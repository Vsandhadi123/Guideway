import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { answers, type, academicAudit, checkin } = body

    const academicAuditPrompt = `You are Guideway, an elite AI academic strategist for high school students.

Your job is to generate a highly personalized academic audit based on the student's profile.
Do NOT give generic advice like "study more" or "join clubs."
Be specific, strategic, and realistic.

Student Profile:
- Grade: ${answers?.grade || 'Unknown'}
- GPA: ${answers?.gpa || 'Unknown'}
- Intended major/career: ${answers?.major || 'Unknown'}
- Target colleges: ${answers?.colleges || 'Unknown'}
- Current classes: ${answers?.classes || 'Unknown'}
- Extracurriculars: ${answers?.ecs?.join(', ') || 'None listed'}
- Leadership level: ${answers?.leadership || 'Unknown'}
- Main struggles: ${answers?.struggles?.join(', ') || 'None listed'}
- Interests: ${answers?.interests || 'Unknown'}
- Test scores: ${answers?.scores || 'Not provided'}
- Main goals: ${answers?.goals?.join(', ') || 'None listed'}

Return a JSON object with exactly these 6 keys:
1. "strengths" - array of exactly 3 short, specific strengths
2. "weaknesses" - array of exactly 3 short, specific weaknesses
3. "priority_actions" - array of exactly 5 highly specific action steps
4. "college_fit" - array of exactly 3 objects, each with:
   - "school"
   - "verdict"
5. "competitiveness" - array of exactly 3 objects, each with:
   - "school"
   - "level" (must be exactly "Reach", "Target", or "Safer")
   - "reason"
   - "improve"
6. "summer_opportunities" - array of exactly 4 specific summer ideas

Rules for competitiveness:
- Base it on the student's GPA, rigor, leadership, extracurricular depth, and target direction
- Be realistic, not overly flattering
- "reason" should be one short sentence
- "improve" should be one specific, high-impact next step

Return only valid JSON.`

    const weeklyReplanPrompt = `You are Guideway, an elite AI academic strategist.

A student has completed a weekly check-in. Update their short-term plan.

Original Student Profile:
- Grade: ${answers?.grade || 'Unknown'}
- GPA: ${answers?.gpa || 'Unknown'}
- Intended major/career: ${answers?.major || 'Unknown'}
- Target colleges: ${answers?.colleges || 'Unknown'}
- Current classes: ${answers?.classes || 'Unknown'}
- Extracurriculars: ${answers?.ecs?.join(', ') || 'None listed'}
- Leadership: ${answers?.leadership || 'Unknown'}
- Main struggles: ${answers?.struggles?.join(', ') || 'None listed'}
- Interests: ${answers?.interests || 'Unknown'}
- Test scores: ${answers?.scores || 'Not provided'}
- Goals: ${answers?.goals?.join(', ') || 'None listed'}

Current Academic Audit:
${JSON.stringify(academicAudit || {})}

Weekly Check-In:
${JSON.stringify(checkin || {})}

Return a JSON object with exactly these 5 keys:
1. "summary" - 1 short paragraph
2. "updated_priority_actions" - array of exactly 5 specific action steps for next week
3. "updated_schedule" - array of exactly 4 realistic weekly schedule blocks
4. "updated_competitiveness" - array of exactly 3 objects, each with:
   - "school"
   - "level" (must be exactly "Reach", "Target", or "Safer")
   - "reason"
   - "improve"
5. "motivation" - 1 short encouraging sentence

Rules:
- If the week went poorly, competitiveness can stay the same or become slightly weaker in outlook
- If the week went well, competitiveness can improve slightly in outlook, but stay realistic
- Base changes on consistency, blockers, stress level, and next-week focus
- Keep the competitiveness grounded and believable
- Return only valid JSON.`

    const planPrompt = `You are Guideway, an AI high school success coach.
Generate a personalized weekly success plan for this student.

Student Profile:
- Grade: ${answers?.grade || 'Unknown'}
- GPA: ${answers?.gpa || 'Unknown'}
- Intended major/career: ${answers?.major || 'Unknown'}
- Current classes: ${answers?.classes || 'Unknown'}
- Main struggles: ${answers?.struggles?.join(', ') || 'None listed'}
- Interests: ${answers?.interests || 'Unknown'}
- Goals: ${answers?.goals?.join(', ') || 'None listed'}

Return a JSON object with exactly these 6 keys:
1. "academic" - array of 3-4 specific study strategies
2. "schedule" - array of 4-5 realistic weekly schedule blocks
3. "extracurriculars" - array of 3 extracurricular suggestions
4. "opportunities" - array of 2-3 programs, competitions, or internships
5. "goals" - array of 3 short-term milestones
6. "mentalHealth" - array of 2-3 realistic stress-management strategies

Return only valid JSON.`

    const roadmapPrompt = `You are Guideway, an AI high school college planning coach.
Generate a personalized college roadmap for this student.

Student Profile:
- Grade: ${answers?.grade || 'Unknown'}
- GPA: ${answers?.gpa || 'Unknown'}
- Intended major/career: ${answers?.major || 'Unknown'}
- Target colleges: ${answers?.colleges || 'Unknown'}
- Current classes: ${answers?.classes || 'Unknown'}
- Extracurriculars: ${answers?.ecs?.join(', ') || 'None listed'}
- Leadership level: ${answers?.leadership || 'Unknown'}
- Interests: ${answers?.interests || 'Unknown'}
- Test scores: ${answers?.scores || 'Not provided'}
- Goals: ${answers?.goals?.join(', ') || 'None listed'}

Return a JSON object with exactly these keys:
1. "timeline" - array of 4 objects
2. "current_checklist" - array of 6-8 specific things
3. "target_schools" - array of 3 suggested colleges or categories
4. "test_prep" - object with "sat_target", "act_target", and "timeline"

Return only valid JSON.`

    const opportunitiesPrompt = `You are Guideway, an AI high school success coach.
Generate personalized opportunities for this student.

Student Profile:
- Grade: ${answers?.grade || 'Unknown'}
- GPA: ${answers?.gpa || 'Unknown'}
- Intended major/career: ${answers?.major || 'Unknown'}
- Target colleges: ${answers?.colleges || 'Unknown'}
- Interests: ${answers?.interests || 'Unknown'}
- Extracurriculars: ${answers?.ecs?.join(', ') || 'None listed'}
- Leadership level: ${answers?.leadership || 'Unknown'}
- Goals: ${answers?.goals?.join(', ') || 'None listed'}

Return a JSON object with exactly these keys:
1. "competitions" - array of 3 objects
2. "internships" - array of 3 objects
3. "clubs" - array of 3 objects
4. "scholarships" - array of 3 objects
5. "volunteer" - array of 2 objects
6. "summer" - array of 2 objects

Return only valid JSON.`

    const prompt =
      type === 'academic_audit'
        ? academicAuditPrompt
        : type === 'weekly_replan'
        ? weeklyReplanPrompt
        : type === 'roadmap'
        ? roadmapPrompt
        : type === 'opportunities'
        ? opportunitiesPrompt
        : planPrompt

    const openrouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const raw = await openrouterRes.text()

    if (!openrouterRes.ok) {
      return NextResponse.json(
        {
          error: 'OpenRouter request failed',
          status: openrouterRes.status,
          raw,
        },
        { status: 500 }
      )
    }

    let parsedOuter: any
    try {
      parsedOuter = JSON.parse(raw)
    } catch {
      return NextResponse.json(
        {
          error: 'OpenRouter returned invalid JSON',
          raw,
        },
        { status: 500 }
      )
    }

    const text = parsedOuter.choices?.[0]?.message?.content || ''
    const clean = text.replace(/```json|```/g, '').trim()

    let result: any
    try {
      result = JSON.parse(clean)
    } catch {
      return NextResponse.json(
        {
          error: 'Model returned non-JSON content',
          modelOutput: text,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed in route', raw: String(err) },
      { status: 500 }
    )
  }
}