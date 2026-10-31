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

const LIVE_PROJECTS = [
  { 
    title: "Gulf Outreach Hub", 
    desc: "Automated WhatsApp & Email CRM system for B2B outreach.", 
    tags: ["FastAPI", "React", "WhatsApp API"],
    link: "https://github.com/affaf12" 
  },
  { 
    title: "NextGen Lead Generator", 
    desc: "AI-powered Google Maps scraper + website analyzer to find B2B clients.", 
    tags: ["Python", "Playwright", "AI"],
    link: "https://github.com/affaf12" 
  },
  { 
    title: "ATS Resume Scorer", 
    desc: "AI tool that scores resumes against job descriptions instantly.", 
    tags: ["NLP", "Streamlit", "Python"],
    link: "https://github.com/affaf12" 
  }
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
    <div className="text-white relative">
      
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-10 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs mb-6">FastAPI + React + Power BI • Agency OS v1.0</div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">We build AI-powered systems that solve real business problems</h1>
            <p className="text-slate-400 text-xl max-w-xl mb-10">We listen to your problem, then build the best solution with FastAPI + React + AI and deliver it fast. CRM + ERP + Delivery - all in one system.</p>
            <div className="flex flex-wrap gap-4">
              <a href="/portal" className="px-8 py-4 bg-indigo-600 rounded-xl font-bold">Submit Your Problem →</a>
              <a href="#projects" className="px-8 py-4 bg-slate-800 rounded-xl border border-slate-700">View Our Work</a>
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

      {/* Live Projects */}
      <div id="projects" className="border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-10 py-20">
          <SectionReveal>
            <SectionHeading eyebrow="Live Projects" title="We don't just talk, we build." subtitle="Here are some real, working systems we have built and deployed." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LIVE_PROJECTS.map(p => (
                <div key={p.title} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                  <h3 className="font-bold text-xl mb-2">{p.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded-md">{tag}</span>
                    ))}
                  </div>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">
                    View Project →
                  </a>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
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

      {/* Floating WhatsApp Button (Aapka Number) */}
      <a 
        href="https://wa.me/923042365964" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-transform hover:scale-110 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

    </div>
  )
}
