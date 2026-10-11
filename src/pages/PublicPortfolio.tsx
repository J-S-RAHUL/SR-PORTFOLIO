import React, { useState, useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroSection } from '../components/HeroSection'
import { AboutSection } from '../components/AboutSection'
import { TabsSection } from '../components/TabsSection'
import { SideNav, type TabKey } from '../components/SideNav'
import { ConnectModal } from '../components/ConnectModal'
import { portfolioService } from '../services/portfolioData'
import type { ProfileData } from '../types'

export function PublicPortfolio() {
  const [profile, setProfile] = useState<ProfileData>(portfolioService.getProfile())
  const [activeTab, setActiveTab] = useState<TabKey>('posts')
  const [isConnectOpen, setIsConnectOpen] = useState(false)
  const [connectionsCount, setConnectionsCount] = useState<number>(
    portfolioService.getConnectionsCount()
  )
  const [isSideNavVisible, setIsSideNavVisible] = useState(false)

  // Refresh profile & connections count on mount
  useEffect(() => {
    setProfile(portfolioService.getProfile())
    setConnectionsCount(portfolioService.getConnectionsCount())
  }, [])

  // Show Side Navigation only after scrolling past About Me section
  useEffect(() => {
    const checkVisibility = () => {
      const tabsSection = document.getElementById('portfolio-tabs-section')
      if (tabsSection) {
        const rect = tabsSection.getBoundingClientRect()
        // Becomes visible as user scrolls past About Me into the tabs/posts area
        setIsSideNavVisible(rect.top <= window.innerHeight * 0.75)
      }
    }

    window.addEventListener('scroll', checkVisibility, { passive: true })
    checkVisibility()
    return () => window.removeEventListener('scroll', checkVisibility)
  }, [])

  // Handle side navigation tab switch
  const handleSelectTab = (tab: TabKey) => {
    setActiveTab(tab)
    const el = document.getElementById('portfolio-tabs-section')
    if (el) {
      const rect = el.getBoundingClientRect()
      // If the tabs section is below or above viewport, smooth scroll to it
      if (rect.top > window.innerHeight * 0.4 || rect.bottom < 100) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // Initialize Lenis Smooth Scroll and sync with GSAP ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
    }
  }, [])

  return (
    <div
      className="relative w-full selection:bg-[#111] selection:text-white"
      style={{ background: '#ffffff', color: '#111111' }}
    >
      {/* 1. HERO SECTION with Fixed Top Navbar */}
      <HeroSection />

      {/* 2. 2-SECTION SCROLL ANIMATION BLOCK (About Me + Education) */}
      <AboutSection profile={profile} />

      {/* 3. TABS SECTION (Scroll-driven Posts Showcase, Platforms, Projects, Profile) */}
      <TabsSection
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenConnectModal={() => setIsConnectOpen(true)}
        connectionsCount={connectionsCount}
      />

      {/* 4. FLOATING SIDE NAVIGATION BAR - visible after the About Me section */}
      <SideNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isVisible={isSideNavVisible}
      />

      {/* Minimal Footer */}
      <footer className="w-full py-8 px-6 bg-white border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-black/60 font-mono max-w-7xl mx-auto pb-28 sm:pb-12">
        <div>
          <span>{profile.college || 'MIC College of Technology'}</span> &bull; <span>{profile.name} &copy; 2026</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#about" className="hover:text-black transition-colors">About</a>
          <a href={`${import.meta.env.BASE_URL}admin/login`} className="hover:text-black transition-colors">Admin</a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Top &uarr;
          </button>
        </div>
      </footer>

      {/* 4. CONNECT WITH ME FORM POPUP */}
      <ConnectModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        onSuccess={(newCount) => setConnectionsCount(newCount)}
      />
    </div>
  )
}

