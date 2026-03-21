import Link from 'next/link'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7.5" stroke="#4a7c59" strokeWidth="1"/>
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function CollegeRoadmap() {
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
          <span className="text-xs text-stone-600">College Roadmap</span>
        </div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#f0f5f1] border border-[#d4e4d9] text-[#4a7c59] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full" />
            Grade by grade
          </div>
          <h1 className="brand text-6xl text-stone-900 leading-tight mb-5">Know exactly what to do, <em>every semester.</em></h1>
          <p className="text-lg text-stone-400 leading-relaxed mb-8">A clear roadmap from your current grade all the way to college applications — no more guessing what you should be doing right now.</p>
          <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition">Get my roadmap →</Link>
        </div>
      </section>

      <div className="border-t border-stone-100" />

      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="grid grid-cols-4 gap-6 mb-16">
          {[
            { grade: '9th', theme: 'Build your foundation', tasks: ['Start strong academically', 'Explore interests broadly', 'Build good study habits'] },
            { grade: '10th', theme: 'Find your direction', tasks: ['Narrow your interests', 'Start EC commitments', 'Research career paths'] },
            { grade: '11th', theme: 'The year that matters', tasks: ['SAT/ACT prep', 'Visit colleges', 'Build your narrative'] },
            { grade: '12th', theme: 'Execute and apply', tasks: ['Submit applications', 'Write essays', 'Finish strong'] },
          ].map(({ grade, theme, tasks }) => (
            <div key={grade} className="bg-[#fafaf9] border border-stone-100 rounded-2xl p-5">
              <p className="brand text-3xl text-stone-200 mb-2">{grade}</p>
              <p className="text-xs font-semibold text-[#4a7c59] mb-3 italic">{theme}</p>
              <div className="flex flex-col gap-2">
                {tasks.map(t => (
                  <div key={t} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-stone-300 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-stone-500">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-24">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">What it is</p>
            <h2 className="brand text-5xl text-stone-900 leading-tight mb-6">Your personal college counselor.</h2>
            <p className="text-stone-400 leading-relaxed mb-6">Most students don't know what they should be doing in 9th grade to set themselves up for a strong application in 12th. Guideway maps it all out based on your specific goals and target schools.</p>
            <p className="text-stone-400 leading-relaxed">SAT timelines, EC milestones, application deadlines — all laid out clearly, semester by semester.</p>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { title: 'Grade-by-grade milestones', desc: 'Clear actions for each year — from 9th grade habit building to 12th grade applications.' },
              { title: 'SAT/ACT prep timeline', desc: 'Know exactly when to start, which test to take, and what score to aim for based on your target schools.' },
              { title: 'Tailored to your goals', desc: 'Top university track is very different from community college or trade school. Your roadmap reflects your actual path.' },
              { title: 'Do this now checklist', desc: 'Not just a long-term plan — a list of specific things you should be doing right now, this semester.' },
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
        <h2 className="brand text-6xl text-stone-900 mb-6">Stop guessing. Start planning.</h2>
        <p className="text-stone-400 mb-8">Get your personalized college roadmap. Free to start.</p>
        <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#3d6849] transition">Get my roadmap →</Link>
        <p className="text-xs text-stone-300 mt-4">No credit card required</p>
      </section>

      <footer className="border-t border-stone-100 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <span className="brand text-lg text-stone-900">Guideway</span>
        <p className="text-xs text-stone-300">© 2025 Guideway. Built for students, by a student.</p>
      </footer>
    </main>
  )
}