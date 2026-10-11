import React, { useState } from 'react'
import type { ContactInfo } from '../types'
import { portfolioService } from '../services/portfolioData'
import { Mail, Phone, MapPin, GitBranch, Send, CheckCircle2 } from 'lucide-react'

/* ── Inline SVG social icons ── */
function IconLinkedin({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function IconTwitterX({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.855L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

interface ContactSectionProps {
  contactInfo: ContactInfo
}

export function ContactSection({ contactInfo }: ContactSectionProps) {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.name || !formState.email || !formState.message) return

    setSending(true)
    setTimeout(() => {
      portfolioService.addMessage({
        name: formState.name,
        email: formState.email,
        message: formState.message,
      })
      setSending(false)
      setSubmitted(true)
      setFormState({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitted(false), 6000)
    }, 600)
  }

  return (
    <section
      id="contact"
      className="relative w-full bg-white text-[#111111] py-24 px-6 sm:px-12 lg:px-20 border-t border-black/10"
      style={{ fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-black/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-black/40 mb-2 block font-mono">
              07 // Connect &amp; Inquire
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111]">
              Get in Touch
            </h2>
          </div>
          <p className="text-sm text-black/50 max-w-md mt-4 md:mt-0 leading-relaxed font-light">
            Available for AI/ML projects, full-stack development, and technical engineering collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-normal text-[#111] tracking-tight mb-4">
                Direct Contact
              </h3>

              <div className="flex items-center gap-4 bg-[#f8f8f8] p-5 border border-black/10">
                <div className="p-3 bg-black/[0.06] text-[#111]">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-black/40 block font-mono">
                    Email
                  </span>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-base text-[#111] hover:underline font-light"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#f8f8f8] p-5 border border-black/10">
                <div className="p-3 bg-black/[0.06] text-[#111]">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-black/40 block font-mono">
                    Phone
                  </span>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-base text-[#111] hover:underline font-light"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#f8f8f8] p-5 border border-black/10">
                <div className="p-3 bg-black/[0.06] text-[#111]">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-black/40 block font-mono">
                    Location
                  </span>
                  <span className="text-base text-[#111] font-light">
                    {contactInfo.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-black/40 mb-4 font-mono">
                Social Profiles
              </h4>
              <div className="flex flex-wrap gap-3">
                {contactInfo.github && (
                  <a
                    href={contactInfo.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-[#f8f8f8] border border-black/10 text-[#111] hover:border-black/40 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <GitBranch size={16} />
                    GitHub
                  </a>
                )}
                {contactInfo.linkedin && (
                  <a
                    href={contactInfo.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-[#f8f8f8] border border-black/10 text-[#111] hover:border-black/40 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <IconLinkedin size={16} />
                    LinkedIn
                  </a>
                )}
                {contactInfo.instagram && (
                  <a
                    href={contactInfo.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-[#f8f8f8] border border-black/10 text-[#111] hover:border-black/40 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <IconInstagram size={16} />
                    Instagram
                  </a>
                )}
                {contactInfo.twitter && (
                  <a
                    href={contactInfo.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-[#f8f8f8] border border-black/10 text-[#111] hover:border-black/40 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <IconTwitterX size={16} />
                    X / Twitter
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-[#f8f8f8] border border-black/10 p-8 sm:p-12 relative">
            <h3 className="text-2xl font-normal text-[#111] mb-6">
              Send a Message
            </h3>

            {submitted ? (
              <div className="p-8 border border-green-500/40 bg-green-50 text-center my-8">
                <CheckCircle2 size={40} className="text-green-600 mx-auto mb-4" />
                <h4 className="text-xl text-[#111] font-medium mb-2">Message Sent!</h4>
                <p className="text-sm text-black/60 font-light">
                  Thank you for reaching out. Shanmukh will respond to your message shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-black/50 block mb-2 font-mono">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-white border border-black/15 text-[#111] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-black/25"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-black/50 block mb-2 font-mono">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-white border border-black/15 text-[#111] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-black/25"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-black/50 block mb-2 font-mono">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell me about your project or inquiry..."
                    className="w-full bg-white border border-black/15 text-[#111] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-black/25 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 bg-[#111] text-white font-medium text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  <span>{sending ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
