import { useState } from 'react'
import api from '../api/client.js'

export default function ClientPortal(){
  const [form, setForm] = useState({name:"", email:"", company:"", phone:"", problem:"", budget:"", website:""})
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e)=>{
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/api/v1/public/submit', {
        name: form.name, email: form.email, company: form.company || null, phone: form.phone || null,
        problem: form.problem, budget: form.budget || null, kind: 'portal', website: form.website,
      })
      setDone(true)
    } catch (err) {
      setError(err?.response?.status === 429
        ? 'Bohat zyada requests - thori dair baad dobara try karein.'
        : 'Kuch masla ho gaya, dobara try karein ya WhatsApp/email pe rabta karein.')
    } finally {
      setSubmitting(false)
    }
  }

  if(done) return <div className="p-20 text-white text-center"><h1 className="text-4xl font-bold mb-4">✅ Received!</h1><p className="text-slate-400">Affaf will contact you in 2 hours. Aap ki request mil gayi hai.</p></div>

  return (
    <div className="max-w-2xl mx-auto p-10 text-white">
      <h1 className="text-3xl font-bold mb-2">Client Order Portal</h1>
      <p className="text-slate-400 mb-8">Apna masla likho, hum kal tak best solution de denge. Hum 2 ghante ke andar aap se rabta karenge.</p>
      <form onSubmit={submit} className="space-y-4 bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{position:'absolute',left:'-9999px',opacity:0,height:0}} value={form.website} onChange={e=>setForm({...form,website:e.target.value})}/>
        <input placeholder="Name" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <input type="email" placeholder="Email" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
        <input placeholder="Company" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/>
        <input placeholder="Phone / WhatsApp" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
        <textarea placeholder="Aap ka masla kya hai? Detail me likho - example: mujhe apne restaurant ke liye leads chahiye..." rows={5} className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" value={form.problem} onChange={e=>setForm({...form,problem:e.target.value})} required/>
        <input placeholder="Budget USD (ex: 500)" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}/>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button disabled={submitting} className="w-full py-4 bg-indigo-600 rounded-xl font-bold disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit Problem →'}</button>
      </form>
    </div>
  )
}
