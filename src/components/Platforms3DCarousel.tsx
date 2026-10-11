import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

interface PlatformDef {
  id: string
  name: string
  handle: string
  url: string
  brandColor: string
  ariaLabel: string
  logo: React.ReactNode
}

// Crisp official inline brand SVGs
const InstagramLogo = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="transition-transform duration-300 group-hover:scale-108 drop-shadow-md">
    <defs>
      <radialGradient id="ig-grad-3d" cx="20%" cy="115%" r="135%">
        <stop offset="0%" stopColor="#ffda77" />
        <stop offset="12%" stopColor="#fca951" />
        <stop offset="38%" stopColor="#ee4759" />
        <stop offset="65%" stopColor="#d12c8b" />
        <stop offset="100%" stopColor="#4c63d2" />
      </radialGradient>
    </defs>
    <rect width="56" height="56" rx="16" fill="url(#ig-grad-3d)" />
    <rect x="11" y="11" width="34" height="34" rx="10" fill="none" stroke="#ffffff" strokeWidth="3.2" />
    <circle cx="28" cy="28" r="8" fill="none" stroke="#ffffff" strokeWidth="3.2" />
    <circle cx="37.5" cy="18.5" r="2.2" fill="#ffffff" />
  </svg>
)

// Pixel-perfect official WhatsApp Logo (Simple Icons official vector)
const WhatsAppLogo = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="transition-transform duration-300 group-hover:scale-108 drop-shadow-md">
    <rect width="56" height="56" rx="16" fill="#25D366" />
    <g transform="translate(12, 12) scale(1.3333)">
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
        fill="#ffffff"
      />
    </g>
  </svg>
)

const LinkedInLogo = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="transition-transform duration-300 group-hover:scale-108 drop-shadow-md">
    <rect width="56" height="56" rx="16" fill="#0A66C2" />
    <path
      d="M20 17c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3zm-6 7.5h6v18h-6v-18zm9.5 0h5.7v2.5h.1c.8-1.6 2.8-3.1 5.7-3.1 6.1 0 7.2 4 7.2 9.2v9.4h-6v-8.4c0-2 0-4.6-2.8-4.6s-3.2 2.2-3.2 4.4v8.6h-6.7v-18z"
      fill="#ffffff"
    />
  </svg>
)

const GitHubLogo = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="transition-transform duration-300 group-hover:scale-108 drop-shadow-md">
    <rect width="56" height="56" rx="16" fill="#181717" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M28 13c-8.3 0-15 6.7-15 15 0 6.6 4.3 12.2 10.3 14.2.8.1 1-.3 1-.7v-2.7c-4.2.9-5.1-2-5.1-2-.7-1.8-1.7-2.3-1.7-2.3-1.4-.9.1-.9.1-.9 1.5.1 2.3 1.6 2.3 1.6 1.4 2.3 3.6 1.6 4.4 1.3.1-1 .6-1.6 1-2-3.3-.4-6.8-1.7-6.8-7.4 0-1.6.6-3 1.5-4-.2-.4-.7-1.9.1-4 0 0 1.3-.4 4.2 1.5 1.2-.3 2.5-.5 3.8-.5 1.3 0 2.6.2 3.8.5 2.9-1.9 4.2-1.5 4.2-1.5.8 2.1.3 3.6.1 4 1 1 1.5 2.4 1.5 4 0 5.7-3.5 7-6.8 7.4.6.5 1 1.4 1 2.9v4.3c0 .4.3.8 1 .7 6-2 10.3-7.6 10.3-14.2 0-8.3-6.7-15-15-15z"
      fill="#ffffff"
    />
  </svg>
)

