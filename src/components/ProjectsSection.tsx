import React from 'react'
import type { ProjectItem } from '../types'
import { GitBranch, ExternalLink, Star } from 'lucide-react'

interface ProjectsSectionProps {
  projects: ProjectItem[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const publishedProjects = projects.filter((p) => p.published !== false)

  return (
    <section
      id="projects"
      className="relative w-full bg-[#f4f4f4] text-[#111111] py-24 px-6 sm:px-12 lg:px-20 border-t border-black/10"
      style={{ fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-black/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-black/40 mb-2 block font-mono">
              04 // Featured Software
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111]">
              Projects
            </h2>
          </div>
          <p className="text-sm text-black/50 max-w-md mt-4 md:mt-0 leading-relaxed font-light">
            Production applications, machine learning architectures, and editorial web experiences.
          </p>
        </div>

        {/* Projects Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-black/10 hover:border-black/40 transition-all duration-500 group flex flex-col justify-between overflow-hidden"
            >
              {/* Top Image Box */}
              <div className="relative h-56 w-full overflow-hidden border-b border-black/10 bg-[#eee]">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent opacity-80" />

                {/* Featured Badge */}
                {p.featured && (
                  <div className="absolute top-4 right-4 bg-[#111] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 flex items-center gap-1 shadow-md">
                    <Star size={11} fill="white" />
                    Featured
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-black/35 mb-3 font-mono">
                    <span>{p.date}</span>
                  </div>

                  <h3 className="text-2xl font-normal text-[#111] mb-3">
                    {p.name}
                  </h3>

                  <p className="text-sm text-black/60 font-light leading-relaxed mb-6 line-clamp-3">
                    {p.description}
                  </p>
                </div>

                {/* Bottom Stack & Links */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2.5 py-1 bg-[#f4f4f4] border border-black/10 text-black/65"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-black/10 text-xs">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-black/60 hover:text-[#111] transition-colors font-mono"
                      >
                        <GitBranch size={15} />
                        <span>Code</span>
                      </a>
                    )}
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-black/60 hover:text-[#111] transition-colors font-mono ml-auto"
                      >
                        <ExternalLink size={15} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
