import Link from 'next/link'

export default function ConfirmEmail() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
      .brand { font-family: 'Fraunces', serif; }`}</style>

      <div className="w-full max-w-sm text-center">
        <Link href="/" className="block brand text-3xl text-stone-900 mb-10">Guideway</Link>

        <div className="w-14 h-14 rounded-full bg-[#f0f5f1] border border-[#d4e4d9] flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 8l9 6 9-6M3 8v10a1 1 0 001 1h16a1 1 0 001-1V8M3 8a1 1 0 011-1h16a1 1 0 011 1" stroke="#4a7c59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-stone-900 mb-2">Check your email</h1>
        <p className="text-sm text-stone-400 leading-relaxed mb-8">
          We sent a confirmation link to your email. Click it to activate your account and get started.
        </p>
        <p className="text-xs text-stone-300">Already confirmed? <Link href="/login" className="text-[#4a7c59] font-medium hover:underline">Log in</Link></p>
      </div>
    </main>
  )
}