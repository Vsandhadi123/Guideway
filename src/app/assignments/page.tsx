'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Assignment = {
  id: string
  title: string
  subject: string
  due_date: string
  priority: string
  done: boolean
}

const PRIORITIES = [
  { value: 'high', label: 'High', color: 'bg-red-50 text-red-500 border-red-100' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-50 text-amber-500 border-amber-100' },
  { value: 'low', label: 'Low', color: 'bg-stone-50 text-stone-400 border-stone-100' },
]

function getPriorityStyle(priority: string) {
  return PRIORITIES.find(p => p.value === priority)?.color || ''
}

function daysUntil(dateStr: string) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  due.setHours(0, 0, 0, 0)
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

function DueBadge({ dateStr }: { dateStr: string }) {
  const days = daysUntil(dateStr)
  if (days === null) return null
  if (days < 0) return <span className="text-xs font-semibold text-red-400">Overdue</span>
  if (days === 0) return <span className="text-xs font-semibold text-red-400">Due today</span>
  if (days === 1) return <span className="text-xs font-semibold text-amber-400">Due tomorrow</span>
  return <span className="text-xs text-stone-400">Due in {days} days</span>
}

export default function Assignments() {
  const router = useRouter()
  const supabase = createClient()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('pending')
  const [form, setForm] = useState({ title: '', subject: '', due_date: '', priority: 'medium' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true })
      setAssignments(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function addAssignment() {
    if (!form.title) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('assignments').insert({
      user_id: user.id,
      title: form.title,
      subject: form.subject,
      due_date: form.due_date || null,
      priority: form.priority,
      done: false,
    }).select().single()
    if (data) setAssignments(prev => [...prev, data].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()))
    setForm({ title: '', subject: '', due_date: '', priority: 'medium' })
    setShowForm(false)
    setSaving(false)
  }

  async function toggleDone(id: string, done: boolean) {
    await supabase.from('assignments').update({ done: !done }).eq('id', id)
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, done: !done } : a))
  }

  async function deleteAssignment(id: string) {
    await supabase.from('assignments').delete().eq('id', id)
    setAssignments(prev => prev.filter(a => a.id !== id))
  }

  const filtered = assignments.filter(a => {
    if (filter === 'pending') return !a.done
    if (filter === 'done') return a.done
    return true
  })

  const pendingCount = assignments.filter(a => !a.done).length
  const overdueCount = assignments.filter(a => !a.done && daysUntil(a.due_date) !== null && daysUntil(a.due_date)! < 0).length

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
          <button onClick={() => router.push('/tools')} className="text-sm text-stone-400 hover:text-stone-700 transition">Tools</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-10 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="brand text-4xl text-stone-900">Assignments</h1>
            <p className="text-stone-400 text-sm mt-1">
              {pendingCount} pending
              {overdueCount > 0 && <span className="text-red-400 font-medium ml-2">· {overdueCount} overdue</span>}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition"
          >
            + Add assignment
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
            <h2 className="text-sm font-semibold text-stone-900 mb-4">New assignment</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Assignment title"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                />
                <input
                  type="date"
                  value={form.due_date}
                  onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                />
                <select
                  value={form.priority}
                  onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                  className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition bg-white"
                >
                  <option value="high">High priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="low">Low priority</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={addAssignment} disabled={!form.title || saving} className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition disabled:opacity-40">
                  {saving ? 'Saving...' : 'Add assignment'}
                </button>
                <button onClick={() => setShowForm(false)} className="text-sm text-stone-400 hover:text-stone-600 transition px-4">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 mb-5 border-b border-stone-100">
          {(['pending', 'all', 'done'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px capitalize ${filter === f ? 'text-[#4a7c59] border-[#4a7c59]' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Assignment list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
            <p className="text-stone-400 text-sm">
              {filter === 'pending' ? 'No pending assignments. Add one above!' : 'No assignments here.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(a => (
              <div key={a.id} className={`bg-white rounded-2xl border border-stone-100 p-4 flex items-center gap-4 transition-all ${a.done ? 'opacity-60' : ''}`}>
                <button
                  onClick={() => toggleDone(a.id, a.done)}
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${a.done ? 'bg-[#4a7c59] border-[#4a7c59]' : 'border-stone-200 hover:border-[#4a7c59]'}`}
                >
                  {a.done && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${a.done ? 'line-through text-stone-400' : 'text-stone-800'}`}>{a.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {a.subject && <span className="text-xs text-stone-400">{a.subject}</span>}
                    {a.due_date && !a.done && <DueBadge dateStr={a.due_date} />}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getPriorityStyle(a.priority)}`}>
                    {a.priority}
                  </span>
                  <button onClick={() => deleteAssignment(a.id)} className="text-stone-200 hover:text-red-400 transition ml-1">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M6 6.5v3M8 6.5v3M3 3.5l.5 7a.5.5 0 00.5.5h6a.5.5 0 00.5-.5l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}