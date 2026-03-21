import Link from 'next/link'
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7.5" stroke="#4a7c59" strokeWidth="1"/>
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
export default function TradeVocational() {
  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,700&family=Inter:wght@400;500;600&display=swap'); .brand { font-family: 'Fraunces', serif; }`}</style>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="flex items-center justify-between px-8 py-3.5 max-w-7xl mx-auto">
          <Link href="/" className="brand text-xl text-stone-900">Guideway</Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-stone-400 hover:text-stone-700 transition">Pricing</Link>
            <Link href="/login" className="text-sm text-stone-400 hover:text-stone-700 transition">Log in</Link>
            <Link href="/signup" className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition font-medium">Get started</Link>
          </div>
        </div>
      </nav>
      <section className="max-w-5xl mx-auto px-8 pt-20 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="text-xs text-stone-400">Guideway</Link>
          <span className="text-stone-200">/</span>
          <span className="text-xs text-stone-600">Trade and Vocational</span>
        </div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#f0f5f1] border border-[#d4e4d9] text-[#4a7c59] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full" />
            Alternative pathways
          </div>
          <h1 className="brand text-6xl text-stone-900 leading-tight mb-5">College is not the only path. <em>Plan yours intentionally.</em></h1>
          <p className="text-lg text-stone-400 leading-relaxed mb-8">Trade and vocational careers offer financial security, job satisfaction, and genuine impact. But they require just as much intentional planning as the college track. Guideway builds you a roadmap for your actual goals.</p>
          <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition">Get my plan →</Link>
        </div>
      </section>
      <div className="border-t border-stone-100" />
      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="grid grid-cols-2 gap-24">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Why this path deserves a plan</p>
            <h2 className="brand text-5xl text-stone-900 leading-tight mb-6">Skilled trades are in demand. Get ahead of it.</h2>
            <p className="text-stone-400 leading-relaxed mb-6">Electricians, plumbers, HVAC technicians, and other skilled tradespeople earn strong salaries with less debt than most college graduates. But entering these fields strategically — certifications, apprenticeships, programs — requires planning.</p>
            <p className="text-stone-400 leading-relaxed">Guideway builds your plan around vocational programs, certifications, and hands-on experience opportunities that set you up for success.</p>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { title: 'Vocational program research', desc: 'Find the right programs, apprenticeships, and certifications for your specific trade interest.' },
              { title: 'Relevant ECs', desc: 'SkillsUSA, technical clubs, and hands-on programs that strengthen your vocational profile.' },
              { title: 'Certification timeline', desc: 'Know exactly which certifications to pursue and when, based on your grade and target trade.' },
              { title: 'Financial planning', desc: 'Scholarships, grants, and programs specifically for students entering trades and vocational careers.' },
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
        <h2 className="brand text-6xl text-stone-900 mb-6">Your path. Your plan.</h2>
        <p className="text-stone-400 mb-8">Get a plan built for your actual goals. Free to start.</p>
        <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#3d6849] transition">Get my plan →</Link>
        <p className="text-xs text-stone-300 mt-4">No credit card required</p>
      </section>
      <footer className="border-t border-stone-100 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <span className="brand text-lg text-stone-900">Guideway</span>
        <p className="text-xs text-stone-300">© 2025 Guideway. Built for students, by a student.</p>
      </footer>
    </main>
  )
}