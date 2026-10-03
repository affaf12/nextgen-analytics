import SectionReveal from '../components/SectionReveal.jsx'

const SERVICES = [
  { t: "Power BI & Data Analytics", d: "Dashboards that turn raw data - sales, HR, inventory, operations - into decisions you can act on." },
  { t: "AI Automation", d: "Chatbots, lead generation, and workflow automation built with modern AI tooling." },
  { t: "WhatsApp Business API", d: "Automated client communication that fits how your business already works." },
  { t: "Custom SaaS Tools", d: "In-house systems built from scratch when an off-the-shelf tool doesn't fit your problem." },
]

export default function AboutUs(){
  return (
    <div className="text-white">
      <div className="max-w-4xl mx-auto px-10 pt-20 pb-10">
        <SectionReveal>
          <div className="inline-flex px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs mb-6">About Us</div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">Built by an engineer, not a sales team</h1>
          <p className="text-slate-400 text-lg mb-4 max-w-2xl">
            NextGen Analytics is a data analytics and AI studio based in Karachi, Pakistan, run by Muhammad Affaf -
            an AI and Power BI developer who builds the systems himself, end to end.
          </p>
          <p className="text-slate-400 text-lg mb-16 max-w-2xl">
            No account managers, no hand-offs. When you submit a problem, the person who reads it is the same
            person who designs, builds, and ships the solution.
          </p>
        </SectionReveal>

        {/* Team */}
        <SectionReveal className="mb-16">
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center font-display text-2xl font-bold shrink-0">MA</div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-xl">Muhammad Affaf</h3>
              <p className="text-indigo-400 text-sm mb-3">Founder · AI & Power BI Engineer</p>
              <p className="text-slate-400 text-sm mb-4 max-w-md">
                Designs, builds, and ships every project personally - from the Power BI dashboard to the AI system behind it.
              </p>
              <div className="flex gap-4 justify-center sm:justify-start text-sm">
                <a href="https://www.linkedin.com/in/muhammadaffaf/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">LinkedIn →</a>
                <a href="https://github.com/affaf12" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">GitHub →</a>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Services */}
        <SectionReveal className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6">What we do</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {SERVICES.map(s=>(
              <div key={s.t} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-lg mb-2">{s.t}</h3>
                <p className="text-slate-400 text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal className="p-8 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-center">
          <h3 className="font-bold text-xl mb-2">See the work</h3>
          <p className="text-slate-400 text-sm mb-6">Every project on the Projects page is real - built, shipped, and running.</p>
          <a href="/projects" className="inline-block px-8 py-3 bg-indigo-600 rounded-xl font-bold">View Projects →</a>
        </SectionReveal>
      </div>
    </div>
  )
}
