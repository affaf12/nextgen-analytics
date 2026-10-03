const STACK = [
  "FastAPI", "React", "Power BI", "PostgreSQL", "OpenAI", "Groq",
  "Python", "DAX", "Tailwind CSS", "Docker", "SQLAlchemy", "Vite",
]

export default function TechMarquee(){
  const items = [...STACK, ...STACK] // duplicated for a seamless loop
  return (
    <div className="border-y border-slate-800 bg-slate-900/40 overflow-hidden py-5">
      <div className="marquee-track flex gap-12 whitespace-nowrap">
        {items.map((s, i) => (
          <span key={i} className="text-slate-500 text-sm font-medium tracking-wide">{s}</span>
        ))}
      </div>
      <style>{`
        .marquee-track {
          width: max-content;
          animation: marquee-scroll 28s linear infinite;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  )
}
