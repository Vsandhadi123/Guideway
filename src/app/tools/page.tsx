'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const TOOLS = [
  {
    title: 'Assignments',
    desc: 'Track homework and due dates. Never miss a deadline.',
    href: '/assignments',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12l2 2 4-4" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Grades',
    desc: 'Track your grades per class and auto-calculate your GPA.',
    href: '/grades',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Class Schedule',
    desc: 'Enter your classes and see your week at a glance.',
    href: '/schedule',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Exam Countdown',
    desc: 'Track upcoming tests and see exactly how many days you have.',
    href: '/exams',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Focus Timer',
    desc: 'Pomodoro timer to stay focused and take proper breaks.',
    href: '/pomodoro',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 0v10l4 2" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'AI Study Buddy',
    desc: 'Chat with an AI that knows your profile. Get help studying anything.',
    href: '/chat',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function Tools() {
  const router = useRouter()
  const supabase = createClient()

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
          <button onClick={() => router.push('/plan')} className="text-sm text-stone-400 hover:text-stone-700 transition">My Plan</button>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="text-sm text-stone-400 hover:text-stone-700 transition">Sign out</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-10 py-12">
        <div className="mb-10">
          <h1 className="brand text-4xl text-stone-900">Study Tools</h1>
          <p className="text-stone-400 text-sm mt-1">Everything you need to stay organized and focused.</p>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {TOOLS.map(({ title, desc, href, icon }) => (
            <button
              key={title}
              onClick={() => router.push(href)}
              className="bg-white rounded-2xl border border-stone-100 p-6 text-left hover:border-[#c8dace] hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#f0f5f1] border border-[#d4e4d9] flex items-center justify-center mb-4 group-hover:bg-[#4a7c59] transition-colors duration-200">
                <div className="group-hover:[&_path]:stroke-white transition-all duration-200">
                  {icon}
                </div>
              </div>
              <h2 className="text-base font-semibold text-stone-900 mb-1.5">{title}</h2>
              <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
              <p className="text-xs text-[#4a7c59] font-medium mt-4 group-hover:underline">Open →</p>
            </button>
          ))}
        </div>

        {/* Quick stats */}
        <div className="mt-10 bg-white rounded-2xl border border-stone-100 p-6">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-5">Quick access</p>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'View my plan', href: '/plan' },
              { label: 'Weekly check-in', href: '/checkin' },
              { label: 'Opportunities', href: '/opportunities' },
              { label: 'Settings', href: '/settings' },
            ].map(({ label, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 hover:border-[#c8dace] hover:bg-[#f0f5f1] transition text-sm font-medium text-stone-600"
              >
                {label}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="#d4d0c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}