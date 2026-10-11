import React, { useEffect, useRef } from 'react'

interface ParticleSphereProps {
  pulseKey?: number
  isError?: boolean
  isSuccess?: boolean
  onCollapseComplete?: () => void
}

interface Particle {
  x: number
  y: number
  z: number
  digit: string
  speedFactor: number
  twinklePhase: number
}

export function ParticleSphere({
  pulseKey = 0,
  isError = false,
  isSuccess = false,
  onCollapseComplete,
}: ParticleSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pulseIntensityRef = useRef(0)
  const successStartTimeRef = useRef<number | null>(null)
  const onCollapseCompleteRef = useRef(onCollapseComplete)
  onCollapseCompleteRef.current = onCollapseComplete

  // Track pulse changes
  useEffect(() => {
    if (pulseKey > 0) {
      pulseIntensityRef.current = 1.0
    }
  }, [pulseKey])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Device Pixel Ratio scaling
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = 180
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const isMobile = window.innerWidth < 640
    const count = isMobile ? 140 : 280
    const baseRadius = 64
    const cx = size / 2
    const cy = size / 2

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Fibonacci sphere distribution for uniform points
    const particles: Particle[] = []
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // ~2.39996

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2 // 1 to -1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = goldenAngle * i
      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY

      particles.push({
        x,
        y,
        z,
        digit: Math.floor(Math.random() * 10).toString(),
        speedFactor: 0.85 + Math.random() * 0.3,
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }

    let rotX = 0.3
    let rotY = 0
    let animationFrameId: number
    let lastTime = performance.now()
    let swirlCycleTime = 0
    const SWIRL_PERIOD = 6000 // 6 seconds cycle

    const render = (now: number) => {
      const dt = Math.min(now - lastTime, 50)
      lastTime = now

      // Decay pulse
      pulseIntensityRef.current *= 0.88

      // Clear frame
      ctx.clearRect(0, 0, size, size)

      // Handle Success Collapse state
      if (isSuccess) {
        if (successStartTimeRef.current === null) {
          successStartTimeRef.current = now
        }
        const elapsed = now - successStartTimeRef.current
        const progress = Math.min(elapsed / 600, 1)

        // Rapid inward swirl and collapse
        rotY += 0.08
        rotX += 0.05
        const collapseScale = Math.pow(Math.max(0, 1 - progress), 2.2)

        // Draw collapsing particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          const cosY = Math.cos(rotY * p.speedFactor)
          const sinY = Math.sin(rotY * p.speedFactor)
          const cosX = Math.cos(rotX)
          const sinX = Math.sin(rotX)

          const x1 = p.x * cosY + p.z * sinY
          const z1 = -p.x * sinY + p.z * cosY
          const y1 = p.y * cosX - z1 * sinX
          const z2 = p.y * sinX + z1 * cosX

          const currentR = baseRadius * collapseScale
          const screenX = cx + x1 * currentR
          const screenY = cy + y1 * currentR

          ctx.font = 'bold 8px monospace'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - progress * 0.7)})`
          ctx.fillText(p.digit, screenX, screenY)
        }

        // Intense center glowing core that flashes out
        const coreSize = progress < 0.7 ? 12 + progress * 30 : (progress - 0.7) * 200
        const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, coreSize))
        flashGrad.addColorStop(0, 'rgba(255, 255, 255, 1)')
        flashGrad.addColorStop(0.3, `rgba(255, 255, 255, ${Math.min(1, progress * 1.5)})`)
        flashGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = flashGrad
        ctx.beginPath()
        ctx.arc(cx, cy, Math.max(1, coreSize), 0, Math.PI * 2)
        ctx.fill()

        if (progress >= 1) {
          if (onCollapseCompleteRef.current) {
            onCollapseCompleteRef.current()
          }
          return
        }

        animationFrameId = requestAnimationFrame(render)
        return
      }

      // Normal animation logic
      if (!prefersReducedMotion) {
        swirlCycleTime = (swirlCycleTime + dt) % SWIRL_PERIOD
      }

      // Determine swirl cycle phase:
      // 0ms - 3800ms: steady rotation
      // 3800ms - 4400ms: swirl inward
      // 4400ms - 4600ms: pinched center point
      // 4600ms - 5200ms: burst out with elastic overshoot
      // 5200ms - 6000ms: settle back to 1.0
      let currentScale = 1.0
      let swirlSpinBoost = 0
      let centerGlowAlpha = 0

      if (!prefersReducedMotion) {
        if (swirlCycleTime < 3800) {
          currentScale = 1.0
        } else if (swirlCycleTime < 4400) {
          // Swirl in
          const t = (swirlCycleTime - 3800) / 600
          // Smooth cosine curve down to 0.05
          const ease = 0.5 * (1 + Math.cos(t * Math.PI))
          currentScale = 0.05 + 0.95 * ease
          swirlSpinBoost = (1 - ease) * 0.04
          centerGlowAlpha = (1 - ease) * 0.9
        } else if (swirlCycleTime < 4600) {
          // Pinched center point
          currentScale = 0.05
          swirlSpinBoost = 0.04
          centerGlowAlpha = 1.0
        } else if (swirlCycleTime < 5200) {
          // Burst out
          const t = (swirlCycleTime - 4600) / 600
          // Elastic burst overshoot to 1.15 then back
          const burst = Math.sin(t * Math.PI) * 0.18 + t
          currentScale = Math.min(1.18, Math.max(0.05, burst))
          swirlSpinBoost = (1 - t) * 0.02
          centerGlowAlpha = (1 - t) * 0.8
        } else {
          // Settle
          const t = (swirlCycleTime - 5200) / 800
          currentScale = 1.15 - 0.15 * t
          centerGlowAlpha = 0
        }

        // Apply typing pulse boost
        if (pulseIntensityRef.current > 0.01) {
          currentScale += pulseIntensityRef.current * 0.14
        }

        // Advance 3D rotation angles
        rotY += 0.007 + swirlSpinBoost
        rotX += 0.004 + swirlSpinBoost * 0.5
      }

      // Draw faint center glowing ambient halo during swirl
      if (centerGlowAlpha > 0.05) {
        const glowRadius = 24 * (centerGlowAlpha + 0.5)
        const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius)
        radGrad.addColorStop(0, `rgba(255, 255, 255, ${centerGlowAlpha * 0.95})`)
        radGrad.addColorStop(0.3, `rgba(255, 255, 255, ${centerGlowAlpha * 0.5})`)
        radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = radGrad
        ctx.beginPath()
        ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Projection: Sort particles by z-depth so rear particles draw before front
      const projected = particles.map((p) => {
        // Rotate around Y
        const cosY = Math.cos(rotY * p.speedFactor)
        const sinY = Math.sin(rotY * p.speedFactor)
        const x1 = p.x * cosY + p.z * sinY
        const z1 = -p.x * sinY + p.z * cosY

        // Rotate around X
        const cosX = Math.cos(rotX)
        const sinX = Math.sin(rotX)
        const y1 = p.y * cosX - z1 * sinX
        const z2 = p.y * sinX + z1 * cosX

        // Perspective projection
        const fov = 180
        const zDist = fov / (fov + z2 * baseRadius * 0.4)
        const currentR = baseRadius * currentScale

        return {
          digit: p.digit,
          screenX: cx + x1 * currentR * zDist,
          screenY: cy + y1 * currentR * zDist,
          depth: z2, // -1 (back) to +1 (front)
          zDist,
        }
      })

      // Sort by depth (ascending: back to front)
      projected.sort((a, b) => a.depth - b.depth)

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (let i = 0; i < projected.length; i++) {
        const item = projected[i]
        // Depth-based opacity: back is 0.18, front is 0.95
        const normZ = (item.depth + 1) / 2 // 0 to 1
        const opacity = 0.16 + Math.pow(normZ, 1.4) * 0.82

        // Font size scales with depth
        const fontSize = Math.max(7, Math.round(7.5 + normZ * 3.5))
        ctx.font = `600 ${fontSize}px monospace`

        // Front digits gain subtle bright white glow
        if (normZ > 0.75) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, opacity + 0.1)})`
        } else {
          ctx.fillStyle = `rgba(240, 240, 245, ${opacity})`
        }

        ctx.fillText(item.digit, item.screenX, item.screenY)
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isSuccess])

  return (
    <div
      className={`relative w-[180px] h-[180px] mx-auto rounded-full border border-white/20 flex items-center justify-center overflow-hidden bg-black shadow-[0_0_30px_rgba(255,255,255,0.06)] transition-transform duration-200 ${
        isError ? 'animate-shake' : ''
      }`}
    >
      <canvas
        ref={canvasRef}
        className="w-[180px] h-[180px] pointer-events-none block"
      />
    </div>
  )
}
