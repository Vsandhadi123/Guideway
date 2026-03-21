'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Settings() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nameSaved, setNameSaved] = useState(false)
  const [emailSaved, setEmailSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setName(user.user_metadata?.full_name || '')
      setEmail(user.email || '')
      setLoading(false)
    }
    load()
  }, [])

  async function saveName() {
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } })
    if (!error) { setNameSaved(true); setTimeout(() => setNameSaved(false), 2000) }
  }

  async function saveEmail() {
    const { error } = await supabase.auth.updateUser({ email })
    if (!error) { setEmailSaved(true); setTimeout(() => setEmailSaved(false), 2000) }
    else setError(error.message)
  }

  async function savePassword() {
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return }
    setError('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (!error) {
      setPasswordSaved(true)
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSaved(false), 2000)
    } else setError(error.message)
  }

  async function deleteAccount() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').delete().eq('id', user.id)
      await supabase.auth.signOut()
      router.push('/')
    }
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-[#4a7c59] border-t-transparent rounded-full animate-spin" />
    </main>
  )

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
          <button onClick={() => router.push('/dashboard')} className="text-sm text-stone-400 hover:text-stone-700 transition">Dashboard</button>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="text-sm text-stone-400 hover:text-stone-700 transition">Sign out</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-10 py-12">
        <div className="mb-10">
          <h1 className="brand text-4xl text-stone-900">Settings</h1>
          <p className="text-stone-400 text-sm mt-1">Manage your account.</p>
        </div>

        <div className="flex flex-col gap-6">

          {/* Profile */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-5">Profile</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Full name</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                  />
                  <button
                    onClick={saveName}
                    className="bg-[#4a7c59] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#3d6849] transition"
                  >
                    {nameSaved ? 'Saved!' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-5">Email address</h2>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
              />
              <button
                onClick={saveEmail}
                className="bg-[#4a7c59] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#3d6849] transition"
              >
                {emailSaved ? 'Saved!' : 'Save'}
              </button>
            </div>
            <p className="text-xs text-stone-300 mt-2">You will receive a confirmation email at the new address.</p>
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-5">Change password</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Confirm new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Same password again"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                onClick={savePassword}
                disabled={!newPassword || !confirmPassword}
                className="w-full bg-[#4a7c59] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#3d6849] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {passwordSaved ? 'Password updated!' : 'Update password'}
              </button>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-2">Account</h2>
            <p className="text-xs text-stone-400 mb-5">Signed in as <span className="font-medium text-stone-600">{user?.email}</span></p>
            <div className="flex flex-col gap-3">
              <button
                onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
                className="w-full border border-stone-200 text-stone-600 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-50 transition"
              >
                Sign out
              </button>
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="w-full border border-red-100 text-red-400 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition"
                >
                  Delete account
                </button>
              ) : (
                <div className="border border-red-100 rounded-xl p-4 bg-red-50">
                  <p className="text-sm text-red-500 font-medium mb-3">Are you sure? This cannot be undone.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setDeleteConfirm(false)} className="flex-1 border border-stone-200 text-stone-600 py-2 rounded-lg text-sm hover:bg-white transition">Cancel</button>
                    <button onClick={deleteAccount} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition">Yes, delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}