import React, { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

/* ─────────────────────────────── constants ─────────────────────────────── */

// Light grey/silver CSS background replicating the original photographic backdrop
const HERO_BG_STYLE: React.CSSProperties = {
  background: 'linear-gradient(160deg, #c8cacf 0%, #b8bcc4 30%, #a8acb8 55%, #bec0c8 80%, #caccce 100%)',
}

const PORTRAIT_URL = `${import.meta.env.BASE_URL}user_portrait.png`

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
]

const SOCIAL_LINKS = ['Instagram', 'TikTok', 'YouTube']

const HN = '"Helvetica Neue ME", Helvetica, Arial, sans-serif'
const CREAM = '#efeee9'

/* ─────────────────────────────── helpers ────────────────────────────────── */

function staggerStyle(
  open: boolean,
  delay: string,
  translateY = '24px',
): React.CSSProperties {
  return {
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0)' : `translateY(${translateY})`,
    transition: `opacity 500ms ease ${delay}, transform 500ms cubic-bezier(0.22,1,0.36,1) ${delay}`,
  }
}

/* ─────────────────────────────── sub-components ────────────────────────── */

function Hamburger({ open }: { open: boolean }) {
  const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'
  const bar: React.CSSProperties = {
    display: 'block',
    height: '1.5px',
    width: '24px',
    background: CREAM,
    transformOrigin: 'center',
  }
  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6.5px',
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          ...bar,
          transition: `transform 500ms ${EASE}`,
          transform: open ? 'translateY(8px) rotate(45deg)' : 'none',
        }}
      />
      <span
        style={{
          ...bar,
          transition: `opacity 300ms ease`,
          opacity: open ? 0 : 1,
        }}
      />
      <span
        style={{
          ...bar,
          transition: `transform 500ms ${EASE}`,
          transform: open ? 'translateY(-8px) rotate(-45deg)' : 'none',
        }}
      />
    </span>
  )
}