const BASE_PLATFORMS: PlatformDef[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@shanmukh_rahul.joga',
    url: 'https://instagram.com/shanmukh_rahul.joga',
    brandColor: '#E1306C',
    ariaLabel: 'Open Instagram profile (@shanmukh_rahul.joga)',
    logo: <InstagramLogo />,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    handle: 'Chat with me',
    url: 'https://wa.me/919398939586',
    brandColor: '#25D366',
    ariaLabel: 'Chat with me on WhatsApp (+91 9398939586)',
    logo: <WhatsAppLogo />,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'Shanmukh Rahul Joga',
    url: 'https://www.linkedin.com/in/shanmukh-rahul-joga-5b38a1367',
    brandColor: '#0A66C2',
    ariaLabel: 'Open LinkedIn profile (Shanmukh Rahul Joga)',
    logo: <LinkedInLogo />,
  },
  {
    id: 'github',
    name: 'GitHub',
    handle: '@J-S-RAHUL',
    url: 'https://github.com/J-S-RAHUL',
    brandColor: '#181717',
    ariaLabel: 'Open GitHub profile (@J-S-RAHUL)',
    logo: <GitHubLogo />,
  },
]

// 8 slots in the carousel ring (repeats the 4 platforms twice for a dense 3D cylinder)
const RING_SLOTS: (PlatformDef & { slotIndex: number })[] = [
  ...BASE_PLATFORMS.map((p, i) => ({ ...p, slotIndex: i })),
  ...BASE_PLATFORMS.map((p, i) => ({ ...p, slotIndex: i + 4 })),
]

/* ──────────────── 4K ANIMATED SPACE CANVAS (STARS + METEORS) ──────────────── */
interface Star {
  x: number
  y: number
  size: number
  baseAlpha: number
  twinkleSpeed: number
  twinklePhase: number
  color: string
  isBright: boolean
}

interface Meteor {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  alpha: number
  decay: number
}

function SpaceStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let stars: Star[] = []
    let meteors: Meteor[] = []
    let lastMeteorTime = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      // Generate 4K high-density star field
      const starCount = Math.floor((rect.width * rect.height) / 2800)
      const starColors = ['#ffffff', '#ffffff', '#e0f2fe', '#bae6fd', '#f3e8ff', '#fef9c3']

      stars = []
      for (let i = 0; i < starCount; i++) {
        const isBright = Math.random() < 0.08
        stars.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          size: isBright ? 1.6 + Math.random() * 0.9 : 0.5 + Math.random() * 1.1,
          baseAlpha: isBright ? 0.8 + Math.random() * 0.2 : 0.2 + Math.random() * 0.6,
          twinkleSpeed: 0.002 + Math.random() * 0.004,
          twinklePhase: Math.random() * Math.PI * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          isBright,
        })
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const render = (time: number) => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Draw twinkling stars with optical diffraction flares
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.35
        const currentAlpha = Math.max(0.1, Math.min(1, s.baseAlpha + twinkle))

        ctx.save()
        ctx.globalAlpha = currentAlpha
        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()

        // 4-point cross diffraction flare for brightest celestial stars
        if (s.isBright && currentAlpha > 0.65) {
          ctx.strokeStyle = s.color
          ctx.lineWidth = 0.5
          ctx.globalAlpha = currentAlpha * 0.45
          const flare = s.size * 3.8
          ctx.beginPath()
          ctx.moveTo(s.x - flare, s.y)
          ctx.lineTo(s.x + flare, s.y)
          ctx.moveTo(s.x, s.y - flare)
          ctx.lineTo(s.x, s.y + flare)
          ctx.stroke()
        }
        ctx.restore()
      }

      // Spawning periodic shooting stars / meteors
      if (time - lastMeteorTime > 3200 + Math.random() * 2500) {
        lastMeteorTime = time
        meteors.push({
          x: Math.random() * rect.width * 0.8,
          y: Math.random() * (rect.height * 0.4),
          length: 90 + Math.random() * 70,
          speed: 8 + Math.random() * 5,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
          alpha: 1.0,
          decay: 0.016 + Math.random() * 0.01,
        })
      }

      // Update and draw shooting stars
      for (let j = meteors.length - 1; j >= 0; j--) {
        const m = meteors[j]
        m.x += Math.cos(m.angle) * m.speed
        m.y += Math.sin(m.angle) * m.speed
        m.alpha -= m.decay

        if (m.alpha <= 0 || m.x > rect.width + 120 || m.y > rect.height + 120) {
          meteors.splice(j, 1)
          continue
        }

        ctx.save()
        const tailX = m.x - Math.cos(m.angle) * m.length
        const tailY = m.y - Math.sin(m.angle) * m.length
        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y)
        grad.addColorStop(0, 'rgba(56, 189, 248, 0)')
        grad.addColorStop(0.7, `rgba(165, 243, 252, ${m.alpha * 0.45})`)
        grad.addColorStop(1, `rgba(255, 255, 255, ${m.alpha})`)

        ctx.strokeStyle = grad
        ctx.lineWidth = 1.8
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(m.x, m.y)
        ctx.stroke()

        // Luminous meteor head
        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`
        ctx.beginPath()
        ctx.arc(m.x, m.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  )
}

/* ──────────────── 3D CAROUSEL COMPONENT ──────────────── */
export function Platforms3DCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  // Rotation states (smooth physics)
  const [currentRotation, setCurrentRotation] = useState(0)
  const targetRotation = useRef(0)
  const currentRotationRef = useRef(0)

  // Dragging state
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startRot = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const velocity = useRef(0)
  const didDrag = useRef(false)
  const snapTimer = useRef<number | null>(null)

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Responsive dimensions
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [])

  const isMobile = windowWidth < 768
  // Radius calculation: card width ~220px desktop -> radius ~310px; mobile ~150px -> radius ~205px
  const cardWidth = isMobile ? 150 : 220
  const cardHeight = isMobile ? 210 : 300
  const radius = isMobile ? 205 : 310

  // Snap to nearest 45-degree angle
  const snapToNearest = useCallback(() => {
    const step = 45
    targetRotation.current = Math.round(targetRotation.current / step) * step
  }, [])

  // Physics animation loop (lerp smoothly toward target)
  useEffect(() => {
    let animId: number
    const tick = () => {
      const diff = targetRotation.current - currentRotationRef.current
      if (Math.abs(diff) > 0.01) {
        currentRotationRef.current += diff * 0.12
        setCurrentRotation(currentRotationRef.current)
        if (ringRef.current) {
          ringRef.current.style.transform = `rotateY(${currentRotationRef.current}deg)`
        }
      }
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [])

  // Non-passive wheel event listener to rotate ring smoothly
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(delta) < 2) return
      e.preventDefault()
      targetRotation.current -= delta * 0.15

      if (snapTimer.current) window.clearTimeout(snapTimer.current)
      snapTimer.current = window.setTimeout(snapToNearest, 180)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [snapToNearest])

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    didDrag.current = false
    startX.current = e.clientX
    startRot.current = targetRotation.current
    lastX.current = e.clientX
    lastTime.current = performance.now()
    velocity.current = 0
    if (snapTimer.current) window.clearTimeout(snapTimer.current)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 6) {
      didDrag.current = true
    }
    targetRotation.current = startRot.current + dx * 0.38

    const now = performance.now()
    const dt = now - lastTime.current
    if (dt > 0) {
      velocity.current = (e.clientX - lastX.current) / dt
    }
    lastX.current = e.clientX
    lastTime.current = now
  }

  const handleMouseUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    if (didDrag.current) {
      targetRotation.current += velocity.current * 140
      snapToNearest()
    }
  }

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true
    didDrag.current = false
    startX.current = e.touches[0].clientX
    startRot.current = targetRotation.current
    lastX.current = e.touches[0].clientX
    lastTime.current = performance.now()
    velocity.current = 0
    if (snapTimer.current) window.clearTimeout(snapTimer.current)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    const dx = e.touches[0].clientX - startX.current
    if (Math.abs(dx) > 6) {
      didDrag.current = true
    }
    targetRotation.current = startRot.current + dx * 0.42

    const now = performance.now()
    const dt = now - lastTime.current
    if (dt > 0) {
      velocity.current = (e.touches[0].clientX - lastX.current) / dt
    }
    lastX.current = e.touches[0].clientX
    lastTime.current = now
  }

  const handleTouchEnd = () => {
    if (!isDragging.current) return
    isDragging.current = false
    if (didDrag.current) {
      targetRotation.current += velocity.current * 160
      snapToNearest()
    }
  }

  // Window-level safety release
  useEffect(() => {
    const handleGlobalRelease = () => {
      if (isDragging.current) {
        isDragging.current = false
        if (didDrag.current) {
          targetRotation.current += velocity.current * 140
          snapToNearest()
        }
      }
    }
    window.addEventListener('mouseup', handleGlobalRelease)
    window.addEventListener('touchend', handleGlobalRelease)
    return () => {
      window.removeEventListener('mouseup', handleGlobalRelease)
      window.removeEventListener('touchend', handleGlobalRelease)
    }
  }, [snapToNearest])

  // Arrow button clicks
  const rotateLeft = () => {
    targetRotation.current += 45
    snapToNearest()
  }

  const rotateRight = () => {
    targetRotation.current -= 45
    snapToNearest()
  }

  // Rotate specific slot to front
  const rotateSlotToFront = (slotIdx: number) => {
    const currentSlot = Math.round((-targetRotation.current / 45) % 8 + 8) % 8
    let diff = slotIdx - currentSlot
    if (diff > 4) diff -= 8
    if (diff < -4) diff += 8
    targetRotation.current -= diff * 45
    snapToNearest()
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') rotateLeft()
      if (e.key === 'ArrowRight') rotateRight()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Calculate which slot is facing front
  const normalizedRotation = ((-currentRotation % 360) + 360) % 360
  const frontSlotIndex = Math.round(normalizedRotation / 45) % 8
  const activeDotIndex = frontSlotIndex % 4

  // Jump to specific platform from dots
  const jumpToPlatform = (dotIdx: number) => {
    const currentNormSlot = Math.round((-targetRotation.current / 45) % 8 + 8) % 8
    let diff = dotIdx - (currentNormSlot % 4)
    if (diff > 2) diff -= 4
    if (diff < -2) diff += 4
    targetRotation.current -= diff * 45
    snapToNearest()
  }

  /* ──────────────── Reduced Motion Accessible Fallback ──────────────── */
  if (prefersReducedMotion) {
    return (
      <div className="relative w-full py-16 px-4 max-w-5xl mx-auto bg-[#030308] text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BASE_PLATFORMS.map((platform) => (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={platform.ariaLabel}
              className="bg-white/10 border border-white/20 hover:border-cyan-400/50 rounded-[20px] p-6 flex flex-col items-center text-center shadow-lg transition-all cursor-pointer backdrop-blur-md"
            >
              <div className="mb-4">{platform.logo}</div>
              <h3 className="text-lg font-medium text-white mb-1">{platform.name}</h3>
              <p className="text-xs font-mono text-white/60 mb-4">{platform.handle}</p>
              <span className="text-xs font-medium text-cyan-300 inline-flex items-center gap-1 underline underline-offset-4">
                Open {platform.name} <ArrowUpRight size={13} />
              </span>
            </a>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="relative w-full py-12 sm:py-20 pb-32 sm:pb-40 select-none overflow-hidden flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-colors duration-700"
      style={{
        backgroundColor: '#030308',
        fontFamily: '"Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif',
        touchAction: 'pan-y',
      }}
    >
      {/* ──────── 1. 4K ANIMATED SPACE CANVAS WITH STARS & METEORS ──────── */}
      <SpaceStarfield />

      {/* ──────── 2. VIBRANT COSMIC NEBULA GLOWS ──────── */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[550px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/12 to-transparent rounded-full blur-[110px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 w-[700px] h-[600px] bg-gradient-to-bl from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] bg-radial from-violet-600/10 via-transparent to-transparent rounded-full blur-[90px] pointer-events-none" />

      {/* ──────── 3. HEADER INFO BANNER (SPACE THEMED) ──────── */}
      <div className="relative z-10 text-center max-w-xl mx-auto px-4 mb-4 sm:mb-8 pointer-events-none">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[11px] font-mono uppercase tracking-wider text-cyan-300 mb-3 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
          <Sparkles size={12} className="text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Interactive 3D Cosmos Ring</span>
        </span>
        <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
          Social &amp; Developer Channels
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300/80 font-light mt-2 max-w-md mx-auto">
          Drag horizontally, scroll, or use arrows to navigate the galaxy ring. Tap any card to open directly.
        </p>
      </div>

      {/* ──────── 4. 3D PERSPECTIVE STAGE ──────── */}
      <div
        className="relative w-full flex items-center justify-center z-10"
        style={{
          height: isMobile ? '380px' : '480px',
          perspective: isMobile ? '950px' : '1300px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* The 3D Preserve-3D Rotating Ring */}
        <div
          ref={ringRef}
          className="relative flex items-center justify-center will-change-transform"
          style={{
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            transformStyle: 'preserve-3d',
            transform: `rotateY(${currentRotation}deg)`,
          }}
        >
          {RING_SLOTS.map((platform, i) => {
            const baseAngle = i * 45
            // Determine relative angle to camera
            const rawAngle = (baseAngle + currentRotation) % 360
            const normAngle = ((rawAngle + 180) % 360 + 360) % 360 - 180
            const isFront = Math.abs(normAngle) < 22.5
            const isRear = Math.abs(normAngle) > 90

            // Exact z-index so front cards are always on top and clickable
            const zIndex = isFront ? 50 : Math.round(100 - Math.abs(normAngle))

            // Lift front card slightly for depth hierarchy
            const extraLift = isFront ? (isMobile ? 16 : 26) : 0
            const extraScale = isFront ? 1.05 : 0.98

            return (
              <div
                key={`${platform.id}-${i}`}
                style={{
                  position: 'absolute',
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${baseAngle}deg) translateZ(${radius + extraLift}px) scale(${extraScale})`,
                  zIndex: zIndex,
                  pointerEvents: isRear ? 'none' : 'auto',
                  willChange: 'transform',
                }}
                className="transition-transform duration-300"
              >
                {/* Direct-Access Card (High-contrast, crystal-clear white card against deep space) */}
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform.ariaLabel}
                  onClick={(e) => {
                    // Prevent navigation only if the user was actively dragging
                    if (didDrag.current) {
                      e.preventDefault()
                      return
                    }
                    // If clicking a side card, also snap it to front
                    if (!isFront) {
                      rotateSlotToFront(i)
                    }
                    // Robust click trigger: open link directly in a new tab
                    window.open(platform.url, '_blank', 'noopener,noreferrer')
                    e.preventDefault()
                  }}
                  className={`group block w-full h-full relative cursor-pointer outline-none rounded-[20px] transition-all duration-300 ${
                    isFront
                      ? 'shadow-[0_24px_60px_-10px_rgba(0,0,0,0.8),0_0_35px_rgba(56,189,248,0.22)] ring-1 ring-white/30 hover:-translate-y-1'
                      : 'shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] opacity-85 hover:opacity-100'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* ──────── FRONT FACE (White Card with Cosmic Polish) ──────── */}
                  <div
                    className="absolute inset-0 bg-white/98 backdrop-blur-md border border-white/50 rounded-[20px] p-5 sm:p-6 flex flex-col items-center justify-between text-center overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Top subtle badge */}
                    <div className="w-full flex items-center justify-between text-[10px] font-mono text-black/45 uppercase tracking-widest pointer-events-none">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: platform.brandColor }} />
                        <span>Direct Channel</span>
                      </span>
                      <ArrowUpRight size={13} className="text-black/35 group-hover:text-black transition-colors" />
                    </div>

                    {/* Brand Logo & Name */}
                    <div className="flex flex-col items-center space-y-3 my-auto pointer-events-none">
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        {platform.logo}
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg sm:text-xl font-medium tracking-tight text-[#111111]">
                          {platform.name}
                        </h3>
                        <p className="text-xs font-mono text-black/55 truncate max-w-[170px]">
                          {platform.handle}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Direct Action Pill */}
                    <div className="w-full py-2.5 px-3 rounded-full bg-[#111111] text-white text-xs font-medium font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md group-hover:bg-black group-hover:shadow-[0_0_15px_rgba(0,0,0,0.35)] group-hover:scale-[1.02] transition-all">
                      <span>Open {platform.name}</span>
                      <ArrowUpRight size={13} />
                    </div>
                  </div>

                  {/* ──────── BACK FACE (Dark Slate Cosmic Card on Rear of Cylinder) ──────── */}
                  <div
                    className="absolute inset-0 bg-[#0C0E1C]/92 border border-white/15 rounded-[20px] p-5 sm:p-6 flex flex-col items-center justify-between text-center text-white overflow-hidden shadow-2xl backdrop-blur-md pointer-events-none"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {/* Top brand indicator */}
                    <div className="w-full flex items-center justify-between text-[10px] font-mono text-white/50 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: platform.brandColor }}
                        />
                        <span>{platform.name}</span>
                      </span>
                      <ArrowUpRight size={14} className="text-white/60" />
                    </div>

                    {/* Center: Open [Platform] with arrow icon */}
                    <div className="flex flex-col items-center space-y-3 my-auto">
                      <div
                        className="w-13 h-13 rounded-2xl flex items-center justify-center text-white shadow-md border border-white/20"
                        style={{ backgroundColor: `${platform.brandColor}35` }}
                      >
                        <ArrowUpRight size={26} className="text-white" />
                      </div>

                      <div className="space-y-1 px-1">
                        <span className="text-lg sm:text-xl font-medium text-white tracking-tight flex items-center justify-center gap-1.5">
                          <span>Open {platform.name}</span>
                          <ArrowUpRight size={15} className="text-white/80" />
                        </span>
                        <p className="text-xs font-mono text-white/50 truncate max-w-[170px]">
                          {platform.handle}
                        </p>
                      </div>
                    </div>

                    {/* Direct Launch Link button */}
                    <div className="w-full py-2 px-3 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm">
                      <span>Launch Link</span>
                      <ArrowUpRight size={12} />
                    </div>
                  </div>
                </a>
              </div>
            )
          })}
        </div>

        {/* Left & Right Carousel Navigation Arrows (Glassmorphic Space Style) */}
        <button
          onClick={rotateLeft}
          aria-label="Previous platform"
          className="absolute left-3 sm:left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.6)] text-white backdrop-blur-xl flex items-center justify-center transition-all cursor-pointer z-30 hover:scale-108 active:scale-95 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={rotateRight}
          aria-label="Next platform"
          className="absolute right-3 sm:right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.6)] text-white backdrop-blur-xl flex items-center justify-center transition-all cursor-pointer z-30 hover:scale-108 active:scale-95 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* ──────── 5. CAROUSEL INDICATOR DOTS (GLOWING COSMIC PILLS) ──────── */}
      <div className="relative z-10 flex items-center justify-center gap-2.5 mt-4 sm:mt-8">
        {BASE_PLATFORMS.map((platform, dotIdx) => {
          const isActive = activeDotIndex === dotIdx
          return (
            <button
              key={platform.id}
              onClick={() => jumpToPlatform(dotIdx)}
              aria-label={`Jump to ${platform.name}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                isActive
                  ? 'w-8 h-2.5 bg-cyan-400 shadow-[0_0_14px_#38bdf8]'
                  : 'w-2.5 h-2.5 bg-white/25 hover:bg-white/50 hover:shadow-[0_0_8px_rgba(255,255,255,0.6)]'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
