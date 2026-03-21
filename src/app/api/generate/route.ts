import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { answers, type } = await req.json()

  const planPrompt = `You are Guideway, an AI high school success coach.
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

  const roadmapPrompt = `You are Guideway, an AI high school college planning coach.
Generate a personalized college roadmap for this student.

Student Profile:
- Grade: ${answers.grade}
- GPA: ${answers.gpa}
- Goals: ${answers.goals?.join(', ')}
- Interests: ${answers.interests}

Return a JSON object with exactly these keys:
1. "timeline" - array of 4 objects, one per year, each with:
   - "year": "9th Grade", "10th Grade", "11th Grade", or "12th Grade"
   - "theme": a one-line theme for that year (e.g. "Build your foundation")
   - "tasks": array of 3-4 key tasks for that year
2. "current_checklist" - array of 6-8 specific action items the student should do RIGHT NOW based on their current grade
3. "target_schools" - array of 3 suggested college types that match their goals (e.g. "Large state university with strong CS program")
4. "test_prep" - object with "sat_target" (number), "act_target" (number), and "timeline" (string describing when to start prep)

Be specific to their grade and goals. Return only valid JSON, no markdown, no explanation.`

  const opportunitiesPrompt = `You are Guideway, an AI high school success coach.
Generate personalized opportunities for this student.

Student Profile:
- Grade: ${answers.grade}
- GPA: ${answers.gpa}
- Goals: ${answers.goals?.join(', ')}
- Interests: ${answers.interests}

Return a JSON object with exactly these keys:
1. "competitions" - array of 3 objects, each with "name", "desc", "deadline", "link_hint"
2. "internships" - array of 3 objects, each with "name", "desc", "deadline", "link_hint"
3. "clubs" - array of 3 objects, each with "name", "desc", "commitment", "link_hint"
4. "scholarships" - array of 3 objects, each with "name", "desc", "amount", "link_hint"
5. "volunteer" - array of 2 objects, each with "name", "desc", "commitment", "link_hint"
6. "summer" - array of 2 objects, each with "name", "desc", "deadline", "link_hint"

Be specific to their grade, interests, and goals. Reference real programs where possible.
Return only valid JSON, no markdown, no explanation.`

  const prompt = type === 'roadmap' ? roadmapPrompt : type === 'opportunities' ? opportunitiesPrompt : planPrompt

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
    const result = JSON.parse(clean)
    return NextResponse.json(result)

  } catch (err) {
    return NextResponse.json({ error: 'Failed', raw: String(err) }, { status: 500 })
  }
}