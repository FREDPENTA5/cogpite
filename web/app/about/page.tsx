import { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'About Cogpite — AI Procurement Intelligence for East Africa',
  description: 'Learn about Cogpite, the AI-powered procurement intelligence platform helping East African ICT firms discover and win government tenders from PPDA, PPRA, RPPA.',
  openGraph: {
    title: 'About Cogpite',
    description: 'AI-powered procurement intelligence for East African ICT firms.',
    url: 'https://cogpite.com/about',
  },
  alternates: { canonical: 'https://cogpite.com/about' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://cogpite.com' },
        { name: 'About', url: 'https://cogpite.com/about' },
      ]} />
      
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo-horizontal.svg" alt="Cogpite" className="h-7 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#platform" className="text-[14px] font-normal text-[#444] hover:text-black transition-colors">Platform</Link>
            <Link href="/#pricing" className="text-[14px] font-normal text-[#444] hover:text-black transition-colors">Pricing</Link>
            <Link href="/about" className="text-[14px] font-semibold text-black">About</Link>
            <Link href="/login" className="text-[14px] font-normal text-[#444] hover:text-black transition-colors">Sign In</Link>
          </nav>
        </div>
      </header>

      <main className="pt-[120px] pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-[42px] md:text-[56px] font-light text-[#111] leading-[1.08] tracking-[-0.02em] mb-8">
            Built for East Africa's{' '}
            <span className="text-[#6b8f71]">boldest</span> tech firms.
          </h1>
          
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-[17px] text-[#666] leading-[1.8] font-light mb-8">
              Cogpite is an AI-powered procurement intelligence platform purpose-built for ICT companies operating in East Africa. We solve a simple but critical problem: government tenders in Uganda, Kenya, Rwanda, and Tanzania are published across dozens of disconnected portals, making it nearly impossible for growing tech firms to track every relevant opportunity.
            </p>

            <h2 className="text-[28px] font-normal text-[#111] mt-16 mb-6 tracking-tight">The Problem We Solve</h2>
            <p className="text-[15px] text-[#888] leading-[1.8] font-light mb-6">
              Every week, hundreds of government ICT tenders are published across PPDA (Uganda), PPRA (Kenya), RPPA (Rwanda), PPRA (Tanzania), and dozens of district-level procurement websites. A typical East African ICT firm spends 10+ hours per week manually checking these sites, downloading PDFs, and reading through 100-page tender documents just to determine if an opportunity is worth pursuing.
            </p>
            <p className="text-[15px] text-[#888] leading-[1.8] font-light mb-6">
              The result? Most firms miss more than half of the tenders relevant to their capabilities. The companies that win are simply the ones with enough resources to have a dedicated business development team checking every portal, every day.
            </p>

            <h2 className="text-[28px] font-normal text-[#111] mt-16 mb-6 tracking-tight">Our Solution</h2>
            <p className="text-[15px] text-[#888] leading-[1.8] font-light mb-6">
              Cogpite automates the entire tender discovery and qualification process. Our AI engine scrapes 15+ procurement portals multiple times daily, parses every tender document, extracts key requirements (tech stack, budget, scope, deadline), and scores each opportunity against your company's profile. You get notified the moment a high-confidence match appears — before your competitors even know it exists.
            </p>

            <h2 className="text-[28px] font-normal text-[#111] mt-16 mb-6 tracking-tight">Our Mission</h2>
            <p className="text-[15px] text-[#888] leading-[1.8] font-light mb-8">
              We believe every capable ICT firm in East Africa — regardless of size — should have equal access to procurement opportunities. By democratizing tender intelligence through AI, we're leveling the playing field and helping the region's most innovative tech companies win the contracts they deserve.
            </p>

            <div className="mt-16 flex items-center gap-4">
              <Link href="/signup" className="bg-[#111] text-white font-normal text-[14px] px-6 py-[11px] rounded-[10px] hover:bg-black transition-colors">
                Start Your Free Trial
              </Link>
              <Link href="/" className="text-[14px] font-normal text-[#444] hover:text-black transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100/50 py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} Cogpite. All rights reserved.</p>
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-900">Home</Link>
        </div>
      </footer>
    </div>
  )
}
