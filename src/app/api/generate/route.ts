import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    let body: any = {}
    let uploadedFile: File | null = null

    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      uploadedFile = formData.get('file') as File | null
      const payload = formData.get('payload') as string | null
      body = payload ? JSON.parse(payload) : {}
    } else {
      body = await req.json()
    }

    const { answers, type, academicAudit, checkin, transcriptText } = body

    let extractedTranscriptText = transcriptText || ''

    if (uploadedFile && type === 'transcript_audit') {
      const arrayBuffer = await uploadedFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const pdfParse = (await import('pdf-parse')).default
      const parsed = await pdfParse(buffer)

      extractedTranscriptText = parsed.text || transcriptText || ''
    }

    const prompt =
      type === 'transcript_audit'
        ? `You are Guideway, an academic transcript analyst. Analyze this transcript:

${extractedTranscriptText || 'No transcript text provided'}

Return only valid JSON with:
{
  "gpa_summary": "",
  "course_rigor": "",
  "strengths": [],
  "concerns": [],
  "recommended_next_courses": [],
  "admissions_notes": []
}`
        : type === 'weekly_replan'
        ? `You are Guideway. Update the student plan.

Profile:
${JSON.stringify(answers || {})}

Current audit:
${JSON.stringify(academicAudit || {})}

Check-in:
${JSON.stringify(checkin || {})}

Return only valid JSON with:
{
  "summary": "",
  "updated_priority_actions": [],
  "updated_schedule": [],
  "updated_competitiveness": [],
  "motivation": ""
}`
        : type === 'academic_audit'
        ? `You are Guideway. Create an academic audit.

Profile:
${JSON.stringify(answers || {})}

Return only valid JSON with:
{
  "strengths": [],
  "weaknesses": [],
  "priority_actions": [],
  "college_fit": [],
  "competitiveness": [],
  "summer_opportunities": []
}`
        : type === 'roadmap'
        ? `Create a college roadmap.

Profile:
${JSON.stringify(answers || {})}

Return only valid JSON with:
{
  "timeline": [],
  "current_checklist": [],
  "target_schools": [],
  "test_prep": {}
}`
        : type === 'opportunities'
        ? `Generate student opportunities.

Profile:
${JSON.stringify(answers || {})}

Return only valid JSON with:
{
  "competitions": [],
  "internships": [],
  "clubs": [],
  "scholarships": [],
  "volunteer": [],
  "summer": []
}`
        : `Generate a weekly success plan.

Profile:
${JSON.stringify(answers || {})}

Return only valid JSON with:
{
  "academic": [],
  "schedule": [],
  "extracurriculars": [],
  "opportunities": [],
  "goals": [],
  "mentalHealth": []
}`

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
        { error: 'OpenRouter request failed', status: openrouterRes.status, raw },
        { status: 500 }
      )
    }

    const parsedOuter = JSON.parse(raw)
    const text = parsedOuter.choices?.[0]?.message?.content || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed in route', raw: String(err) },
      { status: 500 }
    )
  }
}
