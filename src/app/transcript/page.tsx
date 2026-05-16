'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function TranscriptPage() {
  const router = useRouter()
  const supabase = createClient()

  const [transcriptText, setTranscriptText] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)


  async function analyzeTranscript() {
  console.log('1. Analyze clicked')
  console.log('Transcript:', transcriptText)
  console.log('File:', file)

  if (!transcriptText.trim() && !file) {
    alert('Please upload a PDF or paste transcript details.')
    return
  }

  setLoading(true)

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  console.log('2. User:', user)
  console.log('User error:', userError)

  if (!user) {
    alert('You are not logged in.')
    router.push('/login')
    return
  }

  let transcriptFilePath = ''

  if (file) {
    console.log('3. Uploading file...')

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('transcripts')
      .upload(filePath, file)

    console.log('Upload error:', uploadError)

    if (uploadError) {
      alert('PDF upload failed. Check console.')
      setLoading(false)
      return
    }

    transcriptFilePath = filePath
  }

  console.log('4. Calling AI...')

const formData = new FormData()

if (file) {
  formData.append('file', file)
}

formData.append(
  'payload',
  JSON.stringify({
    type: 'transcript_audit',
    transcriptText,
  })
)

const res = await fetch('/api/generate', {
  method: 'POST',
  body: formData,
})

console.log('5. API status:', res.status)
console.log('5b. API ok:', res.ok)

const data = await res.json()
console.log('6. Transcript audit response:', data)
if (data.error) {
  console.error('Transcript AI error full:', JSON.stringify(data, null, 2))
}

  if (!data.error) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        transcript_audit: data,
        transcript_file_path: transcriptFilePath || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    console.log('7. Update error:', updateError)

    if (updateError) {
      alert('Profile update failed. Check console.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  } else {
    alert('AI analysis failed. Check console.')
  }

  setLoading(false)
}

  return (
    <main className="min-h-screen bg-[#fafaf9] px-4 py-10" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-stone-400 hover:text-stone-700 mb-6"
        >
          ← Back to dashboard
        </button>

        <div className="bg-white border border-stone-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <p className="text-xs font-bold text-[#4a7c59] uppercase tracking-widest mb-3">
            Transcript analysis
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4">
            Upload or paste your transcript.
          </h1>

          <p className="text-sm text-stone-500 mb-6 leading-relaxed">
            Upload a PDF transcript, or paste your classes, grades, GPA, AP/Honors/DE courses, and anything else shown on your transcript.
          </p>
        
        <div className="mb-6">
        <label className="block text-sm font-semibold text-stone-700 mb-2">
            Upload transcript PDF
        </label>

        <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border-2 border-stone-200 rounded-2xl p-4 text-sm bg-white"
        />

        {file && (
            <p className="text-xs text-[#4a7c59] mt-2">
            Selected: {file.name}
            </p>
        )}
        </div>

          <textarea
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            placeholder="Example: 10th grade, GPA 3.9, AP CSA A, Honors Chemistry B+, AP Precalculus A-, Spanish IV A..."
            className="w-full h-64 border-2 border-stone-200 rounded-2xl p-4 text-sm outline-none focus:border-[#4a7c59] resize-none"
          />

          <button
            onClick={analyzeTranscript}
            disabled={loading || (!transcriptText.trim() && !file)}
            className="mt-6 w-full bg-[#4a7c59] text-white rounded-2xl py-4 font-semibold disabled:opacity-40"
          >
            {loading ? 'Analyzing transcript...' : 'Analyze my transcript →'}
          </button>
        </div>
      </div>
    </main>
  )
}