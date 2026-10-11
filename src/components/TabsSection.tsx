import React, { useState, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { TabKey } from './SideNav'
import { PostsScrollShowcase } from './PostsScrollShowcase'
import { Platforms3DCarousel } from './Platforms3DCarousel'
import { ProjectsShowcase } from './ProjectsShowcase'
import { portfolioService } from '../services/portfolioData'
import type { PostItem, ProjectItem } from '../types'

interface TabsSectionProps {
  activeTab: TabKey
  onSelectTab: (tab: TabKey) => void
  onOpenConnectModal?: () => void
  connectionsCount?: number
}

export function TabsSection({
  activeTab,
}: TabsSectionProps) {
  const [posts, setPosts] = useState<PostItem[]>(portfolioService.getPosts())
  const [projects, setProjects] = useState<ProjectItem[]>(portfolioService.getProjects())

  // Dynamic real-time subscription & async refresh
  useEffect(() => {
    // Initial async fetch from database
    portfolioService.fetchPostsAsync().then(setPosts)
    portfolioService.fetchProjectsAsync().then(setProjects)

    // Realtime subscriptions (or multi-tab storage fallback)
    const unsubscribePosts = portfolioService.subscribeToPosts((updated) => {
      setPosts(updated)
    })
    const unsubscribeProjects = portfolioService.subscribeToProjects((updated) => {
      setProjects(updated)
    })

    // Auto-refresh when tab gains focus
    const handleFocus = () => {
      portfolioService.fetchPostsAsync().then(setPosts)
      portfolioService.fetchProjectsAsync().then(setProjects)
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      unsubscribePosts()
      unsubscribeProjects()
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Refresh data when switching tabs
  useEffect(() => {
    setPosts(portfolioService.getPosts())
    setProjects(portfolioService.getProjects())
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 120)
    return () => clearTimeout(timer)
  }, [activeTab])

  return (
    <section
      id="portfolio-tabs-section"
      className="relative w-full text-[#111111] selection:bg-[#111111] selection:text-white transition-colors duration-500"
      style={{
        background: activeTab === 'posts' ? '#F1F2D9' : activeTab === 'platforms' ? '#030308' : activeTab === 'projects' ? '#070709' : '#ffffff',
        fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif',
      }}
    >
      {/* ─────────────── TABS CONTENT ─────────────── */}
      {activeTab === 'posts' ? (
        <PostsScrollShowcase posts={posts} />
      ) : activeTab === 'platforms' ? (
        <Platforms3DCarousel />
      ) : (
        <div className="relative w-full min-h-screen">
          <ProjectsShowcase projects={projects} />
        </div>
      )}
    </section>
  )
}
