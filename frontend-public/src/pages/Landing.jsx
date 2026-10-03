import { lazy, Suspense } from 'react'
import TechMarquee from '../components/TechMarquee.jsx'
import SectionReveal from '../components/SectionReveal.jsx'
import FAQAccordion from '../components/FAQAccordion.jsx'
const Hero3D = lazy(() => import('../components/Hero3D.jsx'))

const SERVICES = [
  {t:"Lead Gen System", d:"Google Maps scraper 70% hot leads, 2.8min me 60 leads", s:"FastAPI + Playwright"},
  {t:"Social Media AI", d:"Auto post, AI caption, scheduler", s:"FastAPI + React"},
  {t:"Power BI Dashboards", d:"Sales, HR, Inventory dashboards - tumhare existing data se", s:"Power BI + SQL"},
  {t:"Delivery Chatbot", d:"Natural language se data query", s:"Streamlit + Transformers"},
  {t:"ATS Resume Scorer", d:"JD match, keyword extraction", s:"Python + NLP"},
  {t:"Custom SaaS", d:"Client ki koi bhi problem ka SaaS solution", s:"FastAPI + React + Postgres"},
]

const PROCESS = [
  { n: "01", t: "Submit Your Problem", d: "Form fill karo ya AI Assistant se baat karo - koi call schedule karne ki zaroorat nahi." },
  { n: "02", t: "Instant AI Estimate", d: "Stack, timeline aur price turant mil jaata hai - koi wait nahi." },
  { n: "03", t: "Built by the Founder", d: "Wahi shaks jo estimate deta hai, wahi khud build bhi karta hai - koi hand-off nahi." },
  { n: "04", t: "Delivered & Supported", d: "Working system deliver hota hai, source code ke sath, aur delivery ke baad bhi support." },
]

const WHY_US = [
  { t: "Direct founder access", d: "Koi account manager, koi middle-man nahi - jo estimate deta hai wahi code likhta hai." },
  { t: "Real, verifiable work", d: "Har project GitHub pe public hai - claims nahi, actual repos dekh sakte ho." },
  { t: "Fast turnaround", d: "Chhote projects days mein deliver hote hain, hafton mein nahi." },
  { t: "Full-stack delivery", d: "Dashboard se le kar backend, deployment tak - sab ek jagah se." },
]

const FAQS = [
  { q: "Kitna time lagta hai ek project deliver karne mein?", a: "Chhote projects (dashboard, chatbot, automation script) usually 2-5 din mein deliver hote hain. Bara/custom SaaS project ka timeline AI Estimator turant bata deta hai jab aap apna problem submit karte hain." },
  { q: "Pricing kaise decide hoti hai?", a: "Har project alag hai, isliye fixed package nahi hai. Submit Your Problem form fill karo ya AI Assistant se baat karo - dono jagah instant estimate milta hai based on scope." },
  { q: "Source code milta hai ya sirf hosted service?", a: "Full source code milta hai, aapka apna hai. Koi vendor lock-in nahi." },
  { q: "Kya main pehle se bani dashboards/systems ko modify bhi karwa sakta hoon?", a: "Bilkul - existing Power BI dashboards, scripts, ya systems ko improve/fix karna bhi ek common request hai. Submit Your Problem mein detail likh dein." },
  { q: "Delivery ke baad support milta hai?", a: "Haan - bugs fix hote hain aur chhote tweaks delivery ke baad bhi cover hote hain. Bade changes naya scope count hote hain." },
]

function SectionHeading({ eyebrow, title, subtitle }){
  return (
    <div className="mb-10">
      {eyebrow && <div className="inline-flex px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs mb-4">{eyebrow}</div>}
      <h2 className="font-display text-3xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-slate-400 max-w-2xl">{subtitle}</p>}
    </div>
  )
}

export default function Landing(){
  return (
    <div className="text-white">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-10 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs mb-6">FastAPI + React + Power BI • Agency OS v1.0</div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">We build AI-powered systems that solve real business problems</h1>
            <p className="text-slate-400 text-xl max-w-xl mb-10">Client ka masla sunte hain, FastAPI + React + AI se best solution bana ke kal deliver karte hain. CRM + ERP + Delivery - sab ek system me.</p>
            <div className="flex flex-wrap gap-4">
              <a href="/portal" className="px-8 py-4 bg-indigo-600 rounded-xl font-bold">Submit Your Problem →</a>
              <a href="/projects" className="px-8 py-4 bg-slate-800 rounded-xl border border-slate-700">View Our Work</a>
            </div>
          </div>
          <div className="h-[360px] lg:h-[440px] hidden md:block">
            <Suspense fallback={<div className="w-full h-full" />}>
              <Hero3D />
            </Suspense>
          </div>
        </div>
      </div>

      <TechMarquee />

      {/* Services */}
      <div className="max-w-6xl mx-auto px-10 py-20">
        <SectionReveal>
          <SectionHeading eyebrow="Services" title="What we build" subtitle="Systems built to solve one specific problem well, not generic templates." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(c=>(
              <div key={c.t} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-indigo-400 mb-2">{c.s}</div>
                <h3 className="font-bold text-lg mb-2">{c.t}</h3>
                <p className="text-slate-400 text-sm">{c.d}</p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>

      {/* Process */}
      <div className="border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-10 py-20">
          <SectionReveal>
            <SectionHeading eyebrow="Process" title="How it works" subtitle="Four steps, no sales calls required to get started." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROCESS.map(p=>(
                <div key={p.n} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="font-display text-2xl text-indigo-400 mb-3">{p.n}</div>
                  <h3 className="font-bold mb-2">{p.t}</h3>
                  <p className="text-slate-400 text-sm">{p.d}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>

      {/* Why us */}
      <div className="max-w-6xl mx-auto px-10 py-20">
        <SectionReveal>
          <SectionHeading eyebrow="Why Us" title="Why work with us" subtitle="No agency theatre - just what actually matters when you're picking who builds this." />
          <div className="grid md:grid-cols-2 gap-6">
            {WHY_US.map(w=>(
              <div key={w.t} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-lg mb-2">{w.t}</h3>
                <p className="text-slate-400 text-sm">{w.d}</p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>

      {/* FAQ */}
      <div className="border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-3xl mx-auto px-10 py-20">
          <SectionReveal>
            <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
            <FAQAccordion items={FAQS} />
          </SectionReveal>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-6xl mx-auto px-10 py-20">
        <SectionReveal className="p-10 md:p-16 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Have a problem worth solving?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Tell us what's broken or missing - we'll tell you exactly how we'd fix it, for free, in minutes.</p>
          <a href="/portal" className="inline-block px-8 py-4 bg-indigo-600 rounded-xl font-bold">Submit Your Problem →</a>
        </SectionReveal>
      </div>
    </div>
  )
}
