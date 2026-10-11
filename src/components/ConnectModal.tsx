import React, { useState, useEffect, useRef } from 'react'
import { X, CheckCircle, ShieldCheck, Heart, Sparkles, Send } from 'lucide-react'
import { portfolioService } from '../services/portfolioData'

interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newCount: number) => void
}

export function ConnectModal({ isOpen, onClose, onSuccess }: ConnectModalProps) {
  const [name, setName] = useState('')
  const [college, setCollege] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successName, setSuccessName] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number | null>(null)

  // Confetti explosion animation on success
  const triggerConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      rotation: number
      vRot: number
    }> = []

    const colors = ['#C1121F', '#1E1F2B', '#FFD166', '#06D6A0', '#118AB2', '#9B5DE5', '#F15BB5']

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
      })
    }

    let frame = 0
    const render = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.35 // gravity
        p.rotation += p.vRot

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      })

      if (frame < 120) {
        animRef.current = requestAnimationFrame(render)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    render()
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Honeypot spam check
    if (honeypot.trim().length > 0) {
      setError('Submission error. Please try again.')
      return
    }

    // Validation
    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!college.trim()) {
      setError('Please enter your college or institution.')
      return
    }

    // Phone format validation (allows digits with optional leading + and 10 to 14 numbers)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    const phoneRegex = /^\+?[0-9]{10,14}$/
    if (!phoneRegex.test(cleanPhone)) {
      setError('Please enter a valid 10-14 digit phone number (e.g. +91 98765 43210).')
      return
    }

    setLoading(true)

    try {
      const res = portfolioService.addConnection({
        name: name.trim(),
        college: college.trim(),
        phone: phone.trim(),
        note: note.trim(),
        honeypot,
      })

      if (!res.success) {
        setError(res.message || 'Could not complete connection.')
        setLoading(false)
        return
      }

      setLoading(false)
      setSuccessName(name.trim())
      if (res.count) {
        onSuccess(res.count)
      }
      setTimeout(() => {
        triggerConfetti()
      }, 50)
    } catch (err: any) {
      setError(err?.message || 'Error saving connection.')
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setCollege('')
    setPhone('')
    setNote('')
    setError(null)
    setSuccessName(null)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif' }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white border border-black/15 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)] text-[#111111] z-10 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute top-5 right-5 p-2 rounded-full bg-black/5 hover:bg-black/10 text-black/60 hover:text-black transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {successName ? (
          /* Celebratory Success View */
          <div className="py-8 text-center flex flex-col items-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-black/5 border border-black/15 text-black flex items-center justify-center mb-5">
              <CheckCircle size={36} />
            </div>

            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111111] mb-2">
              Welcome, {successName}! 🎉
            </h3>

            <p className="text-sm sm:text-base text-black/70 font-light max-w-sm mb-6 leading-relaxed">
              Thanks for connecting with Rahul. Your contact request has been received, and the connection count has been updated!
            </p>

            <button
              onClick={handleClose}
              className="px-6 py-3 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer shadow-md"
            >
              Back to Portfolio
            </button>
          </div>
        ) : (
          /* Input Form */
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[11px] font-mono uppercase tracking-wider text-black/70 mb-3">
                <Sparkles size={12} className="text-black" />
                <span>Let's Connect</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111111] mb-1.5">
                Connect with Rahul
              </h3>
              <p className="text-xs sm:text-sm text-black/60 font-light leading-relaxed">
                Fill in your details below to link up for projects, software development, and technical engineering collaborations.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field for bot/spam prevention */}
              <input
                type="text"
                name="website_url_honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Name */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-black/60 font-mono mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shanmukh"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/[0.03] border border-black/15 text-black placeholder-black/30 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
              </div>

              {/* College */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-black/60 font-mono mb-1.5">
                  College / Institution *
                </label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. MIC College of Technology"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/[0.03] border border-black/15 text-black placeholder-black/30 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-black/60 font-mono mb-1.5">
                  Phone Number (with Country Code) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 93989 39586"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/[0.03] border border-black/15 text-black placeholder-black/30 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-black/60 font-mono mb-1.5">
                  Note / Collaboration idea (Optional)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Interested in discussing AI / machine fabrication..."
                  className="w-full px-4 py-2 rounded-xl bg-black/[0.03] border border-black/15 text-black placeholder-black/30 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <span>Connecting...</span>
                ) : (
                  <>
                    <span>Submit &amp; Connect</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Privacy Notice */}
            <div className="mt-5 pt-4 border-t border-black/10 flex items-center justify-center gap-1.5 text-center text-xs text-black/50 font-light">
              <ShieldCheck size={14} className="text-black flex-shrink-0" />
              <span>Your details are shared only with Rahul.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
