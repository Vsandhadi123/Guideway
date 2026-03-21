'use client'

import ReactMarkdown from 'react-markdown'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'Help me study for my next exam',
  'Quiz me on a topic',
  'Explain a concept I am struggling with',
  'How can I improve my GPA?',
  'Help me manage my time better',
  'What should I focus on this week?',
]

export default function Chat() {
  const router = useRouter()
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setPageLoading(false)

      // Welcome message
      const name = user.user_metadata?.full_name?.split(' ')[0] || 'there'
      setMessages([{
        role: 'assistant',
        content: `Hey ${name}! I'm your Guideway study buddy. I know your profile — you're in ${data?.answers?.grade || 'high school'} with a ${data?.answers?.gpa || ''} GPA, interested in ${data?.answers?.interests || 'various subjects'}. I'm here to help you study, explain concepts, quiz you, or just talk through anything school-related. What do you need help with?`
      }])
    }
    load()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')
    setLoading(true)

    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)

    const systemPrompt = `You are a friendly, knowledgeable AI study buddy for a high school student named ${profile?.answers ? 'a student' : 'this student'}.

Here is what you know about this student:
- Grade: ${profile?.answers?.grade || 'high school'}
- GPA: ${profile?.answers?.gpa || 'unknown'}
- Struggles: ${profile?.answers?.struggles?.join(', ') || 'not specified'}
- Interests: ${profile?.answers?.interests || 'not specified'}
- Goals: ${profile?.answers?.goals?.join(', ') || 'not specified'}
- Stress level: ${profile?.answers?.stress || 'unknown'}/10
- Study hours per week: ${profile?.answers?.hours || 'unknown'}

Your role:
- Help them study specific subjects and topics
- Explain concepts clearly and simply
- Quiz them when asked
- Give them study tips tailored to their struggles
- Be encouraging, warm, and direct
- Keep responses concise — this is a chat, not an essay
- Use their interests to make explanations relatable when possible

Never be generic. Always be specific to what they asked.`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt
        })
      })
      const data = await res.json()
      const reply = data.reply || "Sorry, I couldn't respond. Try again!"
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      console.log('Chat error:', err)
      setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Try again!" }])
    }

    setLoading(false)
  }

  if (pageLoading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-[#4a7c59] border-t-transparent rounded-full animate-spin" />
    </main>
  )

  return (
    <main className="min-h-screen bg-[#fafaf9] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
        .brand { font-family: 'Fraunces', serif; }
      `}</style>

      <nav className="bg-white border-b border-stone-100 flex items-center justify-between px-10 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="brand text-2xl text-stone-900">Guideway</span>
          <span className="text-xs font-semibold text-[#4a7c59] bg-[#f0f5f1] border border-[#d4e4d9] px-2.5 py-1 rounded-full">Study Buddy</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-stone-400 hover:text-stone-700 transition">Dashboard</button>
          <button onClick={() => router.push('/pomodoro')} className="text-sm text-stone-400 hover:text-stone-700 transition">Focus Timer</button>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-3xl mx-auto w-full">

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 mb-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-[#4a7c59] flex items-center justify-center flex-shrink-0 mt-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1a6 6 0 100 12A6 6 0 007 1zM4.5 7.5c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5M5 5.5h.01M9 5.5h.01" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
            )}
            <div className={`max-w-lg px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-[#4a7c59] text-white rounded-tr-sm'
                : 'bg-white border border-stone-100 text-stone-700 rounded-tl-sm'
            }`}>
              {m.role === 'assistant' ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                    h3: ({ children }) => <p className="font-semibold mt-3 mb-1">{children}</p>,
                    h2: ({ children }) => <p className="font-semibold mt-3 mb-1">{children}</p>,
                    code: ({ children }) => <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#4a7c59] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1a6 6 0 100 12A6 6 0 007 1zM4.5 7.5c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5M5 5.5h.01M9 5.5h.01" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="bg-white border border-stone-100 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs text-stone-500 border border-stone-200 bg-white px-4 py-2 rounded-full hover:border-[#4a7c59] hover:text-[#4a7c59] transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-stone-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything — explain a concept, quiz me, help me study..."
            className="flex-1 border border-stone-200 rounded-2xl px-5 py-3 text-sm text-stone-800 outline-none focus:border-[#4a7c59] transition"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="bg-[#4a7c59] text-white px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-[#3d6849] transition disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  )
}
