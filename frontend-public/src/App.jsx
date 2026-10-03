import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Portfolio from './pages/Portfolio.jsx'
import ClientPortal from './pages/ClientPortal.jsx'
import AIAssistant from './pages/AIAssistant.jsx'
import AboutUs from './pages/AboutUs.jsx'
import ContactUs from './pages/ContactUs.jsx'
import ChatWidget from './components/ChatWidget.jsx'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/ai', label: 'AI Assistant' },
  { to: '/contact', label: 'Contact' },
]

function PublicNav(){
  const loc = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const isActive = (p) => loc.pathname===p ? 'text-white' : 'text-slate-400 hover:text-white'

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-lg text-white" onClick={()=>setMenuOpen(false)}>NextGen OS <span className="text-indigo-400">AI</span></Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map(l => <Link key={l.to} to={l.to} className={isActive(l.to)}>{l.label}</Link>)}
          <Link to="/portal" className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-semibold">Submit Your Problem</Link>
        </div>

        <button className="md:hidden text-white text-2xl leading-none" onClick={()=>setMenuOpen(o=>!o)} aria-label="Toggle menu">
          {menuOpen ? '×' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 px-6 py-4 flex flex-col gap-4 text-sm">
          {NAV_LINKS.map(l => <Link key={l.to} to={l.to} className={isActive(l.to)} onClick={()=>setMenuOpen(false)}>{l.label}</Link>)}
          <Link to="/portal" className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-semibold text-center" onClick={()=>setMenuOpen(false)}>Submit Your Problem</Link>
        </div>
      )}
    </nav>
  )
}

function Footer(){
  return (
    <footer className="border-t border-slate-800 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} NextGen Analytics — Muhammad Affaf</p>
        <div className="flex gap-6">
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
          <a href="https://github.com/affaf12" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
          <a href="https://www.linkedin.com/in/muhammadaffaf/" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <div className="bg-slate-950 min-h-screen flex flex-col">
        <PublicNav/>
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="/projects" element={<Portfolio/>} />
            <Route path="/about" element={<AboutUs/>} />
            <Route path="/contact" element={<ContactUs/>} />
            <Route path="/portal" element={<ClientPortal/>} />
            <Route path="/ai" element={<AIAssistant/>} />
          </Routes>
        </div>
        <Footer/>
        <ChatWidget/>
      </div>
    </BrowserRouter>
  )
}
