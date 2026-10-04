import { lazy, Suspense } from 'react'
import TechMarquee from '../components/TechMarquee.jsx'
import SectionReveal from '../components/SectionReveal.jsx'
import FAQAccordion from '../components/FAQAccordion.jsx'
const Hero3D = lazy(() => import('../components/Hero3D.jsx'))

const SERVICES = [
  {t:"Lead Gen System", d:"Google Maps scraper - 70% hot leads, 60 leads in 2.8 minutes", s:"FastAPI + Playwright"},
  {t:"Social Media AI", d:"Auto post, AI caption, scheduler", s:"FastAPI + React"},
  {t:"Power BI Dashboards", d:"Sales, HR and Inventory dashboards - built from your existing data", s:"Power BI + SQL"},
  {t:"Delivery Chatbot", d:"Query your data in natural language", s:"Streamlit + Transformers"},
  {t:"ATS Resume Scorer", d:"JD match, keyword extraction", s:"Python + NLP"},
  {t:"Custom SaaS", d:"A SaaS solution for any client problem", s:"FastAPI + React + Postgres"},
]

const PROCESS = [
  { n: "01", t: "Submit Your Problem", d: "Fill in the form or chat with the AI Assistant - no need to schedule a call." },
  { n: "02", t: "Instant AI Estimate", d: "Get the stack, timeline and price instantly - no waiting." },
  { n: "03", t: "Built by the Founder", d: "The person who gives you the estimate also builds it - no hand-offs." },
  { n: "04", t: "Delivered & Supported", d: "You get a working system with the source code, plus support after delivery." },
]

const WHY_US = [
  { t: "Direct founder access", d: "No account managers, no middle-men - the person who estimates is the one who writes the code." },
  { t: "Real, verifiable work", d: "Every project is public on GitHub - you can see the actual repos, not just claims." },
  { t: "Fast turnaround", d: "Small projects ship in days, not weeks." },
  { t: "Full-stack delivery", d: "From the dashboard to the backend and deployment - all from one place." },
]

const FAQS = [
  { q: "How long does it take to deliver a project?", a: "Small projects (a dashboard, chatbot or automation script) are usually delivered in 2-5 days. For larger or custom SaaS projects, the AI Estimator gives you a timeline right away when you submit your problem." },
  { q: "How is pricing decided?", a: "Every project is different, so there are no fixed packages. Fill in the Submit Your Problem form or chat with the AI Assistant - both give you an instant estimate based on the scope." },
  { q: "Do I get the source code, or is it only a hosted service?", a: "You get the full source code and it's yours. No vendor lock-in." },
  { q: "Can I have my existing dashboards or systems modified?", a: "Absolutely - improving or fixing existing Power BI dashboards, scripts or systems is a common request. Just describe it in Submit Your Problem." },
  { q: "Is support included after delivery?", a: "Yes - bug fixes and small tweaks are covered after delivery. Larger changes count as new scope." },
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
            <p className="text-slate-400 text-xl max-w-xl mb-10">We listen to your problem, then build the best solution with FastAPI + React + AI and deliver it fast. CRM + ERP + Delivery - all in one system.</p>
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
