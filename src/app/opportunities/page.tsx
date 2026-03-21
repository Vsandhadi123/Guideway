'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const CATEGORIES = [
  { key: 'competitions', label: 'Competitions', emoji: '🏆' },
  { key: 'internships', label: 'Internships', emoji: '💼' },
  { key: 'clubs', label: 'Clubs', emoji: '🎯' },
  { key: 'scholarships', label: 'Scholarships', emoji: '🎓' },
  { key: 'volunteer', label: 'Volunteer', emoji: '🤝' },
  { key: 'summer', label: 'Summer Programs', emoji: '☀️' },
]

export default function Opportunities() {
  const router = useRouter()
  const supabase = createClient()
  const [opportunities, setOpportunities] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('competitions')
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      if (data?.opportunities) setOpportunities(data.opportunities)
      setLoading(false)
    }
    load()
  }, [])

  async function generate() {
    setGenerating(true)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: profile.answers, type: 'opportunities' })
    })
    const data = await res.json()
    if (!data.error) {
      setOpportunities(data)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) await supabase.from('profiles').update({ opportunities: data }).eq('id', user.id)
    }
    setGenerating(false)
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-[#4a7c59] border-t-transparent rounded-full animate-spin" />
    </main>
  )

  const activeItems = opportunities?.[activeTab] || []

  return (
    <main className="min-h-screen bg-[#fafaf9]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
      `}</style>

      {/* Nav */}
      <nav className="bg-white border-b border-stone-100 flex items-center justify-between px-10 py-4 sticky top-0 z-50">
        <span className="brand text-2xl text-stone-900">Guideway</span>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-stone-400 hover:text-stone-700 transition">Dashboard</button>
          <button onClick={() => router.push('/plan')} className="text-sm text-stone-400 hover:text-stone-700 transition">My Plan</button>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="text-sm text-stone-400 hover:text-stone-700 transition">Sign out</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-10 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="brand text-4xl text-stone-900">Opportunities</h1>
            <p className="text-stone-400 text-sm mt-1">Personalized to your interests and goals.</p>
          </div>
          <button
            onClick={generate}
            disabled={generating}
            className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition disabled:opacity-40"
          >
            {generating ? 'Generating...' : opportunities ? 'Regenerate →' : 'Generate opportunities →'}
          </button>
        </div>

        {!opportunities && !generating && (
          <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center">
            <h2 className="brand text-3xl text-stone-900 mb-3">Find your opportunities</h2>
            <p className="text-stone-400 text-sm mb-8 max-w-md mx-auto">We will find competitions, internships, scholarships, and more — all matched to your specific interests and goals.</p>
            <button
              onClick={generate}
              className="bg-[#4a7c59] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition"
            >
              Generate my opportunities →
            </button>
          </div>
        )}

        {generating && (
          <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center">
            <div className="w-8 h-8 border-2 border-[#4a7c59] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-400 text-sm">Finding opportunities matched to you...</p>
          </div>
        )}

        {opportunities && !generating && (
          <div>
            {/* Category tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {CATEGORIES.map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    activeTab === key
                      ? 'bg-[#4a7c59] text-white'
                      : 'bg-white border border-stone-100 text-stone-500 hover:border-[#c8dace]'
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-3 gap-5">
              {activeItems.map((item: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6 hover:border-[#c8dace] hover:shadow-md transition-all duration-200">
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">{item.name}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex flex-col gap-1.5">
                    {item.deadline && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Deadline</span>
                        <span className="text-xs text-stone-500">{item.deadline}</span>
                      </div>
                    )}
                    {item.amount && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Amount</span>
                        <span className="text-xs text-[#4a7c59] font-semibold">{item.amount}</span>
                      </div>
                    )}
                    {item.commitment && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Commitment</span>
                        <span className="text-xs text-stone-500">{item.commitment}</span>
                      </div>
                    )}
                  </div>
                  {item.link_hint && (
                    <p className="text-[10px] text-stone-300 mt-3 italic">Search: {item.link_hint}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}