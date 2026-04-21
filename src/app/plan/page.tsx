'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

type Profile = Record<string, unknown>
type Plan = Record<string, Record<string, unknown>>

const SECTIONS = [
  { key: 'academic', title: 'Academic Study Plan', icon: '📚', color: '#4a7c59', bg: '#f0f5f1', border: '#d4e4d9' },
  { key: 'schedule', title: 'Weekly Schedule', icon: '🗓', color: '#4a6a7c', bg: '#f0f3f5', border: '#c8d4e4' },
  { key: 'extracurriculars', title: 'Extracurriculars', icon: '🏅', color: '#7c6a4a', bg: '#f5f3f0', border: '#e4d9c8' },
  { key: 'opportunities', title: 'Opportunities', icon: '🚀', color: '#6a4a7c', bg: '#f3f0f5', border: '#d9c8e4' },
  { key: 'goals', title: 'Monthly Goals', icon: '🎯', color: '#7c4a4a', bg: '#f5f0f0', border: '#e4c8c8' },
  { key: 'mentalHealth', title: 'Mental Health', icon: '🧠', color: '#4a7c7c', bg: '#f0f5f5', border: '#c8e4e4' },
]

export default function Plan() {
  const router = useRouter()
  const supabase = createClient()
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activeSection, setActiveSection] = useState('academic')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profile)
      if (!profile?.answers) { router.push('/onboarding'); return }

      if (profile.plan) {
        setPlan(profile.plan)
        setLoading(false)
        return
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: profile.answers, type: 'plan' })
      })

      const data = await res.json() as Plan
      if ((data as Record<string, unknown>).error) { setError('Something went wrong generating your plan.'); setLoading(false); return }
      await supabase.from('profiles').update({ plan: data }).eq('id', user.id)
      setPlan(data)
      setLoading(false)
    }
    load()
  }, [])

  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there'
  const activeData = SECTIONS.find(s => s.key === activeSection)
  const activeContent = plan?.[activeSection]

  if (loading) return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f7f6f3]">
      <div className="w-10 h-10 border-2 border-[#4a7c59] border-t-transparent rounded-full animate-spin" />
      <div className="text-center">
        <p className="text-stone-700 font-medium mb-1">Generating your personalized plan...</p>
        <p className="text-stone-400 text-sm">This takes about 15 seconds</p>
      </div>
    </main>
  )

  if (error) return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#f7f6f3]">
      <div className="text-center">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <button onClick={() => router.push('/dashboard')} className="text-sm text-[#4a7c59] hover:underline">← Back to dashboard</button>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#f7f6f3]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
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
              <button key={label} onClick={() => router.push(href)} className={`px-3 py-2 text-sm rounded-lg transition ${href === '/plan' ? 'text-[#4a7c59] bg-[#f0f5f1] font-medium' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'}`}>
                {label}
              </button>
            ))}
            <div className="relative ml-2">
              <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 rounded-full bg-[#4a7c59] flex items-center justify-center text-white text-xs font-bold hover:bg-[#3d6849] transition">
                {name?.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-stone-100 shadow-xl p-2 z-50">
                  <button onClick={() => { setMenuOpen(false); router.push('/settings') }} className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-xl transition">Settings</button>
                  <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-50 rounded-xl transition">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Hero header */}
        <div className="bg-white rounded-2xl border border-stone-100 p-8 mb-6" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f7f9f7 100%)' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#4a7c59] uppercase tracking-widest mb-2">Your Guideway Plan</p>
              <h1 className="brand text-5xl text-stone-900 mb-3">
                {name}&apos;s Success Plan
              </h1>
              <p className="text-stone-400 text-base">AI-generated and personalized to your exact profile. Updates every week.</p>
            </div>
            <div className="flex items-center gap-2 bg-[#f0f5f1] border border-[#d4e4d9] px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-[#4a7c59] rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-[#4a7c59]">AI Generated</span>
            </div>
          </div>

          {profile?.answers && (
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-stone-100">
              {[
                { label: 'Grade', value: profile.answers.grade },
                { label: 'GPA', value: profile.answers.gpa },
                { label: 'Study hours', value: `${profile.answers.hours}h/week` },
                { label: 'Stress', value: `${profile.answers.stress}/10` },
                { label: 'Goal', value: profile.answers.goals?.[0] || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-stone-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-stone-700 truncate max-w-32">{value}</p>
                </div>
              ))}
              <div className="ml-auto">
                <button
                  onClick={async () => {
                    await supabase.from('profiles').update({ plan: null }).eq('id', user.id)
                    setPlan(null)
                    setLoading(true)
                    const res = await fetch('/api/generate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ answers: profile.answers, type: 'plan' })
                    })
                    const data = await res.json()
                    await supabase.from('profiles').update({ plan: data }).eq('id', user.id)
                    setPlan(data)
                    setLoading(false)
                  }}
                  className="text-xs text-stone-400 border border-stone-200 px-3 py-1.5 rounded-lg hover:border-stone-300 transition"
                >
                  Regenerate plan
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-6">

          {/* Left nav */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl border border-stone-100 p-3 sticky top-24">
              <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest px-3 mb-3">Plan sections</p>
              <div className="flex flex-col gap-1">
                {SECTIONS.map(({ key, title, icon, color, bg, border }) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeSection === key ? 'shadow-sm' : 'hover:bg-stone-50'}`}
                    style={activeSection === key ? { background: bg, border: `1px solid ${border}` } : {}}
                  >
                    <span className="text-base">{icon}</span>
                    <span className="text-xs font-semibold" style={{ color: activeSection === key ? color : '#78716c' }}>
                      {title}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col gap-1">
                <button onClick={() => router.push('/dashboard')} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition text-xs text-stone-400 font-medium">
                  ← Dashboard
                </button>
                <button onClick={() => router.push('/checkin')} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition text-xs text-stone-400 font-medium">
                  Weekly check-in →
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-span-3">
            {activeData && (
              <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                {/* Section header */}
                <div className="px-8 py-6 border-b border-stone-100" style={{ background: activeData.bg }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: 'white', border: `1px solid ${activeData.border}` }}>
                      {activeData.icon}
                    </div>
                    <div>
                      <h2 className="brand text-2xl text-stone-900">{activeData.title}</h2>
                      <p className="text-xs text-stone-400 mt-0.5">Personalized to your profile</p>
                    </div>
                  </div>
                </div>

                {/* Section content */}
                <div className="p-8">
                  {!activeContent ? (
                    <div className="text-center py-16">
                      <p className="text-stone-400">This section is empty. Try regenerating your plan.</p>
                    </div>
                  ) : Array.isArray(activeContent) ? (
                    <div className="flex flex-col gap-4">
                      {activeContent.map((item: string, i: number) => (
                        <div
                          key={i}
                          className="flex gap-4 p-5 rounded-2xl border transition-all hover:shadow-sm"
                          style={{ borderColor: activeData.border, background: activeData.bg }}
                        >
                          <div
                            className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 text-white"
                            style={{ background: activeData.color }}
                          >
                            {i + 1}
                          </div>
                          <p className="text-sm text-stone-700 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-600 leading-relaxed">{activeContent}</p>
                  )}
                </div>

                {/* Section footer nav */}
                <div className="px-8 py-4 border-t border-stone-100 flex items-center justify-between bg-[#fafaf9]">
                  <button
                    onClick={() => {
                      const idx = SECTIONS.findIndex(s => s.key === activeSection)
                      if (idx > 0) setActiveSection(SECTIONS[idx - 1].key)
                    }}
                    disabled={SECTIONS.findIndex(s => s.key === activeSection) === 0}
                    className="text-xs text-stone-400 hover:text-stone-600 transition disabled:opacity-30"
                  >
                    ← Previous section
                  </button>
                  <div className="flex gap-1.5">
                    {SECTIONS.map(({ key }) => (
                      <div
                        key={key}
                        className="w-1.5 h-1.5 rounded-full transition-all"
                        style={{ background: key === activeSection ? activeData?.color : '#e8e5e0' }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const idx = SECTIONS.findIndex(s => s.key === activeSection)
                      if (idx < SECTIONS.length - 1) setActiveSection(SECTIONS[idx + 1].key)
                    }}
                    disabled={SECTIONS.findIndex(s => s.key === activeSection) === SECTIONS.length - 1}
                    className="text-xs text-stone-400 hover:text-stone-600 transition disabled:opacity-30"
                  >
                    Next section →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}