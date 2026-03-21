'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Class = {
  id: string
  name: string
  teacher: string
  room: string
  day: string
  start_time: string
  end_time: string
  color: string
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const COLORS = ['#4a7c59', '#4a6a7c', '#7c4a6a', '#7c6a4a', '#4a7c7c', '#7c4a4a']

export default function Schedule() {
  const router = useRouter()
  const supabase = createClient()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeDay, setActiveDay] = useState('Monday')
  const [form, setForm] = useState({ name: '', teacher: '', room: '', day: 'Monday', start_time: '', end_time: '', color: '#4a7c59' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('classes').select('*').eq('user_id', user.id).order('start_time', { ascending: true })
      setClasses(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function addClass() {
    if (!form.name) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('classes').insert({
      user_id: user.id,
      ...form,
    }).select().single()
    if (data) setClasses(prev => [...prev, data].sort((a, b) => a.start_time.localeCompare(b.start_time)))
    setForm({ name: '', teacher: '', room: '', day: 'Monday', start_time: '', end_time: '', color: '#4a7c59' })
    setShowForm(false)
    setSaving(false)
  }

  async function deleteClass(id: string) {
    await supabase.from('classes').delete().eq('id', id)
    setClasses(prev => prev.filter(c => c.id !== id))
  }

  const todayClasses = classes.filter(c => c.day === activeDay)

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

      <nav className="bg-white border-b border-stone-100 flex items-center justify-between px-10 py-4 sticky top-0 z-50">
        <span className="brand text-2xl text-stone-900">Guideway</span>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-stone-400 hover:text-stone-700 transition">Dashboard</button>
          <button onClick={() => router.push('/assignments')} className="text-sm text-stone-400 hover:text-stone-700 transition">Assignments</button>
          <button onClick={() => router.push('/grades')} className="text-sm text-stone-400 hover:text-stone-700 transition">Grades</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-10 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="brand text-4xl text-stone-900">Class Schedule</h1>
            <p className="text-stone-400 text-sm mt-1">{classes.length} classes added</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition"
          >
            + Add class
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
            <h2 className="text-sm font-semibold text-stone-900 mb-4">Add a class</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Class name (e.g. AP Biology)"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Teacher name"
                  value={form.teacher}
                  onChange={e => setForm(p => ({ ...p, teacher: e.target.value }))}
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                />
                <input
                  type="text"
                  placeholder="Room number"
                  value={form.room}
                  onChange={e => setForm(p => ({ ...p, room: e.target.value }))}
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={form.day}
                  onChange={e => setForm(p => ({ ...p, day: e.target.value }))}
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition bg-white"
                >
                  {DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={e => setForm(p => ({ ...p, start_time: e.target.value }))}
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                />
                <input
                  type="time"
                  value={form.end_time}
                  onChange={e => setForm(p => ({ ...p, end_time: e.target.value }))}
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                />
              </div>
              {/* Color picker */}
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-2">Class color</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setForm(p => ({ ...p, color: c }))}
                      style={{ background: c }}
                      className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-stone-400 scale-110' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={addClass} disabled={!form.name || saving} className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition disabled:opacity-40">
                  {saving ? 'Saving...' : 'Add class'}
                </button>
                <button onClick={() => setShowForm(false)} className="text-sm text-stone-400 hover:text-stone-600 transition px-4">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Day tabs */}
        <div className="flex gap-1 mb-6 border-b border-stone-100">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${activeDay === day ? 'text-[#4a7c59] border-[#4a7c59]' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Classes for active day */}
        {todayClasses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
            <p className="text-stone-400 text-sm">No classes on {activeDay}. Add one above!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {todayClasses.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center gap-4">
                <div className="w-1.5 h-14 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-stone-800">{c.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {c.teacher && <span className="text-xs text-stone-400">{c.teacher}</span>}
                    {c.room && <span className="text-xs text-stone-400">Room {c.room}</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {c.start_time && (
                    <p className="text-sm font-semibold text-stone-700">{c.start_time}</p>
                  )}
                  {c.end_time && (
                    <p className="text-xs text-stone-400">{c.end_time}</p>
                  )}
                </div>
                <button onClick={() => deleteClass(c.id)} className="text-stone-200 hover:text-red-400 transition ml-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M6 6.5v3M8 6.5v3M3 3.5l.5 7a.5.5 0 00.5.5h6a.5.5 0 00.5-.5l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Weekly overview */}
        {classes.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Weekly overview</p>
            <div className="grid grid-cols-5 gap-3">
              {DAYS.map(day => {
                const dayClasses = classes.filter(c => c.day === day)
                return (
                  <div key={day} className="bg-white rounded-2xl border border-stone-100 p-3">
                    <p className="text-xs font-semibold text-stone-400 mb-2">{day.slice(0, 3)}</p>
                    {dayClasses.length === 0 ? (
                      <p className="text-xs text-stone-200">Free</p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {dayClasses.map(c => (
                          <div key={c.id} className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                            <p className="text-xs text-stone-600 truncate">{c.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}