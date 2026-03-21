'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const MODES = [
  { id: 'focus', label: 'Focus', duration: 25 * 60, color: '#4a7c59' },
  { id: 'short', label: 'Short break', duration: 5 * 60, color: '#4a6a7c' },
  { id: 'long', label: 'Long break', duration: 15 * 60, color: '#7c6a4a' },
]

export default function Pomodoro() {
  const router = useRouter()
  const [modeIdx, setModeIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(MODES[0].duration)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [task, setTask] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const mode = MODES[modeIdx]

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            if (modeIdx === 0) setSessions(s => s + 1)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current!)
    }
    return () => clearInterval(intervalRef.current!)
  }, [running])

  function setMode(idx: number) {
    setModeIdx(idx)
    setTimeLeft(MODES[idx].duration)
    setRunning(false)
  }

  function reset() {
    setTimeLeft(mode.duration)
    setRunning(false)
  }

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')
  const progress = 1 - timeLeft / mode.duration
  const circumference = 2 * Math.PI * 120

  return (
    <main className="min-h-screen bg-[#fafaf9] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
      `}</style>

      <nav className="bg-white border-b border-stone-100 flex items-center justify-between px-10 py-4">
        <span className="brand text-2xl text-stone-900">Guideway</span>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-stone-400 hover:text-stone-700 transition">Dashboard</button>
          <button onClick={() => router.push('/assignments')} className="text-sm text-stone-400 hover:text-stone-700 transition">Assignments</button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <h1 className="brand text-4xl text-stone-900 mb-2">Focus Timer</h1>
        <p className="text-stone-400 text-sm mb-10">Stay focused. Take breaks. Get things done.</p>

        {/* Mode tabs */}
        <div className="flex items-center gap-2 bg-white border border-stone-100 rounded-2xl p-1.5 mb-10">
          {MODES.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setMode(i)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${modeIdx === i ? 'text-white' : 'text-stone-400 hover:text-stone-600'}`}
              style={modeIdx === i ? { background: m.color } : {}}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Timer circle */}
        <div className="relative mb-8">
          <svg width="280" height="280" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r="120" fill="none" stroke="#f0ede8" strokeWidth="8" />
            <circle
              cx="140" cy="140" r="120"
              fill="none"
              stroke={mode.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              transform="rotate(-90 140 140)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="brand text-7xl text-stone-900 leading-none">{mins}:{secs}</p>
            <p className="text-sm text-stone-400 mt-2">{mode.label}</p>
            {sessions > 0 && (
              <div className="flex gap-1 mt-3">
                {Array.from({ length: Math.min(sessions, 8) }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ background: mode.color }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Task input */}
        <div className="w-full max-w-sm mb-8">
          <input
            type="text"
            placeholder="What are you working on?"
            value={task}
            onChange={e => setTask(e.target.value)}
            className="w-full text-center border border-stone-200 rounded-2xl px-5 py-3 text-sm text-stone-700 outline-none focus:border-[#4a7c59] transition bg-white"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={reset}
            className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-stone-50 transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8a6 6 0 106-6H6M6 2L4 4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            onClick={() => setRunning(!running)}
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl transition-all hover:scale-105 active:scale-95 shadow-xl"
            style={{ background: mode.color, boxShadow: `0 8px 32px ${mode.color}40` }}
          >
            {running ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="5" y="4" width="4" height="12" rx="1" fill="white"/>
                <rect x="11" y="4" width="4" height="12" rx="1" fill="white"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 4l10 6-10 6V4z" fill="white"/>
              </svg>
            )}
          </button>

          <button
            onClick={() => setMode((modeIdx + 1) % MODES.length)}
            className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-stone-50 transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Sessions count */}
        {sessions > 0 && (
          <p className="text-sm text-stone-400 mt-8">
            {sessions} session{sessions !== 1 ? 's' : ''} completed today
          </p>
        )}
      </div>
    </main>
  )
}