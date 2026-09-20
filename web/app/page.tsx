import React from "react";
import Link from "next/link";
import { 
  Search, 
  Bell, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  Building2, 
  Zap,
  Briefcase,
  ChevronRight,
  BarChart3
} from "lucide-react";
import "./landing.css";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Cogpite",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "AI-powered RFP and procurement intelligence platform for East African ICT firms.",
          })
        }}
      />
      
      {/* ═══════════════════════════════════════════════════════════
          HEADER — Morrow style: logo left, nav center, CTA right
      ═══════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-[140px]">
            <div className="w-7 h-7 rounded-full border-[3px] border-[#6b8f71]"></div>
            <span className="text-[18px] font-normal text-[#111] tracking-tight">Cogpite</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[14px] font-normal text-[#444] hover:text-black transition-colors">How it works</a>
            <a href="#solutions" className="text-[14px] font-normal text-[#444] hover:text-black transition-colors">Trust</a>
            <a href="#pricing" className="text-[14px] font-normal text-[#444] hover:text-black transition-colors">Integrations</a>
            <Link href="/login" className="text-[14px] font-normal text-[#444] hover:text-black transition-colors">English</Link>
          </nav>
          
          <div className="hidden md:flex min-w-[140px] justify-end">
            <Link href="/signup" className="text-[14px] font-normal text-[#111] px-5 py-2 rounded-full border border-[#ccc] hover:border-[#999] transition-colors">
              Request Access
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO — Thin headline, tight subtitle, two pill buttons
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-[160px] pb-0 overflow-hidden bg-[#fafafa]">
        <div className="relative max-w-3xl mx-auto px-4 text-center z-20">
          <h1 className="text-[42px] md:text-[56px] lg:text-[68px] font-light text-[#111] leading-[1.08] tracking-[-0.02em] mb-5">
            Know exactly which{'\u00A0'}
            <br className="hidden md:block" />
            tenders match you.
          </h1>
          
          <p className="text-[15px] md:text-[17px] font-light text-[#999] max-w-[460px] mx-auto mb-9 leading-[1.65]">
            Know exactly where your next bid is. Get a clearer pipeline
            and spend less time chasing what still needs your attention.
          </p>
          
          <div className="flex items-center justify-center gap-3">
            <Link href="/signup" className="bg-[#111] text-white font-normal text-[14px] px-6 py-[11px] rounded-full hover:bg-black transition-colors">
              Start Your Free Trial
            </Link>
            <Link href="/demo" className="bg-white text-[#111] font-normal text-[14px] px-6 py-[11px] rounded-full border border-[#d4d4d4] hover:border-[#999] transition-colors">
              Request Access
            </Link>
          </div>
        </div>

        {/* ─── Hero Illustration ─── */}
        <div className="relative mt-16 max-w-[1100px] mx-auto h-[620px] z-10 pointer-events-none select-none overflow-hidden">
          
          {/* Organic green glow blobs */}
          <div className="absolute top-[35%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-[50%_60%_40%_70%] bg-[#ddf0e0] opacity-60 blur-[80px] z-0"></div>
          <div className="absolute top-[50%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[250px] rounded-[60%_40%_50%_60%] bg-[#c8e6cd] opacity-50 blur-[60px] z-0"></div>
          <div className="absolute top-[30%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[200px] h-[180px] rounded-[45%_55%_50%_50%] bg-[#b5debb] opacity-40 blur-[50px] z-0"></div>

          {/* Sweeping arc with chevron markers */}
          <svg className="absolute top-0 left-0 w-full h-[550px] z-10" viewBox="0 0 1100 550" fill="none">
            <defs>
              <path id="arcPath" d="M 80,520 C 200,180 400,30 550,25 C 700,20 900,180 1020,520" />
            </defs>
            <use href="#arcPath" fill="none" stroke="#d4d4d4" strokeWidth="1.2" />
            {/* Chevron markers */}
            <text fill="#bbb" fontSize="11" fontFamily="sans-serif" letterSpacing="3">
              <textPath href="#arcPath" startOffset="12%">› › ›</textPath>
            </text>
            <text fill="#bbb" fontSize="11" fontFamily="sans-serif" letterSpacing="3">
              <textPath href="#arcPath" startOffset="32%">› › ›</textPath>
            </text>
            <text fill="#bbb" fontSize="11" fontFamily="sans-serif" letterSpacing="3">
              <textPath href="#arcPath" startOffset="52%">› › ›</textPath>
            </text>
            <text fill="#bbb" fontSize="11" fontFamily="sans-serif" letterSpacing="3">
              <textPath href="#arcPath" startOffset="72%">› › ›</textPath>
            </text>
            <text fill="#bbb" fontSize="11" fontFamily="sans-serif" letterSpacing="3">
              <textPath href="#arcPath" startOffset="88%">› › ›</textPath>
            </text>
          </svg>

          {/* ─── Floating Pills (along the arc) ─── */}
          <div className="absolute top-[52%] left-[8%] z-20 px-4 py-1.5 bg-white rounded-lg shadow-[0_2px_12px_rgb(0,0,0,0.06)] border border-[#eee] text-[13px] font-normal text-[#555]">
            Talabat
          </div>
          <div className="absolute top-[10%] left-[50%] -translate-x-1/2 z-20 px-4 py-1.5 bg-white rounded-lg shadow-[0_2px_12px_rgb(0,0,0,0.06)] border border-[#eee] text-[13px] font-normal text-[#555]">
            Deliveroo
          </div>
          <div className="absolute top-[26%] left-[77%] z-20 px-4 py-1.5 bg-white rounded-lg shadow-[0_2px_12px_rgb(0,0,0,0.06)] border border-[#eee] text-[13px] font-normal text-[#555]">
            Cards
          </div>
          <div className="absolute top-[72%] left-[5%] z-20 px-4 py-1.5 bg-white rounded-lg shadow-[0_2px_12px_rgb(0,0,0,0.06)] border border-[#eee] text-[13px] font-normal text-[#555]">
            Marketplaces
          </div>

          {/* ─── Floating Card: Shopify (Top-Left) ─── */}
          <div className="absolute top-[16%] left-[18%] z-20 w-[210px] bg-white p-3 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-[#eee]">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#95bf47] flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">S</span>
                </div>
                <span className="font-semibold text-[12px] text-[#222]">Shopify</span>
              </div>
              <span className="text-[9px] text-[#aaa]">now</span>
            </div>
            <p className="text-[10px] text-[#777] leading-[1.5]">
              A new sale worth AED 400.00 has been recorded in your store.
            </p>
          </div>

          {/* ─── Floating Card: Amazon (Bottom-Left) ─── */}
          <div className="absolute top-[60%] left-[6%] z-20 w-[210px] bg-white p-3 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-[#eee]">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#222] flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">a</span>
                </div>
                <span className="font-semibold text-[12px] text-[#222]">Amazon</span>
              </div>
              <span className="text-[9px] text-[#aaa]">6m ago</span>
            </div>
            <p className="text-[10px] text-[#777] leading-[1.5]">
              A refund totaling AED 400.00 has been processed for a recent order.
            </p>
          </div>

          {/* ─── Floating Card: Shopify (Right) ─── */}
          <div className="absolute top-[40%] left-[78%] z-20 w-[210px] bg-white p-3 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-[#eee]">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#95bf47] flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">S</span>
                </div>
                <span className="font-semibold text-[12px] text-[#222]">Shopify</span>
              </div>
              <span className="text-[9px] text-[#aaa]">10m ago</span>
            </div>
            <p className="text-[10px] text-[#777] leading-[1.5]">
              A new sale worth AED 400.00 has been recorded in your store.
            </p>
          </div>

          {/* ─── Central Phone ─── */}
          <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[270px] z-30">
            <div className="bg-[#111] rounded-[36px] shadow-[0_20px_50px_rgb(0,0,0,0.2)] border-[5px] border-[#1a1a1a] overflow-hidden">
              
              {/* Status bar */}
              <div className="flex items-center justify-between px-6 pt-3 pb-1">
                <span className="text-[10px] text-white/80 font-medium">9:41</span>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] text-white/50">●●●</span>
                  <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                  <div className="w-5 h-2.5 border border-white/50 rounded-[3px] relative">
                    <div className="absolute inset-[1px] right-[2px] bg-white/70 rounded-[2px]"></div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="px-3 pb-3 flex flex-col gap-2.5">
                
                {/* Primary notification */}
                <div className="bg-[#1e1e1e] rounded-2xl p-3.5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2d5a3a]/30 via-transparent to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="w-3.5 h-3.5 bg-white/15 rounded"></div>
                      <span className="text-[9px] text-white/50 font-medium tracking-wide">MORROW AI</span>
                      <span className="text-[9px] text-white/30 ml-auto">now</span>
                    </div>
                    <h4 className="text-white text-[13px] font-semibold mb-0.5 leading-tight">Daily Close is ready!</h4>
                    <p className="text-white/60 text-[11px] leading-tight mb-3">
                      127 transactions: 4 mismatches<br/>AED 8,000 to explain.
                    </p>
                    <div className="flex gap-2">
                      <span className="flex-1 bg-[#3d6b4a] text-white text-[11px] font-medium py-2 rounded-full text-center">Reconcile Now</span>
                      <span className="flex-1 text-white/40 text-[11px] font-medium py-2 rounded-full border border-white/10 text-center">Not Now</span>
                    </div>
                  </div>
                </div>

                {/* Second notification */}
                <div className="bg-[#1e1e1e]/70 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-3.5 h-3.5 bg-white/10 rounded"></div>
                    <span className="text-[9px] text-white/30 font-medium tracking-wide">MORROW AI</span>
                    <span className="text-[9px] text-white/20 ml-auto">now</span>
                  </div>
                  <h4 className="text-white/70 text-[12px] font-semibold mb-0.5">3 Tabalat payouts need approval</h4>
                  <p className="text-white/40 text-[10px] leading-tight">AED 9310 net: 31 May - 9 Jun<br/>The 19 orders already tie out</p>
                </div>

                {/* Third notification */}
                <div className="bg-[#1e1e1e]/50 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-3.5 h-3.5 bg-white/5 rounded"></div>
                    <span className="text-[9px] text-white/20 font-medium tracking-wide">MORROW AI</span>
                    <span className="text-[9px] text-white/15 ml-auto">now</span>
                  </div>
                  <h4 className="text-white/50 text-[12px] font-semibold mb-0.5">Refund request</h4>
                  <p className="text-white/30 text-[10px] leading-tight">Customer on whatsapp wrong item<br/>delivered. AED 145 · confirm refund?</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#fafafa] via-[#fafafa]/80 to-transparent z-40"></div>
        </div>
      </section>

      {/* Social Proof / Trusted By */}
      <section className="border-y border-slate-100/50 bg-slate-50/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Aggregating RFPs from East Africa's top procurement portals
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-24 text-slate-400">
            <div className="flex items-center gap-2.5 hover:text-slate-600 transition-colors grayscale hover:grayscale-0 opacity-70 hover:opacity-100">
              <Globe className="w-5 h-5" /> <span className="font-bold text-lg tracking-tight">PPDA Uganda</span>
            </div>
            <div className="flex items-center gap-2.5 hover:text-slate-600 transition-colors grayscale hover:grayscale-0 opacity-70 hover:opacity-100">
              <Building2 className="w-5 h-5" /> <span className="font-bold text-lg tracking-tight">PPOA Kenya</span>
            </div>
            <div className="flex items-center gap-2.5 hover:text-slate-600 transition-colors grayscale hover:grayscale-0 opacity-70 hover:opacity-100">
              <ShieldCheck className="w-5 h-5" /> <span className="font-bold text-lg tracking-tight">RPPA Rwanda</span>
            </div>
            <div className="flex items-center gap-2.5 hover:text-slate-600 transition-colors grayscale hover:grayscale-0 opacity-70 hover:opacity-100">
              <Briefcase className="w-5 h-5" /> <span className="font-bold text-lg tracking-tight">DevEx</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Connect your business. <br className="hidden md:block"/> Win more contracts.
            </h2>
            <p className="text-lg text-slate-500 font-light">
              Run opportunity identification, capture development, pricing, and proposals in one unified platform designed for East African GovCon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-8 group-hover:-translate-y-1 transition-transform duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.05)] ring-1 ring-slate-900/5 text-slate-800">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Discover</h3>
              <p className="text-slate-500 text-sm leading-relaxed">We scrape 15+ portals daily. Never manually check PPDA, newspapers, or agency sites again. Define your parameters and let opportunities come to you.</p>
            </div>
            
            <div className="group bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-8 group-hover:-translate-y-1 transition-transform duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.05)] ring-1 ring-slate-900/5 text-slate-800">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Capture & Analyze</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Our AI extracts tech stacks, budget tiers, and calculates a match confidence score. Qualify bids in seconds, not hours.</p>
            </div>
            
            <div className="group bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-8 group-hover:-translate-y-1 transition-transform duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.05)] ring-1 ring-slate-900/5 text-slate-800">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Track & Propose</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Get instant alerts via email when highly relevant RFPs are posted. Save, assign to team members, and manage your bidding pipeline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution Image-text block */}
      <section className="py-32 bg-slate-50/50 border-y border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                The Operating System for <br/> East African GovCon
              </h2>
              <p className="text-slate-500 mb-10 text-lg font-light leading-relaxed">
                Stop managing your pipeline in fragmented spreadsheets and disconnected SharePoint folders. Cogpite brings your entire capture process into one secure, intelligent environment.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white shadow-[0_4px_14px_rgb(0,0,0,0.04)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">Single Source of Truth</h4>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">All East African tenders in one unified, searchable dashboard.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white shadow-[0_4px_14px_rgb(0,0,0,0.04)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">AI Extraction</h4>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">We parse the PDFs instantly and show you the budget, stack, and complexity at a glance.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white shadow-[0_4px_14px_rgb(0,0,0,0.04)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">Real-Time Alerts</h4>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">Get notified the moment a contract matching your exact criteria is published.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="rounded-2xl bg-white p-2 shadow-[0_20px_50px_rgb(0,0,0,0.06)] relative ring-1 ring-slate-900/5">
               <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-white opacity-50 z-0"></div>
               <div className="rounded-xl overflow-hidden relative z-10 bg-white ring-1 ring-slate-900/5 shadow-sm">
                 <img src="/screenshots/dashboard-detail.png" alt="Cogpite Details" className="w-full block" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Trusted by Forward-Thinking IT Firms</h2>
            <p className="text-slate-500 text-lg font-light">See what our partners are achieving.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]">
              <p className="text-base text-slate-700 mb-8 leading-relaxed font-medium">
                "Before Cogpite, we were missing about 60% of the relevant government IT tenders in Uganda because we couldn't check every district website. Now, we get an email as soon as a Next.js/React project is posted. It's paid for itself 100x."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full shadow-[0_4px_14px_rgb(0,0,0,0.06)] ring-1 ring-slate-900/5 flex items-center justify-center text-slate-900 font-bold text-sm tracking-tight">DM</div>
                <div>
                  <h4 className="text-slate-900 font-bold text-sm tracking-tight">David M.</h4>
                  <p className="text-xs text-slate-500">CTO, Kampala Solutions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]">
              <p className="text-base text-slate-700 mb-8 leading-relaxed font-medium">
                "The AI extraction is magic. Instead of downloading a 100-page PPOA tender document just to find out the budget is too small for us, Cogpite tells us instantly that it's a Tier 1 budget with Java backend requirements. Unbelievable time saver."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full shadow-[0_4px_14px_rgb(0,0,0,0.06)] ring-1 ring-slate-900/5 flex items-center justify-center text-slate-900 font-bold text-sm tracking-tight">SK</div>
                <div>
                  <h4 className="text-slate-900 font-bold text-sm tracking-tight">Sarah K.</h4>
                  <p className="text-xs text-slate-500">BD Manager, Nairobi Tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 bg-white border-t border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-500 font-light">Choose the plan that fits your firm's ambition.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
            {/* Free Tier */}
            <div className="bg-white rounded-3xl p-10 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-300 ring-1 ring-slate-900/5">
              <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Local Scout</h3>
              <p className="text-slate-500 text-sm mb-8">For small firms getting started.</p>
              <div className="text-5xl font-extrabold text-slate-900 mb-8 tracking-tighter"><span className="text-lg font-medium text-slate-400 tracking-normal">/mo</span></div>
              
              <ul className="space-y-4 mb-10 flex-1 text-sm">
                <li className="flex items-center gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-slate-300" /> Basic RFP Search
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-slate-300" /> 1 Country Coverage (e.g. Uganda)
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-slate-300" /> Standard Filters (Budget & Date)
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <span className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-[10px] text-slate-300 ring-1 ring-slate-200/50">-</span> No AI Extraction
                </li>
              </ul>
              
              <Link href="/signup" className="block w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 text-center font-semibold rounded-full transition-all shadow-[0_4px_14px_rgb(0,0,0,0.05)] ring-1 ring-slate-900/5 hover:shadow-[0_6px_20px_rgb(0,0,0,0.08)]">
                Start Free
              </Link>
            </div>
            
            {/* Paid Tier */}
            <div className="bg-slate-900 rounded-3xl p-10 flex flex-col relative shadow-[0_20px_50px_rgba(15,23,42,0.3)] md:scale-105 z-10">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-blue-500 text-white px-4 py-1 text-xs font-bold rounded-full uppercase tracking-widest shadow-sm">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Enterprise Hunter</h3>
              <p className="text-slate-400 text-sm mb-8">For aggressive growth across East Africa.</p>
              <div className="text-5xl font-extrabold text-white mb-8 tracking-tighter"><span className="text-lg font-medium text-slate-500 tracking-normal">/mo</span></div>
              
              <ul className="space-y-4 mb-10 flex-1 text-sm">
                <li className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" /> Everything in Local Scout
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" /> All East African Portals
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" /> AI Tech Stack Extraction
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" /> Real-time Email & Webhook Alerts
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" /> Team Collaboration (Up to 5)
                </li>
              </ul>
              
              <Link href="/signup?plan=enterprise" className="block w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 text-center font-semibold rounded-full transition-all shadow-[0_4px_14px_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.15)]">
                Upgrade to Hunter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#fafafa] border-t border-slate-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Ready to Win More Contracts?</h2>
          <p className="text-lg text-slate-500 mb-10 font-light">
            Join the smartest ICT firms in East Africa automating their procurement pipeline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-full transition-all shadow-[0_4px_14px_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.15)]">
              Create Your Free Account
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-medium rounded-full transition-all shadow-[0_4px_14px_rgb(0,0,0,0.05)] ring-1 ring-slate-900/5 hover:shadow-[0_6px_20px_rgb(0,0,0,0.08)]">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100/50 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-full border-[3px] border-[#6b8f71]"></div>
                <span className="text-xl font-normal text-slate-900 tracking-tight">Cogpite</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                The ultimate procurement intelligence platform for ICT firms in East Africa.
              </p>
            </div>
            
            <div>
              <h4 className="text-slate-900 font-bold mb-6 text-sm tracking-tight">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#features" className="hover:text-slate-900 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a></li>
                <li><Link href="/login" className="hover:text-slate-900 transition-colors">Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-slate-900 font-bold mb-6 text-sm tracking-tight">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Gov Tender Guide</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">API Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-slate-900 font-bold mb-6 text-sm tracking-tight">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-900 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Cogpite. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-medium text-slate-400">
              <span className="hover:text-slate-900 cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-slate-900 cursor-pointer transition-colors">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
