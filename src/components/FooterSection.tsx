import React from 'react'
import { ArrowUp } from 'lucide-react'

export function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      className="w-full bg-[#f0f0f0] text-[#111111] py-16 px-6 sm:px-12 lg:px-20 border-t border-black/10"
      style={{ fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-xl font-normal text-[#111] tracking-tight mb-2">
            J. Shanmukh Rahul
          </h3>
          <p className="text-xs text-black/40 font-light">
            AI/ML Engineer &amp; Full-Stack Developer &mdash; MIC College of Technology &copy; 2026
          </p>
        </div>

        <div className="flex items-center gap-8 text-xs text-black/50">
          <a href="#about" className="hover:text-[#111] transition-colors">About</a>
          <a href="#skills" className="hover:text-[#111] transition-colors">Skills</a>
          <a href="#projects" className="hover:text-[#111] transition-colors">Projects</a>
          <a href="/admin/login" className="hover:text-[#111] transition-colors font-mono">Admin</a>
        </div>

        <button
          onClick={scrollToTop}
          className="p-3 border border-black/20 text-[#111] hover:bg-black/5 transition-colors flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </footer>
  )
}
