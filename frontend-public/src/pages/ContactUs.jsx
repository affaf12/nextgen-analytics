import { useState } from 'react'
import api from '../api/client.js'
import SectionReveal from '../components/SectionReveal.jsx'

export default function ContactUs(){
  const [form, setForm] = useState({ name:"", email:"", message:"", website:"" })
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/api/v1/public/submit', {
        name: form.name, email: form.email, problem: form.message, kind: 'contact', website: form.website,
      })
      setDone(true)
    } catch (err) {
      setError(err?.response?.status === 429 ? 'Too many requests - please try again in a little while.' : 'Something went wrong. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="text-white">
      <div className="max-w-4xl mx-auto px-10 py-20">
        <SectionReveal>
        <div className="inline-flex px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs mb-6">Contact Us</div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">Let's talk about your problem</h1>
        <p className="text-slate-400 text-lg mb-12 max-w-xl">Have a question before you commit to a full project? Send a message here instead.</p>
        </SectionReveal>

        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-3">
            {done ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-lg font-semibold mb-2">Message mil gaya ✓</p>
                <p className="text-slate-400 text-sm">Jald hi reply karenge - usually within a few hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{position:'absolute',left:'-9999px',opacity:0,height:0}} value={form.website} onChange={e=>setForm({...form,website:e.target.value})}/>
                <input placeholder="Your Name" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
                <input type="email" placeholder="Email" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
                <textarea placeholder="Your message" rows={5} className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required/>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button disabled={submitting} className="px-8 py-3 bg-indigo-600 rounded-xl font-bold disabled:opacity-60">
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold mb-1">GitHub</h3>
              <a href="https://github.com/affaf12" target="_blank" rel="noreferrer" className="text-indigo-400 text-sm">github.com/affaf12</a>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold mb-1">LinkedIn</h3>
              <a href="https://www.linkedin.com/in/muhammadaffaf/" target="_blank" rel="noreferrer" className="text-indigo-400 text-sm">linkedin.com/in/muhammadaffaf</a>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold mb-1">Based in</h3>
              <p className="text-slate-400 text-sm">Karachi, Pakistan</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold mb-1">Have a full project?</h3>
              <a href="/portal" className="text-indigo-400 text-sm">Use the Submit Your Problem form →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
