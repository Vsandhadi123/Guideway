'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function ResetPassword() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpdate() {
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
      .brand { font-family: 'Fraunces', serif; }`}</style>

      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center brand text-3xl text-stone-900 mb-10">Guideway</Link>

        <h1 className="text-2xl font-semibold text-stone-900 mb-1">Set a new password</h1>
        <p className="text-sm text-stone-400 mb-8">Choose something strong that you will remember.</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">New password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Same password again"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            onClick={handleUpdate}
            disabled={loading || !password || !confirm}
            className="w-full bg-[#4a7c59] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Updating...' : 'Update password →'}
          </button>
        </div>
      </div>
    </main>
  )
}