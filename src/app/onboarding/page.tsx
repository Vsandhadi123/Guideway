'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const steps = [
  {
    id: 'grade',
    question: "What grade are you in?",
    sub: "Let's start with the basics.",
    type: 'chips',
    options: ['9th grade', '10th grade', '11th grade', '12th grade'],
    reactions: {
      '9th grade': "Freshman year — the best time to build leverage.",
      '10th grade': "Sophomore year — perfect time to get intentional.",
      '11th grade': "Junior year — the most important academic year.",
      '12th grade': "Senior year — strong decisions now still change everything."
    }
  },

  {
    id: 'gpa',
    question: "What's your current GPA?",
    sub: "Be honest — strategy starts with reality.",
    type: 'chips',
    options: [
      'Below 2.0',
      '2.0 – 2.5',
      '2.5 – 3.0',
      '3.0 – 3.5',
      '3.5 – 4.0',
      '4.0+'
    ],
    reactions: {
      'Below 2.0': "Good. We work with reality, not fantasy.",
      '2.0 – 2.5': "This can move faster than you think with the right system.",
      '2.5 – 3.0': "Solid base. Now we optimize upward.",
      '3.0 – 3.5': "Good standing. Let's push you into stronger territory.",
      '3.5 – 4.0': "Strong GPA. Now your profile needs to match.",
      '4.0+': "Excellent. Now we focus on standing out beyond grades."
    }
  },

  {
    id: 'major',
    question: "What major or career are you aiming for?",
    sub: "Your roadmap depends on where you're headed.",
    type: 'chips',
    options: [
      'Computer Science',
      'Engineering',
      'Pre-Med',
      'Business',
      'Finance',
      'Law',
      'Psychology',
      'Not sure yet'
    ],
    reactions: {
      default: "Perfect — your academic strategy should match your future, not fight it."
    }
  },

  {
    id: 'colleges',
    question: "What schools are on your radar?",
    sub: "Dream schools help us reverse-engineer your plan.",
    type: 'text',
    placeholder: "e.g. UVA, Virginia Tech, Georgia Tech, Stanford...",
    reactions: {
      default: "Now we can compare where you are vs where you want to be."
    }
  },

  {
    id: 'classes',
    question: "What classes are you taking right now?",
    sub: "AP, Honors, Dual Enrollment — all of it matters.",
    type: 'text',
    placeholder: "e.g. AP CSA, AP Calc AB, Honors Chem, AP Lang...",
    reactions: {
      default: "Course rigor matters almost as much as GPA."
    }
  },

  {
    id: 'ecs',
    question: "What extracurriculars are you already involved in?",
    sub: "Leadership and impact matter more than random participation.",
    type: 'multi',
    options: [
      'TSA',
      'Key Club',
      'Sports',
      'Research',
      'Volunteering',
      'Internship',
      'Business',
      'Music / Arts',
      'Student Government',
      'None yet'
    ],
    reactions: {
      default: "Good — now we can identify what’s missing from your profile."
    }
  },

  {
    id: 'leadership',
    question: "Do you currently hold any leadership roles?",
    sub: "Leadership is one of the biggest admissions differentiators.",
    type: 'chips',
    options: [
      'Yes — strong leadership',
      'Some leadership',
      'Very little',
      'None yet'
    ],
    reactions: {
      default: "This is one of the fastest areas to improve strategically."
    }
  },

  {
    id: 'struggles',
    question: "Where do you struggle most?",
    sub: "Pick what actually slows you down.",
    type: 'multi',
    options: [
      'Staying focused',
      'Managing time',
      'Procrastinating',
      'Test anxiety',
      'Understanding material',
      'Staying motivated',
      'Balancing activities',
      'Sleep / energy'
    ],
    reactions: {
      default: "Your system should solve this — not just tell you to work harder."
    }
  },

  {
    id: 'interests',
    question: "What are you genuinely interested in?",
    sub: "This helps us suggest better opportunities, not generic ones.",
    type: 'text',
    placeholder: "e.g. coding, startups, robotics, basketball, music...",
    reactions: {
      default: "The best extracurriculars come from real interest, not resume stuffing."
    }
  },

  {
    id: 'scores',
    question: "SAT / ACT score (optional)",
    sub: "Skip if you haven't taken one yet.",
    type: 'text',
    placeholder: "e.g. SAT 1380, ACT 29, Not taken yet",
    reactions: {
      default: "This helps us set realistic score targets."
    }
  },

  {
    id: 'goals',
    question: "What do you want most from Guideway?",
    sub: "Your audit should solve your real problem.",
    type: 'multi',
    options: [
      'Get into a top university',
      'Raise my GPA',
      'Build stronger extracurriculars',
      'Find scholarships',
      'Reduce stress',
      'Create a better schedule',
      'Figure out my future'
    ],
    reactions: {
      default: "Perfect — your academic audit will prioritize exactly this."
    }
  }
]

