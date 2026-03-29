'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const SECTIONS = [
  { key: 'academic', title: 'Academic Study Plan' },
  { key: 'schedule', title: 'Weekly Schedule' },
  { key: 'extracurriculars', title: 'Extracurriculars' },
  { key: 'opportunities', title: 'Opportunities' },
  { key: 'goals', title: 'Monthly Goals' },
  { key: 'mentalHealth', title: 'Mental Health' },
]

export default function Plan() {
  const router = useRouter()
  const supabase = createClient()
  const [plan, setPlan] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile?.answers) { router.push('/onboarding'); return }

      // If plan already saved, use it
      if (profile.plan) {
        setPlan(profile.plan)
        setLoading(false)
        return
      }

      // Otherwise generate it
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: profile.answers, type: 'plan' })
      })

      const data = await res.json()

      if (data.error) {
        setError('Something went wrong generating your plan.')
        setLoading(false)
        return
      }

      // Save plan to Supabase
      await supabase.from('profiles').update({ plan: data }).eq('id', user.id)

      setPlan(data)
      setLoading(false)
    }

    load()
  }, [])

  if (loading) return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-2 border-[#4a7c59] border-t-transparent rounded-full animate-spin" />
      <p className="text-stone-400 text-sm">Generating your personalized plan...</p>
    </main>
  )

  if (error) return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <p className="text-red-400 text-sm">{error}</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-white px-6 py-12" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
      .brand { font-family: 'Fraunces', serif; }`}</style>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="brand text-4xl text-stone-900">Your Guideway Plan</h1>
            <p className="text-stone-400 text-sm mt-1">Personalized based on your profile.</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-stone-400 border border-stone-200 px-4 py-2 rounded-lg hover:border-stone-300 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-5">
          {SECTIONS.map(({ key, title }) => {
            const content = plan?.[key]
            if (!content) return null

            return (
              <div key={key} className="border border-stone-100 rounded-2xl p-6 hover:border-[#c8dace] transition">
                <h2 className="text-sm font-semibold text-stone-900 mb-4">{title}</h2>
                {Array.isArray(content) ? (
                  <ul className="flex flex-col gap-2.5">
                    {content.map((item: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-stone-500">
                        <span className="text-[#4a7c59] mt-0.5 flex-shrink-0">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-stone-500 leading-relaxed">{content}</p>
                )}
              </div>
            )
          })}
        </div>

        <button
          onClick={async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) await supabase.from('profiles').update({ plan: null }).eq('id', user.id)
            router.push('/onboarding')
          }}
          className="mt-10 text-xs text-stone-300 hover:text-stone-500 transition"
        >
          ← Redo onboarding
        </button>
      </div>
    </main>
  )
}