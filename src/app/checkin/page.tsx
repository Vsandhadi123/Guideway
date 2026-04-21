'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const steps = [
  {
    id: 'week_rating',
    question: "How did this week go overall?",
    hint: "Be honest — this helps Guideway adjust your plan.",
    type: 'slider',
    min: 1,
    max: 10,
    default: 6,
    reactions: {
      low: "That’s okay — rough weeks happen. We’ll simplify and refocus.",
      mid: "Solid. We’ll keep momentum and tighten what matters most.",
      high: "Love that. We can push a little harder this week."
    }
  },
  {
    id: 'completed_wins',
    question: "What did you actually get done this week?",
    hint: "Classes, projects, clubs, tests, anything meaningful.",
    type: 'text',
    placeholder: 'e.g. finished my CSA project, studied for math, went to TSA, got an A on a quiz...',
    reactions: {
      default: "Good — progress matters, even if the week wasn’t perfect."
    }
  },
  {
    id: 'biggest_blockers',
    question: "What got in the way most?",
    hint: "Pick the biggest things that slowed you down.",
    type: 'multi',
    options: [
      'Procrastination',
      'Too much homework',
      'Test stress',
      'Phone / distractions',
      'Low energy',
      'Too many activities',
      'Family / personal stuff',
      'Did not know what to prioritize'
    ],
    reactions: {
      default: "That helps. Your next plan should solve the real bottleneck."
    }
  },
  {
    id: 'stress_level',
    question: "How stressed do you feel right now?",
    hint: "This affects how intense next week should be.",
    type: 'slider',
    min: 1,
    max: 10,
    default: 5,
    reactions: {
      low: "Good — we can keep things ambitious but controlled.",
      mid: "Makes sense. We’ll keep breathing room in the plan.",
      high: "Heard. We’ll cut the noise and focus only on the highest-impact work."
    }
  },
  {
    id: 'next_week_focus',
    question: "What matters most next week?",
    hint: "What do you want Guideway to prioritize?",
    type: 'chips',
    options: [
      'Raise my grades',
      'Stay consistent',
      'Get ahead academically',
      'Improve time management',
      'Reduce stress',
      'Focus on college prep',
      'Build extracurriculars'
    ],
    reactions: {
      default: "Perfect. Your updated plan should reflect that."
    }
  },
]

function getReaction(step: any, answer: any): string {
  if (step.id === 'stress_level' || step.id === 'week_rating') {
    const val = Number(answer)
    if (val <= 3) return step.reactions.low
    if (val <= 6) return step.reactions.mid
    return step.reactions.high
  }

  if (step.reactions[answer]) return step.reactions[answer]
  return step.reactions.default || "Got it."
}

