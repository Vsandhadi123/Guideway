import Link from 'next/link'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7.5" stroke="#4a7c59" strokeWidth="1"/>
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function StudyPlanMockup() {
  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #e8e5e0', boxShadow: '0 24px 64px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center gap-2 px-5 py-3 border-b border-stone-100 bg-[#fafaf9]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
        <div className="flex-1 flex justify-center">
          <div className="bg-stone-100 rounded px-3 py-0.5 text-[11px] text-stone-400">guideway.app/plan</div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-1">Academic Study Plan</p>
            <p className="text-sm font-semibold text-stone-800">Personalized for Varun · 10th Grade</p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#f0f5f1] border border-[#d4e4d9] px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c59]" />
            <span className="text-[10px] font-semibold text-[#4a7c59]">AI Generated</span>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { title: 'Active recall over passive rereading', desc: 'After each study session, close your notes and write down everything you remember. This forces retrieval and builds long-term memory.' },
            { title: 'Pomodoro technique for focus', desc: '25 minutes of focused study followed by 5-minute breaks. Matches your 15 available hours per week across structured blocks.' },
            { title: 'Spaced repetition for retention', desc: 'Review material at increasing intervals — day 1, day 3, day 7. Especially useful for AP Biology and history content.' },
            { title: 'Teach-back method for understanding', desc: 'Explain concepts out loud as if teaching a friend. Identifies gaps in understanding faster than re-reading.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-[#4a7c59] text-sm mt-0.5 flex-shrink-0">→</span>
              <div>
                <p className="text-xs font-semibold text-stone-800 mb-0.5">{item.title}</p>
                <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AIStudyPlan() {
  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
      `}</style>

      {/* Nav */}
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

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-20 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="text-xs text-stone-400 hover:text-stone-600 transition">Guideway</Link>
          <span className="text-stone-200">/</span>
          <Link href="/#features" className="text-xs text-stone-400 hover:text-stone-600 transition">Features</Link>
          <span className="text-stone-200">/</span>
          <span className="text-xs text-stone-600">AI Study Plan</span>
        </div>
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#f0f5f1] border border-[#d4e4d9] text-[#4a7c59] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full" />
              AI-powered
            </div>
            <h1 className="brand text-6xl text-stone-900 leading-tight mb-5">
              A study plan built <em>for you.</em>
            </h1>
            <p className="text-lg text-stone-400 leading-relaxed mb-8">
              Not a generic template. Guideway analyzes your GPA, your specific struggles, your interests, and the time you actually have — then builds a study strategy that fits your life.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/signup" className="bg-[#4a7c59] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition">
                Get my study plan →
              </Link>
              <Link href="/pricing" className="text-sm text-stone-400 hover:text-stone-700 transition">
                View pricing
              </Link>
            </div>
          </div>
          <StudyPlanMockup />
        </div>
      </section>

      <div className="border-t border-stone-100" />

      {/* What it is */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="grid grid-cols-2 gap-24">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">What it is</p>
            <h2 className="brand text-5xl text-stone-900 leading-tight mb-6">
              Not advice. An actual plan.
            </h2>
            <p className="text-stone-400 leading-relaxed mb-6">
              Most study advice is generic — &ldquo;use flashcards&rdquo;, &ldquo;study more&rdquo;. Guideway&apos;s AI Study Plan is different. It reads your profile and builds specific strategies for your specific situation.
            </p>
            <p className="text-stone-400 leading-relaxed">
              Struggling with procrastination and have 10 hours a week? You get a plan for that. Have a 3.8 GPA and want to push to 4.0? You get a plan for that too. Every plan is different because every student is different.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { title: 'Tailored to your GPA', desc: 'Whether you\'re at a 2.0 or a 4.0, the strategies are calibrated to where you are and where you want to go.' },
              { title: 'Built around your struggles', desc: 'Tell us where you struggle — focus, time management, test anxiety — and we build strategies that directly address those.' },
              { title: 'Fits your actual schedule', desc: 'You tell us how many hours you have. We build a plan that works in that time, not an idealized version of your week.' },
              { title: 'Updates with you', desc: 'Every weekly check-in, your plan gets smarter. As your goals and situation change, your plan changes too.' },
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

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">How it works</p>
          <h2 className="brand text-5xl text-stone-900">Your plan in 3 steps.</h2>
        </div>
        <div className="grid grid-cols-3 gap-12">
          {[
            { step: '01', title: 'Tell us about yourself', desc: 'Grade, GPA, struggles, interests, available time, stress level — 7 questions that take 2 minutes.' },
            { step: '02', title: 'AI builds your plan', desc: 'Guideway\'s AI reads your profile and generates a personalized study plan with specific strategies for your exact situation.' },
            { step: '03', title: 'It gets better every week', desc: 'Weekly check-ins update your plan. The more you use Guideway, the more dialed-in your plan becomes.' },
          ].map(({ step, title, desc }) => (
            <div key={step}>
              <p className="brand text-6xl text-stone-100 mb-4 leading-none">{step}</p>
              <h3 className="text-base font-semibold text-stone-900 mb-2">{title}</h3>
              <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-stone-100" />

      {/* Why it matters */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="grid grid-cols-2 gap-24 items-center">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Why it matters</p>
            <h2 className="brand text-5xl text-stone-900 leading-tight mb-6">
              Most students study hard. <em className="text-[#4a7c59]">Few study smart.</em>
            </h2>
            <p className="text-stone-400 leading-relaxed mb-4">
              Research shows that how you study matters far more than how long you study. Active recall beats passive rereading. Spaced repetition beats cramming. But most students never learn these techniques.
            </p>
            <p className="text-stone-400 leading-relaxed">
              Guideway&apos;s AI Study Plan builds these proven techniques into your daily routine — automatically, without you needing to know they exist.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { stat: '2x', label: 'better retention with active recall vs rereading' },
              { stat: '40%', label: 'less study time needed with spaced repetition' },
              { stat: '91%', label: 'of students surveyed would use Guideway' },
              { stat: '2min', label: 'to get your personalized plan' },
            ].map(({ stat, label }) => (
              <div key={label} className="border border-stone-100 rounded-2xl p-6 hover:border-[#d4e4d9] transition">
                <p className="brand text-4xl text-stone-900 mb-2">{stat}</p>
                <p className="text-xs text-stone-400 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-stone-100" />

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-8 py-24 text-center">
        <h2 className="brand text-6xl text-stone-900 mb-6">Ready to study smarter?</h2>
        <p className="text-stone-400 mb-8">Get your personalized AI study plan in 2 minutes. Free to start.</p>
        <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#3d6849] transition">
          Get my study plan →
        </Link>
        <p className="text-xs text-stone-300 mt-4">No credit card required</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <span className="brand text-lg text-stone-900">Guideway</span>
        <p className="text-xs text-stone-300">© 2025 Guideway. Built for students, by a student.</p>
      </footer>
    </main>
  )
}