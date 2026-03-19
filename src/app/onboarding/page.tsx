'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const steps = [
  {
    id: 'grade',
    question: 'What grade are you in?',
    type: 'chips',
    options: ['9th grade', '10th grade', '11th grade', '12th grade'],
  },
  {
    id: 'gpa',
    question: "What's your current GPA?",
    type: 'chips',
    options: ['Below 2.0', '2.0 – 2.5', '2.5 – 3.0', '3.0 – 3.5', '3.5 – 4.0', '4.0+'],
  },
  {
    id: 'struggles',
    question: 'Where do you struggle most?',
    hint: 'Pick all that apply',
    type: 'multi',
    options: ['Staying focused', 'Managing time', 'Procrastinating', 'Test anxiety', 'Understanding material', 'Staying motivated', 'Balancing activities', 'Sleep / energy'],
  },
  {
    id: 'interests',
    question: 'What are your interests or hobbies?',
    hint: 'Helps us suggest relevant extracurriculars',
    type: 'text',
    placeholder: 'e.g. robotics, writing, basketball, coding...',
  },
  {
    id: 'goals',
    question: 'What are your goals after high school?',
    type: 'multi',
    options: ['Top university', 'State / in-state school', 'Community college', 'Trade / vocational', 'Start a business', 'Not sure yet'],
  },
  {
    id: 'hours',
    question: 'Hours available for studying per week?',
    type: 'slider',
    min: 1,
    max: 30,
    default: 10,
  },
  {
    id: 'stress',
    question: 'How stressed do you feel on average?',
    type: 'slider',
    min: 1,
    max: 10,
    default: 5,
  },
]

export default function Onboarding() {
  const router = useRouter()
  const supabase = createClient()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
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
    if (current < steps.length - 1) {
      setCurrent(current + 1)
      return
    }

    // Last step — save to Supabase and generate plan
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        answers,
        updated_at: new Date().toISOString(),
      })
    }

    // Save answers to localStorage as backup
    localStorage.setItem('guideway_answers', JSON.stringify(answers))
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
      .brand { font-family: 'Fraunces', serif; }`}</style>

      <div className="w-full max-w-lg">
        {/* Logo */}
        <p className="brand text-2xl text-stone-900 text-center mb-10">Guideway</p>

        {/* Progress bar */}
        <div className="w-full bg-stone-100 rounded-full h-1 mb-10">
          <div
            className="bg-[#4a7c59] h-1 rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step counter */}
        <p className="text-xs text-stone-400 mb-2">{current + 1} of {steps.length}</p>

        {/* Question */}
        <h2 className="text-2xl font-semibold text-stone-900 mb-1">{step.question}</h2>
        {step.hint && <p className="text-sm text-stone-400 mb-6">{step.hint}</p>}
        {!step.hint && <div className="mb-6" />}

        {/* Chips */}
        {step.type === 'chips' && (
          <div className="flex flex-wrap gap-3">
            {step.options!.map(opt => (
              <button
                key={opt}
                onClick={() => setAnswer(opt)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition
                  ${answer === opt
                    ? 'bg-[#4a7c59] text-white border-[#4a7c59]'
                    : 'border-stone-200 text-stone-600 hover:border-[#4a7c59]'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Multi select */}
        {step.type === 'multi' && (
          <div className="flex flex-wrap gap-3">
            {step.options!.map(opt => {
              const selected = (answer || []).includes(opt)
              return (
                <button
                  key={opt}
                  onClick={() => toggleMulti(opt)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition
                    ${selected
                      ? 'bg-[#4a7c59] text-white border-[#4a7c59]'
                      : 'border-stone-200 text-stone-600 hover:border-[#4a7c59]'}`}
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
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-[#4a7c59] resize-none h-28"
            placeholder={step.placeholder}
            value={answer || ''}
            onChange={e => setAnswer(e.target.value)}
          />
        )}

        {/* Slider */}
        {step.type === 'slider' && (
          <div>
            <p className="text-4xl font-bold text-[#4a7c59] mb-4">
              {answer ?? step.default}{step.id === 'stress' ? '/10' : ' hrs'}
            </p>
            <input
              type="range"
              min={step.min}
              max={step.max}
              value={answer ?? step.default}
              onChange={e => setAnswer(Number(e.target.value))}
              className="w-full accent-[#4a7c59]"
            />
            <div className="flex justify-between text-xs text-stone-300 mt-1">
              <span>{step.id === 'stress' ? 'Very calm' : 'Almost none'}</span>
              <span>{step.id === 'stress' ? 'Very stressed' : 'A lot'}</span>
            </div>
          </div>
        )}

        {/* Next button */}
        <button
          onClick={next}
          disabled={!canContinue() || saving}
          className="mt-10 w-full py-3 bg-[#4a7c59] text-white rounded-xl font-medium text-sm hover:bg-[#3d6849] transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving your plan...' : current === steps.length - 1 ? 'Build my plan →' : 'Continue →'}
        </button>
      </div>
    </main>
  )
}