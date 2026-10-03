import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQAccordion({ items }){
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="divide-y divide-slate-800 border-y border-slate-800">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold pr-6">{item.q}</span>
              <span className={`text-indigo-400 text-xl leading-none transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="text-slate-400 text-sm pb-5 pr-10">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
