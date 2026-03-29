'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Dashboard() {
  const [roadmap, setRoadmap] = useState<any>(null)
  const [roadmapLoading, setRoadmapLoading] = useState(false)
  const [activeYear, setActiveYear] = useState('9th Grade')
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [plan, setPlan] = useState<any>(null)
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
      if (data?.plan) setPlan(data.plan)
      if (data?.roadmap) setRoadmap(data.roadmap)
      if (data?.opportunities) setOpportunities(data.opportunities)
      setLoading(false)
    }
    load()
  }, [])

  function toggleTask(key: string) {
    setTasks(prev => ({ ...prev, [key]: !prev[key] }))
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
  const schedule: string[] = plan?.schedule || []
  const goals: string[] = plan?.goals || []
  const completedTasks = Object.values(tasks).filter(Boolean).length
  const totalTasks = schedule.length
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
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
        <div className="max-w-7xl mx-auto px-8 py-3.5 flex items-center justify-between">
          <span className="brand text-2xl text-stone-900">Guideway</span>
          <div className="flex items-center gap-1">
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
        <div className="max-w-7xl mx-auto px-8 py-8">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm text-stone-400 mb-1">{greeting},</p>
            <h1 className="brand text-5xl text-stone-900">{name}.</h1>
          </div>

          {/* Top stats row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Grade', value: profile.answers.grade?.replace(' grade', '') || '—', sub: 'Current grade' },
              { label: 'GPA', value: profile.answers.gpa || '—', sub: 'Self-reported' },
              { label: 'Study time', value: `${profile.answers.hours}h`, sub: 'Per week' },
              { label: 'Stress', value: `${profile.answers.stress}/10`, sub: 'Current level', alert: profile.answers.stress >= 7 },
            ].map(({ label, value, sub, alert }) => (
              <div key={label} className={`card px-5 py-4 ${alert ? 'border-red-100 bg-red-50/30' : ''}`}>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">{label}</p>
                <p className={`brand text-3xl mb-0.5 ${alert ? 'text-red-400' : 'text-stone-900'}`}>{value}</p>
                <p className="text-xs text-stone-400">{sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">

            {/* Left — main content */}
            <div className="col-span-2 flex flex-col gap-5">

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

              {/* Weekly schedule */}
              <div className="card p-6 hover-card">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-semibold text-stone-900">This week's schedule</h2>
                    <p className="text-xs text-stone-400 mt-0.5">{completedTasks} of {totalTasks} completed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#4a7c59] h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-stone-500">{progressPct}%</span>
                  </div>
                </div>

                {schedule.length === 0 ? (
                  <div className="text-center py-8 bg-stone-50 rounded-xl">
                    <p className="text-sm text-stone-400 mb-3">No schedule yet.</p>
                    <button onClick={() => router.push('/plan')} className="text-xs font-semibold text-[#4a7c59] hover:underline">Generate your plan →</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {schedule.map((item: string, i: number) => {
                      const key = `task-${i}`
                      const done = tasks[key]
                      return (
                        <div
                          key={i}
                          onClick={() => toggleTask(key)}
                          className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all group ${done ? 'bg-[#f0f5f1]' : 'bg-[#fafaf9] hover:bg-stone-50 border border-transparent hover:border-stone-100'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${done ? 'bg-[#4a7c59] border-[#4a7c59]' : 'border-stone-200 group-hover:border-[#4a7c59]'}`}>
                            {done && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <p className={`text-sm transition-all flex-1 ${done ? 'text-stone-400 line-through' : 'text-stone-700'}`}>{item}</p>
                        </div>
                      )
                    })}
                  </div>
                )}

                {plan && (
                  <button onClick={() => router.push('/plan')} className="mt-4 text-xs text-[#4a7c59] font-medium hover:underline flex items-center gap-1">
                    View full plan →
                  </button>
                )}
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

              {/* Monthly goals */}
              <div className="card p-5">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Monthly goals</p>
                {goals.length === 0 ? (
                  <p className="text-sm text-stone-300 text-center py-4">Generate your plan to see goals.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {goals.map((goal: string, i: number) => {
                      const pcts = [15, 35, 10]
                      const pct = pcts[i] || 20
                      return (
                        <div key={i}>
                          <p className="text-xs text-stone-600 leading-snug mb-2">{goal.length > 60 ? goal.slice(0, 60) + '...' : goal}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-[#4a7c59] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] font-semibold text-stone-400">{pct}%</span>
                          </div>
                        </div>
                      )
                    })}
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