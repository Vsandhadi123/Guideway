'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Enterprise() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', district: '', students: '', message: '' })

  return (
    <main style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: 'white' }}>
      <nav style={{ borderBottom: '1px solid #f0ede8', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1c1917', textDecoration: 'none' }}>Guideway</Link>
        <Link href="/signup" style={{ background: '#1c1917', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 14, textDecoration: 'none' }}>Get Guideway free</Link>
      </nav>

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '96px 32px 80px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 72, lineHeight: 1.05, color: '#1c1917', marginBottom: 24 }}>
          Give every student a personalized plan.
        </h1>
        <p style={{ fontSize: 20, color: '#78716c', maxWidth: 520, lineHeight: 1.6, marginBottom: 40 }}>
          Guideway Enterprise brings AI-powered success planning to every student in your school or district at scale.
        </p>
        <a href="#demo" style={{ background: '#4a7c59', color: 'white', padding: '14px 28px', borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
          Request a demo
        </a>
      </section>

      <section id="demo" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 32px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 48, color: '#1c1917', marginBottom: 32 }}>Request a demo</h2>
        {submitted ? (
          <div style={{ background: '#f0f5f1', border: '1px solid #d4e4d9', borderRadius: 24, padding: 48, textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1c1917', marginBottom: 8 }}>We will be in touch!</h3>
            <p style={{ color: '#78716c', fontSize: 14 }}>We will respond within 2 business days.</p>
          </div>
        ) : (
          <div style={{ background: '#fafaf9', border: '1px solid #e8e5e0', borderRadius: 24, padding: 32, maxWidth: 560 }}>
            {[
              { label: 'Your name', key: 'name', placeholder: 'Dr. Jane Smith' },
              { label: 'Work email', key: 'email', placeholder: 'jsmith@lcps.org' },
              { label: 'School or district', key: 'district', placeholder: 'Loudoun County Public Schools' },
              { label: 'Number of students', key: 'students', placeholder: 'e.g. 82,000' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#78716c', marginBottom: 6 }}>{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  style={{ width: '100%', border: '1px solid #e8e5e0', borderRadius: 12, padding: '10px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'white' }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#78716c', marginBottom: 6 }}>Anything else? (optional)</label>
              <textarea
                placeholder="Questions, timeline, specific needs..."
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                style={{ width: '100%', border: '1px solid #e8e5e0', borderRadius: 12, padding: '10px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'white', height: 96, resize: 'none' }}
              />
            </div>
            <button
              onClick={() => { if (form.name && form.email && form.district) setSubmitted(true) }}
              style={{ width: '100%', background: '#4a7c59', color: 'white', border: 'none', borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Request a demo
            </button>
          </div>
        )}
      </section>

      <footer style={{ borderTop: '1px solid #f0ede8', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1c1917' }}>Guideway</span>
        <p style={{ fontSize: 12, color: '#d4d0c8' }}>2025 Guideway. Built for students, by a student.</p>
      </footer>
    </main>
  )
}
