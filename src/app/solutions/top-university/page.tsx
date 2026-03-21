import Link from 'next/link'
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7.5" stroke="#4a7c59" strokeWidth="1"/>
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
export default function TopUniversity() {
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
          <span className="text-xs text-stone-600">Top University Track</span>
        </div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#f0f5f1] border border-[#d4e4d9] text-[#4a7c59] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full" />
            Competitive college prep
          </div>
          <h1 className="brand text-6xl text-stone-900 leading-tight mb-5">Aim for the best. <em>Plan like it.</em></h1>
          <p className="text-lg text-stone-400 leading-relaxed mb-8">Top universities don't just want good grades. They want students with a story — depth, impact, and authenticity. Guideway helps you build that profile intentionally, starting from whatever grade you're in.</p>
          <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition">Get my plan →</Link>
        </div>
      </section>
      <div className="border-t border-stone-100" />
      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="grid grid-cols-2 gap-24">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">What top universities look for</p>
            <h2 className="brand text-5xl text-stone-900 leading-tight mb-6">Grades are the floor, not the ceiling.</h2>
            <p className="text-stone-400 leading-relaxed mb-6">A 4.0 gets you in the pool. What gets you admitted is a compelling story — deep commitment to a few things, demonstrated impact, and authentic passion. Guideway helps you build that over time.</p>
            <p className="text-stone-400 leading-relaxed">Every recommendation — ECs, opportunities, milestones — is calibrated for competitive admissions, not just any college.</p>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { title: 'Spike strategy', desc: 'We help you develop a clear "spike" — one area where you go deeper than almost any other applicant.' },
              { title: 'High-impact ECs', desc: 'Leadership positions, research, competitions, and programs that move the needle for competitive schools.' },
              { title: 'GPA and rigor balance', desc: 'The right number of AP/IB courses to show rigor without burning out. Quality over quantity.' },
              { title: 'Application narrative', desc: 'We help you identify and build the story that ties your activities, interests, and goals together.' },
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
        <h2 className="brand text-6xl text-stone-900 mb-6">Build the profile that gets you in.</h2>
        <p className="text-stone-400 mb-8">Get your competitive college prep plan. Free to start.</p>
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