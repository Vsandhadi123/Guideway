import Link from 'next/link'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7.5" stroke="#4a7c59" strokeWidth="1"/>
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ScheduleMockup() {
  const days = [
    { day: 'Mon', blocks: [{ time: '7:00 PM', task: 'AP Bio study block', color: '#4a7c59' }, { time: '8:00 PM', task: 'Math homework', color: '#4a6a7c' }] },
    { day: 'Wed', blocks: [{ time: '6:00 PM', task: 'Coding project', color: '#4a7c59' }] },
    { day: 'Thu', blocks: [{ time: '7:00 PM', task: 'Active recall session', color: '#7c6a4a' }] },
    { day: 'Sat', blocks: [{ time: '10:00 AM', task: 'Robotics club', color: '#4a7c59' }, { time: '2:00 PM', task: 'College research', color: '#4a6a7c' }] },
  ]

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #e8e5e0', boxShadow: '0 24px 64px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center gap-2 px-5 py-3 border-b border-stone-100 bg-[#fafaf9]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
        <div className="flex-1 flex justify-center">
          <div className="bg-stone-100 rounded px-3 py-0.5 text-[11px] text-stone-400">guideway.app/dashboard</div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-4">This week</p>
        <div className="space-y-4">
          {days.map(({ day, blocks }) => (
            <div key={day} className="flex gap-4">
              <div className="w-8 text-xs font-bold text-stone-400 pt-1 flex-shrink-0">{day}</div>
              <div className="flex-1 space-y-2">
                {blocks.map((block, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: block.color }} />
                    <div>
                      <p className="text-xs font-medium text-stone-700">{block.task}</p>
                      <p className="text-[10px] text-stone-400">{block.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function WeeklySchedule() {
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
          <Link href="/#features" className="text-xs text-stone-400 hover:text-stone-600 transition">Features</Link>
          <span className="text-stone-200">/</span>
          <span className="text-xs text-stone-600">Weekly Schedule</span>
        </div>
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#f0f5f1] border border-[#d4e4d9] text-[#4a7c59] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full" />
              Built around your life
            </div>
            <h1 className="brand text-6xl text-stone-900 leading-tight mb-5">A schedule you can <em>actually stick to.</em></h1>
            <p className="text-lg text-stone-400 leading-relaxed mb-8">No more generic study timetables. Guideway builds your weekly schedule around your actual commitments, energy levels, and the hours you really have.</p>
            <div className="flex items-center gap-3">
              <Link href="/signup" className="bg-[#4a7c59] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#3d6849] transition">Get my schedule →</Link>
              <Link href="/pricing" className="text-sm text-stone-400 hover:text-stone-700 transition">View pricing</Link>
            </div>
          </div>
          <ScheduleMockup />
        </div>
      </section>

      <div className="border-t border-stone-100" />

      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="grid grid-cols-2 gap-24">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">What it is</p>
            <h2 className="brand text-5xl text-stone-900 leading-tight mb-6">Realistic beats perfect.</h2>
            <p className="text-stone-400 leading-relaxed mb-6">Most students make ambitious study schedules they abandon by Wednesday. Guideway builds around what you told us — your available hours, your stress level, your extracurriculars — and creates something you can actually follow.</p>
            <p className="text-stone-400 leading-relaxed">Every week, your check-in updates the schedule. Busy week coming up? It adjusts. Exam on Thursday? It front-loads your prep.</p>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { title: 'Built around your hours', desc: 'You tell us how much time you have. We build a schedule that fits — not one that assumes you have 6 free hours every night.' },
              { title: 'Respects your activities', desc: 'Sports, clubs, jobs — your extracurriculars are accounted for. Study blocks go where they actually fit.' },
              { title: 'Stress-aware pacing', desc: 'High stress week? We dial back intensity. Low stress? We push a little harder. Your schedule adapts to how you feel.' },
              { title: 'Updates every week', desc: 'Weekly check-ins keep your schedule current. Life changes — your plan keeps up.' },
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
        <h2 className="brand text-6xl text-stone-900 mb-6">Stop winging your week.</h2>
        <p className="text-stone-400 mb-8">Get a realistic weekly schedule built around your life. Free to start.</p>
        <Link href="/signup" className="inline-block bg-[#4a7c59] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#3d6849] transition">Get my schedule →</Link>
        <p className="text-xs text-stone-300 mt-4">No credit card required</p>
      </section>

      <footer className="border-t border-stone-100 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <span className="brand text-lg text-stone-900">Guideway</span>
        <p className="text-xs text-stone-300">© 2025 Guideway. Built for students, by a student.</p>
      </footer>
    </main>
  )
}