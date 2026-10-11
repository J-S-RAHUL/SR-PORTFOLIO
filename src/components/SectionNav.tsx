import React from 'react'

export type SectionId = 'about' | 'skills' | 'hackathons' | 'projects' | 'github' | 'posts' | 'contact'

/* ── Custom SVGs: Instagram-style filled vs outline ── */
function IconAbout({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6"/>
    </svg>
  )
}

function IconSkills({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  )
}

function IconHackathons({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function IconProjects({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  )
}

function IconGithub({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  )
}

function IconPosts({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

function IconContact({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

const SECTIONS: {
  id: SectionId
  label: string
  Icon: React.ComponentType<{ filled: boolean }>
}[] = [
  { id: 'about',      label: 'About',      Icon: IconAbout },
  { id: 'skills',     label: 'Skills',     Icon: IconSkills },
  { id: 'hackathons', label: 'Hackathons', Icon: IconHackathons },
  { id: 'projects',   label: 'Projects',   Icon: IconProjects },
  { id: 'github',     label: 'GitHub',     Icon: IconGithub },
  { id: 'posts',      label: 'Posts & Feed', Icon: IconPosts },
  { id: 'contact',    label: 'Contact',    Icon: IconContact },
]

const HN = '"Helvetica Neue ME", Helvetica, Arial, sans-serif'

interface SectionNavProps {
  active: SectionId
  onSelect: (id: SectionId) => void
  visible: boolean
}

export function SectionNav({ active, onSelect, visible }: SectionNavProps) {
  return (
    <aside
      aria-label="Instagram Style Left Navigation"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 230,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 14px',
        background: '#ffffff',
        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
        fontFamily: HN,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'opacity 350ms ease, transform 350ms cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow: '10px 0 40px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div>
        {/* Brand / Monogram */}
        <div
          style={{
            padding: '12px 14px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#111111',
              border: '1px solid rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            SR
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111111', letterSpacing: '0.02em' }}>
              Shanmukh Rahul
            </div>
            <div style={{ fontSize: 10, color: '#888888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Portfolio App
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SECTIONS.map(({ id, label, Icon }) => {
            const isActive = active === id
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: isActive ? '#111111' : 'transparent',
                  border: '1px solid transparent',
                  cursor: 'pointer',
                  color: isActive ? '#ffffff' : '#555555',
                  fontFamily: HN,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 180ms ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const b = e.currentTarget as HTMLButtonElement
                    b.style.background = '#f4f4f4'
                    b.style.color = '#111111'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    const b = e.currentTarget as HTMLButtonElement
                    b.style.background = 'transparent'
                    b.style.color = '#555555'
                  }
                }}
              >
                <span style={{ color: isActive ? '#ffffff' : '#888888' }}>
                  <Icon filled={isActive} />
                </span>
                <span>{label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom: Admin Section Button */}
      <div style={{ paddingTop: 16, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <a
          href="/admin/login"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 14px',
            borderRadius: 10,
            background: '#f7f7f7',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            color: '#333333',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 500,
            transition: 'all 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#111111'
            e.currentTarget.style.color = '#ffffff'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f7f7f7'
            e.currentTarget.style.color = '#333333'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <IconLock />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Admin Portal</div>
            <div style={{ fontSize: 10, color: '#999999' }}>Password Protected</div>
          </div>
        </a>
      </div>
    </aside>
  )
}
