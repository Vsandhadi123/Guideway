'use client'

import Link from 'next/link'
import { useEffect } from 'react'

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8.5" stroke="#4a7c59" strokeWidth="1"/>
      <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function DashboardPreview() {
  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200 shadow-2xl shadow-stone-200/80 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#fafaf9]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#4a7c59] flex items-center justify-center text-white text-xs font-bold">V</div>
          <div>
            <p className="text-xs font-semibold text-stone-800">Varun's Plan</p>
            <p className="text-[10px] text-stone-400">Week 3 of 18 · Sophomore year</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full" />
          <span className="text-[10px] text-[#4a7c59] font-semibold">On track</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0 divide-x divide-stone-100">
        <div className="col-span-1 p-5 bg-[#fafaf9]">
          <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mb-3">Your plan</p>
          {[
            { label: 'Overview', active: true },
            { label: 'Study Schedule', active: false },
            { label: 'Extracurriculars', active: false },
            { label: 'College Roadmap', active: false },
            { label: 'Check-in', active: false },
          ].map(({ label, active }) => (
            <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 ${active ? 'bg-[#4a7c59] text-white' : 'text-stone-400'}`}>
              <span className="text-[11px] font-medium">{label}</span>
            </div>
          ))}

          <div className="mt-6">
            <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mb-3">Progress</p>
            <div className="space-y-2.5">
              {[
                { label: 'GPA Goal', pct: 62 },
                { label: 'ECs', pct: 40 },
                { label: 'College Prep', pct: 25 },
              ].map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-stone-400">{label}</span>
                    <span className="text-[10px] font-semibold text-stone-600">{pct}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1">
                    <div className="bg-[#4a7c59] h-1 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2 p-5">
          <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mb-4">This week</p>
          <div className="space-y-2 mb-5">
            {[
              { day: 'Mon', task: 'Pomodoro session — AP Bio', time: '7:00 PM', done: true },
              { day: 'Wed', task: 'Coding project work', time: '6:00 PM', done: true },
              { day: 'Thu', task: 'Active recall flashcards', time: '7:00 PM', done: false },
              { day: 'Sat', task: 'Robotics club build session', time: '10:00 AM', done: false },
            ].map(({ day, task, time, done }) => (
              <div key={day} className={`flex items-center gap-3 p-2.5 rounded-xl ${done ? 'bg-[#f0f5f1]' : 'bg-stone-50 border border-stone-100'}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold ${done ? 'bg-[#4a7c59] text-white' : 'bg-stone-100 text-stone-400'}`}>{day}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-medium truncate ${done ? 'text-stone-400 line-through' : 'text-stone-700'}`}>{task}</p>
                  <p className="text-[9px] text-stone-300">{time}</p>
                </div>
                {done && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
          <div className="bg-[#f0f5f1] rounded-xl p-3 border border-[#d4e4d9]">
            <p className="text-[9px] font-bold text-[#4a7c59] uppercase tracking-widest mb-1">Monthly goal</p>
            <p className="text-[11px] text-stone-600 leading-relaxed">Raise GPA to 3.2 · Submit to Congressional App Challenge · Research 3 target colleges</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  useScrollReveal()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }
        .hero-float { animation: float 6s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <main className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* Nav */}
        <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-4 border-b border-stone-100 bg-white/80 backdrop-blur-md">
          <span className="brand text-2xl text-stone-900">Guideway</span>
          <div className="flex items-center gap-8">
            <Link href="#how-it-works" className="text-sm text-stone-400 hover:text-stone-700 transition">How it works</Link>
            <Link href="#features" className="text-sm text-stone-400 hover:text-stone-700 transition">Features</Link>
            <Link href="#pricing" className="text-sm text-stone-400 hover:text-stone-700 transition">Pricing</Link>
            <Link href="/login" className="text-sm text-stone-500 hover:text-stone-900 transition">Log in</Link>
            <Link href="/signup" className="text-sm bg-[#4a7c59] text-white px-5 py-2.5 rounded-lg hover:bg-[#3d6849] transition font-medium">Get started</Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden px-10 pt-24 pb-0 max-w-7xl mx-auto">
          <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-[#e8f0eb] rounded-full blur-3xl opacity-50 -translate-y-1/2 pointer-events-none" />
          <div className="absolute top-32 right-0 w-96 h-96 bg-[#f0ede8] rounded-full blur-3xl opacity-30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#e8f0eb] rounded-full blur-3xl opacity-20 pointer-events-none" />

          <div className="relative text-center mb-16">
            <div className="reveal inline-flex items-center gap-2 bg-[#f0f5f1] text-[#4a7c59] text-xs font-semibold px-4 py-1.5 rounded-full mb-8 border border-[#d4e4d9]">
              <span className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full animate-pulse" />
              Built for high schoolers, by a high schooler
            </div>

            <h1 className="reveal reveal-delay-1 brand text-7xl text-stone-900 leading-[1.05] mb-7">
              Your personal roadmap<br />
              <span className="italic text-[#4a7c59]">to high school success</span>
            </h1>

            <p className="reveal reveal-delay-2 text-xl text-stone-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Guideway builds you a personalized plan — study schedule, extracurriculars,
              college roadmap, and weekly check-ins that adapt to you.
            </p>

            <div className="reveal reveal-delay-3 flex items-center justify-center gap-4 mb-4">
              <Link href="/signup" className="bg-[#4a7c59] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#3d6849] transition shadow-xl shadow-[#4a7c59]/25 flex items-center gap-2">
                Build my plan — it's free <ArrowRight />
              </Link>
              <Link href="#how-it-works" className="flex items-center gap-2 text-stone-500 text-base hover:text-stone-800 transition px-6 py-4 rounded-xl border border-stone-200 hover:border-stone-300">
                See how it works
              </Link>
            </div>
            <p className="reveal reveal-delay-4 text-xs text-stone-300">No credit card required · Takes 2 minutes</p>
          </div>

          {/* Meet Varun label */}
          <div className="reveal max-w-4xl mx-auto mb-6 mt-16 text-center">
            <p className="brand text-5xl text-stone-800">Meet Varun <span className="italic text-[#4a7c59]">— a real Guideway student</span></p>
          </div>

          {/* Meet Varun card */}
          <div className="reveal max-w-4xl mx-auto mb-6">
            <div className="bg-[#fafaf9] border border-stone-200 rounded-2xl px-7 py-5 flex items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4a7c59] to-[#2d5c3f] flex items-center justify-center text-white text-xl font-bold shadow-lg">V</div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4a7c59] rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-stone-800">Varun S.</p>
                  <span className="text-[10px] bg-[#f0f5f1] text-[#4a7c59] border border-[#d4e4d9] px-2 py-0.5 rounded-full font-medium">Sophomore · Virginia</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Struggling with time management, balancing AP classes, and figuring out the college process — Guideway built him a personalized plan in under 2 minutes.
                </p>
              </div>
              <div className="flex-shrink-0 max-w-xs border-l border-stone-200 pl-6">
                <p className="text-xs text-stone-500 italic leading-relaxed">"I finally feel like I know what I'm supposed to be doing every week."</p>
                <p className="text-[10px] text-stone-300 mt-1">— After 3 weeks on Guideway</p>
              </div>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="reveal hero-float max-w-4xl mx-auto">
            <DashboardPreview />
          </div>

          {/* Floating accent cards */}
          <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 reveal reveal-delay-2">
            <div className="bg-white border border-stone-100 rounded-2xl p-4 shadow-lg w-44">
              <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mb-2">This week's focus</p>
              <p className="text-xs font-semibold text-stone-700 leading-snug">AP Bio + Coding project</p>
              <div className="mt-3 w-full bg-stone-100 rounded-full h-1">
                <div className="bg-[#4a7c59] h-1 rounded-full w-3/5" />
              </div>
              <p className="text-[9px] text-stone-300 mt-1">60% complete</p>
            </div>
          </div>

          <div className="hidden lg:block absolute right-4 top-1/3 reveal reveal-delay-3">
            <div className="bg-white border border-stone-100 rounded-2xl p-4 shadow-lg w-44">
              <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mb-2">Next milestone</p>
              <p className="text-xs font-semibold text-stone-700 leading-snug">Congressional App Challenge</p>
              <p className="text-[9px] text-[#4a7c59] mt-2 font-medium">Due in 6 weeks</p>
            </div>
          </div>

          <div className="hidden lg:block absolute right-8 bottom-32 reveal reveal-delay-4">
            <div className="bg-[#4a7c59] rounded-2xl p-4 shadow-lg shadow-[#4a7c59]/30 w-40">
              <p className="text-[9px] font-bold text-green-200 uppercase tracking-widest mb-2">Stress level</p>
              <p className="text-xl font-bold text-white">↓ 3pts</p>
              <p className="text-[9px] text-green-200 mt-1">Since starting Guideway</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-10 py-32">
          <div className="text-center mb-16 reveal">
            <p className="text-xs font-semibold text-[#4a7c59] uppercase tracking-widest mb-3">How it works</p>
            <h2 className="brand text-5xl text-stone-900">From lost to on track<br /><span className="italic">in minutes</span></h2>
          </div>
          <div className="grid grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Tell us about yourself', desc: 'Answer 7 quick questions about your grade, GPA, goals, struggles, and how much time you have.' },
              { step: '02', title: 'Get your personalized plan', desc: 'AI instantly builds you a custom study schedule, EC suggestions, and a college roadmap.' },
              { step: '03', title: 'Stay on track', desc: 'Weekly check-ins keep your plan updated as your goals and life evolve throughout the year.' },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className={`reveal reveal-delay-${i + 1}`}>
                <div className="w-11 h-11 rounded-2xl bg-[#f0f5f1] flex items-center justify-center mb-5 border border-[#d4e4d9]">
                  <span className="text-xs font-bold text-[#4a7c59]">{step}</span>
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-[#fafaf9] py-32 border-y border-stone-100">
          <div className="max-w-5xl mx-auto px-10">
            <div className="text-center mb-16 reveal">
              <p className="text-xs font-semibold text-[#4a7c59] uppercase tracking-widest mb-3">Features</p>
              <h2 className="brand text-5xl text-stone-900">Everything in<br /><span className="italic">one place</span></h2>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {[
                { title: 'AI Study Plan', desc: 'Personalized strategies based on your GPA, struggles, and the time you actually have.' },
                { title: 'Weekly Schedule', desc: 'A realistic plan built around your life — not a generic one-size-fits-all template.' },
                { title: 'Extracurriculars', desc: 'Activities matched to your interests and college goals, not just what looks good on paper.' },
                { title: 'College Roadmap', desc: 'Step-by-step milestones from 9th grade to applications, tailored to your target schools.' },
                { title: 'Weekly Check-ins', desc: 'Answer a few questions every week. Your plan evolves as your goals and situation change.' },
                { title: 'Mental Health', desc: 'Stress management built into your plan — because burnout is real and we take it seriously.' },
              ].map(({ title, desc }, i) => (
                <div key={title} className={`reveal reveal-delay-${(i % 3) + 1} bg-white rounded-2xl p-6 border border-stone-100 hover:border-[#c8dace] hover:shadow-lg transition-all duration-300 group`}>
                  <div className="w-8 h-8 rounded-xl bg-[#f0f5f1] flex items-center justify-center mb-4 group-hover:bg-[#4a7c59] transition-colors duration-300">
                    <CheckIcon />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-1.5">{title}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-10 py-32 text-center reveal">
          <div className="bg-[#f0f5f1] rounded-3xl p-16 border border-[#d4e4d9]">
            <h2 className="brand text-5xl text-stone-900 mb-4"><span className="italic">Ready</span> to get on track?</h2>
            <p className="text-stone-400 mb-8 leading-relaxed">Join students taking control of their high school journey with a plan that actually works.</p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#4a7c59] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#3d6849] transition shadow-xl shadow-[#4a7c59]/25">
              Build my plan — it's free <ArrowRight />
            </Link>
            <p className="text-xs text-stone-300 mt-4">No credit card required · Takes 2 minutes</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-100 px-10 py-6 flex items-center justify-between bg-[#fafaf9]">
          <span className="brand text-lg text-stone-900">Guideway</span>
          <p className="text-xs text-stone-300">© 2025 Guideway. Built for students, by a student.</p>
        </footer>

      </main>
    </>
  )
}