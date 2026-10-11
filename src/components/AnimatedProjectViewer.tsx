import React, { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  FolderGit2,
} from 'lucide-react'
import type { ProjectItem } from '../types'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedProjectViewerProps {
  projects: ProjectItem[]
}

// Inline Minimal GitHub Mark SVG
const GithubLogo = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
)

// Curated warm theme palette generator for projects
const THEMES = [
  {
    name: 'warm-amber',
    bg: 'radial-gradient(ellipse at 50% 45%, rgba(217, 119, 6, 0.28) 0%, rgba(180, 83, 9, 0.14) 40%, rgba(7, 7, 9, 0.98) 80%)',
    cardGrad: 'linear-gradient(135deg, #451a03 0%, #78350f 45%, #b45309 100%)',
    accentColor: '#f59e0b',
  },
  {
    name: 'terracotta-rose',
    bg: 'radial-gradient(ellipse at 50% 45%, rgba(225, 29, 72, 0.26) 0%, rgba(190, 18, 60, 0.12) 40%, rgba(7, 7, 9, 0.98) 80%)',
    cardGrad: 'linear-gradient(135deg, #3f0713 0%, #881337 45%, #be123c 100%)',
    accentColor: '#f43f5e',
  },
  {
    name: 'golden-ochre',
    bg: 'radial-gradient(ellipse at 50% 45%, rgba(234, 179, 8, 0.26) 0%, rgba(202, 138, 4, 0.12) 40%, rgba(7, 7, 9, 0.98) 80%)',
    cardGrad: 'linear-gradient(135deg, #422006 0%, #713f12 45%, #ca8a04 100%)',
    accentColor: '#eab308',
  },
  {
    name: 'emerald-noir',
    bg: 'radial-gradient(ellipse at 50% 45%, rgba(16, 185, 129, 0.24) 0%, rgba(4, 120, 87, 0.12) 40%, rgba(7, 7, 9, 0.98) 80%)',
    cardGrad: 'linear-gradient(135deg, #022c22 0%, #064e3b 45%, #059669 100%)',
    accentColor: '#10b981',
  },
  {
    name: 'violet-dusk',
    bg: 'radial-gradient(ellipse at 50% 45%, rgba(139, 92, 246, 0.26) 0%, rgba(109, 40, 217, 0.12) 40%, rgba(7, 7, 9, 0.98) 80%)',
    cardGrad: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 45%, #6d28d9 100%)',
    accentColor: '#a78bfa',
  },
  {
    name: 'deep-cobalt',
    bg: 'radial-gradient(ellipse at 50% 45%, rgba(37, 99, 235, 0.26) 0%, rgba(29, 78, 216, 0.12) 40%, rgba(7, 7, 9, 0.98) 80%)',
    cardGrad: 'linear-gradient(135deg, #0b192c 0%, #1e3a8a 45%, #2563eb 100%)',
    accentColor: '#60a5fa',
  },
]

function getProjectTheme(project: ProjectItem, index: number) {
  const hashStr = project.title || project.name || project.id || String(index)
  let hash = 0
  for (let i = 0; i < hashStr.length; i++) {
    hash = (hash << 5) - hash + hashStr.charCodeAt(i)
    hash |= 0
  }
  const themeIndex = Math.abs(hash + index) % THEMES.length
  return THEMES[themeIndex]
}

