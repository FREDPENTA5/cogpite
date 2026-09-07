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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
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
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Cogpite</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Platform</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Solutions</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md transition-colors shadow-sm">
              Book a Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-[4rem] font-extrabold text-slate-900 tracking-tight mb-6 animate-fade-up leading-[1.05] max-w-4xl mx-auto">
            AI infrastructure to win <br className="hidden lg:block" />
            government ICT contracts
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 animate-fade-up delay-100 leading-relaxed">
            Accelerate BD, capture, and proposals. Top East African ICT firms use Cogpite to track portals like PPDA, PPOA, and RPPA in real-time, discovering and winning more public sector bids.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up delay-300">
            <form className="relative w-full max-w-md flex items-center">
              <input 
                type="email" 
                placeholder="you@company.com" 
                className="w-full bg-white border border-slate-300 rounded-md py-3 pl-4 pr-32 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm"
                required
              />
              <button 
                type="submit" 
                className="absolute right-1 top-1 bottom-1 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded text-sm px-4 transition-colors flex items-center gap-2"
              >
                Book a demo
              </button>
            </form>
          </div>
          <p className="mt-4 text-xs text-slate-500 animate-fade-up delay-400">Join 300+ teams winning billions with Cogpite.</p>
        </div>
      </section>

      {/* Hero Product Image */}
      <section className="pb-20 relative">
        <div className="absolute inset-0 top-1/2 bg-white z-0"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-up delay-500">
          <div className="rounded-xl border border-slate-200/60 bg-white shadow-2xl p-2 overflow-hidden">
             <div className="rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
               <img src="/screenshots/dashboard.png" alt="Cogpite Dashboard" className="w-full h-auto block" />
             </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Trusted By */}
      <section className="border-y border-slate-200 bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-500 mb-8">
            Aggregating RFPs from East Africa's top procurement portals
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-20 text-slate-400">
            <div className="flex items-center gap-2 hover:text-slate-600 transition-colors">
              <Globe className="w-5 h-5" /> <span className="font-semibold text-lg tracking-tight">PPDA Uganda</span>
            </div>
            <div className="flex items-center gap-2 hover:text-slate-600 transition-colors">
              <Building2 className="w-5 h-5" /> <span className="font-semibold text-lg tracking-tight">PPOA Kenya</span>
            </div>
            <div className="flex items-center gap-2 hover:text-slate-600 transition-colors">
              <ShieldCheck className="w-5 h-5" /> <span className="font-semibold text-lg tracking-tight">RPPA Rwanda</span>
            </div>
            <div className="flex items-center gap-2 hover:text-slate-600 transition-colors">
              <Briefcase className="w-5 h-5" /> <span className="font-semibold text-lg tracking-tight">DevEx</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Connect your business. Win more contracts.
            </h2>
            <p className="text-lg text-slate-600">
              Run opportunity identification, capture development, pricing, and proposals in one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-slate-900 rounded-lg flex items-center justify-center mb-6">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Discover</h3>
              <p className="text-slate-600 text-sm leading-relaxed">We scrape 15+ portals daily. Never manually check PPDA, newspapers, or agency sites again. Define your parameters and let opportunities come to you.</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-slate-900 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Capture & Analyze</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Our AI extracts tech stacks, budget tiers, and calculates a match confidence score. Qualify bids in seconds, not hours.</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-slate-900 rounded-lg flex items-center justify-center mb-6">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Track & Propose</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Get instant alerts via email when highly relevant RFPs are posted. Save, assign to team members, and manage your bidding pipeline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution Image-text block */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">
                The Operating System for GovCon
              </h2>
              <p className="text-slate-600 mb-8 text-lg">
                Stop managing your pipeline in fragmented spreadsheets and disconnected SharePoint folders. Cogpite brings your entire capture process into one secure, intelligent environment.
              </p>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">Single Source of Truth</h4>
                    <p className="text-slate-600 text-sm mt-1">All East African tenders in one unified, searchable dashboard.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">AI Extraction</h4>
                    <p className="text-slate-600 text-sm mt-1">We parse the PDFs instantly and show you the budget, stack, and complexity at a glance.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">Real-Time Alerts</h4>
                    <p className="text-slate-600 text-sm mt-1">Get notified the moment a contract matching your exact criteria is published.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
               <div className="rounded-lg border border-slate-100 overflow-hidden">
                 <img src="/screenshots/dashboard-detail.png" alt="Cogpite Details" className="w-full block" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Trusted by Forward-Thinking IT Firms</h2>
            <p className="text-slate-600">See what our partners are achieving.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <p className="text-base text-slate-700 mb-6 leading-relaxed">
                "Before Cogpite, we were missing about 60% of the relevant government IT tenders in Uganda because we couldn't check every district website. Now, we get an email as soon as a Next.js/React project is posted. It's paid for itself 100x."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">DM</div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">David M.</h4>
                  <p className="text-xs text-slate-500">CTO, Kampala Solutions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <p className="text-base text-slate-700 mb-6 leading-relaxed">
                "The AI extraction is magic. Instead of downloading a 100-page PPOA tender document just to find out the budget is too small for us, Cogpite tells us instantly that it's a Tier 1 budget with Java backend requirements. Unbelievable time saver."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">SK</div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">Sarah K.</h4>
                  <p className="text-xs text-slate-500">BD Manager, Nairobi Tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-600">Choose the plan that fits your firm's ambition.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Local Scout</h3>
              <p className="text-slate-500 text-sm mb-6">For small firms getting started.</p>
              <div className="text-4xl font-extrabold text-slate-900 mb-8"><span className="text-lg font-medium text-slate-500">/mo</span></div>
              
              <ul className="space-y-4 mb-8 flex-1 text-sm">
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-slate-900" /> Basic RFP Search
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-slate-900" /> 1 Country Coverage (e.g. Uganda)
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-slate-900" /> Standard Filters (Budget & Date)
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0 text-[10px]">-</span> No AI Extraction
                </li>
              </ul>
              
              <Link href="/signup" className="block w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 text-center text-sm font-medium rounded-md transition-colors shadow-sm">
                Start Free
              </Link>
            </div>
            
            {/* Paid Tier */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col relative shadow-xl">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white px-3 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-bold text-white mb-2">Enterprise Hunter</h3>
              <p className="text-slate-400 text-sm mb-6">For aggressive growth across East Africa.</p>
              <div className="text-4xl font-extrabold text-white mb-8"><span className="text-lg font-medium text-slate-500">/mo</span></div>
              
              <ul className="space-y-4 mb-8 flex-1 text-sm">
                <li className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Everything in Local Scout
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> All East African Portals
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> AI Tech Stack Extraction
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Real-time Email & Webhook Alerts
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Team Collaboration (Up to 5)
                </li>
              </ul>
              
              <Link href="/signup?plan=enterprise" className="block w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 text-center text-sm font-semibold rounded-md transition-colors shadow-sm">
                Upgrade to Hunter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Ready to Win More Contracts?</h2>
          <p className="text-lg text-slate-600 mb-10">
            Join the smartest ICT firms in East Africa automating their procurement pipeline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md text-sm transition-colors shadow-sm">
              Create Your Free Account
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-medium rounded-md text-sm transition-colors shadow-sm">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center">
                  <Search className="w-3 h-3 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">Cogpite</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                The ultimate procurement intelligence platform for ICT firms in East Africa.
              </p>
            </div>
            
            <div>
              <h4 className="text-slate-900 font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#features" className="hover:text-slate-900 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a></li>
                <li><Link href="/login" className="hover:text-slate-900 transition-colors">Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-slate-900 font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Gov Tender Guide</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">API Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-slate-900 font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-900 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Cogpite. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-medium text-slate-500">
              <span className="hover:text-slate-900 cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-slate-900 cursor-pointer transition-colors">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
