import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ProfileData } from '../types'
import portraitAsset from '../assets/about-me.jpg'
import collegeAsset from '../assets/college.png'

gsap.registerPlugin(ScrollTrigger)

interface AboutSectionProps {
  profile: ProfileData
}

const BULLET_POINTS = [
  'Student, independent developer and AI engineer',
  'Software development, cloud systems, and machine learning engineering',
  'Builds full-stack applications, intelligent agents, and scalable APIs',
  'Specializes in low-latency architectures and responsive web experiences',
]

const KEY_COMPETENCIES = [
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Docker & Cloud',
  'AI tools',
  'PyTorch',
  'UI/UX',
]

export function AboutSection({ profile }: AboutSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sec1Ref = useRef<HTMLDivElement>(null)
  const sec1DimRef = useRef<HTMLDivElement>(null)
  const sec2Ref = useRef<HTMLDivElement>(null)
  const sec2ImgWrapRef = useRef<HTMLDivElement>(null)
  const sec2TextWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !sec1Ref.current || !sec2Ref.current) return

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(sec2Ref.current, {
        yPercent: 100,
        rotation: 5,
        transformOrigin: 'bottom center',
        willChange: 'transform',
      })

      const sec2Elements = [
        sec2ImgWrapRef.current,
        sec2TextWrapRef.current?.querySelector('.sec2-header'),
        sec2TextWrapRef.current?.querySelector('.sec2-block-1'),
        sec2TextWrapRef.current?.querySelector('.sec2-block-2'),
        sec2TextWrapRef.current?.querySelector('.sec2-block-3'),
      ].filter(Boolean)

      if (sec2Elements.length > 0) {
        gsap.set(sec2Elements, {
          opacity: 0,
          y: 30,
        })
      }

      // Master timeline scrubbed over 200vh
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // 1. Section 1 scales down to 0.96 and dims slightly
      tl.to(
        sec1Ref.current,
        {
          scale: 0.96,
          ease: 'power2.out',
          duration: 1,
        },
        0
      )

      if (sec1DimRef.current) {
        tl.to(
          sec1DimRef.current,
          {
            opacity: 0.35,
            ease: 'power2.out',
            duration: 1,
          },
          0
        )
      }

      // 2. Section 2 card rises from bottom and straightens from 5deg to 0deg
      tl.to(
        sec2Ref.current,
        {
          yPercent: 0,
          rotation: 0,
          ease: 'power2.out',
          duration: 1,
        },
        0
      )

      // 3. Section 2's image, heading and text fade in and move up ~30px with stagger
      if (sec2Elements.length > 0) {
        tl.to(
          sec2Elements,
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: 'power2.out',
            duration: 0.65,
          },
          0.35
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      id="about"
      className="relative w-full"
      style={{
        height: '100vh',
        overflow: 'hidden',
        fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif',
      }}
    >
      {/* ────────────────────── SECTION 1: ABOUT ME (Clean White) ────────────────────── */}
      <section
        ref={sec1Ref}
        aria-label="About Me Section"
        className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
        style={{
          background: '#FFFFFF',
          color: '#111111',
          willChange: 'transform',
          transformOrigin: 'center center',
          zIndex: 1,
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 py-6 md:py-8 h-full flex flex-col md:flex-row items-center justify-center gap-5 sm:gap-8 lg:gap-16">
          {/* Left: Portrait Frame (~28vw wide on desktop, object-position: top center) */}
          <div
            className="w-28 h-36 sm:w-44 sm:h-56 md:w-[28vw] md:max-w-[420px] md:min-w-[260px] md:h-[68vh] rounded-2xl md:rounded-3xl overflow-hidden border border-black/10 shadow-2xl flex-shrink-0 bg-black/5"
            style={{
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.15)',
            }}
          >
            <img
              src={portraitAsset || '/assets/about-me.jpg'}
              alt={profile.name || "Rahul"}
              onError={(e) => {
                const img = e.currentTarget
                if (img.src !== '/assets/about-me.jpg') {
                  img.src = '/assets/about-me.jpg'
                } else {
                  img.src = '/user_portrait.png'
                }
              }}
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'top center',
              }}
            />
          </div>

          {/* Right: Content */}
          <div className="flex-1 max-w-xl text-[#111111] flex flex-col justify-center pr-1 text-center md:text-left">
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-black/60 block mb-1.5 sm:mb-2">
              About Me
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#111111] mb-2 sm:mb-4 md:mb-6">
              Hi, I'm Rahul
            </h2>

            <p className="text-xs sm:text-base lg:text-lg text-black/80 leading-relaxed font-light mb-3 sm:mb-6">
              Student, software engineer and creator passionate about crafting intelligent full-stack applications, physical machine fabrication, and innovative AI systems.
            </p>

            <ul className="space-y-2 sm:space-y-3.5 text-xs sm:text-sm lg:text-base text-black/80 font-light text-left">
              {BULLET_POINTS.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5 sm:gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0 shadow-xs" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dimming overlay when being covered */}
        <div
          ref={sec1DimRef}
          className="absolute inset-0 bg-black/20 pointer-events-none"
          style={{ opacity: 0, zIndex: 10 }}
        />
      </section>

      {/* ────────────────────── SECTION 2: EDUCATION (Clean White) ────────────────────── */}
      <section
        ref={sec2Ref}
        aria-label="Education Section"
        className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
        style={{
          background: '#FAFAFA',
          color: '#111111',
          willChange: 'transform',
          transformOrigin: 'bottom center',
          zIndex: 2,
          clipPath:
            'polygon(0 28px, 28px 0, calc(50% - 60px) 0, 50% 28px, calc(50% + 60px) 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)',
          filter: 'drop-shadow(0 -15px 35px rgba(0, 0, 0, 0.1))',
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 py-6 md:py-8 h-full flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-16 pt-10 md:pt-8">
          {/* Left: College Image Frame (~28vw wide on desktop, object-fit: cover) */}
          <div
            ref={sec2ImgWrapRef}
            className="w-full max-w-[240px] sm:max-w-[320px] md:w-[28vw] md:max-w-[420px] md:min-w-[260px] h-20 sm:h-36 md:h-[68vh] rounded-2xl md:rounded-3xl overflow-hidden border border-black/10 shadow-2xl flex-shrink-0 bg-black/5"
            style={{
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.12)',
            }}
          >
            <img
              src={collegeAsset || '/assets/college.png'}
              alt={profile.college || 'College'}
              onError={(e) => {
                const img = e.currentTarget
                if (img.src !== '/assets/college.png') {
                  img.src = '/assets/college.png'
                }
              }}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Right: Content */}
          <div
            ref={sec2TextWrapRef}
            className="flex-1 max-w-xl text-[#111111] flex flex-col justify-center pr-1"
          >
            {/* Heading & Label */}
            <div className="sec2-header mb-2 sm:mb-4 md:mb-6">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-black/50 block mb-1">
                Education
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-[#111111]">
                {profile.college || 'MIC College of Technology'}
              </h2>
            </div>

            {/* Block 1: Education Details */}
            <div className="sec2-block-1 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-white border border-black/10 mb-2 sm:mb-3 md:mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-black/50 font-mono block mb-0.5 sm:mb-1">
                Degree &amp; Program
              </span>
              <h3 className="text-xs sm:text-base md:text-lg font-medium text-[#111111]">
                {profile.education || 'B.Tech — Artificial Intelligence & Machine Learning'}
              </h3>
            </div>

            {/* Block 2: Core Focus */}
            <div className="sec2-block-2 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-white border border-black/10 mb-2 sm:mb-3 md:mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-black/50 font-mono block mb-0.5 sm:mb-1">
                Core Focus
              </span>
              <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-black/80 font-light leading-relaxed">
                {profile.focus || 'Software development, AI/LLM systems, Cloud Architecture, Full-Stack Engineering'}
              </p>
            </div>

            {/* Block 3: Key Competencies */}
            <div className="sec2-block-3 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-white border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-black/50 font-mono block mb-1 sm:mb-2">
                Key Competencies
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {KEY_COMPETENCIES.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/5 border border-black/10 text-black/90 hover:border-black/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

