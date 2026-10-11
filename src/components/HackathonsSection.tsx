import React, { useState } from 'react'
import type { HackathonItem } from '../types'
import { Trophy, Calendar, ExternalLink, GitBranch, X, FileCheck } from 'lucide-react'

interface HackathonsSectionProps {
  hackathons: HackathonItem[]
}

export function HackathonsSection({ hackathons }: HackathonsSectionProps) {
  const [selectedHackathon, setSelectedHackathon] = useState<HackathonItem | null>(null)

  const publishedHackathons = hackathons.filter((h) => h.published !== false)

  return (
    <section
      id="hackathons"
      className="relative w-full bg-white text-[#111111] py-24 px-6 sm:px-12 lg:px-20 border-t border-black/10"
      style={{ fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-black/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-black/40 mb-2 block font-mono">
              03 // Competitions &amp; Awards
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111]">
              Hackathons
            </h2>
          </div>
          <p className="text-sm text-black/50 max-w-md mt-4 md:mt-0 leading-relaxed font-light">
            Competitive innovation, rapid prototyping, and award-winning AI solutions built under high-stakes timelines.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {publishedHackathons.map((h) => (
            <div
              key={h.id}
              onClick={() => setSelectedHackathon(h)}
              className="bg-[#f8f8f8] border border-black/10 p-8 sm:p-10 cursor-pointer hover:border-black/40 transition-all duration-300 group relative flex flex-col justify-between"
            >
              {/* Top Row: Date & Achievement */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs uppercase tracking-widest text-black/40 font-mono flex items-center gap-2">
                  <Calendar size={14} />
                  {h.date}
                </span>
                <span className="px-3 py-1 bg-black/[0.06] border border-black/10 text-xs tracking-wider uppercase text-[#111] flex items-center gap-1.5 font-medium">
                  <Trophy size={13} className="text-amber-500" />
                  {h.achievement}
                </span>
              </div>

              {/* Title & Org */}
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-medium text-[#111] mb-2">
                  {h.name}
                </h3>
                <p className="text-sm text-black/50 font-light">
                  {h.organization}
                </p>
              </div>

              {/* Project Preview & Description */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-black/50 mb-2 font-mono">
                  <span>Project:</span>
                  <span className="text-[#111] font-medium">{h.projectName}</span>
                </div>
                <p className="text-sm text-black/60 line-clamp-3 leading-relaxed font-light">
                  {h.description}
                </p>
              </div>

              {/* Tech Tags & CTA */}
              <div className="flex items-center justify-between pt-6 border-t border-black/10">
                <div className="flex flex-wrap gap-2">
                  {h.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] px-2.5 py-1 bg-white border border-black/10 text-black/60"
                    >
                      {tech}
                    </span>
                  ))}
                  {h.technologies.length > 3 && (
                    <span className="text-[11px] px-2 py-1 text-black/40">
                      +{h.technologies.length - 3}
                    </span>
                  )}
                </div>

                <span className="text-xs uppercase tracking-widest text-black/50 group-hover:text-[#111] flex items-center gap-1 group-hover:translate-x-1 transition-all">
                  Details &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedHackathon && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedHackathon(null)}
        >
          <div
            className="bg-white border border-black/15 max-w-3xl w-full p-8 sm:p-12 relative my-8"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedHackathon(null)}
              className="absolute top-6 right-6 text-black/40 hover:text-[#111] transition-colors p-2"
            >
              <X size={24} />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-black/[0.06] border border-black/10 text-xs tracking-wider uppercase text-[#111] flex items-center gap-1.5 font-medium">
                <Trophy size={14} className="text-amber-500" />
                {selectedHackathon.achievement}
              </span>
              <span className="text-xs text-black/40 uppercase tracking-widest font-mono">
                {selectedHackathon.date}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-3xl sm:text-4xl font-normal text-[#111] mb-2">
              {selectedHackathon.name}
            </h3>
            <p className="text-base text-black/50 font-light mb-8">
              Hosted by {selectedHackathon.organization}
            </p>

            {/* Image Preview */}
            {selectedHackathon.imageUrl && (
              <div className="mb-8 overflow-hidden border border-black/10 max-h-72">
                <img
                  src={selectedHackathon.imageUrl}
                  alt={selectedHackathon.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-6 bg-[#f8f8f8] border border-black/10 mb-8">
              <div>
                <span className="text-xs text-black/40 uppercase tracking-widest block mb-1">Team</span>
                <span className="text-sm text-[#111] font-medium">{selectedHackathon.teamName}</span>
              </div>
              <div>
                <span className="text-xs text-black/40 uppercase tracking-widest block mb-1">Role</span>
                <span className="text-sm text-[#111] font-medium">{selectedHackathon.role}</span>
              </div>
              <div>
                <span className="text-xs text-black/40 uppercase tracking-widest block mb-1">Project Name</span>
                <span className="text-sm text-[#111] font-medium">{selectedHackathon.projectName}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h4 className="text-xs uppercase tracking-widest text-black/40 mb-3 font-mono">
                Overview &amp; Impact
              </h4>
              <p className="text-black/70 leading-relaxed font-light text-base">
                {selectedHackathon.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h4 className="text-xs uppercase tracking-widest text-black/40 mb-3 font-mono">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedHackathon.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-1 bg-[#f4f4f4] border border-black/10 text-[#111]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-black/10">
              {selectedHackathon.githubUrl && (
                <a
                  href={selectedHackathon.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#111] text-white font-medium text-xs uppercase tracking-wider hover:bg-black transition-colors"
                >
                  <GitBranch size={16} />
                  <span>GitHub Repository</span>
                </a>
              )}
              {selectedHackathon.demoUrl && (
                <a
                  href={selectedHackathon.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#111] text-[#111] font-medium text-xs uppercase tracking-wider hover:bg-black/5 transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Live Demo</span>
                </a>
              )}
              {selectedHackathon.certificateUrl && (
                <a
                  href={selectedHackathon.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-black/20 text-black/70 font-medium text-xs uppercase tracking-wider hover:border-black hover:text-[#111] transition-colors"
                >
                  <FileCheck size={16} />
                  <span>Certificate</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
