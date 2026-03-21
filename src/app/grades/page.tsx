'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Grade = {
  id: string
  subject: string
  grade: number
  letter_grade: string
  credits: number
  semester: string
}

function getLetterGrade(grade: number): string {
  if (grade >= 93) return 'A'
  if (grade >= 90) return 'A-'
  if (grade >= 87) return 'B+'
  if (grade >= 83) return 'B'
  if (grade >= 80) return 'B-'
  if (grade >= 77) return 'C+'
  if (grade >= 73) return 'C'
  if (grade >= 70) return 'C-'
  if (grade >= 67) return 'D+'
  if (grade >= 63) return 'D'
  if (grade >= 60) return 'D-'
  return 'F'
}

function getGradePoints(letter: string): number {
  const map: Record<string, number> = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0
  }
  return map[letter] ?? 0
}

function getGradeColor(letter: string): string {
  if (letter.startsWith('A')) return 'text-[#4a7c59] bg-[#f0f5f1] border-[#d4e4d9]'
  if (letter.startsWith('B')) return 'text-blue-500 bg-blue-50 border-blue-100'
  if (letter.startsWith('C')) return 'text-amber-500 bg-amber-50 border-amber-100'
  return 'text-red-400 bg-red-50 border-red-100'
}

function calculateGPA(grades: Grade[]): number {
  if (grades.length === 0) return 0
  const totalPoints = grades.reduce((sum, g) => sum + getGradePoints(g.letter_grade) * g.credits, 0)
  const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0)
  return totalCredits > 0 ? totalPoints / totalCredits : 0
}

export default function Grades() {
  const router = useRouter()
  const supabase = createClient()
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ subject: '', grade: '', credits: '1', semester: 'Fall 2025' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('grades').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setGrades(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function addGrade() {
    if (!form.subject || !form.grade) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const gradeNum = parseFloat(form.grade)
    const letter = getLetterGrade(gradeNum)
    const { data } = await supabase.from('grades').insert({
      user_id: user.id,
      subject: form.subject,
      grade: gradeNum,
      letter_grade: letter,
      credits: parseFloat(form.credits),
      semester: form.semester,
    }).select().single()
    if (data) setGrades(prev => [data, ...prev])
    setForm({ subject: '', grade: '', credits: '1', semester: form.semester })
    setShowForm(false)
    setSaving(false)
  }

  async function deleteGrade(id: string) {
    await supabase.from('grades').delete().eq('id', id)
    setGrades(prev => prev.filter(g => g.id !== id))
  }

  const gpa = calculateGPA(grades)
  const semesters = [...new Set(grades.map(g => g.semester))]

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
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-10 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="brand text-4xl text-stone-900">Grades</h1>
            <p className="text-stone-400 text-sm mt-1">{grades.length} classes tracked</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition"
          >
            + Add grade
          </button>
        </div>

        {/* GPA card */}
        <div className="bg-[#4a7c59] rounded-2xl p-8 mb-6 text-white">
          <p className="text-xs font-semibold text-green-200 uppercase tracking-widest mb-2">Current GPA</p>
          <div className="flex items-end gap-4">
            <p className="brand text-7xl leading-none">{gpa.toFixed(2)}</p>
            <div className="mb-2">
              <p className="text-green-200 text-sm">{grades.length} classes</p>
              <p className="text-green-200 text-sm">{grades.reduce((s, g) => s + g.credits, 0)} credits</p>
            </div>
          </div>
          {grades.length > 0 && (
            <div className="mt-4 w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${(gpa / 4) * 100}%` }} />
            </div>
          )}
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
            <h2 className="text-sm font-semibold text-stone-900 mb-4">Add a class grade</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Subject name (e.g. AP Biology)"
                value={form.subject}
                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
              />
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Grade (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 92"
                    value={form.grade}
                    onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Credits</label>
                  <input
                    type="number"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={form.credits}
                    onChange={e => setForm(p => ({ ...p, credits: e.target.value }))}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Semester</label>
                  <input
                    type="text"
                    placeholder="e.g. Fall 2025"
                    value={form.semester}
                    onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
                  />
                </div>
              </div>
              {form.grade && (
                <div className="flex items-center gap-2 bg-stone-50 rounded-xl px-4 py-2.5">
                  <span className="text-xs text-stone-400">Letter grade:</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${getGradeColor(getLetterGrade(parseFloat(form.grade)))}`}>
                    {getLetterGrade(parseFloat(form.grade))}
                  </span>
                  <span className="text-xs text-stone-400 ml-1">({getGradePoints(getLetterGrade(parseFloat(form.grade))).toFixed(1)} points)</span>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={addGrade} disabled={!form.subject || !form.grade || saving} className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition disabled:opacity-40">
                  {saving ? 'Saving...' : 'Add grade'}
                </button>
                <button onClick={() => setShowForm(false)} className="text-sm text-stone-400 hover:text-stone-600 transition px-4">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Grades by semester */}
        {grades.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
            <p className="text-stone-400 text-sm">No grades yet — add your first class above!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {semesters.map(semester => (
              <div key={semester}>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">{semester}</p>
                <div className="flex flex-col gap-2">
                  {grades.filter(g => g.semester === semester).map(g => (
                    <div key={g.id} className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-base font-bold flex-shrink-0 ${getGradeColor(g.letter_grade)}`}>
                        {g.letter_grade}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-stone-800">{g.subject}</p>
                        <p className="text-xs text-stone-400 mt-0.5">{g.grade}% · {g.credits} credit{g.credits !== 1 ? 's' : ''} · {getGradePoints(g.letter_grade).toFixed(1)} pts</p>
                      </div>
                      <button onClick={() => deleteGrade(g.id)} className="text-stone-200 hover:text-red-400 transition">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M6 6.5v3M8 6.5v3M3 3.5l.5 7a.5.5 0 00.5.5h6a.5.5 0 00.5-.5l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}