function DrawerCloseBtn({ onClose, open }: { onClose: () => void; open: boolean }) {
  return (
    <button
      onClick={onClose}
      aria-label="Close menu"
      style={{
        position: 'absolute',
        top: 24,
        right: 24,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: open ? 1 : 0,
        transform: open ? 'rotate(0deg)' : 'rotate(90deg)',
        transition: `opacity 200ms ease ${open ? '300ms' : '0ms'},
                     transform 200ms ease ${open ? '300ms' : '0ms'}`,
        color: CREAM,
      }}
    >
      <X size={26} strokeWidth={1.5} color={CREAM} />
    </button>
  )
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const PANEL_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'

  const scrollTo = (href: string) => {
    onClose()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          transition: 'opacity 500ms ease',
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '80%',
          maxWidth: 384,
          zIndex: 40,
          background: '#141414',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: `transform 600ms ${PANEL_EASE}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 32px',
          overflowY: 'auto',
        }}
      >
        <DrawerCloseBtn onClose={onClose} open={open} />

        {/* Site Index */}
        <section style={{ marginBottom: 40 }}>
          <p
            style={{
              ...staggerStyle(open, '250ms', '16px'),
              fontFamily: HN,
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: `${CREAM}80`,
              marginBottom: 16,
            }}
          >
            Site Index
          </p>
          {NAV_ITEMS.map((item, i) => (
            <div
              key={item.label}
              style={staggerStyle(open, `${300 + i * 70}ms`, '20px')}
            >
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo(item.href)
                }}
                style={{
                  fontFamily: HN,
                  fontSize: 28,
                  color: CREAM,
                  textDecoration: 'none',
                  display: 'block',
                  lineHeight: 1.3,
                  marginBottom: 4,
                }}
              >
                {item.label}
              </a>
            </div>
          ))}
          <div style={staggerStyle(open, '700ms', '20px')}>
            <a
              href={`${import.meta.env.BASE_URL}admin/login`}
              style={{
                fontFamily: HN,
                fontSize: 14,
                color: 'rgba(239,238,233,0.5)',
                textDecoration: 'underline',
                display: 'inline-block',
                marginTop: 16,
              }}
            >
              Admin Dashboard
            </a>
          </div>
        </section>

        {/* Find Me */}
        <section>
          <p
            style={{
              ...staggerStyle(open, '500ms', '16px'),
              fontFamily: HN,
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: `${CREAM}80`,
              marginBottom: 14,
            }}
          >
            Find Me
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px' }}>
            {SOCIAL_LINKS.map((link, i) => (
              <div
                key={link}
                style={staggerStyle(open, `${550 + i * 60}ms`, '16px')}
              >
                <a
                  href="#"
                  style={{
                    fontFamily: HN,
                    fontSize: 13,
                    color: CREAM,
                    textDecoration: 'none',
                  }}
                >
                  {link}
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

/* ─────────────────────────────── HeroSection ───────────────────────────── */

export function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false)

  const [scrolled, setScrolled] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), [])

  /* Scroll listener for navbar background */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* Close on desktop resize */
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 640) closeMenu() }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [closeMenu])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* ──────────────────────── HERO SECTION ──────────────────────── */}
      <section
        id="hero"
        style={{
          position: 'relative',
          height: '100dvh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* ── 1. Background (z default/0) ── */}
        <div
          style={{
            ...HERO_BG_STYLE,
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        />

        {/* ── 2. Marquee — z-10 ── */}
        <div
          className="marquee-outer anim-fade-up"
          style={{
            animationDelay: '500ms',
            position: 'absolute',
            left: 0,
            right: 0,
            top: '16vh',
            zIndex: 10,
            overflow: 'hidden',
          }}
        >
          <div
            className="marquee-track"
            style={{
              display: 'flex',
              width: 'max-content',
              whiteSpace: 'nowrap',
              fontFamily: HN,
              fontSize: '16vh',
              lineHeight: 1,
              color: CREAM,
            }}
          >
            <MarqueeHalf />
            <MarqueeHalf />
          </div>
        </div>

        {/* ── 3. Horizontal cream rule — z-10 ── */}
        <div
          className="cream-rule anim-line"
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            bottom: '5.5rem',
            zIndex: 10,
            height: '1px',
            background: CREAM,
          }}
        />

        {/* ── 4. Desktop footer — z-10 on sm+ ── */}
        <footer
          className="footer-inner"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '0 24px 20px',
            fontFamily: HN,
            fontSize: 12,
            lineHeight: 1.6,
            color: CREAM,
          }}
        >
          <div
            className="anim-fade-up"
            style={{ animationDelay: '1550ms', textAlign: 'right' }}
          >
            <p>AI/ML Engineer</p>
            <p>Full-Stack Developer</p>
          </div>
        </footer>

        {/* ── 5. Front portrait — z-20 ── */}
        <img
          src={PORTRAIT_URL}
          alt="Portrait"
          className="anim-rise-in"
          style={{
            position: 'absolute',
            inset: 0,
            height: '100%',
            width: '100%',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        />

        {/* ── 6. Header — FIXED UI above everything ── */}
        <header
          className="hdr-inner"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: scrolled ? '14px 24px' : '24px 24px',
            background: scrolled ? 'rgba(10, 10, 10, 0.78)' : 'transparent',
            backdropFilter: scrolled ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
            transition: 'background 300ms ease, border-color 300ms ease, padding 300ms ease, backdrop-filter 300ms ease',
          }}
        >
          {/* Brand */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="anim-fade-up"
            style={{
              animationDelay: '800ms',
              fontFamily: HN,
              fontSize: 18,
              letterSpacing: '0.05em',
              color: CREAM,
              textDecoration: 'none',
            }}
          >
            SR
          </a>

          {/* Desktop right cluster */}
          <div
            className="dt-nav hidden sm:flex"
            style={{
              alignItems: 'flex-start',
              gap: 32,
              fontFamily: HN,
              fontSize: 13,
              color: CREAM,
            }}
          >
            {/* Nav Link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {NAV_ITEMS.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="anim-fade-up dt-nav-link"
                  style={{
                    animationDelay: `${1000 + i * 80}ms`,
                    color: CREAM,
                    textDecoration: 'none',
                    fontSize: 13,
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Admin Link */}
            <a
              href={`${import.meta.env.BASE_URL}admin/login`}
              className="anim-fade-up dt-nav-link"
              style={{
                animationDelay: '1300ms',
                color: 'rgba(239,238,233,0.6)',
                textDecoration: 'none',
                fontSize: 11,
                letterSpacing: '0.05em',
                border: '1px solid rgba(239,238,233,0.2)',
                padding: '3px 10px',
                borderRadius: 4,
              }}
            >
              ADMIN
            </a>
          </div>

          {/* Mobile hamburger / close toggle — z-50 */}
          <button
            className="mb-hamburger flex sm:hidden anim-fade-up"
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              animationDelay: '900ms',
              position: 'relative',
              zIndex: 50,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Hamburger open={menuOpen} />
          </button>
        </header>

        {/* ── 7. Mobile drawer — z-50 / always rendered, sm:hidden ── */}
        <div className="mobile-drawer sm:hidden">
          <MobileDrawer open={menuOpen} onClose={closeMenu} />
        </div>
      </section>
    </>
  )
}

function MarqueeHalf() {
  return (
    <span style={{ paddingRight: '6vw' }}>
      SHANMUKH&nbsp;RAHUL&nbsp;
    </span>
  )
}
