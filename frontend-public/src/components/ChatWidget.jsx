import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client.js' // Backend connection

// Aapki VIP Links
const CALENDLY_LINK = "https://calendly.com/muhammadaffaf746/new-meeting"
const PORTFOLIO_LINK = "https://affaf12.github.io"

const WELCOME = "Hi there! 👋 I'm Affaf's Executive AI Assistant. I can help you with Power BI dashboards, AI automation, custom CRMs, or booking a consultation. How can I help you scale today?"

// Quick Buttons for Clients (VIP Touch)
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

  // Auto-scroll to bottom jab naya message aaye
  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open, sending])

  const send = async (e, directText = null) => {
    if(e) e.preventDefault()
    const text = directText || input.trim()
    if(!text || sending) return
    
    // User ka message screen par show karein
    setMessages(m => [...m, { from: 'user', text }])
    setInput('')
    setSending(true)

    const lowerText = text.toLowerCase()

    // 🌟 SMART FRONTEND LOGIC (Bina Backend ke VIP Jawab) 🌟
    setTimeout(async () => {
      
      // 1. Agar Call ya Meeting maange
      if (lowerText.includes('book') || lowerText.includes('call') || lowerText.includes('meeting') || lowerText.includes('consult') || lowerText.includes('calendar')) {
        setMessages(m => [...m, { 
          from: 'ai', 
          text: `I'd love to connect! 🚀 You can book a direct 15-minute discovery call with Affaf right here:\n👉 ${CALENDLY_LINK}\n\nOr view his portfolio: ${PORTFOLIO_LINK}`
        }])
        setSending(false)
        return
      }

      // 2. Agar Power BI ya Dashboard ke baare mein poochay
      if (lowerText.includes('power bi') || lowerText.includes('dashboard') || lowerText.includes('report') || lowerText.includes('data')) {
        setMessages(m => [...m, { 
          from: 'ai', 
          text: `Yes, absolutely! Affaf specializes in Power BI. He builds interactive dashboards for Sales, HR, Inventory, and Real Estate (like the Dubai Elite Properties dashboard). \n\nWe can turn your Excel files into live reports in 1-2 weeks. Want to see samples? Check out: ${PORTFOLIO_LINK}`
        }])
        setSending(false)
        return
      }

      // 3. Agar AI ya Automation ke baare mein poochay
      if (lowerText.includes('ai') || lowerText.includes('automation') || lowerText.includes('chatbot') || lowerText.includes('llm') || lowerText.includes('bot')) {
        setMessages(m => [...m, { 
          from: 'ai', 
          text: `Affaf builds custom AI tools using FastAPI and React! For example, he built an AI Lead Generator (Google Maps scraper), an ATS Resume Scorer, and WhatsApp automation systems. \n\nWhat kind of manual work are you trying to automate?`
        }])
        setSending(false)
        return
      }

      // 4. Agar Pricing ya Cost ke baare mein poochay
      if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('pricing') || lowerText.includes('budget')) {
        setMessages(m => [...m, { 
          from: 'ai', 
          text: `Projects are customized based on your needs. A typical Power BI dashboard starts around $350, and AI tools around $799. \n\nLet's discuss your exact requirements on a quick call:\n👉 ${CALENDLY_LINK}`
        }])
        setSending(false)
        return
      }

      // 5. AGAR BACKEND LIVE HAI TOH AI SE POOCHEIN
      try {
        const res = await api.post('/api/v1/ai/chat', { message: text })
        setMessages(m => [...m, { from: 'ai', text: res.data.reply }])
      } catch (error) {
        // Agar backend down ho, toh yeh default VIP reply jayega
        setMessages(m => [...m, { 
          from: 'ai', 
          text: `Thanks for reaching out! Affaf handles Power BI, AI Automation, and Custom CRMs. For detailed project scope and pricing, please book a quick call here:\n👉 ${CALENDLY_LINK}` 
        }])
      } finally {
        setSending(false)
      }
    }, 800) // Thoda sa delay taake "Typing..." animation dikhe
  }

  // Links ko clickable banane ka function
  const renderText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hover:text-indigo-300 font-semibold break-all">{part}</a>
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
            className="mb-4 w-[360px] max-w-[90vw] h-[520px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* VIP Header */}
            <div className="px-4 py-4 bg-gradient-to-r from-indigo-900 to-slate-800 border-b border-slate-700 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    A
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
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
                  className={`max-w-[85%] text-sm px-4 py-3 rounded-2xl leading-relaxed ${
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
              
              {/* Quick Action Buttons (Sirf shuru mein dikhein) */}
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

              {/* Typing Animation */}
              {sending && (
                <div className="max-w-[85%] text-sm px-4 py-3 rounded-2xl bg-slate-800 text-slate-400 border border-slate-700 rounded-tl-sm flex gap-1.5 items-center w-fit">
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

      {/* Floating Chat Button */}
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
