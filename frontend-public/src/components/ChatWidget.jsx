import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client.js'

// Aapki VIP Links
const CALENDLY_LINK = "https://calendly.com/muhammadaffaf746/new-meeting"
const PORTFOLIO_LINK = "https://affaf12.github.io"

const WELCOME = "Hi there! 👋 I'm Affaf's Executive AI Assistant. I can help you with Power BI dashboards, AI automation, custom CRMs, or booking a consultation. How can I help you scale today?"

// Quick Buttons for Clients
const SUGGESTIONS = [
  "Book a Discovery Call 📅",
  "Power BI Dashboards 📊",
  "AI & Automation 🤖",
  "Pricing & Timeline 💰"
]

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
  }, [messages, open, sending])

  const send = async (e, directText = null) => {
    if(e) e.preventDefault()
    const text = directText || input.trim()
    if(!text || sending) return
    
    setMessages(m => [...m, { from: 'user', text }])
    setInput('')
    setSending(true)

    // 🌟 VIP LOGIC: Agar client meeting ya call maange
    const lowerText = text.toLowerCase()
    if (lowerText.includes('book') || lowerText.includes('call') || lowerText.includes('meeting') || lowerText.includes('consult') || lowerText.includes('calendar')) {
      setTimeout(() => {
        setMessages(m => [...m, { 
          from: 'ai', 
          text: `I'd love to connect! 🚀 You can book a direct 15-minute discovery call with Affaf right here:\n👉 ${CALENDLY_LINK}\n\nOr view his portfolio: ${PORTFOLIO_LINK}`,
          isSpecial: true 
        }])
        setSending(false)
      }, 1000)
      return
    }

    // 🌟 Backend AI Call (Agar backend live hai)
    try {
      const res = await api.post('/api/v1/ai/chat', { message: text })
      setMessages(m => [...m, { from: 'ai', text: res.data.reply }])
    } catch {
      // Fallback agar backend down ho
      setMessages(m => [...m, { 
        from: 'ai', 
        text: `Great question! Affaf specializes in Power BI, AI Automation, and Custom CRMs. To discuss your specific needs, please book a quick call here:\n👉 ${CALENDLY_LINK}` 
      }])
    } finally {
      setSending(false)
    }
  }

  // Link text ko clickable banane ka function
  const renderText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hover:text-indigo-300 font-semibold">{part}</a>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-4 w-[360px] max-w-[90vw] h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-4 bg-gradient-to-r from-indigo-900 to-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    A
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">NextGen AI</p>
                  <p className="text-indigo-300 text-xs">Online · Replies instantly</p>
                </div>
              </div>
              <button onClick={()=>setOpen(false)} className="text-slate-400 hover:text-white text-2xl leading-none transition-colors" aria-label="Close chat">×</button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`max-w-[85%] text-sm px-4 py-2.5 rounded-2xl leading-relaxed ${
                    m.from==='ai' 
                      ? 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm' 
                      : 'bg-indigo-600 text-white ml-auto rounded-tr-sm shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {renderText(m.text)}
                  </div>
                </motion.div>
              ))}
              
              {/* Quick Actions (Sirf shuru mein dikhein) */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={(e) => send(e, s)}
                      className="text-xs bg-slate-800 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 px-3 py-1.5 rounded-full transition-colors text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {sending && (
                <div className="max-w-[85%] text-sm px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-400 border border-slate-700 rounded-tl-sm flex gap-1 items-center w-fit">
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>●</motion.span>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>●</motion.span>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>●</motion.span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={send} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                value={input}
                onChange={e=>setInput(e.target.value)}
                placeholder="Ask about Power BI, AI, or book a call..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button type="submit" disabled={sending || !input.trim()} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={()=>setOpen(o=>!o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center text-3xl relative"
      >
        {open ? '×' : '💬'}
        {!open && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-slate-900 rounded-full animate-pulse"></span>}
      </motion.button>
    </div>
  )
}
