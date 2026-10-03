import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client.js'

const WELCOME = "Hi! Main NextGen ka AI assistant hoon. Apna sawal ya masla batayein, main foran reply karta hoon."

export default function ChatWidget(){
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ from: 'ai', text: WELCOME }])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const send = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if(!text || sending) return
    setMessages(m => [...m, { from: 'user', text }])
    setInput('')
    setSending(true)
    try {
      const res = await api.post('/api/v1/ai/chat', { message: text })
      setMessages(m => [...m, { from: 'ai', text: res.data.reply }])
    } catch {
      setMessages(m => [...m, { from: 'ai', text: 'Sorry, abhi reply nahi bhej saka. Seedha Submit Your Problem form try karein.' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="mb-3 w-[340px] max-w-[90vw] h-[440px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">NextGen AI Support</p>
                <p className="text-slate-400 text-xs">Usually replies instantly</p>
              </div>
              <button onClick={()=>setOpen(false)} className="text-slate-400 hover:text-white text-lg leading-none" aria-label="Close chat">×</button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`max-w-[85%] text-sm px-3 py-2 rounded-xl ${m.from==='ai' ? 'bg-slate-800 text-slate-200' : 'bg-indigo-600 text-white ml-auto'}`}>
                  {m.text}
                </div>
              ))}
              {sending && <div className="max-w-[85%] text-sm px-3 py-2 rounded-xl bg-slate-800 text-slate-400">Typing…</div>}
            </div>

            <form onSubmit={send} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                value={input}
                onChange={e=>setInput(e.target.value)}
                placeholder="Apna sawal likhein..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500"
              />
              <button type="submit" disabled={sending} className="px-4 py-2 bg-indigo-600 rounded-lg text-white text-sm font-semibold disabled:opacity-50">
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={()=>setOpen(o=>!o)}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl flex items-center justify-center text-2xl"
        aria-label={open ? 'Close chat support' : 'Open chat support'}
      >
        {open ? '×' : '💬'}
      </motion.button>
    </div>
  )
}
