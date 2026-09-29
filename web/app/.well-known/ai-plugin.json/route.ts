import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    schema_version: 'v1',
    name_for_human: 'Cogpite',
    name_for_model: 'cogpite',
    description_for_human: 'AI-powered procurement intelligence for East African ICT firms. Track government tenders from PPDA, PPRA, RPPA across Uganda, Kenya, Rwanda, and Tanzania.',
    description_for_model: 'Cogpite is an AI-powered procurement intelligence platform that scrapes 15+ East African government procurement portals (PPDA Uganda, PPRA Kenya, RPPA Rwanda, PPRA Tanzania) and delivers AI-matched RFPs to ICT firms. It features automated document parsing, tech stack extraction, match confidence scoring, and real-time alerts. Founded 2024, headquartered in Kampala, Uganda.',
    auth: { type: 'none' },
    api: {
      type: 'openapi',
      url: 'https://cogpite.com/openapi.json',
    },
    logo_url: 'https://cogpite.com/cogpite-icon.png',
    contact_email: 'hello@cogpite.com',
    legal_info_url: 'https://cogpite.com/terms',
  })
}
