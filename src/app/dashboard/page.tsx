'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      if (data?.plan) setPlan(data.plan)
      setLoading(false)
    }
    load()
  }, [])

  function toggleTask(key: string) {
    setTasks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-[#4a7c59] border-t-transparent rounded-full animate-spin" />
    </main>
  )

  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there'
  const hasAnswers = profile?.answers
  const schedule: string[] = plan?.schedule || []
  const opportunities: string[] = plan?.opportunities || []
  const goals: string[] = plan?.goals || []
  const completedTasks = Object.values(tasks).filter(Boolean).length
  const totalTasks = schedule.length
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <main className="min-h-screen bg-[#fafaf9]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
      `}</style>

      {/* Nav */}
      <nav className="bg-white border-b border-stone-100 flex items-center justify-between px-10 py-4 sticky top-0 z-50">
        <span className="brand text-2xl text-stone-900">Guideway</span>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/plan')} className="text-sm text-stone-400 hover:text-stone-700 transition">My Plan</button>
          <button onClick={() => router.push('/onboarding')} className="text-sm text-stone-400 hover:text-stone-700 transition">Rebuild Plan</button>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
            className="text-sm text-stone-400 hover:text-stone-700 transition"
          >Sign out</button>
        </div>
      </nav>

      {!hasAnswers ? (
        <div className="max-w-2xl mx-auto px-10 py-32 text-center">
          <h1 className="brand text-5xl text-stone-900 mb-4">Welcome, {name}!</h1>
          <p className="text-stone-400 mb-8">You haven't built your plan yet. It takes 2 minutes.</p>
          <button
            onClick={() => router.push('/onboarding')}
            className="bg-[#4a7c59] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#3d6849] transition"
          >Build my plan →</button>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-10 py-10">

          {/* Header */}
          <div className="mb-10">
            <h1 className="brand text-4xl text-stone-900">Hey, {name} 👋</h1>
            <p className="text-stone-400 mt-1 text-sm">Here's your Guideway dashboard.</p>
          </div>

          <div className="grid grid-cols-3 gap-6">

            {/* Left column */}
            <div className="col-span-2 flex flex-col gap-6">

              {/* Weekly check-in prompt */}
              <div className="bg-[#4a7c59] rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-green-200 uppercase tracking-widest mb-1">Weekly check-in</p>
                    <h2 className="brand text-2xl mb-1">How's your week going?</h2>
                    <p className="text-green-200 text-sm">Update your plan based on how things are going.</p>
                  </div>
                  <button
                    onClick={() => router.push('/checkin')}
                    className="flex-shrink-0 ml-6 bg-white text-[#4a7c59] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition"
                  >
                    Check in →
                  </button>
                </div>
              </div>

              {/* Weekly schedule */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-stone-900">This week's schedule</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-stone-100 rounded-full h-1.5">
                      <div className="bg-[#4a7c59] h-1.5 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                    </div>
                    <span className="text-xs text-stone-400">{completedTasks}/{totalTasks}</span>
                  </div>
                </div>

                {schedule.length === 0 ? (
                  <p className="text-sm text-stone-300">No schedule yet — generate your plan first.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {schedule.map((item: string, i: number) => {
                      const key = `task-${i}`
                      const done = tasks[key]
                      return (
                        <div
                          key={i}
                          onClick={() => toggleTask(key)}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${done ? 'bg-[#f0f5f1]' : 'bg-stone-50 hover:bg-stone-100'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${done ? 'bg-[#4a7c59] border-[#4a7c59]' : 'border-stone-200'}`}>
                            {done && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <p className={`text-sm transition-all ${done ? 'text-stone-400 line-through' : 'text-stone-700'}`}>{item}</p>
                        </div>
                      )
                    })}
                  </div>
                )}

                {plan && (
                  <button
                    onClick={() => router.push('/plan')}
                    className="mt-4 text-xs text-[#4a7c59] font-medium hover:underline"
                  >
                    View full plan →
                  </button>
                )}
              </div>

              {/* Opportunities */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h2 className="text-base font-semibold text-stone-900 mb-5">Upcoming opportunities</h2>
                {opportunities.length === 0 ? (
                  <p className="text-sm text-stone-300">Generate your plan to see opportunities.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {opportunities.map((item: string, i: number) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c59] mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-stone-600">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">

              {/* Profile summary */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h2 className="text-base font-semibold text-stone-900 mb-4">Your profile</h2>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Grade', value: profile.answers.grade },
                    { label: 'GPA', value: profile.answers.gpa },
                    { label: 'Study time', value: `${profile.answers.hours} hrs/week` },
                    { label: 'Stress', value: `${profile.answers.stress}/10` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                      <span className="text-xs text-stone-400">{label}</span>
                      <span className="text-xs font-semibold text-stone-700">{value}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="mt-4 w-full text-xs text-stone-400 border border-stone-100 py-2 rounded-lg hover:border-stone-200 transition"
                >
                  Update profile
                </button>
              </div>

              {/* Goals progress */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h2 className="text-base font-semibold text-stone-900 mb-4">Monthly goals</h2>
                {goals.length === 0 ? (
                  <p className="text-sm text-stone-300">Generate your plan to see goals.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {goals.map((goal: string, i: number) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs text-stone-500 leading-snug pr-2">{goal.length > 50 ? goal.slice(0, 50) + '...' : goal}</p>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-1">
                          <div
                            className="bg-[#4a7c59] h-1 rounded-full"
                            style={{ width: `${[15, 35, 10][i] || 20}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-stone-300 mt-1">{[15, 35, 10][i] || 20}% complete</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h2 className="text-base font-semibold text-stone-900 mb-4">Quick actions</h2>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'View full plan', href: '/plan' },
                    { label: 'Rebuild my plan', href: '/onboarding' },
                  ].map(({ label, href }) => (
                    <button
                      key={label}
                      onClick={() => router.push(href)}
                      className="w-full text-left text-sm text-stone-600 px-3 py-2.5 rounded-lg hover:bg-stone-50 transition flex items-center justify-between"
                    >
                      {label}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7h8M7 3l4 4-4 4" stroke="#d4d0c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
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