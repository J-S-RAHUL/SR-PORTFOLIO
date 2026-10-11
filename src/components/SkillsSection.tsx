import React, { useState, useMemo } from 'react'
import type { SkillItem } from '../types'
import { Code2, Cpu, Wrench, Layers } from 'lucide-react'

interface SkillsSectionProps {
  skills: SkillItem[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = useMemo(() => {
    const set = new Set<string>()
    skills.forEach((s) => s.category && set.add(s.category))
    return ['All', ...Array.from(set)]
  }, [skills])

  const filteredSkills = useMemo(() => {
    let list = activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory)
    return [...list].sort((a, b) => a.order - b.order)
  }, [skills, activeCategory])

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'languages':
        return <Code2 size={16} />
      case 'ai & data science':
      case 'ai/ml':
        return <Cpu size={16} />
      case 'tools':
        return <Wrench size={16} />
      default:
        return <Layers size={16} />
    }
  }

  return (
    <section
      id="skills"
      className="relative w-full bg-[#f4f4f4] text-[#111111] py-24 px-6 sm:px-12 lg:px-20 border-t border-black/10"
      style={{ fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-black/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-black/40 mb-2 block font-mono">
              02 // Technical Capabilities
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111]">
              Skills &amp; Stack
            </h2>
          </div>
          <p className="text-sm text-black/50 max-w-md mt-4 md:mt-0 leading-relaxed font-light">
            Core technologies, programming languages, frameworks, and AI toolkits utilized in building scalable solutions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-[#111] text-white border-[#111]'
                  : 'bg-white text-black/60 border-black/15 hover:border-black/40 hover:text-[#111]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white border border-black/10 p-5 hover:border-black/40 transition-all duration-300 group flex flex-col justify-between h-36 relative overflow-hidden"
            >
              {/* Subtle hover highlight */}
              <div className="absolute inset-0 bg-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="flex items-center justify-between text-black/35 group-hover:text-black/70 transition-colors">
                <span className="text-xs uppercase tracking-wider font-mono">
                  {skill.category}
                </span>
                {getCategoryIcon(skill.category)}
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#111] tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                  {skill.name}
                </h3>
                {skill.level && (
                  <span className="text-[11px] text-black/40 uppercase tracking-widest block mt-1">
                    {skill.level}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
