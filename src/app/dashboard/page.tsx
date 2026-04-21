'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Dashboard() {
  const [auditLoading, setAuditLoading] = useState(false)
  const [roadmap, setRoadmap] = useState<any>(null)
  const [roadmapLoading, setRoadmapLoading] = useState(false)
  const [activeYear, setActiveYear] = useState('9th Grade')
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [academicAudit, setAcademicAudit] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Record<string, boolean>>({})
  const [opportunities, setOpportunities] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      if (data?.tasks) {
      setTasks(data.tasks)
    }
    
      if (data?.academic_audit) {
        setAcademicAudit(data.academic_audit)
      } else if (data?.answers) {
        setAuditLoading(true)

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: data.answers,
            type: 'academic_audit',
          }),
        })

        const auditData = await res.json()

        if (!auditData.error) {
          setAcademicAudit(auditData)

          await supabase
            .from('profiles')
            .update({
              academic_audit: auditData,
              audit_status: 'completed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
        }

        setAuditLoading(false)
      }

      if (data?.roadmap) setRoadmap(data.roadmap)
      if (data?.opportunities) setOpportunities(data.opportunities)
      setLoading(false)
    }
    load()
  }, [])

  async function toggleTask(key: string) {
  const updated = {
    ...tasks,
    [key]: !tasks[key]
  }

  setTasks(updated)

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase
      .from('profiles')
      .update({
        tasks: updated,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
  }
}

  async function generateRoadmap() {
    setRoadmapLoading(true)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: profile.answers, type: 'roadmap' })
    })
    const data = await res.json()
    if (!data.error) {
      setRoadmap(data)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) await supabase.from('profiles').update({ roadmap: data }).eq('id', user.id)
    }
    setRoadmapLoading(false)
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#4a7c59] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-stone-400">Loading your dashboard...</p>
      </div>
    </main>
  )

  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there'
  const hasAnswers = profile?.answers

  const priorityActions: string[] = academicAudit?.priority_actions || []
  const strengths: string[] = academicAudit?.strengths || []
  const weaknesses: string[] = academicAudit?.weaknesses || []
  const collegeFit = academicAudit?.college_fit || []
  const competitiveness = academicAudit?.competitiveness || []
  const summerOpportunities = academicAudit?.summer_opportunities || []

  const completedActionCount = priorityActions.filter((_, i) => tasks[`action-${i}`]).length
  const totalActionCount = priorityActions.length
  const actionProgressPct =
    totalActionCount > 0
      ? Math.round((completedActionCount / totalActionCount) * 100)
      : 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <main className="min-h-screen bg-[#f7f6f3]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
        .card { background: white; border-radius: 16px; border: 1px solid #ede9e3; }
        .hover-card { transition: all 0.2s ease; }
        .hover-card:hover { border-color: #c8dace; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
      `}</style>

      {/* Nav */}
      <nav className="bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <span className="brand text-2xl text-stone-900">Guideway</span>
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'My Plan', href: '/plan' },
              { label: 'Tools', href: '/tools' },
              { label: 'Opportunities', href: '/opportunities' },
              { label: 'Check in', href: '/checkin' },
            ].map(({ label, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className="px-3 py-2 text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition"
              >
                {label}
              </button>
            ))}
            <div className="relative ml-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-[#4a7c59] flex items-center justify-center text-white text-xs font-bold hover:bg-[#3d6849] transition"
              >
                {name?.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-stone-100 shadow-xl p-2 z-50">
                  <p className="px-3 py-2 text-xs text-stone-400 border-b border-stone-50 mb-1 truncate">{user?.email}</p>
                  <button onClick={() => { setMenuOpen(false); router.push('/tools') }} className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-xl transition">Study Tools</button>
                  <button onClick={() => { setMenuOpen(false); router.push('/settings') }} className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-xl transition">Settings</button>
                  <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-50 rounded-xl transition">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {!hasAnswers ? (
        <div className="max-w-2xl mx-auto px-10 py-32 text-center">
          <h1 className="brand text-5xl text-stone-900 mb-4">Welcome, {name}!</h1>
          <p className="text-stone-400 mb-8">You haven't built your plan yet. It takes 2 minutes.</p>
          <button onClick={() => router.push('/onboarding')} className="bg-[#4a7c59] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#3d6849] transition">Build my plan →</button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm text-stone-400 mb-1">{greeting},</p>
            <h1 className="brand text-3xl md:text-5xl text-stone-900">{name}.</h1>
          </div>

          {/* Top stats row */}
          {profile?.academic_audit?.weekly_summary && (
          <div className="mb-6 rounded-2xl p-4 md:p-6 border border-[#d4e4d9] bg-[#f0f5f1]">
            <p className="text-xs font-bold text-[#4a7c59] uppercase tracking-widest mb-2">
              This week’s update
            </p>

            <p className="text-sm text-stone-700 leading-relaxed mb-4">
              {profile.academic_audit.weekly_summary}
            </p>

            {profile.academic_audit.weekly_motivation && (
              <div className="bg-white border border-[#d4e4d9] rounded-xl px-4 py-3">
                <p className="text-xs text-stone-500 mb-1">Focus</p>
                <p className="text-sm font-medium text-[#4a7c59]">
                  {profile.academic_audit.weekly_motivation}
                </p>
              </div>
            )}

            {profile.academic_audit.priority_actions?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-stone-400 mb-2">
                Updated priorities
              </p>

              <div className="flex flex-col gap-1.5">
                {profile.academic_audit.priority_actions
                  .slice(0, 2)
                  .map((action: string, i: number) => (
                    <div key={i} className="text-xs text-stone-600">
                      → {action}
                    </div>
                  ))}
              </div>
            </div>
          )}
          </div>
        )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Grade', value: profile.answers.grade?.replace(' grade', '') || '—', sub: 'Current grade' },
              { label: 'GPA', value: profile.answers.gpa || '—', sub: 'Self-reported' },
              { label: 'Study time', value: `${profile.answers.hours}h`, sub: 'Per week' },
              { label: 'Stress', value: `${profile.answers.stress}/10`, sub: 'Current level', alert: profile.answers.stress >= 7 },
            ].map(({ label, value, sub, alert }) => (
              <div key={label} className={`card px-5 py-4 ${alert ? 'border-red-100 bg-red-50/30' : ''}`}>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">{label}</p>
                <p className={`brand text-2xl md:text-3xl mb-0.5 ${alert ? 'text-red-400' : 'text-stone-900'}`}>{value}</p>
                <p className="text-xs text-stone-400">{sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Left — main content */}
            <div className="md:col-span-2 flex flex-col gap-5">


              {/* Weekly schedule */}
              <div className="card p-6 hover-card">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-semibold text-stone-900">
                      Your Academic Audit
                    </h2>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Personalized analysis based on your profile
                    </p>
                  </div>

                  {profile?.academic_audit?.weekly_summary && (
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4a7c59] bg-[#f0f5f1] border border-[#d4e4d9] px-2.5 py-1 rounded-full">
                      Updated this week
                    </span>
                  )}
                </div>

                {!academicAudit ? (
                  <div className="text-center py-8 bg-stone-50 rounded-xl">
                  {auditLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-[#4a7c59] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-stone-400 mb-1">
                        Running your academic audit...
                      </p>
                      <p className="text-xs text-stone-300">
                        Analyzing your profile, strengths, and next steps.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-stone-400 mb-3">
                        Your audit is being prepared.
                      </p>
                      <p className="text-xs text-stone-300">
                        This is where Guideway becomes powerful.
                      </p>
                    </>
                  )}
                </div>
                ) : (
                  <div className="space-y-6">

                    <div>
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                        Strengths
                      </p>
                      <div className="space-y-2">
                        {strengths.map((item: string, i: number) => (
                          <div key={i} className="p-3 rounded-xl bg-[#f0f5f1] border border-[#d4e4d9] text-sm text-stone-700">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                        Weaknesses
                      </p>
                      <div className="space-y-2">
                        {weaknesses.map((item: string, i: number) => (
                          <div key={i} className="p-3 rounded-xl bg-[#fafaf9] border border-stone-100 text-sm text-stone-700">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                      Priority Actions
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#4a7c59] h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${actionProgressPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-stone-400">
                        {completedActionCount}/{totalActionCount}
                      </span>
                    </div>

                    {priorityActions.length > 0 && (
                      <div className="mb-4 p-4 rounded-xl bg-[#4a7c59] text-white">
                        <p className="text-xs uppercase opacity-80 mb-1">Start here</p>
                        <p className="text-sm font-semibold">{priorityActions[0]}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {priorityActions.map((item: string, i: number) => {
                        const key = `action-${i}`
                        const done = tasks[key]

                        return (
                          <div
                            key={i}
                            onClick={() => toggleTask(key)}
                            className={`flex items-center gap-3 p-4 min-h-[52px] rounded-xl cursor-pointer transition ${
                            done
                              ? 'bg-[#f0f5f1]'
                              : i < 2
                              ? 'bg-[#f8fbf8] border border-[#d4e4d9] hover:border-[#4a7c59]'
                              : 'bg-white border border-stone-100 hover:border-[#4a7c59]'
                          }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                done ? 'bg-[#4a7c59] border-[#4a7c59]' : 'border-stone-200'
                              }`}
                            >
                              {done && <span className="text-white text-xs">✓</span>}
                            </div>

                            <p className={`text-sm ${done ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                              {item}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  </div>
                )}
              </div>


              {/* Check-in banner */}
              <div className="rounded-2xl p-6 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #4a7c59 0%, #3d6849 100%)' }}>
                <div>
                  <p className="text-xs font-bold text-green-200 uppercase tracking-widest mb-1.5">Weekly check-in</p>
                  <h2 className="brand text-2xl text-white mb-1">How's your week going?</h2>
                  <p className="text-green-200 text-sm">Update your plan based on how things are going.</p>
                </div>
                <button
                  onClick={() => router.push('/checkin')}
                  className="flex-shrink-0 ml-6 bg-white text-[#4a7c59] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition shadow-lg"
                >
                  Check in →
                </button>
              </div>


              {/* Opportunities preview */}
              <div className="card p-6 hover-card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-stone-900">Opportunities for you</h2>
                  <button onClick={() => router.push('/opportunities')} className="text-xs font-semibold text-[#4a7c59] hover:underline">View all →</button>
                </div>
                {!opportunities ? (
                  <div className="text-center py-8 bg-stone-50 rounded-xl">
                    <p className="text-sm text-stone-400 mb-3">No opportunities generated yet.</p>
                    <button onClick={() => router.push('/opportunities')} className="text-xs font-semibold text-[#4a7c59] hover:underline">Find my opportunities →</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {opportunities.competitions?.slice(0, 2).map((item: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#fafaf9] border border-stone-100 hover:border-[#c8dace] transition">
                        <div className="w-2 h-2 rounded-full bg-[#4a7c59] mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-stone-700">{item.name}</p>
                          <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{item.desc?.slice(0, 80)}...</p>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => router.push('/opportunities')} className="text-xs text-[#4a7c59] font-medium text-center mt-1 hover:underline">See all opportunities →</button>
                  </div>
                )}
              </div>

              {/* College Roadmap */}
              <div className="card p-6 hover-card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-stone-900">College roadmap</h2>
                  {!roadmap && (
                    <button onClick={generateRoadmap} disabled={roadmapLoading} className="text-xs font-semibold text-[#4a7c59] border border-[#d4e4d9] bg-[#f0f5f1] px-3 py-1.5 rounded-lg hover:bg-[#e0ede4] transition disabled:opacity-40">
                      {roadmapLoading ? 'Generating...' : 'Generate →'}
                    </button>
                  )}
                </div>

                {!roadmap && !roadmapLoading && (
                  <div className="text-center py-8 bg-stone-50 rounded-xl">
                    <p className="text-sm text-stone-400 mb-1">Your college roadmap is ready to generate.</p>
                    <p className="text-xs text-stone-300">Based on your grade and goals.</p>
                  </div>
                )}

                {roadmapLoading && (
                  <div className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-[#4a7c59] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs text-stone-400">Building your roadmap...</p>
                  </div>
                )}

                {roadmap && (
                  <div>
                    <div className="flex gap-1 mb-5 border-b border-stone-100">
                      {roadmap.timeline?.map(({ year }: any) => (
                        <button key={year} onClick={() => setActiveYear(year)} className={`px-3 py-2 text-xs font-semibold transition border-b-2 -mb-px ${activeYear === year ? 'text-[#4a7c59] border-[#4a7c59]' : 'text-stone-400 border-transparent hover:text-stone-600'}`}>
                          {year}
                        </button>
                      ))}
                    </div>
                    {roadmap.timeline?.filter((t: any) => t.year === activeYear).map(({ theme, tasks: yearTasks }: any) => (
                      <div key={activeYear} className="mb-5">
                        <p className="text-xs font-semibold text-[#4a7c59] mb-3 italic">{theme}</p>
                        <div className="flex flex-col gap-2">
                          {yearTasks?.map((task: string, i: number) => (
                            <div key={i} className="flex items-start gap-2.5 text-sm text-stone-600">
                              <span className="text-[#4a7c59] mt-0.5 flex-shrink-0">→</span>
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="mt-5 pt-5 border-t border-stone-100">
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Do this now</p>
                      <div className="flex flex-col gap-2">
                        {roadmap.current_checklist?.slice(0, 4).map((item: string, i: number) => (
                          <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f0f5f1] border border-[#d4e4d9]">
                            <div className="w-4 h-4 rounded-full border-2 border-[#4a7c59] flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-stone-600">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {roadmap.test_prep && (
                      <div className="mt-4 pt-4 border-t border-stone-100">
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Test prep targets</p>
                        <div className="flex gap-3">
                          <div className="flex-1 bg-stone-50 rounded-xl p-3 text-center border border-stone-100">
                            <p className="text-lg font-bold text-stone-800">{roadmap.test_prep.sat_target}</p>
                            <p className="text-xs text-stone-400">SAT target</p>
                          </div>
                          <div className="flex-1 bg-stone-50 rounded-xl p-3 text-center border border-stone-100">
                            <p className="text-lg font-bold text-stone-800">{roadmap.test_prep.act_target}</p>
                            <p className="text-xs text-stone-400">ACT target</p>
                          </div>
                        </div>
                        <p className="text-xs text-stone-400 mt-2">{roadmap.test_prep.timeline}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-5">

              {/* Quick actions */}
              <div className="card p-5">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Quick actions</p>
                <div className="flex flex-col gap-1">
                  {[
                    { label: 'View my plan', icon: '📋', href: '/plan' },
                    { label: 'Study tools', icon: '🛠', href: '/tools' },
                    { label: 'AI study buddy', icon: '🤖', href: '/chat' },
                    { label: 'Assignments', icon: '✅', href: '/assignments' },
                    { label: 'Grades', icon: '📊', href: '/grades' },
                    { label: 'Focus timer', icon: '⏱', href: '/pomodoro' },
                    { label: 'Exam countdown', icon: '📅', href: '/exams' },
                  ].map(({ label, icon, href }) => (
                    <button
                      key={label}
                      onClick={() => router.push(href)}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition group"
                    >
                      <span className="text-base">{icon}</span>
                      <span className="text-sm text-stone-600 group-hover:text-stone-900 transition flex-1">{label}</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-0 group-hover:opacity-100 transition">
                        <path d="M2.5 6h7M6 2.5l3.5 3.5L6 9.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* College competitiveness */}
              <div className="card p-5">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                  College competitiveness
                </p>

                {competitiveness.length === 0 ? (
                  <p className="text-sm text-stone-300 text-center py-4">
                    Your competitiveness analysis will appear here.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {competitiveness.map((item: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <p className="text-sm font-semibold text-stone-700">
                            {item.school}
                          </p>
                          <span
                            className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full ${
                              item.level === 'Reach'
                                ? 'bg-red-50 text-red-500 border border-red-100'
                                : item.level === 'Target'
                                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                : 'bg-[#f0f5f1] text-[#4a7c59] border border-[#d4e4d9]'
                            }`}
                          >
                            {item.level}
                          </span>
                        </div>

                        <p className="text-xs text-stone-500 leading-relaxed mb-2">
                          {item.reason}
                        </p>

                        <p className="text-xs text-[#4a7c59] leading-relaxed">
                          Improve: {item.improve}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile card */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Your profile</p>
                  <button onClick={() => router.push('/onboarding')} className="text-xs text-[#4a7c59] hover:underline">Update</button>
                </div>
                <div className="flex flex-col gap-0">
                  {[
                    { label: 'Grade', value: profile.answers.grade },
                    { label: 'GPA', value: profile.answers.gpa },
                    { label: 'Study time', value: `${profile.answers.hours} hrs/week` },
                    { label: 'Stress', value: `${profile.answers.stress}/10` },
                    { label: 'Goals', value: profile.answers.goals?.[0] || '—' },
                  ].map(({ label, value }, i, arr) => (
                    <div key={label} className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? 'border-b border-stone-50' : ''}`}>
                      <span className="text-xs text-stone-400">{label}</span>
                      <span className="text-xs font-semibold text-stone-700 max-w-24 truncate text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </main>
  )
}