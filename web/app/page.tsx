import React from "react";
import Link from "next/link";
import { 
  Search, 
  Bell, 
  BarChart, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Building2, 
  Zap, 
  Briefcase
} from "lucide-react";
import "./landing.css";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-200 font-sans selection:bg-blue-600/30">
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
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "128"
            }
          })
        }}
      />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Cogpite</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-300 hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">Pricing</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/30 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Now tracking PPDA, PPOA, and RPPA portals in real-time
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 animate-fade-up delay-100 leading-[1.1]">
            Win More Government <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 text-glow">
              ICT Tenders
            </span> in East Africa
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto mb-10 animate-fade-up delay-200">
            Cogpite aggregates, analyzes, and alerts you to relevant RFPs across Uganda, Kenya, Rwanda, and Tanzania. Stop missing opportunities hidden deep in complex government portals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
            <form className="relative w-full max-w-md flex items-center">
              <input 
                type="email" 
                placeholder="Enter your work email" 
                className="w-full bg-[#0d1424] border border-white/10 rounded-full py-4 pl-6 pr-36 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-6 transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
          <p className="mt-4 text-sm text-slate-500 animate-fade-up delay-400">14-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="border-y border-white/5 bg-[#0d1424]/50 py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-400 mb-8 uppercase tracking-widest">
            Aggregating RFPs from East Africa's top procurement portals
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6" /> <span className="font-semibold text-lg">PPDA Uganda</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6" /> <span className="font-semibold text-lg">PPOA Kenya</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" /> <span className="font-semibold text-lg">RPPA Rwanda</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6" /> <span className="font-semibold text-lg">DevEx</span>
            </div>
          </div>
        </div>
      </section>

      {/* Macro Stats */}
      <section className="py-20 bg-[#0a0f1a] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="py-6">
              <div className="text-4xl font-mono font-bold text-white mb-2">500+</div>
              <div className="text-slate-400">New RFPs Scraped Weekly</div>
            </div>
            <div className="py-6">
              <div className="text-4xl font-mono font-bold text-white mb-2">5</div>
              <div className="text-slate-400">Countries Covered</div>
            </div>
            <div className="py-6">
              <div className="text-4xl font-mono font-bold text-white mb-2">94%</div>
              <div className="text-slate-400">AI Match Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase / Dashboard Preview */}
      <section id="features" className="py-24 bg-gradient-mesh relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              The Complete RFP Lifecycle
            </h2>
            <p className="text-lg text-slate-400">
              From finding hidden opportunities to organizing your bid team, Cogpite gives you an unfair advantage in government procurement.
            </p>
          </div>

          <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-2 sm:p-4 shadow-2xl relative">
            <div className="absolute -inset-1 bg-gradient-to-b from-blue-600 to-emerald-600 rounded-2xl blur opacity-20 -z-10"></div>
            {/* Using a placeholder or actual image for the dashboard screenshot */}
            <div className="aspect-[16/9] w-full bg-[#0a0f1a] rounded-xl overflow-hidden border border-white/5 relative group flex items-center justify-center">
              {/* Fallback to mock UI if image fails or isn't placed yet */}
              <div className="absolute inset-0 bg-[url('/screenshots/dashboard.png')] bg-cover bg-center bg-no-repeat opacity-80 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 bg-slate-900/80 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-2xl flex flex-col items-center max-w-md text-center">
                <BarChart className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Intelligent Dashboard</h3>
                <p className="text-sm text-slate-300">Filter by budget, complexity, and tech stack. Let our AI highlight the RFPs you have the highest probability of winning.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-[#0d1424]/50 border border-white/5 rounded-xl p-8 hover:bg-[#0d1424] transition-colors">
              <div className="w-12 h-12 bg-blue-900/30 text-blue-400 rounded-lg flex items-center justify-center mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Discover</h3>
              <p className="text-slate-400">We scrape 15+ portals daily. Never manually check PPDA, newspapers, or agency sites again.</p>
            </div>
            
            <div className="bg-[#0d1424]/50 border border-white/5 rounded-xl p-8 hover:bg-[#0d1424] transition-colors">
              <div className="w-12 h-12 bg-emerald-900/30 text-emerald-400 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Analyze</h3>
              <p className="text-slate-400">Our AI extracts tech stacks, budget tiers (Small to Enterprise), and calculates a match confidence score.</p>
            </div>
            
            <div className="bg-[#0d1424]/50 border border-white/5 rounded-xl p-8 hover:bg-[#0d1424] transition-colors">
              <div className="w-12 h-12 bg-purple-900/30 text-purple-400 rounded-lg flex items-center justify-center mb-6">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Track</h3>
              <p className="text-slate-400">Get instant alerts via email or webhook when highly relevant RFPs are posted. Save and collaborate with your team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-24 bg-[#0a0f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                The Old Way is Costing You Millions in Lost Contracts
              </h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-900/30 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">✕</div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Scattered Portals</h4>
                    <p className="text-slate-400 mt-1">Your team wastes hours checking dozens of confusing government sites every week.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-900/30 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">✕</div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Buried Requirements</h4>
                    <p className="text-slate-400 mt-1">You download 50-page PDFs just to realize the tech stack doesn't match your expertise.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-900/30 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">✕</div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Missed Deadlines</h4>
                    <p className="text-slate-400 mt-1">By the time you find a great RFP, it's too late to put together a winning bid.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-8 lg:p-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px]"></div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-6">The Cogpite Solution</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">Single Source of Truth</h4>
                    <p className="text-slate-400 mt-1">All East African tenders in one unified, searchable dashboard.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">AI Extraction</h4>
                    <p className="text-slate-400 mt-1">We parse the PDFs instantly and show you the budget, stack, and complexity at a glance.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">Real-Time Alerts</h4>
                    <p className="text-slate-400 mt-1">Get notified the moment a contract matching your exact criteria is published.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-[#0d1424] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">How Cogpite Works</h2>
            <p className="text-lg text-slate-400">Three simple steps to supercharge your procurement pipeline.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Define Your Profile</h3>
              <p className="text-slate-400">Set your target countries (e.g., Uganda, Kenya), preferred budget tiers, and technology stacks.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center mt-8 md:mt-0">
              <div className="w-16 h-16 rounded-2xl bg-[#0a0f1a] border border-blue-500 text-blue-400 flex items-center justify-center text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Matches Tenders</h3>
              <p className="text-slate-400">Our scrapers work 24/7. AI analyzes every document and scores its relevance to your profile.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center mt-8 md:mt-0">
              <div className="w-16 h-16 rounded-2xl bg-[#0a0f1a] border border-blue-500 text-blue-400 flex items-center justify-center text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Review & Bid</h3>
              <p className="text-slate-400">Receive alerts, collaborate with your team on the dashboard, and focus purely on writing the winning proposal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#0a0f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Trusted by Forward-Thinking IT Firms</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-8">
              <div className="flex gap-1 text-yellow-400 mb-6">
                ★ ★ ★ ★ ★
              </div>
              <p className="text-lg text-slate-300 italic mb-8">
                "Before Cogpite, we were missing about 60% of the relevant government IT tenders in Uganda because we just couldn't check every district website. Now, we get an email as soon as a Next.js/React project is posted. It's paid for itself 100x."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold">DM</div>
                <div>
                  <h4 className="text-white font-semibold">David M.</h4>
                  <p className="text-sm text-slate-500">CTO, Kampala Solutions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-8">
              <div className="flex gap-1 text-yellow-400 mb-6">
                ★ ★ ★ ★ ★
              </div>
              <p className="text-lg text-slate-300 italic mb-8">
                "The AI extraction is magic. Instead of downloading a 100-page PPOA tender document just to find out the budget is too small for us, Cogpite tells us instantly that it's a Tier 1 budget with Java backend requirements. Unbelievable time saver."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold">SK</div>
                <div>
                  <h4 className="text-white font-semibold">Sarah K.</h4>
                  <p className="text-sm text-slate-500">BD Manager, Nairobi Tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gradient-mesh relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-400">Choose the plan that fits your firm's ambition.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-[#0a0f1a] border border-white/10 rounded-3xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Local Scout</h3>
              <p className="text-slate-400 mb-6">For small firms getting started.</p>
              <div className="text-4xl font-extrabold text-white mb-8">$0<span className="text-xl font-normal text-slate-500">/mo</span></div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" /> Basic RFP Search
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" /> 1 Country Coverage (e.g. Uganda)
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" /> Standard Filters (Budget & Date)
                </li>
                <li className="flex items-center gap-3 text-slate-500">
                  <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center flex-shrink-0 text-xs">-</span> No AI Extraction
                </li>
              </ul>
              
              <Link href="/signup" className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-center font-semibold rounded-xl transition-colors">
                Start Free
              </Link>
            </div>
            
            {/* Paid Tier */}
            <div className="bg-[#0d1424] border border-blue-500/50 rounded-3xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(37,99,235,0.15)]">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 text-sm font-semibold rounded-full">Most Popular</div>
              <h3 className="text-2xl font-bold text-blue-400 mb-2">Enterprise Hunter</h3>
              <p className="text-slate-400 mb-6">For aggressive growth across East Africa.</p>
              <div className="text-4xl font-extrabold text-white mb-8">$99<span className="text-xl font-normal text-slate-500">/mo</span></div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" /> Everything in Local Scout
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> All East African Portals
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> AI Tech Stack Extraction
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Real-time Email & Webhook Alerts
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Team Collaboration (Up to 5)
                </li>
              </ul>
              
              <Link href="/signup?plan=enterprise" className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                Upgrade to Hunter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#0a0f1a] border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-400">Everything you need to know about Cogpite.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
              <h4 className="text-xl font-semibold text-white mb-3">Which countries does Cogpite cover?</h4>
              <p className="text-slate-400">Currently, Cogpite monitors government portals in Uganda (PPDA), Kenya (PPOA), Rwanda (RPPA), and Tanzania. We are continuously adding new municipal and regional agency portals within these countries.</p>
            </div>
            
            <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
              <h4 className="text-xl font-semibold text-white mb-3">How accurate is the AI extraction?</h4>
              <p className="text-slate-400">Our custom models achieve a 94% accuracy rate in extracting technology stacks, determining budget tiers, and summarizing project scopes, saving you hours of reading through heavy PDF documentation.</p>
            </div>
            
            <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
              <h4 className="text-xl font-semibold text-white mb-3">Can I get alerted via WhatsApp?</h4>
              <p className="text-slate-400">Currently, we support email and custom Webhook alerts. Webhook integrations can be used to forward alerts to Slack, Discord, or custom internal systems. WhatsApp support is coming in Q3.</p>
            </div>
            
            <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
              <h4 className="text-xl font-semibold text-white mb-3">Do you write the proposals for us?</h4>
              <p className="text-slate-400">No, Cogpite is a procurement intelligence platform. We find, organize, and analyze the RFPs so your business development team can focus 100% of their time on writing winning proposals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-900/20 border-t border-blue-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(37,99,235,0.05)_1px,_transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Win More Contracts?</h2>
          <p className="text-xl text-blue-200 mb-10">
            Join the smartest ICT firms in East Africa automating their procurement pipeline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              Create Your Free Account
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full text-lg transition-all">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050810] border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Cogpite</span>
              </div>
              <p className="text-sm text-slate-500">
                The ultimate procurement intelligence platform for ICT firms in East Africa.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-blue-400">Features</a></li>
                <li><a href="#pricing" className="hover:text-blue-400">Pricing</a></li>
                <li><Link href="/login" className="hover:text-blue-400">Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400">Gov Tender Guide</a></li>
                <li><a href="#" className="hover:text-blue-400">API Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Cogpite. All rights reserved.
            </p>
            <div className="flex gap-4 text-slate-500">
              {/* Social icons placeholder */}
              <span className="hover:text-white cursor-pointer">Twitter</span>
              <span className="hover:text-white cursor-pointer">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}