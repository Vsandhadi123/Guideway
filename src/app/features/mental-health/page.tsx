import Link from 'next/link'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7.5" stroke="#4a7c59" strokeWidth="1"/>
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function MentalHealth() {
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
            <Link href="/#features" className="text-sm text-stone-400 hover:text-stone-700 transition">Features</Link>
            <Link href="/pricing" className="text-sm text-stone-400 hover:text-stone-700 transition">Pricing</Link>
            <Link href="/login" className="text-sm text-stone-400 hover:text-stone-700 transition">Log in</Link>
            <Link href="/signup" className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition font-medium">Get started</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-8 pt-20 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="text-xs text-stone-400 hover:text-stone-600 transition">Guideway</Link>
          <span className="text-stone-200">/</span>
          <span className="text-xs text-stone-600">Mental Health</span>
        </div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#f0f5f1] border border-[#d4e4d9] text-[#4a7c59] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full" />
            Built in, not bolted on
          </div>
          <h1 className="brand text-6xl text-stone-900 leading-tight mb-5">Success without <em>burning out.</em></h1>
          <p className="text-lg text-stone-400 leading-relaxed mb-8">Mental health isn't separate from academic success — it's the foundation of it. Guideway builds stress management and recovery directly into your plan, not as an afterthought.</p>
          <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition">Get started →</Link>
        </div>
      </section>

      <div className="border-t border-stone-100" />

      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="grid grid-cols-2 gap-24">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">What it is</p>
            <h2 className="brand text-5xl text-stone-900 leading-tight mb-6">Burnout kills more dreams than bad grades.</h2>
            <p className="text-stone-400 leading-relaxed mb-6">High school is stressful. Guideway takes your stress level seriously — it's one of the 7 questions we ask. If you're at an 8/10, your plan looks different than if you're at a 3/10. Because it should.</p>
            <p className="text-stone-400 leading-relaxed">We build in recovery time, healthy habits, and stress-reduction strategies that actually fit your life — not generic advice like "meditate more".</p>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { title: 'Stress-aware planning', desc: 'Your stress level directly shapes your plan. High stress means lighter load, more recovery. Low stress means we push harder.' },
              { title: 'Built-in recovery time', desc: 'Rest isn\'t a reward for finishing work — it\'s scheduled into your week as a non-negotiable.' },
              { title: 'Specific strategies', desc: 'Not "take breaks". Specific techniques — breathing exercises, movement breaks, sleep hygiene — matched to your situation.' },
              { title: 'Tracked weekly', desc: 'Every check-in, we ask about your stress. If it\'s rising, your plan adapts before burnout hits.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-4">
                <CheckIcon />
                <div>
                  <p className="text-sm font-semibold text-stone-800 mb-1">{title}</p>
                  <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-stone-100" />

      <section className="max-w-3xl mx-auto px-8 py-24 text-center">
        <h2 className="brand text-6xl text-stone-900 mb-6">Succeed without sacrificing yourself.</h2>
        <p className="text-stone-400 mb-8">Get a plan that takes your mental health seriously. Free to start.</p>
        <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#3d6849] transition">Get started →</Link>
        <p className="text-xs text-stone-300 mt-4">No credit card required</p>
      </section>

      <footer className="border-t border-stone-100 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <span className="brand text-lg text-stone-900">Guideway</span>
        <p className="text-xs text-stone-300">© 2025 Guideway. Built for students, by a student.</p>
      </footer>
    </main>
  )
}