export default function CheckIn() {
  const router = useRouter()
  const supabase = createClient()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [reaction, setReaction] = useState<string | null>(null)
  const [animIn, setAnimIn] = useState(true)
  const [saving, setSaving] = useState(false)

  const step = steps[current]
  const answer = answers[step.id]

  function setAnswer(val: any) {
    setAnswers(prev => ({ ...prev, [step.id]: val }))
  }

  function toggleMulti(option: string) {
    const prev: string[] = answers[step.id] || []
    if (prev.includes(option)) {
      setAnswer(prev.filter((o: string) => o !== option))
    } else {
      setAnswer([...prev, option])
    }
  }

  function canContinue() {
    if (step.type === 'slider') return true
    if (step.type === 'text') return true
    if (!answer) return false
    if (Array.isArray(answer)) return answer.length > 0
    return true
  }

  async function next() {
    if (!canContinue()) return

    const r = getReaction(step, answer ?? (step as any).default)
    setReaction(r)
    await new Promise(res => setTimeout(res, 2500))
    setReaction(null)

    if (current < steps.length - 1) {
      setAnimIn(false)
      await new Promise(res => setTimeout(res, 200))
      setCurrent(current + 1)
      setAnimIn(true)
    } else {
  setSaving(true)

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('answers, academic_audit')
      .eq('id', user.id)
      .single()

    // 1. Build check-in data
    const checkinData = {
      user_id: user.id,
      week_rating: answers.week_rating ?? 6,
      completed_wins: answers.completed_wins || '',
      biggest_blockers: answers.biggest_blockers || [],
      stress_level: answers.stress_level ?? 5,
      next_week_focus: answers.next_week_focus || '',
    }

    // 2. Save check-in to Supabase
    
    const insertRes = await supabase.from('checkins').insert(checkinData)

    // 3. Call AI to replan
    const generateRes = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'weekly_replan',
      answers: profile?.answers,
      academicAudit: profile?.academic_audit,
      checkin: checkinData,
    }),
  })

  let replanned: any = null

  console.log('generateRes status:', generateRes.status)
  console.log('generateRes ok:', generateRes.ok)

  try {
    replanned = await generateRes.json()
  } catch (error) {
    console.error('Failed to parse /api/generate response:', error)
  }

  console.log('weekly_replan response full:', JSON.stringify(replanned, null, 2))
  console.log('updated_competitiveness only:', replanned?.updated_competitiveness)

  if (replanned && !replanned.error) {
    const updatedAudit = {
    ...(profile?.academic_audit || {}),
    priority_actions:
      replanned.updated_priority_actions ||
      profile?.academic_audit?.priority_actions ||
      [],
    competitiveness:
      replanned.updated_competitiveness ||
      profile?.academic_audit?.competitiveness ||
      [],
    weekly_summary: replanned.summary || '',
    weekly_motivation: replanned.motivation || '',
    updated_schedule: replanned.updated_schedule || [],
  }

    await supabase
      .from('profiles')
      .update({
        academic_audit: updatedAudit,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
  } else {
    console.error('weekly_replan failed:', replanned)
  }

    // 4. Update dashboard data
    if (replanned && !replanned.error) {
      const updatedAudit = {
        ...(profile?.academic_audit || {}),
        priority_actions:
          replanned.updated_priority_actions ||
          profile?.academic_audit?.priority_actions ||
          [],
        weekly_summary: replanned.summary || '',
        weekly_motivation: replanned.motivation || '',
        updated_schedule: replanned.updated_schedule || [],
      }

      await supabase
        .from('profiles')
        .update({
          academic_audit: updatedAudit,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
    }
  }

  router.push('/dashboard')
}
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden" style={{
      fontFamily: "'Inter', sans-serif",
      background: 'linear-gradient(135deg, #f7f9f7 0%, #faf8f5 50%, #f0f5f1 100%)'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
        .slide-in { animation: slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .slide-out { animation: slideOut 0.25s ease-in forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-24px); } }
        .reaction-in { animation: reactionIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes reactionIn { from { opacity: 0; transform: translateY(16px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .chip { transition: all 0.18s cubic-bezier(0.22, 1, 0.36, 1); border: 2px solid #e8e5e0; }
        .chip:hover { transform: translateY(-2px); border-color: #4a7c59 !important; box-shadow: 0 4px 16px rgba(74,124,89,0.15); }
        .chip.selected { transform: translateY(-2px); background: #4a7c59 !important; color: white !important; border-color: #4a7c59 !important; }
      `}</style>

      {/* Background blobs */}
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,124,89,0.08) 0%, transparent 70%)', top: -100, right: -100, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,124,89,0.06) 0%, transparent 70%)', bottom: -80, left: -80, pointerEvents: 'none' }} />

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-6 relative z-10">
        <div>
          <span className="brand text-xl text-stone-900">Guideway</span>
          <span className="ml-3 text-xs font-semibold text-[#4a7c59] bg-[#f0f5f1] border border-[#d4e4d9] px-2.5 py-1 rounded-full">Weekly check-in</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 items-center">
            {steps.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-500"
                style={{
                  width: i === current ? '28px' : '6px',
                  height: '6px',
                  background: i < current ? '#4a7c59' : i === current ? '#4a7c59' : '#d4d0c8'
                }}
              />
            ))}
          </div>
          <span className="text-xs text-stone-400 font-medium">{current + 1} of {steps.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-0.5 bg-stone-100 relative z-10">
        <div
          className="h-full bg-[#4a7c59] transition-all duration-700 ease-out"
          style={{ width: `${(current / steps.length) * 100}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-xl">

          {/* Reaction */}
          {reaction && (
            <div className="reaction-in">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-[#4a7c59] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#4a7c59]/20">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2.5 8.5l3.5 3.5 7.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#4a7c59] uppercase tracking-widest mb-2">Guideway says</p>
                  <div className="bg-white border border-[#d4e4d9] rounded-3xl rounded-tl-lg px-6 py-4 shadow-sm">
                    <p className="text-base text-stone-700 leading-relaxed">{reaction}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-14 mt-4">
                <div className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Question */}
          {!reaction && (
            <div className={animIn ? 'slide-in' : 'slide-out'}>
              <div className="mb-8">
                <h2 className="brand text-5xl text-stone-900 leading-tight">{step.question}</h2>
                {step.hint && <p className="text-sm text-stone-400 mt-3">{step.hint}</p>}
              </div>

              {step.type === 'chips' && (
                <div className="flex flex-wrap gap-3">
                  {step.options!.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setAnswer(opt)}
                      className={`chip px-5 py-3 rounded-2xl text-sm font-semibold bg-white text-stone-600 ${answer === opt ? 'selected' : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {step.type === 'multi' && (
                <div className="flex flex-wrap gap-3">
                  {step.options!.map(opt => {
                    const selected = (answer || []).includes(opt)
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleMulti(opt)}
                        className={`chip px-5 py-3 rounded-2xl text-sm font-semibold bg-white text-stone-600 ${selected ? 'selected' : ''}`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              )}

              {step.type === 'text' && (
                <textarea
                  className="w-full border-2 border-stone-200 rounded-3xl px-6 py-4 text-base text-stone-800 outline-none focus:border-[#4a7c59] resize-none h-36 transition-all bg-white shadow-sm"
                  placeholder={step.placeholder}
                  value={answer || ''}
                  onChange={e => setAnswer(e.target.value)}
                />
              )}

              {step.type === 'slider' && (
                <div className="bg-white rounded-3xl border-2 border-stone-100 p-8 shadow-sm">
                  <p className="brand text-8xl text-[#4a7c59] mb-1 leading-none">
                    {answer ?? (step as any).default}
                    <span className="text-3xl text-stone-300 ml-2">/ 10</span>
                  </p>
                  <p className="text-sm text-stone-400 mb-6">out of 10</p>
                  <input
                    type="range"
                    min={(step as any).min}
                    max={(step as any).max}
                    value={answer ?? (step as any).default}
                    onChange={e => setAnswer(Number(e.target.value))}
                    className="w-full accent-[#4a7c59]"
                  />
                  <div className="flex justify-between text-xs text-stone-300 mt-2">
                    <span>Very calm</span>
                    <span>Extremely stressed</span>
                  </div>
                </div>
              )}

              <button
                onClick={next}
                disabled={!canContinue() || saving}
                className="mt-8 w-full py-4 bg-[#4a7c59] text-white rounded-2xl font-semibold text-base disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#4a7c59]/20 hover:bg-[#3d6849] transition"
              >
                {saving ? 'Replanning your week...' : current === steps.length - 1 ? 'Update my week →' : 'Continue →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}