function getReaction(step: any, answer: any): string {
  if (step.id === 'stress') {
    const val = Number(answer)
    if (val <= 3) return step.reactions.low
    if (val <= 6) return step.reactions.mid
    return step.reactions.high
  }
  if (step.reactions[answer]) return step.reactions[answer]
  return step.reactions.default || "Got it."
}

function ProfileCard({ answers, currentStep, steps }: { answers: Record<string, any>, currentStep: number, steps: any[] }) {
  const completedCount = Object.keys(answers).length
  const totalSteps = steps.length
  const pct = Math.round((completedCount / totalSteps) * 100)
  const circumference = 2 * Math.PI * 28

  const gpaColors: Record<string, string> = {
    'Below 2.0': '#e24b4a', '2.0 – 2.5': '#ef9f27', '2.5 – 3.0': '#BA7517',
    '3.0 – 3.5': '#4a6a7c', '3.5 – 4.0': '#4a7c59', '4.0+': '#085041'
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-100 p-6 shadow-lg shadow-stone-100/60">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-1">Your profile</p>
          <p className="text-sm font-semibold text-stone-800">Running your academic audit...</p>
        </div>
        <div className="relative w-16 h-16">
          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#f0ede8" strokeWidth="6" />
            <circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="#4a7c59"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - pct / 100)}
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-stone-700">{pct}%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Grade */}
        <div className={`flex items-center justify-between p-3 rounded-xl transition-all duration-500 ${answers.grade ? 'bg-[#f0f5f1] border border-[#d4e4d9]' : 'bg-stone-50 border border-stone-100'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${answers.grade ? 'bg-[#4a7c59] text-white' : 'bg-stone-100 text-stone-300'}`}>
              {answers.grade ? '✓' : '1'}
            </div>
            <span className="text-xs font-medium text-stone-600">Grade</span>
          </div>
          <span className={`text-xs font-semibold transition-all duration-300 ${answers.grade ? 'text-[#4a7c59]' : 'text-stone-300'}`}>
            {answers.grade || '—'}
          </span>
        </div>

        {/* GPA */}
        <div className={`flex items-center justify-between p-3 rounded-xl transition-all duration-500 ${answers.gpa ? 'bg-[#f0f5f1] border border-[#d4e4d9]' : 'bg-stone-50 border border-stone-100'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${answers.gpa ? 'bg-[#4a7c59] text-white' : 'bg-stone-100 text-stone-300'}`}>
              {answers.gpa ? '✓' : '2'}
            </div>
            <span className="text-xs font-medium text-stone-600">GPA</span>
          </div>
          {answers.gpa ? (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${gpaColors[answers.gpa]}20`, color: gpaColors[answers.gpa] }}>
              {answers.gpa}
            </span>
          ) : (
            <span className="text-xs font-semibold text-stone-300">—</span>
          )}
        </div>

        {/* Struggles */}
        <div className={`p-3 rounded-xl transition-all duration-500 ${answers.struggles?.length ? 'bg-[#f0f5f1] border border-[#d4e4d9]' : 'bg-stone-50 border border-stone-100'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${answers.struggles?.length ? 'bg-[#4a7c59] text-white' : 'bg-stone-100 text-stone-300'}`}>
                {answers.struggles?.length ? '✓' : '3'}
              </div>
              <span className="text-xs font-medium text-stone-600">Struggles</span>
            </div>
            {answers.struggles?.length > 0 && (
              <span className="text-xs text-[#4a7c59] font-semibold">{answers.struggles.length} selected</span>
            )}
          </div>
          {answers.struggles?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 ml-9">
              {answers.struggles.slice(0, 3).map((s: string) => (
                <span key={s} className="text-[10px] bg-white border border-[#d4e4d9] text-[#4a7c59] px-2 py-0.5 rounded-full">{s}</span>
              ))}
              {answers.struggles.length > 3 && (
                <span className="text-[10px] text-stone-400">+{answers.struggles.length - 3} more</span>
              )}
            </div>
          )}
        </div>

        {/* Interests */}
        <div className={`flex items-center justify-between p-3 rounded-xl transition-all duration-500 ${answers.interests ? 'bg-[#f0f5f1] border border-[#d4e4d9]' : 'bg-stone-50 border border-stone-100'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${answers.interests ? 'bg-[#4a7c59] text-white' : 'bg-stone-100 text-stone-300'}`}>
              {answers.interests ? '✓' : '4'}
            </div>
            <span className="text-xs font-medium text-stone-600">Interests</span>
          </div>
          <span className={`text-xs font-semibold transition-all duration-300 max-w-24 truncate text-right ${answers.interests ? 'text-[#4a7c59]' : 'text-stone-300'}`}>
            {answers.interests || '—'}
          </span>
        </div>

        {/* Goals */}
        <div className={`p-3 rounded-xl transition-all duration-500 ${answers.goals?.length ? 'bg-[#f0f5f1] border border-[#d4e4d9]' : 'bg-stone-50 border border-stone-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${answers.goals?.length ? 'bg-[#4a7c59] text-white' : 'bg-stone-100 text-stone-300'}`}>
                {answers.goals?.length ? '✓' : '5'}
              </div>
              <span className="text-xs font-medium text-stone-600">Goals</span>
            </div>
            <span className={`text-xs font-semibold ${answers.goals?.length ? 'text-[#4a7c59]' : 'text-stone-300'}`}>
              {answers.goals?.length ? answers.goals[0] : '—'}
            </span>
          </div>
        </div>

        {/* Study hours */}
        <div className={`flex items-center justify-between p-3 rounded-xl transition-all duration-500 ${answers.hours !== undefined ? 'bg-[#f0f5f1] border border-[#d4e4d9]' : 'bg-stone-50 border border-stone-100'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${answers.hours !== undefined ? 'bg-[#4a7c59] text-white' : 'bg-stone-100 text-stone-300'}`}>
              {answers.hours !== undefined ? '✓' : '6'}
            </div>
            <span className="text-xs font-medium text-stone-600">Study hours</span>
          </div>
          <span className={`text-xs font-semibold ${answers.hours !== undefined ? 'text-[#4a7c59]' : 'text-stone-300'}`}>
            {answers.hours !== undefined ? `${answers.hours} hrs/week` : '—'}
          </span>
        </div>

        {/* Stress */}
        <div className={`flex items-center justify-between p-3 rounded-xl transition-all duration-500 ${answers.stress !== undefined ? 'bg-[#f0f5f1] border border-[#d4e4d9]' : 'bg-stone-50 border border-stone-100'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${answers.stress !== undefined ? 'bg-[#4a7c59] text-white' : 'bg-stone-100 text-stone-300'}`}>
              {answers.stress !== undefined ? '✓' : '7'}
            </div>
            <span className="text-xs font-medium text-stone-600">Stress level</span>
          </div>
          <span className={`text-xs font-semibold ${answers.stress !== undefined ? 'text-[#4a7c59]' : 'text-stone-300'}`}>
            {answers.stress !== undefined ? `${answers.stress}/10` : '—'}
          </span>
        </div>
      </div>

      {pct === 100 && (
        <div className="mt-4 p-3 bg-[#4a7c59] rounded-2xl text-center">
          <p className="text-xs font-semibold text-white">Profile complete! Running your academic audit...</p>
        </div>
      )}
    </div>
  )
}

export default function Onboarding() {
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
    await new Promise(res => setTimeout(res, 2000))
    setReaction(null)

    if (current < steps.length - 1) {
      setAnimIn(false)
      await new Promise(res => setTimeout(res, 200))
      setCurrent(current + 1)
      setAnimIn(true)
    } else {
      setSaving(true)
      const finalAnswers = { ...answers }
      if (finalAnswers.hours === undefined) finalAnswers.hours = 10
      if (finalAnswers.stress === undefined) finalAnswers.stress = 5
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert({
        id: user.id,
        answers: finalAnswers,
        audit_status: 'pending',
        academic_audit: null,
        updated_at: new Date().toISOString(),
      })
      }
      localStorage.setItem('guideway_answers', JSON.stringify(finalAnswers))
      router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-[#fafaf9]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
        .slide-in { animation: slideIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .slide-out { animation: slideOut 0.2s ease-in forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-20px); } }
        .reaction-in { animation: reactionIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes reactionIn { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .chip { transition: all 0.15s cubic-bezier(0.22, 1, 0.36, 1); }
        .chip:hover { transform: translateY(-1px); }
        .chip.selected { transform: translateY(-1px); }
      `}</style>

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-stone-100 bg-white">
        <span className="brand text-xl text-stone-900">Guideway</span>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-400"
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  background: i < current ? '#4a7c59' : i === current ? '#4a7c59' : '#e8e5e0'
                }}
              />
            ))}
          </div>
          <span className="text-xs text-stone-400">{current + 1} of {steps.length}</span>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-2 gap-16 items-start">

        {/* Left — Question */}
        <div className="pt-8">
          {/* Reaction */}
          {reaction && (
            <div className="reaction-in mb-8 flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#4a7c59] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#4a7c59]/20">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7.5l3 3 7-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="bg-white border border-[#d4e4d9] rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm">
                <p className="text-sm text-stone-700 leading-relaxed">{reaction}</p>
              </div>
            </div>
          )}

          {!reaction && (
            <div className={animIn ? 'slide-in' : 'slide-out'}>
              <p className="text-sm text-stone-400 mb-2">{step.sub}</p>
              <h2 className="brand text-5xl text-stone-900 leading-tight mb-8">{step.question}</h2>

              {/* Chips */}
              {step.type === 'chips' && (
                <div className="flex flex-wrap gap-3">
                  {step.options!.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setAnswer(opt)}
                      className={`chip px-5 py-3 rounded-2xl border-2 text-sm font-semibold transition
                        ${answer === opt
                          ? 'selected bg-[#4a7c59] text-white border-[#4a7c59] shadow-lg shadow-[#4a7c59]/20'
                          : 'border-stone-200 text-stone-600 bg-white hover:border-[#4a7c59]'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Multi */}
              {step.type === 'multi' && (
                <div className="flex flex-wrap gap-3">
                  {step.options!.map(opt => {
                    const selected = (answer || []).includes(opt)
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleMulti(opt)}
                        className={`chip px-5 py-3 rounded-2xl border-2 text-sm font-semibold transition
                          ${selected
                            ? 'selected bg-[#4a7c59] text-white border-[#4a7c59] shadow-lg shadow-[#4a7c59]/20'
                            : 'border-stone-200 text-stone-600 bg-white hover:border-[#4a7c59]'}`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Text */}
              {step.type === 'text' && (
                <textarea
                  className="w-full border-2 border-stone-200 rounded-2xl px-5 py-4 text-base text-stone-800 outline-none focus:border-[#4a7c59] resize-none h-32 transition bg-white"
                  placeholder={step.placeholder}
                  value={answer || ''}
                  onChange={e => setAnswer(e.target.value)}
                />
              )}

              {/* Slider */}
              {step.type === 'slider' && (
                <div className="bg-white rounded-2xl border-2 border-stone-100 p-6">
                  <p className="brand text-7xl text-[#4a7c59] mb-1 leading-none">
                    {answer ?? (step as any).default}
                    <span className="text-2xl text-stone-300 ml-2">{step.id === 'stress' ? '/ 10' : 'hrs'}</span>
                  </p>
                  <p className="text-sm text-stone-400 mb-5">{step.id === 'stress' ? 'out of 10' : 'per week'}</p>
                  <input
                    type="range"
                    min={(step as any).min}
                    max={(step as any).max}
                    value={answer ?? (step as any).default}
                    onChange={e => setAnswer(Number(e.target.value))}
                    className="w-full accent-[#4a7c59]"
                  />
                  <div className="flex justify-between text-xs text-stone-300 mt-2">
                    <span>{step.id === 'stress' ? 'Very calm' : 'Almost none'}</span>
                    <span>{step.id === 'stress' ? 'Very stressed' : 'A lot'}</span>
                  </div>
                </div>
              )}

              <button
                onClick={next}
                disabled={!canContinue() || saving}
                className="mt-8 w-full py-4 bg-[#4a7c59] text-white rounded-2xl font-semibold text-base disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3d6849] transition shadow-lg shadow-[#4a7c59]/20"
              >
                {saving ? 'Running your academic audit...' : current === steps.length - 1 ? 'Run my Academic Audit →' : 'Continue →'}
              </button>
            </div>
          )}
        </div>

        {/* Right — Live profile card */}
        <div className="pt-8">
          <p className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-4">Academic profile — building live</p>
          <ProfileCard answers={answers} currentStep={current} steps={steps} />
        </div>
      </div>
    </main>
  )
}