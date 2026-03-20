'use client'

import Link from 'next/link'
import { useState } from 'react'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7.5" stroke="#4a7c59" strokeWidth="1"/>
      <path d="M5 8l2 2 4-4" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with a basic success plan.',
    cta: 'Get started',
    href: '/signup',
    featured: false,
    features: [
      'Basic AI-generated success plan',
      'Study schedule',
      'Extracurricular suggestions',
      'College goal overview',
      '1 plan generation per month',
    ],
    missing: [
      'Fully personalized AI plan',
      'Weekly check-ins & plan updates',
      'Mental health strategies',
      'Opportunity recommendations',
      'Priority AI model',
    ]
  },
  {
    name: 'Pro',
    price: '$5',
    period: 'per month',
    description: 'A fully personalized plan that adapts to you every week.',
    cta: 'Start Pro',
    href: '/signup',
    featured: true,
    features: [
      'Everything in Free',
      'Fully personalized AI plan',
      'Weekly check-ins & plan updates',
      'Mental health strategies',
      'Opportunity & competition recommendations',
      'Priority AI model',
      'Unlimited plan regenerations',
      'Progress tracking & goals',
    ],
    missing: []
  },
]

export default function Pricing() {
  const [districtOpen, setDistrictOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', district: '', students: '' })
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
      `}</style>

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-4 border-b border-stone-100 bg-white/80 backdrop-blur-md">
        <Link href="/" className="brand text-2xl text-stone-900">Guideway</Link>
        <div className="flex items-center gap-8">
          <Link href="/#how-it-works" className="text-sm text-stone-400 hover:text-stone-700 transition">How it works</Link>
          <Link href="/#features" className="text-sm text-stone-400 hover:text-stone-700 transition">Features</Link>
          <Link href="/pricing" className="text-sm text-stone-400 hover:text-stone-700 transition">Pricing</Link>
          <Link href="/login" className="text-sm text-stone-500 hover:text-stone-900 transition">Log in</Link>
          <Link href="/signup" className="text-sm bg-[#4a7c59] text-white px-5 py-2.5 rounded-lg hover:bg-[#3d6849] transition font-medium">Get started</Link>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-3xl mx-auto px-10 pt-20 pb-12 text-center">
        <p className="text-xs font-semibold text-[#4a7c59] uppercase tracking-widest mb-4">Pricing</p>
        <h1 className="brand text-6xl text-stone-900 mb-4">Simple, <span className="italic text-[#4a7c59]">honest</span> pricing</h1>
        <p className="text-stone-400 text-lg leading-relaxed">Start free. Upgrade when you're ready for a plan that truly adapts to you.</p>
      </section>

      {/* Plans */}
      <section className="max-w-3xl mx-auto px-10 pb-20">
        <div className="grid grid-cols-2 gap-6">
          {plans.map(({ name, price, period, description, cta, href, featured, features, missing }) => (
            <div
              key={name}
              className={`rounded-3xl p-8 flex flex-col ${
                featured
                  ? 'bg-[#4a7c59] text-white shadow-2xl shadow-[#4a7c59]/30'
                  : 'bg-[#fafaf9] border border-stone-100'
              }`}
            >
              {featured && (
                <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6 w-fit">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  Most popular
                </div>
              )}

              <p className={`text-sm font-semibold mb-2 ${featured ? 'text-green-200' : 'text-stone-400'}`}>{name}</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`brand text-5xl ${featured ? 'text-white' : 'text-stone-900'}`}>{price}</span>
                <span className={`text-sm ${featured ? 'text-green-200' : 'text-stone-400'}`}>/{period}</span>
              </div>
              <p className={`text-sm mb-8 leading-relaxed ${featured ? 'text-green-100' : 'text-stone-400'}`}>{description}</p>

              <Link
                href={href}
                className={`w-full text-center py-3 rounded-xl text-sm font-semibold transition mb-8 ${
                  featured
                    ? 'bg-white text-[#4a7c59] hover:bg-green-50'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300'
                }`}
              >
                {cta}
              </Link>

              <div className="flex flex-col gap-3">
                {features.map(f => (
                  <div key={f} className="flex items-start gap-2.5">
                    {featured ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                        <circle cx="8" cy="8" r="7.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                        <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <div style={{ marginTop: 2 }}><CheckIcon /></div>
                    )}
                    <span className={`text-sm ${featured ? 'text-green-50' : 'text-stone-600'}`}>{f}</span>
                  </div>
                ))}
                {missing.map(f => (
                  <div key={f} className="flex items-start gap-2.5 opacity-30">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <circle cx="8" cy="8" r="7.5" stroke="#888" strokeWidth="1"/>
                      <path d="M5.5 10.5l5-5M10.5 10.5l-5-5" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-sm text-stone-400">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* District licensing */}
        <div className="mt-8 rounded-3xl border border-stone-100 bg-[#fafaf9] p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="brand text-2xl text-stone-900">District & School Licensing</h2>
                <span className="text-xs bg-[#f0f5f1] text-[#4a7c59] border border-[#d4e4d9] px-2.5 py-1 rounded-full font-semibold">Enterprise</span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed max-w-lg">
                Give every student in your school or district access to Guideway. Custom pricing based on enrollment — starting at $15,000/year for county-wide access.
              </p>
              <div className="flex flex-wrap gap-6 mt-5">
                {[
                  'Unlimited student accounts',
                  'Admin dashboard',
                  'Usage analytics',
                  'Dedicated support',
                  'Custom onboarding',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckIcon />
                    <span className="text-sm text-stone-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setDistrictOpen(!districtOpen)}
              className="ml-8 flex-shrink-0 flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-stone-700 transition"
            >
              Get in touch <ArrowRight />
            </button>
          </div>

          {/* Contact form */}
          {districtOpen && !submitted && (
            <div className="mt-8 pt-8 border-t border-stone-100">
              <p className="text-sm font-semibold text-stone-900 mb-5">Tell us about your district</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Your name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Dr. Jane Smith"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Work email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="jsmith@lcps.org"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">School or district name</label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                    placeholder="Loudoun County Public Schools"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">Estimated students</label>
                  <input
                    type="text"
                    value={form.students}
                    onChange={e => setForm(p => ({ ...p, students: e.target.value }))}
                    placeholder="e.g. 82,000"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition bg-white"
                  />
                </div>
              </div>
              <button
                onClick={() => setSubmitted(true)}
                disabled={!form.name || !form.email || !form.district}
                className="mt-4 bg-[#4a7c59] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send inquiry →
              </button>
            </div>
          )}

          {districtOpen && submitted && (
            <div className="mt-8 pt-8 border-t border-stone-100 text-center py-6">
              <p className="text-2xl mb-2">✓</p>
              <p className="text-sm font-semibold text-stone-900">Thanks! We'll be in touch within 2 business days.</p>
              <p className="text-xs text-stone-400 mt-1">We're excited to bring Guideway to your students.</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-10 pb-24">
        <h2 className="brand text-3xl text-stone-900 text-center mb-10">Common questions</h2>
        <div className="flex flex-col gap-6">
          {[
            { q: 'Can I cancel anytime?', a: 'Yes — cancel anytime from your account settings. No questions asked.' },
            { q: 'What makes Pro plans better?', a: 'Pro uses a more advanced AI model with deeper personalization. It factors in your stress level, specific struggles, and interests far more precisely than the free tier.' },
            { q: 'Is there a student discount?', a: 'Guideway is already priced for students at $5/month. If you genuinely can\'t afford it, reach out — we\'ll work something out.' },
            { q: 'How does district licensing work?', a: 'We work with school administrators to set up accounts for all students. Pricing is based on enrollment, starting at $15,000/year for county-wide access.' },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-stone-100 pb-6">
              <p className="text-sm font-semibold text-stone-900 mb-2">{q}</p>
              <p className="text-sm text-stone-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 px-10 py-6 flex items-center justify-between bg-[#fafaf9]">
        <span className="brand text-lg text-stone-900">Guideway</span>
        <p className="text-xs text-stone-300">© 2025 Guideway. Built for students, by a student.</p>
      </footer>
    </main>
  )
}