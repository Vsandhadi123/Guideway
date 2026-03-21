import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { messages, systemPrompt } = await req.json()

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ]
      })
    })

    const data = await res.json()
    console.log('Chat API response:', JSON.stringify(data))
    const reply = data.choices?.[0]?.message?.content
    return NextResponse.json({ reply })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}