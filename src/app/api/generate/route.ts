import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const answers = await req.json()

  const prompt = `You are Guideway, an AI high school success coach.
A student has filled out their profile. Generate a personalized success plan.

Student Profile:
- Grade: ${answers.grade}
- GPA: ${answers.gpa}
- Struggles: ${answers.struggles?.join(', ')}
- Interests: ${answers.interests}
- Goals: ${answers.goals?.join(', ')}
- Study hours available per week: ${answers.hours}
- Stress level: ${answers.stress}/10

Return a JSON object with exactly these 6 keys:
1. "academic" - array of 3-4 specific study strategies tailored to their struggles and GPA
2. "schedule" - array of 4-5 weekly schedule blocks based on their available hours
3. "extracurriculars" - array of 3 extracurricular suggestions based on their interests and goals
4. "opportunities" - array of 2-3 specific programs, competitions, or internships to look into
5. "goals" - array of 3 monthly milestones for this semester
6. "mentalHealth" - array of 2-3 strategies given their stress level

Be specific. Reference their actual interests and struggles directly.
Return only valid JSON, no markdown, no explanation.`

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content
    const clean = text.replace(/```json|```/g, '').trim()
    const plan = JSON.parse(clean)
    return NextResponse.json(plan)

  } catch (err) {
    return NextResponse.json({ error: 'Failed', raw: String(err) }, { status: 500 })
  }
}