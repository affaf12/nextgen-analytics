import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client.js'

export default function AIAssistant(){
  const [problem, setProblem] = useState("")
  const [estimate, setEstimate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [chatMsg, setChatMsg] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [sending, setSending] = useState(false)

  const getEstimate = async ()=>{
    if(problem.trim().length < 3) return
    setLoading(true); setError("")
    try {
      const res = await api.post('/api/v1/ai/estimate', { client_problem: problem })
      setEstimate(res.data)
    } catch (err) {
      setError(err?.response?.status === 429 ? 'Bohat zyada requests - thori dair baad try karein.' : 'Estimate nahi ban saka, dobara try karein.')
    } finally { setLoading(false) }
  }

  const sendChat = async (e)=>{
    e.preventDefault()
    const msg = chatMsg.trim()
    if(!msg || sending) return
    setChatMsg(""); setSending(true)
    try {
      const res = await api.post('/api/v1/ai/chat', { message: msg })
      setChatHistory(h=>[...h, {user: msg, ai: res.data.reply}])
    } catch {
      setChatHistory(h=>[...h, {user: msg, ai: 'Sorry, reply nahi aa saka. Dobara try karein.'}])
    } finally { setSending(false) }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 text-white">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">AI Assistant</h1>
      <p className="text-slate-400 mb-10">Apna masla likhein - instant estimate lein ya apna sawal poochein.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="font-bold mb-4">Instant Project Estimate</h3>
          <textarea value={problem} maxLength={2000} onChange={e=>setProblem(e.target.value)} rows={5}
            placeholder="Example: Mujhe restaurant ke liye Google Maps se leads chahiye jo website nahi rakhte..."
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 mb-3"/>
          <button onClick={getEstimate} disabled={loading} className="w-full py-3 bg-indigo-600 rounded-xl font-bold disabled:opacity-60">
            {loading ? "Estimate ban raha hai..." : "Get Estimate →"}
          </button>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          {estimate && (
            <div className="mt-4 p-4 bg-slate-800 rounded-xl text-sm">
              <div className="text-indigo-400 font-bold">{estimate.suggested_stack}</div>
              <div className="mt-2">⏱ ~{estimate.estimated_hours} hours • 💰 ~${estimate.suggested_price_usd} • Confidence: {estimate.confidence}</div>
              <ul className="mt-3 list-disc ml-5 text-slate-400">{estimate.breakdown.map((b,i)=><li key={i}>{b}</li>)}</ul>
              <p className="text-xs text-slate-500 mt-3">Ye ek andaza hai - final price scope dekh kar tay hota hai.</p>
              <Link to="/portal" className="mt-4 block text-center py-2 bg-green-600 rounded font-semibold">Submit Your Problem →</Link>
            </div>
          )}
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col">
          <h3 className="font-bold mb-4">Ask a Question</h3>
          <div className="h-64 overflow-y-auto bg-slate-800 rounded-lg p-3 mb-3 space-y-3">
            {chatHistory.map((c,i)=>(
              <div key={i}>
                <div className="text-xs text-slate-500">You: {c.user}</div>
                <div className="text-sm bg-indigo-600/20 p-2 rounded mt-1 whitespace-pre-wrap">{c.ai}</div>
              </div>
            ))}
            {chatHistory.length===0 && <div className="text-slate-500 text-sm">Apna sawal likhein, AI jawab dega...</div>}
          </div>
          <form onSubmit={sendChat} className="flex gap-2">
            <input value={chatMsg} maxLength={1000} onChange={e=>setChatMsg(e.target.value)} placeholder="Apna sawal likhein..." className="flex-1 p-2 rounded bg-slate-800 border border-slate-700"/>
            <button disabled={sending} className="px-4 bg-indigo-600 rounded disabled:opacity-60">Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}
