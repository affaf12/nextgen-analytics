import { useEffect, useState } from 'react'
import api from '../api/client.js'
import SectionReveal from '../components/SectionReveal.jsx'

function ProjectCard({ p }){
  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col">
      <div className="text-xs text-indigo-400 mb-2">{p.tag}</div>
      <h3 className="font-bold text-lg mb-2">{p.title}</h3>
      <p className="text-slate-400 text-sm mb-4 flex-1">{p.description}</p>
      <a
        href={p.link}
        target="_blank"
        rel="noreferrer"
        className="inline-block text-center px-4 py-2 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-600 rounded-lg text-sm font-semibold transition-colors"
      >
        View Project →
      </a>
    </div>
  )
}

function Section({ title, subtitle, items }){
  if(!items || items.length===0) return null
  return (
    <SectionReveal className="mb-16">
      <h2 className="text-2xl font-bold mb-1">{title}</h2>
      <p className="text-slate-500 text-sm mb-6">{subtitle}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p => <ProjectCard key={p.link} p={p} />)}
      </div>
    </SectionReveal>
  )
}

export default function Portfolio(){
  const [sections, setSections] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/v1/portfolio/')
      .then(r => setSections(r.data))
      .catch(() => setError('Couldn’t load projects, please try again shortly.'))
  }, [])

  const loading = sections === null && !error
  const totalCount = sections ? (sections.power_bi.length + sections.ai.length + (sections.other?.length||0)) : 0

  return (
    <div className="text-white">
      <div className="max-w-6xl mx-auto px-10 py-16">
        <SectionReveal>
        <div className="inline-flex px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs mb-6">Portfolio</div>
        <h1 className="text-4xl font-black mb-4">Projects We've <span className="text-indigo-400">Shipped</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl mb-4">Real dashboards and systems, built and delivered - not mockups.</p>
        <a href="https://github.com/affaf12" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-12">
          github.com/affaf12 →
        </a>
        </SectionReveal>

        {loading && <p className="text-slate-500">Loading projects…</p>}
        {error && <p className="text-red-400">{error}</p>}

        {sections && totalCount===0 && (
          <p className="text-slate-500">Projects jald hi yahan nazar aayenge.</p>
        )}

        {sections && (
          <>
            <Section title="Power BI Projects" subtitle="Dashboards and data analytics work" items={sections.power_bi} />
            <Section title="AI Projects" subtitle="AI-driven tools, chatbots, and automation" items={sections.ai} />
            <Section title="Other Projects" subtitle="Everything else we've built" items={sections.other} />
          </>
        )}

        <div className="mt-4 p-8 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-center">
          <h3 className="font-bold text-xl mb-2">Have a problem like these?</h3>
          <p className="text-slate-400 text-sm mb-6">Tell us about it and we'll get back to you within hours.</p>
          <a href="/portal" className="inline-block px-8 py-3 bg-indigo-600 rounded-xl font-bold">Submit Your Problem →</a>
        </div>
      </div>
    </div>
  )
}
