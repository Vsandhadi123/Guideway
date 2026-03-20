'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const steps = [
  {
    id: 'grade',
    question: "First things first —",
    sub: "what grade are you in?",
    type: 'chips',
    options: ['9th grade', '10th grade', '11th grade', '12th grade'],
    reactions: {
      '9th grade': "Freshman year! You've got time on your side. Most students don't start planning until junior year — you're already ahead.",
      '10th grade': "Sophomore year — the perfect time to get serious. You've got enough experience to know what works, and enough time to act on it.",
      '11th grade': "Junior year. This is the one that matters most. Let's make every week count.",
      '12th grade': "Senior year! It's not too late — the right plan now can still change where you end up.",
    }
  },
  {
    id: 'gpa',
    question: "Be honest with yourself —",
    sub: "what's your GPA looking like?",
    type: 'chips',
    options: ['Below 2.0', '2.0 – 2.5', '2.5 – 3.0', '3.0 – 3.5', '3.5 – 4.0', '4.0+'],
    reactions: {
      'Below 2.0': "That takes courage to admit. Knowing where you are is the first step — and we've seen students turn this around completely with the right system.",
      '2.0 – 2.5': "There's real room to grow here. A focused plan and consistent habits can move this faster than you think.",
      '2.5 – 3.0': "Solid foundation. You're doing the work — now let's make sure you're doing the right work.",
      '3.0 – 3.5': "Good standing. You're above average — let's build a plan that pushes you into the top tier.",
      '3.5 – 4.0': "Strong GPA. Let's make sure the rest of your profile — ECs, opportunities, college prep — matches this level.",
      '4.0+': "Impressive. Let's make sure you're building a life, not just a GPA. Balance is going to be key for you.",
    }
  },
  {
    id: 'struggles',
    question: "No judgment here —",
    sub: "where do you struggle most?",
    hint: "Pick everything that feels true",
    type: 'multi',
    options: ['Staying focused', 'Managing time', 'Procrastinating', 'Test anxiety', 'Understanding material', 'Staying motivated', 'Balancing activities', 'Sleep / energy'],
    reactions: {
      default: "Noted — and honestly, these are the same things most high achievers struggle with. Your plan will tackle these directly, not just work around them."
    }
  },
  {
    id: 'interests',
    question: "Tell us what you're",
    sub: "actually into.",
    hint: "Be specific — this shapes your extracurricular suggestions",
    type: 'text',
    placeholder: 'e.g. coding, basketball, making music, photography, cooking...',
    reactions: {
      default: "We love it. We'll find real opportunities — competitions, programs, internships — that match what you actually care about. Not just what looks good on paper."
    }
  },
  {
    id: 'goals',
    question: "Dream big —",
    sub: "where do you see yourself after high school?",
    type: 'multi',
    options: ['Top university', 'State / in-state school', 'Community college', 'Trade / vocational', 'Start a business', 'Not sure yet'],
    reactions: {
      default: "Perfect. Every recommendation in your plan — from ECs to college prep — will be built around exactly this."
    }
  },
  {
    id: 'hours',
    question: "Be real with yourself —",
    sub: "how many hours can you study each week?",
    type: 'slider',
    min: 1,
    max: 30,
    default: 10,
    reactions: {
      default: "We'll build a schedule around what you actually have — not some idealized version of your life. Realistic plans get followed."
    }
  },
  {
    id: 'stress',
    question: "Last one —",
    sub: "how stressed are you feeling right now?",
    type: 'slider',
    min: 1,
    max: 10,
    default: 5,
    reactions: {
      low: "That's great to hear. Let's keep it that way — we'll make sure your plan builds momentum without burning you out.",
      mid: "That's manageable, but we'll make sure your plan has breathing room built in. Sustainable > intense.",
      high: "We hear you — and we take that seriously. Mental health isn't an afterthought in your plan, it's a core part of it.",
    }
  },
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
    if (!answer) return false
    if (Array.isArray(answer)) return answer.length > 0
    if (typeof answer === 'string') return answer.trim().length > 0
    return true
  }

  async function next() {
    if (!canContinue()) return
    const r = getReaction(step, answer ?? (step as any).default)
    setReaction(r)
    await new Promise(res => setTimeout(res, 3000))
    setReaction(null)

    if (current < steps.length - 1) {
      setAnimIn(false)
      await new Promise(res => setTimeout(res, 250))
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
          plan: null,
          updated_at: new Date().toISOString(),
        })
      }
      localStorage.setItem('guideway_answers', JSON.stringify(finalAnswers))
      router.push('/dashboard')
    }
  }

  const progress = ((current) / steps.length) * 100

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden" style={{
      fontFamily: "'Inter', sans-serif",
      background: 'linear-gradient(135deg, #f7f9f7 0%, #faf8f5 50%, #f0f5f1 100%)'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400;1,9..144,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }

        .slide-in {
          animation: slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .slide-out {
          animation: slideOut 0.25s ease-in forwards;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-24px); }
        }
        .reaction-in {
          animation: reactionIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes reactionIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chip {
          transition: all 0.18s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .chip:hover {
          transform: translateY(-2px);
          border-color: #4a7c59 !important;
          box-shadow: 0 4px 16px rgba(74, 124, 89, 0.15);
        }
        .chip.selected {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(74, 124, 89, 0.25);
        }
        .continue-btn {
          transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .continue-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(74, 124, 89, 0.35);
        }
        .continue-btn:active:not(:disabled) {
          transform: translateY(0px);
        }

        /* Decorative blobs */
        .blob1 {
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(74,124,89,0.08) 0%, transparent 70%);
          top: -100px;
          right: -100px;
          pointer-events: none;
        }
        .blob2 {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(74,124,89,0.06) 0%, transparent 70%);
          bottom: -80px;
          left: -80px;
          pointer-events: none;
        }
        .blob3 {
          position: fixed;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,229,210,0.5) 0%, transparent 70%);
          top: 40%;
          left: 10%;
          pointer-events: none;
        }
      `}</style>

      {/* Decorative background blobs */}
      <div className="blob1" />
      <div className="blob2" />
      <div className="blob3" />

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-6 relative z-10">
        <span className="brand text-2xl text-stone-900">Guideway</span>
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
          style={{ width: `${progress}%` }}
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

              {/* Question text */}
              <div className="mb-8">
                <p className="text-xl text-stone-400 font-medium mb-1">{step.question}</p>
                <h2 className="brand text-5xl text-stone-900 leading-tight">{step.sub}</h2>
                {step.hint && (
                  <p className="text-sm text-stone-400 mt-3">{step.hint}</p>
                )}
              </div>

              {/* Chips */}
              {step.type === 'chips' && (
                <div className="flex flex-wrap gap-3">
                  {step.options!.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setAnswer(opt)}
                      className={`chip px-5 py-3 rounded-2xl border-2 text-sm font-semibold
                        ${answer === opt
                          ? 'selected bg-[#4a7c59] text-white border-[#4a7c59]'
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
                        className={`chip px-5 py-3 rounded-2xl border-2 text-sm font-semibold
                          ${selected
                            ? 'selected bg-[#4a7c59] text-white border-[#4a7c59]'
                            : 'border-stone-200 text-stone-600 bg-white'}`}
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
                  className="w-full border-2 border-stone-200 rounded-3xl px-6 py-4 text-base text-stone-800 outline-none focus:border-[#4a7c59] resize-none h-36 transition-all bg-white shadow-sm"
                  placeholder={step.placeholder}
                  value={answer || ''}
                  onChange={e => setAnswer(e.target.value)}
                />
              )}

              {/* Slider */}
              {step.type === 'slider' && (
                <div className="bg-white rounded-3xl border-2 border-stone-100 p-8 shadow-sm">
                  <p className="brand text-8xl text-[#4a7c59] mb-1 leading-none">
                    {answer ?? (step as any).default}
                    <span className="text-3xl text-stone-300 ml-2">{step.id === 'stress' ? '/ 10' : 'hrs'}</span>
                  </p>
                  <p className="text-sm text-stone-400 mb-6">{step.id === 'stress' ? 'out of 10' : 'per week'}</p>
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
                    <span>{step.id === 'stress' ? 'Extremely stressed' : 'A lot'}</span>
                  </div>
                </div>
              )}

              {/* Continue */}
              <button
                onClick={next}
                disabled={!canContinue() || saving}
                className="continue-btn mt-8 w-full py-4 bg-[#4a7c59] text-white rounded-2xl font-semibold text-base disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#4a7c59]/20"
              >
                {saving ? 'Building your plan...' : current === steps.length - 1 ? 'Build my plan →' : 'Continue →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}