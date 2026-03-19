'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-[#4a7c59] border-t-transparent rounded-full animate-spin" />
    </main>
  )

  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there'
  const hasAnswers = profile?.answers

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
      .brand { font-family: 'Fraunces', serif; }`}</style>

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-4 border-b border-stone-100">
        <span className="brand text-2xl text-stone-900">Guideway</span>
        <div className="flex items-center gap-6">
          <span className="text-sm text-stone-400">Hey, {name}</span>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
            className="text-sm text-stone-400 hover:text-stone-700 transition"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-10 py-16">
        {!hasAnswers ? (
          // No plan yet
          <div className="text-center py-24">
            <h1 className="brand text-5xl text-stone-900 mb-4">Welcome, {name}!</h1>
            <p className="text-stone-400 mb-8">You haven't built your plan yet. It takes 2 minutes.</p>
            <button
              onClick={() => router.push('/onboarding')}
              className="bg-[#4a7c59] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#3d6849] transition"
            >
              Build my plan →
            </button>
          </div>
        ) : (
          // Has plan
          <div>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="brand text-4xl text-stone-900">Hey, {name}</h1>
                <p className="text-stone-400 mt-1">Here's your Guideway plan.</p>
              </div>
              <button
                onClick={() => router.push('/onboarding')}
                className="text-sm text-stone-400 border border-stone-200 px-4 py-2 rounded-lg hover:border-stone-300 transition"
              >
                Rebuild plan
              </button>
            </div>

            {/* Profile summary */}
            <div className="grid grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Grade', value: profile.answers.grade },
                { label: 'GPA', value: profile.answers.gpa },
                { label: 'Study hours', value: `${profile.answers.hours} hrs/week` },
                { label: 'Stress level', value: `${profile.answers.stress}/10` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#fafaf9] rounded-2xl p-4 border border-stone-100">
                  <p className="text-xs text-stone-400 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-stone-800">{value}</p>
                </div>
              ))}
            </div>

            {/* Generate plan button */}
            <div className="bg-[#f0f5f1] rounded-2xl p-8 border border-[#d4e4d9] text-center">
              <h2 className="brand text-3xl text-stone-900 mb-2">Ready to see your full plan?</h2>
              <p className="text-stone-400 text-sm mb-6">We'll use your profile to generate a personalized success plan.</p>
              <button
                onClick={() => router.push('/plan')}
                className="bg-[#4a7c59] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition"
              >
                Generate my plan →
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}