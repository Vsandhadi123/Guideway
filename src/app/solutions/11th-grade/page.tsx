import Link from 'next/link'
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7.5" stroke="#4a7c59" strokeWidth="1"/>
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
export default function EleventhGrade() {
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
          <span className="text-xs text-stone-600">11th Grade</span>
        </div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#f0f5f1] border border-[#d4e4d9] text-[#4a7c59] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full" />
            Junior year
          </div>
          <h1 className="brand text-6xl text-stone-900 leading-tight mb-5">The year that matters most. <em>Make it count.</em></h1>
          <p className="text-lg text-stone-400 leading-relaxed mb-8">Junior year is the most important year of high school. SAT/ACT, the hardest classes, college visits, and the beginning of your application narrative — all at once. You need a plan.</p>
          <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition">Get my 11th grade plan →</Link>
        </div>
      </section>
      <div className="border-t border-stone-100" />
      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="grid grid-cols-2 gap-24">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Why 11th grade matters most</p>
            <h2 className="brand text-5xl text-stone-900 leading-tight mb-6">Everything converges this year.</h2>
            <p className="text-stone-400 leading-relaxed mb-6">Junior year GPA is the most recent and heavily weighted by colleges. Your SAT/ACT score is due. Your college list needs to take shape. And you&apos;re probably in your hardest classes yet.</p>
            <p className="text-stone-400 leading-relaxed">Without a system, junior year overwhelms most students. Guideway builds you one before it starts.</p>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { title: 'SAT/ACT strategy', desc: 'Which test, when to take it, how to prep — based on your target schools and current academic profile.' },
              { title: 'AP course management', desc: 'Balancing multiple AP classes requires a different study approach. Your plan accounts for this.' },
              { title: 'College list building', desc: 'Start researching schools seriously. Your plan includes milestones for visits, research, and narrowing down.' },
              { title: 'Stress management priority', desc: 'Junior year stress is real. Your plan builds in recovery and tracks burnout before it derails you.' },
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
        <h2 className="brand text-6xl text-stone-900 mb-6">Junior year is your shot. Take it.</h2>
        <p className="text-stone-400 mb-8">Get your personalized 11th grade plan. Free to start.</p>
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