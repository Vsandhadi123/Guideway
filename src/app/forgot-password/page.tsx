'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function ForgotPassword() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleReset() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
      .brand { font-family: 'Fraunces', serif; }`}</style>

      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center brand text-3xl text-stone-900 mb-10">Guideway</Link>

        {sent ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#f0f5f1] border border-[#d4e4d9] flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 10l5 5 9-9" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-stone-900 mb-2">Check your email</h1>
            <p className="text-sm text-stone-400 mb-6 leading-relaxed">We sent a password reset link to <span className="font-medium text-stone-600">{email}</span>. Click the link to reset your password.</p>
            <Link href="/login" className="text-sm text-[#4a7c59] font-medium hover:underline">Back to log in</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-stone-900 mb-1">Forgot your password?</h1>
            <p className="text-sm text-stone-400 mb-8">No worries — we will send you a reset link.</p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                onClick={handleReset}
                disabled={loading || !email}
                className="w-full bg-[#4a7c59] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Sending...' : 'Send reset link →'}
              </button>
            </div>

            <p className="text-center text-xs text-stone-400 mt-6">
              Remember it?{' '}
              <Link href="/login" className="text-[#4a7c59] font-medium hover:underline">Log in</Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}