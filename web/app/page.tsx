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
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border-4 border-[#8ba38d] bg-transparent"></div>
            <span className="text-xl font-medium text-slate-900 tracking-tight">Cogpite</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            <a href="#platform" className="text-[15px] font-medium text-slate-800 hover:text-black transition-colors">Platform</a>
            <a href="#solutions" className="text-[15px] font-medium text-slate-800 hover:text-black transition-colors">Solutions</a>
            <a href="#pricing" className="text-[15px] font-medium text-slate-800 hover:text-black transition-colors">Pricing</a>
            <Link href="/login" className="text-[15px] font-medium text-slate-800 hover:text-black transition-colors">
              Sign In
            </Link>
          </nav>
          
          <div className="w-24 hidden md:block"></div> {/* Spacer for centering nav */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-[22vh] pb-8 overflow-hidden bg-white">
        
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
          <h1 className="text-[42px] md:text-[58px] lg:text-[72px] font-light text-[#111] leading-[1.08] tracking-[-0.02em] mb-5">
            Know exactly which<br className="hidden md:block" />
            tenders match you.
          </h1>
          
          <p className="text-[16px] md:text-[18px] font-light text-[#888] max-w-[520px] mx-auto mb-10 leading-[1.6]">
            Know exactly where your next bid is. Get a clearer pipeline<br className="hidden md:block" />
            and spend less time chasing what still needs your attention.
          </p>
          
          <div className="flex items-center justify-center gap-3">
            <Link href="/signup" className="bg-[#111] text-white font-normal text-[15px] px-7 py-3 rounded-full hover:bg-black transition-colors">
              Start Your Free Trial
            </Link>
            <Link href="/demo" className="bg-white text-[#111] font-normal text-[15px] px-7 py-3 rounded-full border border-[#d4d4d4] hover:border-[#999] transition-colors">
              Request Access
            </Link>
          </div>
        </div>

        {/* Hero Graphic (Glassmorphism & Glowing Green) */}
        <div className="relative mt-24 max-w-5xl mx-auto h-[600px] z-10 animate-fade-up delay-300 pointer-events-none select-none">
          
          {/* Soft Green Glow (Squashed Ellipse) */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#e6f4ea] blur-[60px] rounded-[100%] z-0"></div>
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#c3ead0] blur-[40px] rounded-[100%] z-0"></div>

          {/* Sweeping Arc Line */}
          <svg className="absolute top-0 left-0 w-full h-[500px] z-10 opacity-40" viewBox="0 0 1000 500">
            <path 
              d="M 50,450 A 450 250 0 0 1 950,450" 
              fill="none" 
              stroke="#cbd5e1" 
              strokeWidth="1.5" 
            />
          </svg>

          {/* Floating Arc Pills (Positioned along the SVG arc) */}
          <div className="absolute top-[35%] left-[9%] -translate-y-1/2 -translate-x-1/2 z-20 px-5 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-slate-100 text-[13px] font-medium text-slate-700">
            Talabat
          </div>
          <div className="absolute top-[8%] left-[50%] -translate-y-1/2 -translate-x-1/2 z-20 px-5 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-slate-100 text-[13px] font-medium text-slate-700">
            Deliveroo
          </div>
          <div className="absolute top-[35%] left-[88%] -translate-y-1/2 -translate-x-1/2 z-20 px-5 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-slate-100 text-[13px] font-medium text-slate-700">
            Cards
          </div>
          <div className="absolute top-[75%] left-[92%] -translate-y-1/2 -translate-x-1/2 z-20 px-5 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-slate-100 text-[13px] font-medium text-slate-700">
            Marketplaces
          </div>

          {/* Floating Detail Card 1 (Left) */}
          <div className="absolute top-[60%] left-[12%] -translate-y-1/2 -translate-x-1/2 z-20 w-[240px] bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-[0_15px_40px_rgb(0,0,0,0.06)] border border-slate-100">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">a</span>
                </div>
                <span className="font-semibold text-[13px] text-slate-900">Amazon</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">6m ago</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              A refund totaling AED 400.00 has been processed for a recent order.
            </p>
          </div>

          {/* Floating Detail Card 2 (Right) */}
          <div className="absolute top-[48%] left-[82%] -translate-y-1/2 -translate-x-1/2 z-20 w-[240px] bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-[0_15px_40px_rgb(0,0,0,0.06)] border border-slate-100">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#2c9f52] flex items-center justify-center">
                  <span className="text-[12px] font-bold text-white">S</span>
                </div>
                <span className="font-semibold text-[13px] text-slate-900">Shopify</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">10m ago</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              A new sale worth AED 400.00 has been recorded in your store.
            </p>
          </div>
          
          {/* Floating Detail Card 3 (Top Left) */}
          <div className="absolute top-[22%] left-[25%] -translate-y-1/2 -translate-x-1/2 z-20 w-[240px] bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-[0_15px_40px_rgb(0,0,0,0.06)] border border-slate-100">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#2c9f52] flex items-center justify-center">
                  <span className="text-[12px] font-bold text-white">S</span>
                </div>
                <span className="font-semibold text-[13px] text-slate-900">Shopify</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">now</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              A new sale worth AED 400.00 has been recorded in your store.
            </p>
          </div>

          {/* Central Phone Mockup */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[300px] h-[550px] z-30">
            
            {/* Phone Hardware Shell */}
            <div className="absolute inset-0 bg-[#0d0d0d] rounded-[48px] shadow-[0_30px_60px_rgb(0,0,0,0.15)] ring-4 ring-[#1f1f1f] ring-offset-4 ring-offset-white border-[6px] border-black overflow-hidden relative">
              
              {/* Screen Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-[18px] z-40"></div>
              
              {/* Screen Status Bar */}
              <div className="absolute top-2 left-6 text-[10px] text-white/90 font-medium z-40">9:41</div>
              <div className="absolute top-2 right-6 flex gap-1 items-center z-40">
                <div className="w-3 h-2.5 bg-white/90 rounded-[2px]"></div> {/* Battery icon sim */}
              </div>

              {/* Phone Content / Notifications */}
              <div className="pt-16 px-4 flex flex-col gap-3">
                
                {/* Active Notification */}
                <div className="bg-[#222] rounded-[18px] p-4 relative overflow-hidden border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#3a6646]/40 via-transparent to-transparent"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-4 h-4 bg-white/20 rounded-[4px]"></div>
                      <span className="text-[10px] text-white/60 font-medium tracking-wide">MORROW AI</span>
                      <span className="text-[10px] text-white/40 ml-auto font-medium">now</span>
                    </div>
                    <h4 className="text-white text-[15px] font-semibold mb-1 leading-tight">Daily Close is ready!</h4>
                    <p className="text-white/70 text-[13px] leading-tight mb-4">
                      127 transactions: 4 mismatches<br/>
                      AED 8,000 to explain.
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-[#4d7b5b] hover:bg-[#5b8a6a] text-white text-[13px] font-medium py-2.5 rounded-full transition-colors border border-white/10">Reconcile Now</button>
                      <button className="flex-1 bg-transparent text-white/50 text-[13px] font-medium py-2.5 rounded-full border border-white/10">Not Now</button>
                    </div>
                  </div>
                </div>

                {/* Faded Notification 1 */}
                <div className="bg-[#222]/80 rounded-[18px] p-4 border border-white/5 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-white/10 rounded-[4px]"></div>
                    <span className="text-[10px] text-white/40 font-medium tracking-wide">MORROW AI</span>
                    <span className="text-[10px] text-white/30 ml-auto font-medium">now</span>
                  </div>
                  <h4 className="text-white/80 text-[14px] font-semibold mb-1">3 Tabalat payouts need approval</h4>
                  <p className="text-white/50 text-[12px] leading-tight">
                    AED 9310 net: 31 May - 9 Jun<br/>
                    The 19 orders already tie out
                  </p>
                </div>
                
                {/* Faded Notification 2 */}
                <div className="bg-[#222]/60 rounded-[18px] p-4 border border-white/5 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-white/10 rounded-[4px]"></div>
                    <span className="text-[10px] text-white/30 font-medium tracking-wide">MORROW AI</span>
                    <span className="text-[10px] text-white/20 ml-auto font-medium">now</span>
                  </div>
                  <h4 className="text-white/60 text-[14px] font-semibold mb-1">Refund request</h4>
                  <p className="text-white/40 text-[12px] leading-tight">
                    Customer on whatsapp wrong item<br/>
                    delivered. AED 145, confirm refund?
                  </p>
                </div>

              </div>
            </div>

            {/* Hardware Buttons */}
            <div className="absolute top-[120px] -left-[14px] w-[6px] h-[25px] bg-[#1a1a1a] rounded-l-md border border-[#333] border-r-0 z-10"></div>
            <div className="absolute top-[160px] -left-[14px] w-[6px] h-[50px] bg-[#1a1a1a] rounded-l-md border border-[#333] border-r-0 z-10"></div>
            <div className="absolute top-[220px] -left-[14px] w-[6px] h-[50px] bg-[#1a1a1a] rounded-l-md border border-[#333] border-r-0 z-10"></div>
            <div className="absolute top-[180px] -right-[14px] w-[6px] h-[70px] bg-[#1a1a1a] rounded-r-md border border-[#333] border-l-0 z-10"></div>
            
            {/* White Fade Gradient covering the bottom half */}
            <div className="absolute -bottom-10 left-[-50px] right-[-50px] h-[300px] bg-gradient-to-t from-white via-white to-transparent z-50 pointer-events-none"></div>

          </div>
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
                <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center shadow-sm">
                  <Search className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">Cogpite</span>
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
