'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', type: 'General question', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    await new Promise(res => setTimeout(res, 1000))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
      `}</style>

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="flex items-center justify-between px-8 py-3.5 max-w-7xl mx-auto">
          <Link href="/" className="brand text-xl text-stone-900">Guideway</Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-stone-400 hover:text-stone-700 transition">Pricing</Link>
            <Link href="/faq" className="text-sm text-stone-400 hover:text-stone-700 transition">FAQ</Link>
            <Link href="/login" className="text-sm text-stone-400 hover:text-stone-700 transition">Log in</Link>
            <Link href="/signup" className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition font-medium">Get started</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-8 pt-20 pb-12">
        <div className="grid grid-cols-2 gap-24 items-start">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Contact</p>
            <h1 className="brand text-6xl text-stone-900 leading-tight mb-6">
              Get in <em className="text-[#4a7c59]">touch.</em>
            </h1>
            <p className="text-stone-400 leading-relaxed mb-10">
              Whether you have a question, feedback, a bug to report, or want to discuss district licensing — we read every message and respond within 2 business days.
            </p>

            <div className="flex flex-col gap-6">
              {[
                { label: 'General questions', desc: 'Questions about Guideway, how it works, or your plan.' },
                { label: 'District licensing', desc: 'Bringing Guideway to your school or county. We will put together a custom proposal.' },
                { label: 'Bug reports', desc: 'Something not working right? Tell us and we will fix it fast.' },
                { label: 'Feedback', desc: 'Ideas, suggestions, or anything you wish Guideway did differently.' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c59] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-stone-800 mb-0.5">{label}</p>
                    <p className="text-sm text-stone-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="bg-[#f0f5f1] border border-[#d4e4d9] rounded-3xl p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-[#4a7c59] flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="brand text-3xl text-stone-900 mb-2">Message sent!</h3>
                <p className="text-stone-400 text-sm leading-relaxed">We will get back to you within 2 business days. Thanks for reaching out.</p>
              </div>
            ) : (
              <div className="bg-[#fafaf9] border border-stone-100 rounded-3xl p-8">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1.5">Your name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Varun S."
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1.5">What is this about?</label>
                    <select
                      value={form.type}
                      onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition bg-white"
                    >
                      <option>General question</option>
                      <option>District licensing</option>
                      <option>Bug report</option>
                      <option>Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1.5">Message</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us what is on your mind..."
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition bg-white resize-none h-32"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!form.name || !form.email || !form.message || loading}
                    className="w-full bg-[#4a7c59] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send message →'}
                  </button>
                  <p className="text-xs text-stone-300 text-center">We respond within 2 business days</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-100 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <span className="brand text-lg text-stone-900">Guideway</span>
        <p className="text-xs text-stone-300">© 2025 Guideway. Built for students, by a student.</p>
      </footer>
    </main>
  )
}