function power3InOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function AnimatedProjectViewer({ projects }: AnimatedProjectViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const isReducedMotionRef = useRef(false)

  // Continuous scroll progress (0.0 to 1.0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Window dimension listener
  const [windowDimensions, setWindowDimensions] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1200,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  })

  const isMobile = windowDimensions.w < 640

  // Preload project images
  useEffect(() => {
    projects.forEach((p) => {
      if (p.imageUrl) {
        const img = new Image()
        img.src = p.imageUrl
      }
    })
  }, [projects])

  // Reduced motion detection
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    isReducedMotionRef.current = mq.matches
    const listener = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches
    }
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [])

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        w: window.innerWidth,
        h: window.innerHeight,
      })
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const count = projects.length

  // GSAP ScrollTrigger setup for continuous scrubbed vertical scrolling
  useEffect(() => {
    if (!containerRef.current || !stageRef.current || count <= 1) return

    const totalScrollDistance = (count - 1) * window.innerHeight

    // Refresh after short tick to ensure tabs layout is calculated
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${totalScrollDistance}px`,
        pin: stageRef.current,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress)
        },
      })
    })

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [count, windowDimensions])

  // Map continuous progress to active step & interpolation variable
  let stepIndex = 0
  let stepRawU = 0

  if (count > 1) {
    const rawT = scrollProgress * (count - 1)
    stepIndex = Math.min(Math.floor(rawT), count - 2)
    stepRawU = Math.max(0, Math.min(1, rawT - stepIndex))
  }

  const easedU = isReducedMotionRef.current
    ? stepRawU >= 0.5
      ? 1
      : 0
    : power3InOut(stepRawU)

  // Active project for captions, counters, and links
  const activeIndex = stepRawU < 0.5 ? stepIndex : Math.min(stepIndex + 1, count - 1)
  const activeProject = projects[activeIndex] || projects[0]

  // Smooth programmatic scroll to a specific project index
  const scrollToIndex = useCallback(
    (targetIdx: number) => {
      if (!containerRef.current || count <= 1) return
      const boundedIdx = (targetIdx + count) % count
      const totalScrollDistance = (count - 1) * window.innerHeight
      const containerRect = containerRef.current.getBoundingClientRect()
      const containerTop = window.scrollY + containerRect.top
      const targetScroll = containerTop + (boundedIdx / (count - 1)) * totalScrollDistance
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      })
    },
    [count]
  )

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (count <= 1) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        scrollToIndex(activeIndex === count - 1 ? 0 : activeIndex + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        scrollToIndex(activeIndex === 0 ? count - 1 : activeIndex - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [count, activeIndex, scrollToIndex])

  // Touch swipe gesture support for mobile carousel navigation
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null || count <= 1) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null

    // If horizontal swipe is prominent (> 40px)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) {
        scrollToIndex(activeIndex === count - 1 ? 0 : activeIndex + 1)
      } else {
        scrollToIndex(activeIndex === 0 ? count - 1 : activeIndex - 1)
      }
    }
  }

  // Base tilt settings
  const baseTilt = isMobile ? -10 : -16
  const neighborTilt = isMobile ? 8 : 14
  const activeTilt = isHovered && !isMobile ? baseTilt + 5 : baseTilt

  // Ambient themes for cross-fading
  const themeCurrent = getProjectTheme(projects[stepIndex] || projects[0], stepIndex)
  const themeNext = getProjectTheme(
    projects[Math.min(stepIndex + 1, count - 1)] || projects[0],
    Math.min(stepIndex + 1, count - 1)
  )

  // Caption fade in/out animation calculations
  let captionOpacity = 1
  let captionTranslateY = 0

  if (!isReducedMotionRef.current && count > 1) {
    if (stepRawU < 0.45) {
      const p = stepRawU / 0.45
      captionOpacity = 1 - p
      captionTranslateY = p * 16
    } else if (stepRawU < 0.55) {
      captionOpacity = 0
      captionTranslateY = 16
    } else {
      const p = (stepRawU - 0.55) / 0.45
      captionOpacity = p
      captionTranslateY = (1 - p) * -16
    }
  }

  /* ──────────────── Empty State ──────────────── */
  if (count === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6 bg-[#070709] text-white">
        <div className="w-[90vw] max-w-[720px] h-[400px] bg-[#0c0c0e] border border-white/10 rounded-[20px] flex flex-col items-center justify-center p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 mb-4">
            <FolderGit2 size={28} />
          </div>
          <h2 className="text-3xl font-serif text-white mb-2">Projects coming soon</h2>
          <p className="text-xs sm:text-sm font-mono text-white/50 max-w-md leading-relaxed">
            New software engineering projects and repositories published via the admin dashboard will appear here in the animated scroll viewer.
          </p>
        </div>
      </div>
    )
  }

  /* ──────────────── Helper: Render Single Project Card ──────────────── */
  const renderCard = (
    project: ProjectItem,
    index: number,
    isCenter: boolean
  ) => {
    const title = project.title || project.name || `Project ${index + 1}`
    const theme = getProjectTheme(project, index)
    const tags = project.techTags || project.technologies || ['Full Stack']
    const primaryTech = tags[0] || 'Open Source'
    const formattedNum = String(index + 1).padStart(2, '0')
    const repo = project.repoUrl || project.githubUrl || ''

    return (
      <a
        href={repo || undefined}
        target={repo ? '_blank' : undefined}
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!repo) e.preventDefault()
        }}
        onMouseEnter={() => {
          if (isCenter) setIsHovered(true)
        }}
        onMouseLeave={() => {
          if (isCenter) setIsHovered(false)
        }}
        aria-label={`View ${title} on GitHub`}
        className={`group block w-[84vw] sm:w-[580px] aspect-[4/3] max-h-[420px] rounded-[16px] sm:rounded-[20px] overflow-hidden relative shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/15 select-none ${
          repo ? 'cursor-pointer' : 'cursor-default'
        }`}
        style={{
          background: project.imageUrl ? '#121215' : theme.cardGrad,
        }}
      >
        {/* Photo Card vs Auto-Generated Gradient Card */}
        {project.imageUrl ? (
          <>
            <img
              src={project.imageUrl}
              alt={title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Dark gradient at bottom for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

            {/* Title & Tech overlay */}
            <div className="absolute top-5 left-6 right-6 z-10 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-white/70 block mb-1">
                  {primaryTech}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-white tracking-tight drop-shadow-md">
                  {title}
                </h3>
              </div>
              {repo && (
                <div className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/80 group-hover:text-white transition-colors">
                  <GithubLogo size={16} />
                </div>
              )}
            </div>
          </>
        ) : (
          /* Auto-Generated Gradient Card */
          <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle mesh background circles */}
            <div
              className="absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-25 blur-2xl pointer-events-none"
              style={{ background: theme.accentColor }}
            />

            {/* Top Left: Title & Subtitle */}
            <div className="relative z-10 max-w-[85%]">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-white/60 block mb-1">
                {primaryTech} &bull; Open Source
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white tracking-tight font-normal leading-tight">
                {title}
              </h3>
            </div>

            {/* Bottom Row: Repo logo bottom-left & Big number bottom-right */}
            <div className="relative z-10 flex items-end justify-between pt-4">
              <div className="flex items-center gap-2 text-white/70 text-xs font-mono">
                <GithubLogo size={16} />
                <span className="tracking-wider uppercase text-[10px]">Repository</span>
              </div>
            </div>
          </div>
        )}

        {/* Big stylized project number bottom-right on both card types */}
        <div className="absolute bottom-4 right-5 sm:bottom-6 sm:right-7 z-10 pointer-events-none">
          <span
            className="font-serif text-4xl sm:text-6xl font-normal text-white/90 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] tracking-tighter"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}
          >
            {formattedNum}
          </span>
        </div>

        {/* Hover "View Repo" Badge on desktop */}
        {repo && isCenter && (
          <div className="hidden sm:flex absolute bottom-5 left-6 items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>View repo</span>
            <ArrowUpRight size={13} />
          </div>
        )}
      </a>
    )
  }

  /* ──────────────── Single Project Static State ──────────────── */
  if (count === 1) {
    const single = projects[0]
    const singleTheme = getProjectTheme(single, 0)
    const title = single.title || single.name || 'Project 01'
    const tags = single.techTags || single.technologies || []
    const repo = single.repoUrl || single.githubUrl || ''

    return (
      <div className="relative w-full min-h-screen bg-[#070709] flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Warm Ambient Background */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{ background: singleTheme.bg }}
        />

        {/* Viewport Panel */}
        <div className="relative z-10 w-[92vw] sm:w-[900px] h-[520px] sm:h-[560px] bg-[#0c0c0e] rounded-[18px] sm:rounded-[22px] overflow-hidden border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex items-center justify-center">
          <div style={{ transform: `rotate(${baseTilt}deg)` }}>
            {renderCard(single, 0, true)}
          </div>
        </div>

        {/* Under-Panel Controls & Details */}
        <div className="relative z-10 w-[92vw] sm:w-[900px] mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-white/50 tracking-wider">01 / 01</span>
          </div>

          <div className="text-left sm:text-right max-w-xl">
            <h4 className="font-serif text-2xl sm:text-3xl text-white font-normal tracking-tight">
              {title}
            </h4>
            {single.description && (
              <p className="text-xs sm:text-sm text-white/70 font-light mt-1 line-clamp-2">
                {single.description}
              </p>
            )}
            <div className="flex flex-wrap items-center sm:justify-end gap-1.5 mt-2">
              {tags.slice(0, 4).map((t, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/80"
                >
                  {t}
                </span>
              ))}
              {repo && (
                <a
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:underline ml-2"
                >
                  <span>View GitHub</span>
                  <ArrowUpRight size={11} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ──────────────── Multi-Project Continuous Scroll Showcase ──────────────── */
  // Identify the 4 active card slots for interpolation
  const prevIdx = stepIndex - 1 // exiting above
  const mainIdx = stepIndex // moving center -> top
  const nextIdx = stepIndex + 1 // moving bottom -> center
  const upcomingIdx = stepIndex + 2 // entering from below

  // 1. Current Main Project k: Center -> Top
  const curY = -270 * easedU
  const curRot = baseTilt + (neighborTilt - baseTilt) * easedU
  const curScale = 1.0 + (0.84 - 1.0) * easedU
  const curOpacity = 1.0 + (0.35 - 1.0) * easedU
  const curBlur = 6 * easedU

  // 2. Next Project k+1: Bottom -> Center
  const nextY = 270 * (1 - easedU)
  const nextRot = neighborTilt + (activeTilt - neighborTilt) * easedU
  const nextScale = 0.84 + (1.0 - 0.84) * easedU
  const nextOpacity = 0.35 + (1.0 - 0.35) * easedU
  const nextBlur = 6 * (1 - easedU)

  // 3. Outgoing Project k-1: Top -> Exiting above
  const outY = -270 - 220 * easedU
  const outScale = 0.84 * (1 - easedU * 0.2)
  const outOpacity = Math.max(0, 0.35 * (1 - easedU * 1.5))
  const outBlur = 6 + 4 * easedU

  // 4. Incoming Project k+2: Entering below -> Bottom
  const inY = 490 - 220 * easedU
  const inScale = 0.68 + 0.16 * easedU
  const inOpacity = Math.min(0.35, 0.35 * easedU * 1.5)
  const inBlur = 10 - 4 * easedU

  const activeTitle = activeProject.title || activeProject.name || `Project ${activeIndex + 1}`
  const activeTags = activeProject.techTags || activeProject.technologies || []
  const activeRepo = activeProject.repoUrl || activeProject.githubUrl || ''

  return (
    <div
      ref={containerRef}
      id="projects-scroll-container"
      className="relative w-full selection:bg-white selection:text-black"
      style={{
        height: `${(count - 1) * 100 + 100}vh`,
        background: '#070709',
      }}
    >
      {/* Pinned 100vh Stage */}
      <div
        ref={stageRef}
        className="w-full h-screen h-[100dvh] overflow-hidden relative flex flex-col items-center justify-center p-4 sm:p-6"
      >
        {/* Soft Warm Ambient Gradient Behind Viewport Panel (Cross-fading) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: themeCurrent.bg,
            opacity: 1 - easedU,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: themeNext.bg,
            opacity: easedU,
          }}
        />

        {/* Large Rounded Black Viewport Panel (~90vw mobile, ~900x560 desktop) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative z-10 w-[92vw] sm:w-[900px] h-[520px] sm:h-[560px] bg-[#0c0c0e] rounded-[18px] sm:rounded-[22px] overflow-hidden border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex items-center justify-center"
        >
          {/* Subtle noise / specular texture glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/60 pointer-events-none" />

          {/* Cards Vertical Stack */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Card 3: Outgoing Top Card (k-1) */}
            {prevIdx >= 0 && projects[prevIdx] && (
              <div
                key={`proj-slot-${prevIdx}-out`}
                className="absolute will-change-transform pointer-events-none"
                style={{
                  transform: `translate3d(0, ${outY}px, 0) rotate(${neighborTilt}deg) scale(${outScale})`,
                  opacity: outOpacity,
                  filter: `blur(${outBlur}px)`,
                  zIndex: 8,
                }}
              >
                {renderCard(projects[prevIdx], prevIdx, false)}
              </div>
            )}

            {/* Card 1: Main Project Card (k): Center -> Top */}
            {projects[mainIdx] && (
              <div
                key={`proj-slot-${mainIdx}-main`}
                className="absolute will-change-transform"
                style={{
                  transform: `translate3d(0, ${curY}px, 0) rotate(${curRot}deg) scale(${curScale})`,
                  opacity: curOpacity,
                  filter: `blur(${curBlur}px)`,
                  zIndex: stepRawU < 0.5 ? 20 : 12,
                  pointerEvents: stepRawU < 0.5 ? 'auto' : 'none',
                }}
              >
                {renderCard(projects[mainIdx], mainIdx, stepRawU < 0.5)}
              </div>
            )}

            {/* Card 2: Next Project Card (k+1): Bottom -> Center */}
            {projects[nextIdx] && (
              <div
                key={`proj-slot-${nextIdx}-next`}
                className="absolute will-change-transform"
                style={{
                  transform: `translate3d(0, ${nextY}px, 0) rotate(${nextRot}deg) scale(${nextScale})`,
                  opacity: nextOpacity,
                  filter: `blur(${nextBlur}px)`,
                  zIndex: stepRawU >= 0.5 ? 25 : 10,
                  pointerEvents: stepRawU >= 0.5 ? 'auto' : 'none',
                }}
              >
                {renderCard(projects[nextIdx], nextIdx, stepRawU >= 0.5)}
              </div>
            )}

            {/* Card 4: Incoming Bottom Card (k+2) */}
            {upcomingIdx < count && projects[upcomingIdx] && (
              <div
                key={`proj-slot-${upcomingIdx}-in`}
                className="absolute will-change-transform pointer-events-none"
                style={{
                  transform: `translate3d(0, ${inY}px, 0) rotate(${neighborTilt}deg) scale(${inScale})`,
                  opacity: inOpacity,
                  filter: `blur(${inBlur}px)`,
                  zIndex: 6,
                }}
              >
                {renderCard(projects[upcomingIdx], upcomingIdx, false)}
              </div>
            )}
          </div>
        </div>

        {/* Under-Panel Controls & Project Information */}
        <div className="relative z-10 w-[92vw] sm:w-[900px] mt-4 sm:mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left Side: Arrow Buttons & Counter */}
          <div className="flex items-center gap-3">
            {/* Left arrow (subtle, rounded) */}
            <button
              onClick={() => scrollToIndex(activeIndex === 0 ? count - 1 : activeIndex - 1)}
              aria-label="Previous project"
              className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Right arrow (highlighted, dark rounded square) */}
            <button
              onClick={() => scrollToIndex(activeIndex === count - 1 ? 0 : activeIndex + 1)}
              aria-label="Next project"
              className="w-11 h-11 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
            >
              <ChevronRight size={20} />
            </button>

            <span className="font-mono text-xs text-white/60 ml-2 tracking-widest">
              {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
          </div>

          {/* Right Side: Current Project Title, Description, Tech Tags */}
          <div
            className="text-left sm:text-right max-w-xl transition-all duration-300 will-change-transform"
            style={{
              opacity: captionOpacity,
              transform: `translate3d(0, ${captionTranslateY}px, 0)`,
            }}
          >
            <div className="flex items-center sm:justify-end gap-2">
              <h4 className="font-serif text-xl sm:text-2xl md:text-3xl text-white font-normal tracking-tight">
                {activeTitle}
              </h4>
            </div>

            {activeProject.description && (
              <p className="text-xs sm:text-sm text-white/70 font-light mt-1 line-clamp-1 max-w-lg">
                {activeProject.description}
              </p>
            )}

            <div className="flex flex-wrap items-center sm:justify-end gap-1.5 mt-2">
              {activeTags.slice(0, 4).map((tech, tidx) => (
                <span
                  key={tidx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/80"
                >
                  {tech}
                </span>
              ))}

              {activeRepo && (
                <a
                  href={activeRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:underline ml-2"
                >
                  <span>View on GitHub</span>
                  <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
