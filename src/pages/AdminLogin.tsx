import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { portfolioService } from '../services/portfolioData'
import { ParticleSphere } from '../components/ParticleSphere'
import { ArrowLeft, Loader2 } from 'lucide-react'

const RATE_LIMIT_KEY = 'admin_otp_rate_limit'
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes

interface RateLimitState {
  attempts: number
  lockUntil: number
}

function getRateLimit(): RateLimitState {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {}
  return { attempts: 0, lockUntil: 0 }
}

function setRateLimit(state: RateLimitState) {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state))
  } catch {}
}

export function AdminLogin() {
  const navigate = useNavigate()

  // Steps: 1 = Admin Access (Email), 2 = Enter Code (4-digit passcode: 3117)
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState<string[]>(['', '', '', ''])
  const [activeBoxIndex, setActiveBoxIndex] = useState(0)

  // Status & Feedback
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const [isLocked, setIsLocked] = useState(false)
  const [lockRemainingMin, setLockRemainingMin] = useState(0)

  // Sphere Animations
  const [pulseCount, setPulseCount] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [flashWhite, setFlashWhite] = useState(false)

  // References for OTP input elements
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Check rate limit on mount
  useEffect(() => {
    checkLockout()
  }, [])

  const checkLockout = (): boolean => {
    const { attempts, lockUntil } = getRateLimit()
    const now = Date.now()
    if (lockUntil > now) {
      setIsLocked(true)
      const remaining = Math.ceil((lockUntil - now) / 60000)
      setLockRemainingMin(remaining)
      setErrorMsg(`Too many failed attempts. Access locked for ${remaining} min.`)
      return true
    } else {
      if (lockUntil > 0 && lockUntil <= now) {
        // Reset expired lockout
        setRateLimit({ attempts: 0, lockUntil: 0 })
      }
      setIsLocked(false)
      return false
    }
  }

  // 30s countdown timer for Resend code
  useEffect(() => {
    if (step === 2 && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, resendTimer])

  // Focus active OTP box when switching to step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 150)
    }
  }, [step])

  /* ──────────────── Step 1: Send Code / Fast Passcode ──────────────── */
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setInfoMsg('')

    if (checkLockout()) return

    const cleanInput = email.trim()
    if (!cleanInput) {
      setErrorMsg('Please enter your email or passcode.')
      return
    }

    // Direct 3117 passcode bypass on Step 1 if entered
    if (cleanInput === '3117') {
      handleVerifyCode('3117')
      return
    }

    setLoading(true)
    try {
      const res = await portfolioService.sendAdminOtp(cleanInput.toLowerCase())
      setInfoMsg(res.message)
      setStep(2)
      setResendTimer(30)
      setOtp(['', '', '', ''])
      setActiveBoxIndex(0)
    } catch {
      setStep(2)
      setResendTimer(30)
      setInfoMsg('If this email is an authorized administrator, a verification code has been sent.')
    } finally {
      setLoading(false)
    }
  }

  /* ──────────────── Resend Code ──────────────── */
  const handleResend = async () => {
    if (resendTimer > 0 || isLocked || loading) return
    if (checkLockout()) return

    setLoading(true)
    setErrorMsg('')
    try {
      const res = await portfolioService.sendAdminOtp(email)
      setInfoMsg(res.message)
      setResendTimer(30)
      setOtp(['', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch {
      setInfoMsg('A new verification code has been dispatched if authorized.')
      setResendTimer(30)
    } finally {
      setLoading(false)
    }
  }

  /* ──────────────── Step 2: Passcode Input Handling ──────────────── */
  const handleOtpChange = (index: number, val: string) => {
    if (isLocked || isSuccess) return

    // Pulse sphere briefly on typing
    setPulseCount((c) => c + 1)

    // Handle single digit input
    const cleanDigit = val.replace(/\D/g, '').slice(-1)

    const newOtp = [...otp]
    newOtp[index] = cleanDigit
    setOtp(newOtp)

    if (cleanDigit && index < 3) {
      inputRefs.current[index + 1]?.focus()
      setActiveBoxIndex(index + 1)
    }

    // Auto-verify when all 4 digits are complete
    const fullCode = newOtp.join('')
    if (fullCode.length === 4 && newOtp.every((d) => d !== '')) {
      handleVerifyCode(fullCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
        setActiveBoxIndex(index - 1)
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
      setActiveBoxIndex(index - 1)
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs.current[index + 1]?.focus()
      setActiveBoxIndex(index + 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (isLocked || isSuccess) return

    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!pastedData) return

    setPulseCount((c) => c + 1)
    const newOtp = ['', '', '', '']
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)

    const nextIndex = Math.min(pastedData.length, 3)
    inputRefs.current[nextIndex]?.focus()
    setActiveBoxIndex(nextIndex)

    if (pastedData.length === 4) {
      handleVerifyCode(pastedData)
    }
  }

  /* ──────────────── Step 2: Verification (Password: 3117) ──────────────── */
  const handleVerifyCode = async (codeToVerify?: string) => {
    if (checkLockout()) return

    const code = codeToVerify || otp.join('')
    if (code.length !== 4) {
      setErrorMsg('Please enter all 4 digits of the passcode.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await portfolioService.verifyAdminOtp(email, code)

      if (res.success) {
        // Clear rate limiter
        setRateLimit({ attempts: 0, lockUntil: 0 })

        // Trigger Success animations
        setIsSuccess(true)
        setTimeout(() => {
          setFlashWhite(true)
        }, 400)
      } else {
        // Wrong code handling: track failure & rate limit
        handleVerificationFailure(res.error || 'Invalid passcode.')
      }
    } catch (err: any) {
      handleVerificationFailure(err?.message || 'Verification error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationFailure = (message: string) => {
    const current = getRateLimit()
    const newAttempts = current.attempts + 1

    // Shake sphere and card
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 600)

    // Clear inputs
    setOtp(['', '', '', ''])
    setActiveBoxIndex(0)
    inputRefs.current[0]?.focus()

    if (newAttempts >= MAX_ATTEMPTS) {
      const lockUntil = Date.now() + LOCKOUT_DURATION_MS
      setRateLimit({ attempts: newAttempts, lockUntil })
      setIsLocked(true)
      setLockRemainingMin(15)
      setErrorMsg('Too many failed attempts. Access locked for 15 minutes.')
    } else {
      setRateLimit({ attempts: newAttempts, lockUntil: 0 })
      const remainingAttempts = MAX_ATTEMPTS - newAttempts
      setErrorMsg(`${message} (${remainingAttempts} attempts remaining)`)
    }
  }

  // Called when particle sphere collapse completes
  const handleCollapseComplete = () => {
    setTimeout(() => {
      navigate('/admin')
    }, 250)
  }

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#F0F0F0] selection:bg-black selection:text-white transition-colors overflow-hidden"
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* Symmetric 1px vertical background lines matching admin dashboard */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden w-full h-full">
        {[9.5, 23.0, 36.5, 50.0, 63.5, 77.0, 90.5].map((pct, idx) => (
          <div
            key={`line-${idx}`}
            className="absolute top-0 bottom-0 w-[1px] bg-[#DADADA]"
            style={{ left: `${pct}%` }}
          />
        ))}
      </div>

      {/* Full screen white flash on success */}
      <div
        className={`fixed inset-0 bg-white pointer-events-none z-50 transition-opacity duration-500 ${
          flashWhite ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Ambient soft backlight glow behind the black card */}
      <div className="absolute w-[440px] sm:w-[540px] h-[440px] sm:h-[540px] rounded-full bg-black/10 blur-3xl pointer-events-none z-0" />

      {/* Centered Pitch-Black Card (Larger, more spacious, ultra-premium noir glassmorphism) */}
      <div
        className={`relative z-10 w-full max-w-[440px] sm:max-w-[480px] bg-gradient-to-b from-[#131316] via-[#0a0a0c] to-[#040405] text-white rounded-[34px] sm:rounded-[38px] px-5 min-[390px]:px-7 sm:px-10 pt-8 sm:pt-10 pb-9 sm:pb-11 shadow-[0_35px_90px_-15px_rgba(0,0,0,0.65),0_15px_35px_-5px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.18)] border border-white/12 overflow-hidden flex flex-col items-center transition-transform duration-300 ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Subtle internal top specular radial highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[150px] bg-gradient-to-b from-white/[0.08] to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* TOP OF CARD: 3D Animated Particle Sphere (~180px) */}
        <div className="mb-6 sm:mb-7 relative z-10">
          <ParticleSphere
            pulseKey={pulseCount}
            isError={isShaking}
            isSuccess={isSuccess}
            onCollapseComplete={handleCollapseComplete}
          />
        </div>

        {/* ─── STEP 1: Admin access ─── */}
        {step === 1 && (
          <div className="w-full flex flex-col items-center relative z-10">
            <h1 className="text-[28px] sm:text-[32px] font-normal text-white tracking-tight mb-2 text-center">
              Admin access
            </h1>
            <p className="text-[14px] sm:text-[15px] text-zinc-400 font-light leading-relaxed text-center mb-7 max-w-[320px]">
              Enter your admin email to receive a single-use verification code.
            </p>

            {errorMsg && (
              <div className="w-full mb-5 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-300 text-xs text-center font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSendCode} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  disabled={loading || isLocked}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full h-[56px] sm:h-[60px] bg-white/[0.04] backdrop-blur-md border border-white/15 focus:border-white/70 focus:bg-white/[0.08] rounded-2xl px-5 text-[15px] sm:text-[16px] text-white placeholder-zinc-500 focus:outline-none transition-all font-mono shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
                />
              </div>

              {/* Solid White Pill / Rounded Send Code Button */}
              <button
                type="submit"
                disabled={loading || isLocked}
                className="w-full h-[56px] sm:h-[60px] bg-white text-black hover:bg-zinc-200 font-semibold text-[15px] sm:text-[16px] tracking-wide rounded-2xl shadow-[0_10px_25px_rgba(255,255,255,0.12)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-black" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <span>Send code</span>
                )}
              </button>
            </form>

            {/* Back to site in glassmorphism pill */}
            <div className="mt-7 pt-4 border-t border-white/10 w-full flex justify-center">
              <a
                href="/"
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 hover:border-white/30 backdrop-blur-md text-xs text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
              >
                <ArrowLeft size={14} />
                <span>Return to portfolio</span>
              </a>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Enter the code (Password: 3117) ─── */}
        {step === 2 && (
          <div className="w-full flex flex-col items-center relative z-10">
            <h1 className="text-[28px] sm:text-[32px] font-normal text-white tracking-tight mb-2 text-center">
              Enter the code
            </h1>
            <p className="text-[14px] sm:text-[15px] text-zinc-400 font-light leading-relaxed text-center mb-7 max-w-[320px]">
              We sent a code to your email, please enter it to verify your address.
            </p>

            {errorMsg && (
              <div className="w-full mb-5 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-300 text-xs text-center font-mono">
                {errorMsg}
              </div>
            )}

            {/* OTP 4 Rounded-Square Glassmorphic Input Boxes (for 3117) */}
            <div className="flex items-center justify-center gap-2.5 min-[390px]:gap-3.5 sm:gap-4 mb-7 w-full">
              {otp.map((digit, idx) => {
                const isActive = activeBoxIndex === idx
                return (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    maxLength={1}
                    disabled={loading || isLocked || isSuccess}
                    value={digit}
                    onFocus={() => setActiveBoxIndex(idx)}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    className={`w-[58px] min-[390px]:w-[66px] sm:w-[74px] h-[68px] min-[390px]:h-[74px] sm:h-[82px] text-2xl sm:text-3xl font-mono text-center rounded-[20px] sm:rounded-[22px] transition-all duration-200 focus:outline-none backdrop-blur-xl ${
                      isActive
                        ? 'bg-white/[0.12] border-2 border-white ring-4 ring-white/20 shadow-[0_0_25px_rgba(255,255,255,0.35),inset_0_1px_2px_rgba(255,255,255,0.4)]'
                        : digit
                        ? 'bg-white/[0.08] border-2 border-white/50 text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.25)]'
                        : 'bg-white/[0.04] border-2 border-white/15 hover:border-white/35 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  />
                )
              })}
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-300 mb-4 font-mono">
                <Loader2 size={14} className="animate-spin text-white" />
                <span>Verifying code...</span>
              </div>
            )}

            {/* Solid White Verify Button when all 4 boxes are populated */}
            {otp.every((d) => d !== '') && !isSuccess && !loading && (
              <button
                type="button"
                onClick={() => handleVerifyCode()}
                disabled={loading || isLocked}
                className="w-full h-[56px] sm:h-[60px] mb-4 bg-white text-black hover:bg-zinc-200 font-semibold text-[15px] sm:text-[16px] tracking-wide rounded-2xl shadow-[0_10px_25px_rgba(255,255,255,0.15)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <span>Verify code</span>
              </button>
            )}

            {/* Footer links with subtle glassmorphism styling */}
            <div className="w-full flex items-center justify-between text-xs text-zinc-400 pt-4 border-t border-white/[0.10]">
              <div>
                <span className="text-zinc-500">Haven't received it? </span>
                {resendTimer > 0 ? (
                  <span className="text-zinc-400 font-mono">Resend ({resendTimer}s)</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading || isLocked}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] cursor-pointer"
                  >
                    Resend
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setErrorMsg('')
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 backdrop-blur-md text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  Edit email
                </button>
                <span>•</span>
                <a
                  href="mailto:shanmukhrahul.j@gmail.com"
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 backdrop-blur-md text-zinc-300 hover:text-white transition-all"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
