import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { PostItem } from '../types'
import { ExternalLink, Layers } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface PostsScrollShowcaseProps {
  posts: PostItem[]
}

function power3InOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function PostsScrollShowcase({ posts }: PostsScrollShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const isReducedMotionRef = useRef(false)

  // Track progress and current display index
  const [scrollProgress, setScrollProgress] = useState(0)

  // Preload all post images
  useEffect(() => {
    posts.forEach((post) => {
      if (post.imageUrl) {
        const img = new Image()
        img.src = post.imageUrl
      }
    })
  }, [posts])

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    isReducedMotionRef.current = mq.matches
    const listener = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches
    }
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [])

  // Window dimension listener to recalculate slot geometry on resize
  const [windowDimensions, setWindowDimensions] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1200,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  })

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

  // GSAP ScrollTrigger Setup
  useEffect(() => {
    if (!containerRef.current || !stageRef.current || posts.length <= 1) return

    const totalScrollDistance = (posts.length - 1) * window.innerHeight

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

    return () => ctx.revert()
  }, [posts.length, windowDimensions])

  // Calculate dynamic geometry for the 3 slots
  const isMobile = windowDimensions.w < 768

  const slotGeometry = useMemo(() => {
    const vw = windowDimensions.w
    const vh = windowDimensions.h

    if (!isMobile) {
      // Desktop
      const wMain = Math.min(520, Math.max(310, vw * 0.38))
      const hMain = wMain * 1.25 // 4:5 portrait
      const cxMain = vw * 0.42 // Left of center
      const cyMain = vh * 0.51

      const wPrev = Math.min(105, Math.max(65, vw * 0.072))
      const hPrev = wPrev * 1.25
      const sPrev = wPrev / wMain
      const cxPrev = cxMain - wMain * 0.58 - 18
      const cyPrev = cyMain - hMain * 0.40

      const wNext = Math.min(130, Math.max(80, vw * 0.092))
      const hNext = wNext * 1.25
      const sNext = wNext / wMain
      const cxNext = cxMain + wMain * 0.58 + 18
      const cyNext = cyMain + hMain * 0.40

      return {
        wMain,
        hMain,
        cxMain,
        cyMain,
        sPrev,
        dxPrev: cxPrev - cxMain,
        dyPrev: cyPrev - cyMain,
        sNext,
        dxNext: cxNext - cxMain,
        dyNext: cyNext - cyMain,
      }
    } else {
      // Mobile Portrait
      const wMain = Math.min(350, vw * 0.72)
      const hMain = wMain * 1.25
      const cxMain = vw * 0.50
      const cyMain = vh * 0.43

      const wPrev = vw * 0.15
      const sPrev = wPrev / wMain
      const cxPrev = cxMain - wMain * 0.44
      const cyPrev = cyMain - hMain * 0.50

      const wNext = vw * 0.18
      const sNext = wNext / wMain
      const cxNext = cxMain + wMain * 0.44
      const cyNext = cyMain + hMain * 0.50

      return {
        wMain,
        hMain,
        cxMain,
        cyMain,
        sPrev,
        dxPrev: cxPrev - cxMain,
        dyPrev: cyPrev - cyMain,
        sNext,
        dxNext: cxNext - cxMain,
        dyNext: cyNext - cyMain,
      }
    }
  }, [windowDimensions, isMobile])

  // Map progress to active step & interpolation variables
  const count = posts.length
  let stepIndex = 0
  let stepRawU = 0

  if (count > 1) {
    const rawT = scrollProgress * (count - 1)
    stepIndex = Math.min(Math.floor(rawT), count - 2)
    stepRawU = Math.max(0, Math.min(1, rawT - stepIndex))
  }

  const easedU = isReducedMotionRef.current ? (stepRawU >= 0.5 ? 1 : 0) : power3InOut(stepRawU)

  // Active post for caption and counter
  const activeCaptionIndex = stepRawU < 0.5 ? stepIndex : Math.min(stepIndex + 1, count - 1)
  const activePost = posts[activeCaptionIndex] || posts[0]

  // Caption fade in/out animation calculations
  let captionOpacity = 1
  let captionTranslateY = 0

  if (!isReducedMotionRef.current && count > 1) {
    if (stepRawU < 0.4) {
      const p = stepRawU / 0.4
      captionOpacity = 1 - p
      captionTranslateY = p * 20
    } else if (stepRawU < 0.6) {
      captionOpacity = 0
      captionTranslateY = 20
    } else {
      const p = (stepRawU - 0.6) / 0.4
      captionOpacity = p
      captionTranslateY = (1 - p) * -20
    }
  }

  /* ──────────────── Empty State ──────────────── */
  if (count === 0) {
    return (
      <div
        className="w-full h-screen flex flex-col items-center justify-center p-6 selection:bg-black selection:text-[#F1F2D9]"
        style={{ backgroundColor: '#F1F2D9', fontFamily: '"Space Grotesk", sans-serif' }}
      >
        <div className="max-w-md w-full bg-white/70 backdrop-blur-md border border-black/10 rounded-[24px] p-8 text-center shadow-lg flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center text-black/60">
            <Layers size={24} />
          </div>
          <h2 className="text-2xl font-light text-black">No posts yet</h2>
          <p className="text-[13px] text-black/60 font-light leading-relaxed">
            Showcase moments and engineering highlights published via the Admin dashboard will appear here in the scroll showcase.
          </p>
        </div>
      </div>
    )
  }

  /* ──────────────── Single Post State (Static) ──────────────── */
  if (count === 1) {
    const single = posts[0]
    return (
      <div
        className="w-full h-screen relative overflow-hidden flex flex-col justify-between p-6 sm:p-12 selection:bg-black selection:text-[#F1F2D9]"
        style={{ backgroundColor: '#F1F2D9', fontFamily: '"Space Grotesk", sans-serif' }}
      >
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 max-w-5xl mx-auto w-full">
          <div
            className="rounded-[18px] overflow-hidden shadow-[0_20px_45px_-10px_rgba(0,0,0,0.18)] border border-black/10 aspect-[4/5] bg-black/5"
            style={{ width: isMobile ? '70vw' : '38vw', maxWidth: '500px' }}
          >
            <img
              src={single.imageUrl}
              alt={single.caption || 'Post'}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="max-w-[280px] text-left">
            <p className="text-[13px] leading-relaxed text-[#2C2D25] font-light">
              {single.caption}
            </p>
            {single.linkUrl && (
              <a
                href={single.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#111111] underline underline-offset-4 hover:text-black transition-colors mt-3"
              >
                <span>View post</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>

        {/* Tiny Fixed Footer */}
        <div className="w-full flex items-center justify-between text-xs font-mono text-black/60 pt-4 border-t border-black/10">
          <span>Posts</span>
          <span>1 / 1</span>
        </div>
      </div>
    )
  }

  /* ──────────────── Multi-Post Dynamic Showcase ──────────────── */
  // Identify the 4 active post cards in this scroll segment
  const prevIdx = stepIndex - 1 // fading out
  const mainIdx = stepIndex // moving to prev
  const nextIdx = stepIndex + 1 // moving to main
  const upcomingIdx = stepIndex + 2 // scaling in to next

  // 1. Post k: MAIN -> PREV
  const currentPost = posts[mainIdx]
  const curDx = slotGeometry.dxPrev * easedU
  const curDy = slotGeometry.dyPrev * easedU
  const curScale = 1.0 + (slotGeometry.sPrev - 1.0) * easedU

  // 2. Post k+1: NEXT -> MAIN
  const nextPost = posts[nextIdx]
  const nextDx = slotGeometry.dxNext * (1 - easedU)
  const nextDy = slotGeometry.dyNext * (1 - easedU)
  const nextScale = slotGeometry.sNext + (1.0 - slotGeometry.sNext) * easedU

  // 3. Post k-1: PREV -> 0 (Outgoing)
  const outgoingPost = prevIdx >= 0 ? posts[prevIdx] : null
  const outDx = slotGeometry.dxPrev - 25 * easedU
  const outDy = slotGeometry.dyPrev - 15 * easedU
  const outScale = slotGeometry.sPrev * (1 - easedU)
  const outOpacity = Math.max(0, 1 - easedU * 1.5)

  // 4. Post k+2: 0 -> NEXT (Incoming)
  const incomingPost = upcomingIdx < count ? posts[upcomingIdx] : null
  const inDx = slotGeometry.dxNext
  const inDy = slotGeometry.dyNext
  const inScale = slotGeometry.sNext * easedU
  const inOpacity = Math.min(1, easedU * 1.5)

  return (
    <div
      ref={containerRef}
      id="posts-showcase-container"
      className="relative w-full"
      style={{
        height: `${(count - 1) * 100 + 100}vh`,
        fontFamily: '"Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Pinned 100vh stage */}
      <div
        ref={stageRef}
        className="w-full h-screen overflow-hidden relative flex flex-col justify-between selection:bg-black selection:text-[#F1F2D9]"
        style={{ backgroundColor: '#F1F2D9' }}
      >
        {/* Stage Content */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Card 3: Outgoing PREV thumbnail (post k-1) */}
          {outgoingPost && outgoingPost.imageUrl && (
            <div
              key={`post-${outgoingPost.id}-out`}
              className="absolute overflow-hidden rounded-[18px] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.16)] border border-black/10 bg-black/5 pointer-events-none will-change-transform"
              style={{
                width: slotGeometry.wMain,
                height: slotGeometry.hMain,
                left: slotGeometry.cxMain - slotGeometry.wMain / 2,
                top: slotGeometry.cyMain - slotGeometry.hMain / 2,
                transform: `translate3d(${outDx}px, ${outDy}px, 0) scale(${outScale})`,
                opacity: outOpacity,
                zIndex: 10,
              }}
            >
              <img
                src={outgoingPost.imageUrl}
                alt={outgoingPost.caption || ''}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* Card 1: MAIN -> PREV (post k) */}
          {currentPost && currentPost.imageUrl && (
            <div
              key={`post-${currentPost.id}-main`}
              className="absolute overflow-hidden rounded-[18px] shadow-[0_20px_45px_-10px_rgba(0,0,0,0.18)] border border-black/10 bg-black/5 will-change-transform"
              style={{
                width: slotGeometry.wMain,
                height: slotGeometry.hMain,
                left: slotGeometry.cxMain - slotGeometry.wMain / 2,
                top: slotGeometry.cyMain - slotGeometry.hMain / 2,
                transform: `translate3d(${curDx}px, ${curDy}px, 0) scale(${curScale})`,
                opacity: 1,
                zIndex: 15,
              }}
            >
              <img
                src={currentPost.imageUrl}
                alt={currentPost.caption || ''}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* Card 2: NEXT -> MAIN (post k+1) */}
          {nextPost && nextPost.imageUrl && (
            <div
              key={`post-${nextPost.id}-next`}
              className="absolute overflow-hidden rounded-[18px] shadow-[0_20px_45px_-10px_rgba(0,0,0,0.18)] border border-black/10 bg-black/5 will-change-transform"
              style={{
                width: slotGeometry.wMain,
                height: slotGeometry.hMain,
                left: slotGeometry.cxMain - slotGeometry.wMain / 2,
                top: slotGeometry.cyMain - slotGeometry.hMain / 2,
                transform: `translate3d(${nextDx}px, ${nextDy}px, 0) scale(${nextScale})`,
                opacity: 1,
                zIndex: 20,
              }}
            >
              <img
                src={nextPost.imageUrl}
                alt={nextPost.caption || ''}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* Card 4: Incoming NEXT thumbnail (post k+2) */}
          {incomingPost && incomingPost.imageUrl && (
            <div
              key={`post-${incomingPost.id}-in`}
              className="absolute overflow-hidden rounded-[18px] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.16)] border border-black/10 bg-black/5 pointer-events-none will-change-transform"
              style={{
                width: slotGeometry.wMain,
                height: slotGeometry.hMain,
                left: slotGeometry.cxMain - slotGeometry.wMain / 2,
                top: slotGeometry.cyMain - slotGeometry.hMain / 2,
                transform: `translate3d(${inDx}px, ${inDy}px, 0) scale(${inScale})`,
                opacity: inOpacity,
                zIndex: 10,
              }}
            >
              <img
                src={incomingPost.imageUrl}
                alt={incomingPost.caption || ''}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* Dynamic Caption Block (Desktop: right of main; Mobile: below main) */}
          <div
            className={`absolute z-30 transition-none ${isMobile
                ? 'text-center flex flex-col items-center px-6'
                : 'text-left'
              }`}
            style={{
              left: isMobile
                ? '50%'
                : slotGeometry.cxMain + slotGeometry.wMain / 2 + (windowDimensions.w * 0.04),
              top: isMobile
                ? slotGeometry.cyMain + slotGeometry.hMain / 2 + 18
                : slotGeometry.cyMain - 40,
              transform: isMobile
                ? `translateX(-50%) translateY(${captionTranslateY}px)`
                : `translateY(${captionTranslateY}px)`,
              opacity: captionOpacity,
              maxWidth: isMobile ? '82vw' : '280px',
            }}
          >
            <p className="text-[13px] leading-relaxed text-[#2C2D25] font-light">
              {activePost?.caption || ''}
            </p>
            {activePost?.linkUrl && (
              <a
                href={activePost.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#111111] underline underline-offset-4 hover:text-black transition-colors mt-2.5 cursor-pointer"
              >
                <span>View post</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>

        {/* Tiny Fixed Footer */}
        <footer className="w-full px-6 sm:px-12 pb-6 sm:pb-8 flex items-center justify-between text-xs font-mono text-[#2C2D25]/60 z-30 pointer-events-none select-none">
          <span className="tracking-widest uppercase font-medium">Posts</span>
          <span className="tracking-wider font-medium">
            {activeCaptionIndex + 1} / {count}
          </span>
        </footer>
      </div>
    </div>
  )
}
