'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Exam = {
  id: string
  subject: string
  exam_type: string
  exam_date: string
  notes: string
}

function daysUntil(dateStr: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  due.setHours(0, 0, 0, 0)
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function getUrgencyStyle(days: number) {
  if (days < 0) return { bg: 'bg-stone-50', badge: 'bg-stone-100 text-stone-400', label: 'Passed' }
  if (days === 0) return { bg: 'bg-red-50 border-red-100', badge: 'bg-red-500 text-white', label: 'Today!' }
  if (days <= 3) return { bg: 'bg-red-50 border-red-100', badge: 'bg-red-100 text-red-500', label: `${days}d` }
  if (days <= 7) return { bg: 'bg-amber-50 border-amber-100', badge: 'bg-amber-100 text-amber-500', label: `${days}d` }
  if (days <= 14) return { bg: 'bg-[#f0f5f1] border-[#d4e4d9]', badge: 'bg-[#e0ede4] text-[#4a7c59]', label: `${days}d` }
  return { bg: 'bg-white border-stone-100', badge: 'bg-stone-100 text-stone-500', label: `${days}d` }
}

export default function Exams() {
  const router = useRouter()
  const supabase = createClient()
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showPast, setShowPast] = useState(false)
  const [form, setForm] = useState({ subject: '', exam_type: 'Test', exam_date: '', notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('exams').select('*').eq('user_id', user.id).order('exam_date', { ascending: true })
      setExams(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function addExam() {
    if (!form.subject || !form.exam_date) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('exams').insert({
      user_id: user.id,
      ...form,
    }).select().single()
    if (data) setExams(prev => [...prev, data].sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()))
    setForm({ subject: '', exam_type: 'Test', exam_date: '', notes: '' })
    setShowForm(false)
    setSaving(false)
  }

  async function deleteExam(id: string) {
    await supabase.from('exams').delete().eq('id', id)
    setExams(prev => prev.filter(e => e.id !== id))
  }

  const upcoming = exams.filter(e => daysUntil(e.exam_date) >= 0)
  const past = exams.filter(e => daysUntil(e.exam_date) < 0)
  const nextExam = upcoming[0]

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
            <h1 className="brand text-4xl text-stone-900">Exam Countdown</h1>
            <p className="text-stone-400 text-sm mt-1">{upcoming.length} upcoming exams</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition"
          >
            + Add exam
          </button>
        </div>

        {/* Next exam hero */}
        {nextExam && (
          <div className="bg-[#4a7c59] rounded-2xl p-8 mb-6 text-white">
            <p className="text-xs font-semibold text-green-200 uppercase tracking-widest mb-2">Next exam</p>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="brand text-4xl mb-1">{nextExam.subject}</h2>
                <p className="text-green-200 text-sm">{nextExam.exam_type} · {new Date(nextExam.exam_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <p className="brand text-7xl leading-none">{daysUntil(nextExam.exam_date)}</p>
                <p className="text-green-200 text-sm">days away</p>
              </div>
            </div>
          </div>
        )}

        {/* Add form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
            <h2 className="text-sm font-semibold text-stone-900 mb-4">Add an exam</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Subject (e.g. AP Chemistry)"
                value={form.subject}
                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.exam_type}
                  onChange={e => setForm(p => ({ ...p, exam_type: e.target.value }))}
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition bg-white"
                >
                  {['Test', 'Quiz', 'Midterm', 'Final', 'AP Exam', 'SAT', 'ACT', 'Project'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={form.exam_date}
                  onChange={e => setForm(p => ({ ...p, exam_date: e.target.value }))}
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                />
              </div>
              <input
                type="text"
                placeholder="Notes (optional — topics to review, etc.)"
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
              />
              <div className="flex gap-3">
                <button onClick={addExam} disabled={!form.subject || !form.exam_date || saving} className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition disabled:opacity-40">
                  {saving ? 'Saving...' : 'Add exam'}
                </button>
                <button onClick={() => setShowForm(false)} className="text-sm text-stone-400 hover:text-stone-600 transition px-4">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming exams */}
        {upcoming.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
            <p className="text-stone-400 text-sm">No upcoming exams — add one above!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map(e => {
              const days = daysUntil(e.exam_date)
              const style = getUrgencyStyle(days)
              return (
                <div key={e.id} className={`rounded-2xl border p-4 flex items-center gap-4 ${style.bg}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${style.badge}`}>
                    {style.label}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-stone-800">{e.subject}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-stone-400">{e.exam_type}</span>
                      <span className="text-xs text-stone-400">{new Date(e.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      {e.notes && <span className="text-xs text-stone-300 italic truncate max-w-32">{e.notes}</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteExam(e.id)} className="text-stone-200 hover:text-red-400 transition">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M6 6.5v3M8 6.5v3M3 3.5l.5 7a.5.5 0 00.5.5h6a.5.5 0 00.5-.5l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Past exams toggle */}
        {past.length > 0 && (
          <div className="mt-8">
            <button onClick={() => setShowPast(!showPast)} className="text-xs font-semibold text-stone-400 hover:text-stone-600 transition flex items-center gap-2">
              {showPast ? 'Hide' : 'Show'} past exams ({past.length})
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${showPast ? 'rotate-180' : ''}`}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showPast && (
              <div className="flex flex-col gap-2 mt-3">
                {past.map(e => (
                  <div key={e.id} className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center gap-4 opacity-50">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold bg-stone-100 text-stone-400 flex-shrink-0">Done</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-stone-600">{e.subject}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{e.exam_type} · {new Date(e.exam_date).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteExam(e.id)} className="text-stone-200 hover:text-red-400 transition">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M6 6.5v3M8 6.5v3M3 3.5l.5 7a.5.5 0 00.5.5h6a.5.5 0 00.5-.5l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}