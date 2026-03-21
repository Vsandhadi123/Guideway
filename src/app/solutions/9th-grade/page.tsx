import Link from 'next/link'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7.5" stroke="#4a7c59" strokeWidth="1"/>
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function NinthGrade() {
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
            <Link href="/login" className="text-sm text-stone-400 hover:text-stone-700 transition">Log in</Link>
            <Link href="/signup" className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition font-medium">Get started</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-8 pt-20 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="text-xs text-stone-400 hover:text-stone-600 transition">Guideway</Link>
          <span className="text-stone-200">/</span>
          <Link href="/#features" className="text-xs text-stone-400 hover:text-stone-600 transition">Solutions</Link>
          <span className="text-stone-200">/</span>
          <span className="text-xs text-stone-600">9th Grade</span>
        </div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#f0f5f1] border border-[#d4e4d9] text-[#4a7c59] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full" />
            Freshman year
          </div>
          <h1 className="brand text-6xl text-stone-900 leading-tight mb-5">
            Start strong. <em>Build the habits that last.</em>
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed mb-8">
            9th grade sets the tone for everything that follows. Most students don't realize this until it's too late. Guideway helps you build the systems, habits, and mindset that make the next 3 years easier.
          </p>
          <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition">
            Get my 9th grade plan →
          </Link>
        </div>
      </section>

      <div className="border-t border-stone-100" />

      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="grid grid-cols-2 gap-24">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Why 9th grade matters</p>
            <h2 className="brand text-5xl text-stone-900 leading-tight mb-6">You have time. Use it.</h2>
            <p className="text-stone-400 leading-relaxed mb-6">
              Freshman year GPA counts. The habits you build now — how you study, how you manage time, how you handle stress — will carry you through AP classes, college apps, and beyond.
            </p>
            <p className="text-stone-400 leading-relaxed">
              Most 9th graders wing it. The ones who don't end up years ahead. Guideway gives you a real plan from day one.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { title: 'Build study habits now', desc: 'The study techniques that work in 9th grade work in 12th. Learn active recall, spaced repetition, and time-blocking early.' },
              { title: 'Explore broadly', desc: 'Try different ECs and interests. 9th grade is the time to discover what you\'re actually passionate about.' },
              { title: 'Start your GPA strong', desc: 'A strong freshman GPA gives you a cushion for harder courses later. Your plan prioritizes academic foundation.' },
              { title: 'Low stress, high impact', desc: 'You have the most runway of any grade. Your plan is designed to build momentum without burning you out.' },
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

      <section className="max-w-5xl mx-auto px-8 py-24">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-8">What your 9th grade plan includes</p>
        <div className="grid grid-cols-3 gap-6">
          {[
            { title: 'Study system setup', desc: 'Build active recall and time-blocking habits from week one.' },
            { title: 'EC exploration', desc: 'Try 2-3 different activities to find what genuinely excites you.' },
            { title: 'GPA foundation', desc: 'Target strategies for your current GPA to finish freshman year strong.' },
            { title: 'Stress baseline', desc: 'We track your stress from the start so we can catch burnout before it happens.' },
            { title: 'Early college awareness', desc: 'Start understanding what colleges look for — so every choice is intentional.' },
            { title: 'Weekly check-ins', desc: 'Stay on track every week with a plan that adapts as freshman year unfolds.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-[#fafaf9] border border-stone-100 rounded-2xl p-6 hover:border-[#d4e4d9] transition">
              <h3 className="text-sm font-semibold text-stone-900 mb-2">{title}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-stone-100" />

      <section className="max-w-3xl mx-auto px-8 py-24 text-center">
        <h2 className="brand text-6xl text-stone-900 mb-6">Start strong, freshman.</h2>
        <p className="text-stone-400 mb-8">Get your personalized 9th grade success plan. Free to start.</p>
        <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#3d6849] transition">
          Get my plan →
        </Link>
        <p className="text-xs text-stone-300 mt-4">No credit card required</p>
      </section>

      <footer className="border-t border-stone-100 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <span className="brand text-lg text-stone-900">Guideway</span>
        <p className="text-xs text-stone-300">© 2025 Guideway. Built for students, by a student.</p>
      </footer>
    </main>
  )
}