'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('revealed')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function DashboardMockup() {
  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #e8e5e0', boxShadow: '0 32px 80px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-stone-100 bg-[#fafaf9]">
        <div className="w-3 h-3 rounded-full bg-red-300" />
        <div className="w-3 h-3 rounded-full bg-amber-300" />
        <div className="w-3 h-3 rounded-full bg-green-300" />
        <div className="flex-1 flex justify-center">
          <div className="bg-stone-100 rounded-md px-4 py-1 text-[11px] text-stone-400">guideway.app/dashboard</div>
        </div>
      </div>
      <div className="flex" style={{ minHeight: '480px' }}>
        <div className="w-56 border-r border-stone-100 bg-[#fafaf9] p-4 flex-shrink-0">
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="w-6 h-6 rounded-md bg-[#4a7c59] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">G</span>
            </div>
            <span className="text-sm font-semibold text-stone-800">Guideway</span>
          </div>
          {[
            { label: 'Dashboard', active: true },
            { label: 'My Plan', active: false },
            { label: 'Weekly Check-in', active: false },
            { label: 'College Roadmap', active: false },
            { label: 'Opportunities', active: false },
            { label: 'Settings', active: false },
          ].map(({ label, active }) => (
            <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5 text-[12px] font-medium ${active ? 'bg-stone-200 text-stone-900' : 'text-stone-400'}`}>
              {label}
            </div>
          ))}
          <div className="mt-6 pt-4 border-t border-stone-100">
            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest px-3 mb-2">Progress</p>
            {[
              { label: 'GPA Goal', pct: 62 },
              { label: 'Extracurriculars', pct: 40 },
              { label: 'College Prep', pct: 25 },
            ].map(({ label, pct }) => (
              <div key={label} className="px-3 mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-stone-400">{label}</span>
                  <span className="text-[10px] font-semibold text-stone-500">{pct}%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1">
                  <div className="bg-[#4a7c59] h-1 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-8 overflow-hidden">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-[11px] font-semibold text-stone-300 uppercase tracking-widest mb-1">Week 3 of 18</p>
              <h2 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'Fraunces, serif' }}>Hey, Varun 👋</h2>
              <p className="text-sm text-stone-400 mt-1">Here's your plan for this week.</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f0f5f1] border border-[#d4e4d9] px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c59]" />
              <span className="text-[11px] font-semibold text-[#4a7c59]">On track</span>
            </div>
          </div>
          <div className="bg-[#4a7c59] rounded-2xl p-5 mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-green-200 uppercase tracking-widest mb-1">Weekly check-in</p>
              <p className="text-sm font-semibold text-white">How's your week going? Update your plan.</p>
            </div>
            <div className="bg-white text-[#4a7c59] text-xs font-semibold px-4 py-2 rounded-xl flex-shrink-0">Check in →</div>
          </div>
          <p className="text-[11px] font-bold text-stone-300 uppercase tracking-widest mb-3">This week</p>
          <div className="space-y-2">
            {[
              { day: 'Mon', task: 'Pomodoro session — AP Bio', done: true },
              { day: 'Wed', task: 'Coding project work', done: true },
              { day: 'Thu', task: 'Active recall flashcards', done: false },
              { day: 'Sat', task: 'Robotics club build session', done: false },
            ].map(({ day, task, done }) => (
              <div key={day} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${done ? 'bg-[#f0f5f1]' : 'bg-stone-50 border border-stone-100'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${done ? 'bg-[#4a7c59] border-[#4a7c59]' : 'border-stone-200'}`}>
                  {done && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className={`text-[12px] font-medium ${done ? 'text-stone-400 line-through' : 'text-stone-700'}`}>{task}</span>
                <span className="ml-auto text-[10px] text-stone-300">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const navItems = [
  {
    label: 'Product',
    items: [
      { title: 'AI Study Plan', desc: 'Personalized study strategies', icon: '📚', href: '/features/ai-study-plan' },
      { title: 'Weekly Schedule', desc: 'Built around your life', icon: '🗓', href: '/features/weekly-schedule' },
      { title: 'Extracurriculars', desc: 'Matched to your interests', icon: '🏅', href: '/features/extracurriculars' },
      { title: 'College Roadmap', desc: 'Step-by-step milestones', icon: '🎓', href: '/features/college-roadmap' },
      { title: 'Mental Health', desc: 'Stress built into your plan', icon: '🧠', href: '/features/mental-health' },
      { title: 'Weekly Check-ins', desc: 'Plan that adapts to you', icon: '✅', href: '/features/weekly-checkins' },
    ]
  },
  {
    label: 'Solutions',
    items: [
      { title: '9th Grade', desc: 'Build habits early', icon: '🌱', href: '/solutions/9th-grade' },
      { title: '10th Grade', desc: 'Find your direction', icon: '🧭', href: '/solutions/10th-grade' },
      { title: '11th Grade', desc: 'The year that matters most', icon: '⚡', href: '/solutions/11th-grade' },
      { title: '12th Grade', desc: 'Finish strong', icon: '🏁', href: '/solutions/12th-grade' },
      { title: 'Top University Track', desc: 'Competitive college prep', icon: '🏛', href: '/solutions/top-university' },
      { title: 'Trade & Vocational', desc: 'Alternative pathways', icon: '🔧', href: '/solutions/trade-vocational' },
    ]
  },
  {
    label: 'Resources',
    items: [
      { title: 'FAQ', desc: 'Common questions answered', icon: '💬', href: '/faq' },
      { title: 'Contact', desc: 'Get in touch with us', icon: '✉️', href: '/contact' },
    ]
  },
]

function MobileMenu() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-stone-50 transition">
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-stone-100 shadow-xl p-3 z-50">
          {[
            { label: 'How it works', href: '#how-it-works' },
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Enterprise', href: '/enterprise' },
            { label: 'Log in', href: '/login' },
          ].map(({ label, href }) => (
            <Link key={label} href={href} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 rounded-xl transition">
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  useScrollReveal()
  const [activeTab, setActiveTab] = useState('Study Plan')

  const featureTabs = [
    {
      label: 'Study Plan',
      heading: 'A study plan built around how you actually learn.',
      desc: 'Guideway analyzes your GPA, struggles, and available time to build a study strategy that fits your life — not a generic template.',
      bullets: ['Pomodoro-based focus sessions', 'Active recall & spaced repetition', 'Subject-specific strategies', 'Adapts weekly based on your check-ins'],
    },
    {
      label: 'Schedule',
      heading: 'A weekly schedule you can actually stick to.',
      desc: 'Built around your real commitments — not an idealized version of your life. Realistic plans get followed.',
      bullets: ['Study blocks around your activities', 'Built-in breaks and recovery time', 'Adjusts based on stress level', 'Updated every week automatically'],
    },
    {
      label: 'Extracurriculars',
      heading: 'ECs that actually match who you are.',
      desc: 'Not just what looks good on a college app. Guideway suggests activities that align with your real interests and goals.',
      bullets: ['Matched to your specific interests', 'Aligned with your college goals', 'Competitions and programs included', 'Local and national opportunities'],
    },
    {
      label: 'College Roadmap',
      heading: 'Know exactly what to do, every semester.',
      desc: 'A clear roadmap from your current grade to college applications — no more guessing what you should be doing right now.',
      bullets: ['Grade-by-grade milestones', 'Test prep timeline (SAT/ACT)', 'Application deadlines tracker', 'Tailored to your target schools'],
    },
  ]

  const activeFeature = featureTabs.find(t => t.label === activeTab)!

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }

        @media (max-width: 768px) {
        .desktop-nav { display: none !important; }
        .mobile-nav { display: flex !important; }
        .hero-title { font-size: 42px !important; }
        .hero-sub { font-size: 16px !important; }
        .hero-btns { flex-direction: column !important; align-items: stretch !important; }
        .grid-3 { grid-template-columns: 1fr !important; }
        .grid-2 { grid-template-columns: 1fr !important; }
        .mockup-sidebar { display: none !important; }
        .mockup-cols { grid-template-columns: 1fr !important; }
        .section-pad { padding: 48px 20px !important; }
        .footer-row { flex-direction: column !important; gap: 16px !important; }
      }
      `}</style>

      <main className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* Nav */}
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
          <div className="flex items-center justify-between px-8 py-3.5 max-w-7xl mx-auto relative">
            <span className="brand text-xl text-stone-900">Guideway</span>

            {/* Desktop center tabs */}
            <div className="desktop-nav absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
              {navItems.map(({ label, items }) => (
                <div key={label} className="relative group">
                  <button className="flex items-center gap-1 px-3 py-2 text-sm text-stone-500 hover:text-stone-900 transition rounded-lg hover:bg-stone-50">
                    {label}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-200 group-hover:rotate-180">
                      <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                    <div className="bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/60 p-3 w-64">
                      {items.map(({ title, desc, icon, href }) => (
                        <Link key={title} href={href || '#'} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 cursor-pointer transition group/item">
                          <div className="w-8 h-8 rounded-lg bg-[#f0f5f1] border border-[#d4e4d9] flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#4a7c59] transition-colors">
                            <span className="text-sm">{icon}</span>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-stone-800 group-hover/item:text-[#4a7c59] transition block">{title}</span>
                            <span className="text-xs text-stone-400">{desc}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/pricing" className="px-3 py-2 text-sm text-stone-500 hover:text-stone-900 transition rounded-lg hover:bg-stone-50">
                Pricing
              </Link>
              <Link href="/enterprise" className="px-3 py-2 text-sm text-stone-500 hover:text-stone-900 transition rounded-lg hover:bg-stone-50">
                Enterprise
              </Link>
            </div>

            {/* Desktop right */}
            <div className="desktop-nav flex items-center gap-3">
              <Link href="/login" className="text-sm text-stone-500 hover:text-stone-900 transition px-3 py-2 rounded-lg hover:bg-stone-50">
                Log in
              </Link>
              <Link href="/signup" className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition font-medium">
                Get Guideway free
              </Link>
            </div>

            {/* Mobile nav */}
            <div className="mobile-nav hidden items-center gap-3">
              <Link href="/signup" className="text-sm bg-[#4a7c59] text-white px-4 py-2 rounded-lg font-medium">
                Get started
              </Link>
              <MobileMenu />
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-8 pt-24 pb-16 text-center">
          <h1 className="reveal brand text-7xl text-stone-900 leading-[1.05] tracking-tight mb-6">
            Your personal roadmap<br />to <span className="italic text-[#4a7c59]">high school success</span>
          </h1>
          <p className="reveal reveal-delay-1 text-xl text-stone-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Guideway builds you a personalized plan — study schedule, extracurriculars, college roadmap, and weekly check-ins that actually adapt to you.
          </p>
          <div className="reveal reveal-delay-2 flex items-center justify-center gap-4 mb-4">
            <Link href="/signup" className="bg-[#4a7c59] text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-[#3d6849] transition">
              Get Guideway free →
            </Link>
            <Link href="/login" className="text-sm text-stone-500 hover:text-stone-900 transition px-5 py-3.5 rounded-xl border border-stone-200 hover:border-stone-300">
              Log in
            </Link>
          </div>
          <p className="reveal reveal-delay-3 text-xs text-stone-300">No credit card required · Takes 2 minutes</p>
        </section>

        {/* Full width mockup */}
        <section className="reveal max-w-6xl mx-auto px-8 pb-32">
          <DashboardMockup />
        </section>

        <div className="border-t border-stone-100" />

        {/* How it works */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-8 py-32">
          <div className="reveal mb-20">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">How it works</p>
            <h2 className="brand text-6xl text-stone-900 leading-tight">From lost<br />to on track.</h2>
          </div>
          <div className="grid grid-cols-3 gap-16">
            {[
              { num: '01', title: 'Tell us about yourself', desc: 'Answer 7 quick questions about your grade, GPA, goals, struggles, and how much time you have.' },
              { num: '02', title: 'Get your personalized plan', desc: 'AI instantly builds you a custom study schedule, EC suggestions, and a college roadmap.' },
              { num: '03', title: 'Stay on track', desc: 'Weekly check-ins keep your plan updated as your goals and life evolve throughout the year.' },
            ].map(({ num, title, desc }, i) => (
              <div key={num} className={`reveal reveal-delay-${i + 1}`}>
                <p className="brand text-6xl text-stone-100 mb-4 leading-none">{num}</p>
                <h3 className="text-lg font-semibold text-stone-900 mb-3">{title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-stone-100" />

        {/* Interactive feature tabs — Notion style */}
        <section className="max-w-5xl mx-auto px-8 py-32">
          <div className="reveal mb-12">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Features</p>
            <h2 className="brand text-6xl text-stone-900 leading-tight">Everything<br />in one place.</h2>
          </div>

          {/* Tabs */}
          <div className="reveal flex items-center gap-2 mb-12 border-b border-stone-100 pb-0">
            {featureTabs.map(({ label }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`px-4 py-3 text-sm font-semibold transition border-b-2 -mb-px ${
                  activeTab === label
                    ? 'text-[#4a7c59] border-[#4a7c59]'
                    : 'text-stone-400 border-transparent hover:text-stone-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="reveal grid grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="brand text-4xl text-stone-900 mb-4 leading-tight">{activeFeature.heading}</h3>
              <p className="text-stone-400 text-base leading-relaxed mb-8">{activeFeature.desc}</p>
              <div className="flex flex-col gap-3">
                {activeFeature.bullets.map(b => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#f0f5f1] border border-[#d4e4d9] flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-sm text-stone-600">{b}</span>
                  </div>
                ))}
              </div>
              <Link href="/signup" className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-[#4a7c59] hover:underline">
                Get started free →
              </Link>
            </div>
            <div className="bg-[#fafaf9] rounded-2xl border border-stone-100 p-8 min-h-64 flex items-center justify-center">
              <p className="brand text-6xl text-stone-100 text-center leading-none">{activeTab}</p>
            </div>
          </div>
        </section>

        <div className="border-t border-stone-100" />

        {/* Solutions by grade — Notion "by team" style */}
        <section className="max-w-5xl mx-auto px-8 py-32">
          <div className="reveal mb-12">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Solutions</p>
            <h2 className="brand text-6xl text-stone-900 leading-tight">Built for every<br />stage of high school.</h2>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { grade: '9th Grade', tag: 'Freshman', desc: 'Build the habits and systems that will carry you through all four years. The earlier you start, the easier it gets.', color: 'bg-[#f0f5f1] border-[#d4e4d9]', accent: 'text-[#4a7c59]' },
              { grade: '10th Grade', tag: 'Sophomore', desc: 'Find your direction. Explore interests, start building your EC profile, and get serious about academics.', color: 'bg-[#f5f3f0] border-[#e4d9c8]', accent: 'text-[#7c6a4a]' },
              { grade: '11th Grade', tag: 'Junior', desc: 'The year that matters most. SAT/ACT prep, college research, and making your application stand out.', color: 'bg-[#f0f3f5] border-[#c8d4e4]', accent: 'text-[#4a6a7c]' },
              { grade: '12th Grade', tag: 'Senior', desc: 'Finish strong. Applications, deadlines, and making sure your senior year counts — not just coasts.', color: 'bg-[#f5f0f5] border-[#d9c8e4]', accent: 'text-[#6a4a7c]' },
            ].map(({ grade, tag, desc, color, accent }) => (
              <div key={grade} className={`reveal rounded-2xl border p-8 hover:shadow-md transition-all duration-300 cursor-pointer group ${color}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold uppercase tracking-widest ${accent}`}>{tag}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`opacity-0 group-hover:opacity-100 transition ${accent}`}>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="brand text-3xl text-stone-900 mb-3">{grade}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-stone-100" />

        {/* About / social proof */}
        <section className="max-w-5xl mx-auto px-8 py-32">
          <div className="grid grid-cols-2 gap-24 items-center">
            <div className="reveal">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Built by a student</p>
              <h2 className="brand text-5xl text-stone-900 leading-tight mb-6">Made by someone<br />who gets it.</h2>
              <p className="text-stone-400 text-base leading-relaxed mb-4">Guideway was built by Varun, a sophomore in Virginia, after seeing how many students — himself included — had no real system for navigating high school.</p>
              <p className="text-stone-400 text-base leading-relaxed">No guidance counselor has time to give every student a personalized plan. Guideway does.</p>
            </div>
            <div className="reveal reveal-delay-1 grid grid-cols-2 gap-5">
              {[
                { num: '35+', label: 'students surveyed' },
                { num: '91%', label: 'would use Guideway' },
                { num: '57%', label: 'would pay for it' },
                { num: '2min', label: 'to get your plan' },
              ].map(({ num, label }) => (
                <div key={label} className="border border-stone-100 rounded-2xl p-6 hover:border-[#d4e4d9] hover:bg-[#fafaf9] transition">
                  <p className="brand text-4xl text-stone-900 mb-1">{num}</p>
                  <p className="text-xs text-stone-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="border-t border-stone-100" />

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-8 py-32 text-center reveal">
          <h2 className="brand text-7xl text-stone-900 leading-tight mb-8">
            Start for free.<br /><span className="italic text-[#4a7c59]">Get on track.</span>
          </h2>
          <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#3d6849] transition">
            Get Guideway free →
          </Link>
          <p className="text-xs text-stone-300 mt-4">No credit card required · Takes 2 minutes</p>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-100 px-8 py-8 max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-12">
            <span className="brand text-xl text-stone-900">Guideway</span>
            <div className="grid grid-cols-3 gap-16 text-sm">
              <div>
                <p className="font-semibold text-stone-900 mb-4">Product</p>
                {['AI Study Plan', 'Weekly Schedule', 'Extracurriculars', 'College Roadmap', 'Mental Health'].map(l => (
                  <p key={l} className="text-stone-400 hover:text-stone-700 cursor-pointer mb-2 transition">{l}</p>
                ))}
              </div>
              <div>
                <p className="font-semibold text-stone-900 mb-4">Solutions</p>
                {['9th Grade', '10th Grade', '11th Grade', '12th Grade', 'District Licensing'].map(l => (
                  <p key={l} className="text-stone-400 hover:text-stone-700 cursor-pointer mb-2 transition">{l}</p>
                ))}
              </div>
              <div>
                <p className="font-semibold text-stone-900 mb-4">Company</p>
                {['Pricing', 'FAQ', 'Contact'].map(l => (
                  <p key={l} className="text-stone-400 hover:text-stone-700 cursor-pointer mb-2 transition">{l}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-stone-100 pt-6 flex items-center justify-between">
            <p className="text-xs text-stone-300">© 2025 Guideway. Built for students, by a student.</p>
            <p className="text-xs text-stone-300">Made with ♥ in Virginia</p>
          </div>
        </footer>

      </main>
    </>
  )
}