import type {
  ProfileData,
  SkillItem,
  HackathonItem,
  ProjectItem,
  GithubRepo,
  PostItem,
  ContactInfo,
  ContactMessage,
  ConnectionItem,
} from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/* ──────────────────────── Default Data ──────────────────────── */

const DEFAULT_PROFILE: ProfileData = {
  name: 'J. Shanmukh Rahul',
  title: 'AI/ML Engineer & Full-Stack Developer',
  education: 'B.Tech — Artificial Intelligence & Machine Learning',
  college: 'MIC College of Technology',
  focus: 'Software development, AI/LLM systems, Cloud Architecture, Full-Stack Engineering',
  bio: 'Student, independent developer and AI/ML engineer. Passionate about AI/ML systems, modern web architectures, and intelligent edge systems.',
  profileImage: '/assets/about-me.jpg',
  socials: {
    github: 'https://github.com/J-S-RAHUL',
    linkedin: 'https://www.linkedin.com/in/shanmukh-rahul-joga-5b38a1367',
    instagram: 'https://instagram.com/shanmukh_rahul.joga',
    twitter: 'https://wa.me/919398939586',
  },
}

const DEFAULT_SKILLS: SkillItem[] = [
  { id: '1', name: 'Python', category: 'Languages', level: 'Expert', order: 1 },
  { id: '2', name: 'JavaScript', category: 'Languages', level: 'Expert', order: 2 },
  { id: '3', name: 'React', category: 'Frontend', level: 'Expert', order: 3 },
  { id: '4', name: 'TypeScript', category: 'Languages', level: 'Expert', order: 4 },
  { id: '5', name: 'Docker / Cloud', category: 'DevOps', level: 'Advanced', order: 5 },
  { id: '6', name: 'AI / LLMs', category: 'AI & Data Science', level: 'Expert', order: 6 },
  { id: '7', name: 'PyTorch', category: 'AI & Data Science', level: 'Intermediate', order: 7 },
  { id: '8', name: 'Node.js', category: 'Backend', level: 'Advanced', order: 8 },
]

const DEFAULT_HACKATHONS: HackathonItem[] = [
  {
    id: 'h1',
    name: 'Smart India Hackathon 2025',
    organization: 'Ministry of Education, Govt of India',
    date: 'Dec 2025',
    teamName: 'Neural Pioneers',
    role: 'Team Lead & AI Architect',
    projectName: 'AgriSense AI',
    description: 'An AI-driven crop disease detection and yield optimization platform utilizing computer vision models for real-time edge processing.',
    technologies: ['Python', 'PyTorch', 'React', 'FastAPI', 'OpenCV'],
    achievement: 'Winner — 1st Place',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    certificateUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    githubUrl: 'https://github.com/J-S-RAHUL',
    demoUrl: 'https://agrisense-demo.vercel.app',
    published: true,
  },
]

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'SR Timber & Furniture Web Platform',
    name: 'SR Timber & Furniture Web Platform',
    description: 'Luxury furniture and timber manufacturing web application featuring dynamic 3D woodcraft rendering, custom material configurator, catalog search, and direct WhatsApp quote automation.',
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
    techTags: ['React', 'TypeScript', 'TailwindCSS', 'Three.js', 'Vite'],
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Three.js', 'Vite'],
    repoUrl: 'https://github.com/J-S-RAHUL/SR-TIMBER-FURNITURE',
    githubUrl: 'https://github.com/J-S-RAHUL/SR-TIMBER-FURNITURE',
    demoUrl: 'https://j-s-rahul.github.io/SR-TIMBER-FURNITURE/',
    date: '2025',
    sortOrder: 0,
    featured: true,
    published: true,
  },
  {
    id: 'proj-2',
    title: 'AgriSense Edge Neural Vision',
    name: 'AgriSense Edge Neural Vision',
    description: 'Real-time computer vision system running quantized lightweight vision transformers to detect and diagnose agricultural crop diseases on offline edge nodes with sub-20ms inference.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    techTags: ['PyTorch', 'OpenCV', 'TensorRT', 'FastAPI', 'Edge AI'],
    technologies: ['PyTorch', 'OpenCV', 'TensorRT', 'FastAPI', 'Edge AI'],
    repoUrl: 'https://github.com/J-S-RAHUL/AgriSense-Edge-Vision',
    githubUrl: 'https://github.com/J-S-RAHUL/AgriSense-Edge-Vision',
    demoUrl: 'https://github.com/J-S-RAHUL',
    date: 'Dec 2025',
    sortOrder: 1,
    featured: true,
    published: true,
  },
  {
    id: 'proj-3',
    title: 'Distributed Stream & Telemetry Gateway',
    name: 'Distributed Stream & Telemetry Gateway',
    description: 'High-throughput event streaming gateway and real-time anomaly detection pipeline. Features automated message brokering, WebSocket feeds, and microservice clustering.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    techTags: ['Python', 'FastAPI', 'Redis', 'WebSockets', 'Docker'],
    technologies: ['Python', 'FastAPI', 'Redis', 'WebSockets', 'Docker'],
    repoUrl: 'https://github.com/J-S-RAHUL/Distributed-AI-Stream-Gateway',
    githubUrl: 'https://github.com/J-S-RAHUL/Distributed-AI-Stream-Gateway',
    demoUrl: 'https://github.com/J-S-RAHUL',
    date: 'Nov 2025',
    sortOrder: 2,
    featured: true,
    published: true,
  },
  {
    id: 'proj-4',
    title: 'Embedded Vision Transformer Benchmark',
    name: 'Embedded Vision Transformer Benchmark',
    description: 'Ultra-optimized vision transformer inference engine engineered for sub-15ms latency on low-power microcontrollers, incorporating INT8 quantization and structured attention pruning.',
    imageUrl: '', // Auto-generates unique gradient card in viewer
    techTags: ['PyTorch', 'ONNX Runtime', 'Vision Transformers', 'CUDA'],
    technologies: ['PyTorch', 'ONNX Runtime', 'Vision Transformers', 'CUDA'],
    repoUrl: 'https://github.com/J-S-RAHUL',
    githubUrl: 'https://github.com/J-S-RAHUL',
    demoUrl: 'https://github.com/J-S-RAHUL',
    date: 'Oct 2025',
    sortOrder: 3,
    featured: false,
    published: true,
  },
  {
    id: 'proj-5',
    title: 'TimberLedger ERP & Invoicing Suite',
    name: 'TimberLedger ERP & Invoicing Suite',
    description: 'Industrial lumber inventory management and automated tax invoicing suite. Tracks log cubical volumes, lumber curing cycles, client dispatch accounts, and automated dispatching.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    techTags: ['React', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Express'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Express'],
    repoUrl: 'https://github.com/J-S-RAHUL',
    githubUrl: 'https://github.com/J-S-RAHUL',
    demoUrl: 'https://github.com/J-S-RAHUL',
    date: 'Aug 2025',
    sortOrder: 4,
    featured: false,
    published: true,
  },
  {
    id: 'proj-6',
    title: 'Antigravity Interactive Digital Portfolio',
    name: 'Antigravity Interactive Digital Portfolio',
    description: 'High-fidelity digital developer portfolio featuring scroll-driven parametric image scrubbing, 3D rotating cylinder carousel with CSS 3D physics, and realtime Supabase sync.',
    imageUrl: '', // Auto-generates unique gradient card in viewer
    techTags: ['React', 'Three.js', 'GSAP', 'TypeScript', 'TailwindCSS'],
    technologies: ['React', 'Three.js', 'GSAP', 'TypeScript', 'TailwindCSS'],
    repoUrl: 'https://github.com/J-S-RAHUL',
    githubUrl: 'https://github.com/J-S-RAHUL',
    demoUrl: 'https://j-s-rahul.github.io',
    date: '2026',
    sortOrder: 5,
    featured: false,
    published: true,
  },
]

const DEFAULT_GITHUB_REPOS: GithubRepo[] = [
  {
    id: 'repo-1',
    name: 'SR-TIMBER-FURNITURE',
    description: 'Modern luxury furniture web application with 3D product previews and automated WhatsApp quoting.',
    language: 'TypeScript',
    stars: 12,
    forks: 3,
    updatedAt: '2025-12-10',
    url: 'https://github.com/J-S-RAHUL/SR-TIMBER-FURNITURE',
    featured: true,
  },
  {
    id: 'repo-2',
    name: 'AgriSense-Edge-Vision',
    description: 'High-throughput quantized crop disease neural vision diagnosis for offline embedded edge devices.',
    language: 'Python',
    stars: 28,
    forks: 8,
    updatedAt: '2025-12-05',
    url: 'https://github.com/J-S-RAHUL',
    featured: true,
  },
  {
    id: 'repo-3',
    name: 'Distributed-AI-Stream-Gateway',
    description: 'High-throughput event streaming and real-time anomaly detection pipeline with Redis & WebSockets.',
    language: 'Python',
    stars: 15,
    forks: 4,
    updatedAt: '2025-11-20',
    url: 'https://github.com/J-S-RAHUL',
    featured: true,
  },
]

const DEFAULT_POSTS: PostItem[] = [
  {
    id: 'post-1',
    title: 'AgriSense Edge Neural Vision Deployment',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Engineering an edge computer vision system for real-time crop disease diagnosis with low-latency quantized ViT models deployed on edge devices.',
    date: 'Dec 2025',
    linkUrl: 'https://github.com/J-S-RAHUL',
    sortOrder: 0,
    createdAt: '2025-12-15T10:00:00Z',
    published: true,
  },
  {
    id: 'post-2',
    title: 'Distributed Systems & Cloud Services',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    caption: 'Architecting containerized cloud backends and high-concurrency event pipelines with sub-millisecond dispatch times.',
    date: 'Nov 2025',
    linkUrl: 'https://github.com/J-S-RAHUL',
    sortOrder: 1,
    createdAt: '2025-11-20T14:30:00Z',
    published: true,
  },
  {
    id: 'post-3',
    title: 'Neural Vision & Edge AI Models',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fine-tuning compact vision transformer weights for embedded microcontrollers and IoT nodes. Balancing inference latency with high classification recall.',
    date: 'Oct 2025',
    linkUrl: 'https://github.com/J-S-RAHUL',
    sortOrder: 2,
    createdAt: '2025-10-10T09:15:00Z',
    published: true,
  },
  {
    id: 'post-4',
    title: 'MIC College Tech Keynote & Workshops',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    caption: 'Demonstrating generative AI workflows and full-stack development best practices to over 150 student developers and builders.',
    date: 'Sep 2025',
    linkUrl: 'https://github.com/J-S-RAHUL',
    sortOrder: 3,
    createdAt: '2025-09-05T16:00:00Z',
    published: true,
  },
]

const DEFAULT_CONTACT: ContactInfo = {
  email: 'shanmukhrahul.j@gmail.com',
  phone: '+91 93989 39586',
  location: 'Andhra Pradesh, India',
  github: 'https://github.com/J-S-RAHUL',
  linkedin: 'https://www.linkedin.com/in/shanmukh-rahul-joga-5b38a1367',
  instagram: 'https://instagram.com/shanmukh_rahul.joga',
  twitter: 'https://wa.me/919398939586',
}

const DEFAULT_CONNECTIONS: ConnectionItem[] = []

const BASE_CONNECTIONS_COUNT = 138

// Normalize Project record helper
const normalizeProject = (d: any, index: number): ProjectItem => {
  const title = d.title || d.name || `Project ${index + 1}`
  const repoUrl = d.repo_url || d.repoUrl || d.github_url || d.githubUrl || ''
  const techTags = Array.isArray(d.tech_tags)
    ? d.tech_tags
    : Array.isArray(d.techTags)
      ? d.techTags
      : Array.isArray(d.technologies)
        ? d.technologies
        : typeof d.tech_tags === 'string'
          ? d.tech_tags.split(',').map((s: string) => s.trim()).filter(Boolean)
          : []
  const sortOrder = d.sort_order ?? d.sortOrder ?? index

  return {
    id: String(d.id || `proj-${Date.now()}-${index}`),
    title,
    name: title,
    description: d.description || '',
    repoUrl,
    githubUrl: repoUrl,
    imageUrl: d.image_url || d.imageUrl || '',
    techTags,
    technologies: techTags,
    sortOrder,
    demoUrl: d.demo_url || d.demoUrl || '',
    date: d.date || '',
    featured: d.featured !== false,
    published: d.published !== false,
    createdAt: d.created_at || d.createdAt || '',
  }
}

// Reset legacy seed data from browser storage so database is completely fresh
try {
  if (typeof window !== 'undefined') {
    const cleanKey = 'marcus_db_reset_v6'
    if (!localStorage.getItem(cleanKey)) {
      localStorage.removeItem('marcus_portfolio_profile')
      localStorage.removeItem('marcus_portfolio_skills')
      localStorage.removeItem('marcus_portfolio_projects')
      localStorage.removeItem('marcus_portfolio_posts')
      localStorage.removeItem('marcus_portfolio_github_repos')
      localStorage.removeItem('marcus_portfolio_connections')
      localStorage.removeItem('marcus_portfolio_messages')
      localStorage.setItem(cleanKey, 'true')
    }
  }
} catch { }


/* ──────────────────────── Data Storage Helpers ──────────────────────── */

const getStored = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`marcus_portfolio_${key}`)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`marcus_portfolio_${key}`, JSON.stringify(value))
  } catch (e) {
    console.error('Failed saving to localStorage:', e)
  }
}

/* ──────────────────────── Service Methods ──────────────────────── */

export const portfolioService = {
  // Profile
  getProfile: (): ProfileData => getStored('profile', DEFAULT_PROFILE),
  saveProfile: (profile: ProfileData): void => setStored('profile', profile),

  // Skills
  getSkills: (): SkillItem[] => getStored('skills', DEFAULT_SKILLS),
  saveSkills: (skills: SkillItem[]): void => setStored('skills', skills),

  // Hackathons
  getHackathons: (): HackathonItem[] => getStored('hackathons', DEFAULT_HACKATHONS),
  saveHackathons: (hackathons: HackathonItem[]): void => setStored('hackathons', hackathons),

  // Projects
  getProjects: (): ProjectItem[] => {
    let list = getStored<ProjectItem[]>('projects', DEFAULT_PROJECTS)
    if (!list || list.length === 0 || list.some((p) => p.description?.includes('Hackathon'))) {
      setStored('projects', DEFAULT_PROJECTS)
      list = DEFAULT_PROJECTS
    }
    return list
      .map((p, idx) => normalizeProject(p, idx))
      .sort((a, b) => {
        if (a.sortOrder !== undefined && b.sortOrder !== undefined && a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder
        }
        return 0
      })
  },
  fetchProjectsAsync: async (): Promise<ProjectItem[]> => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any, idx: number) => normalizeProject(d, idx))
          setStored('projects', mapped)
          return mapped
        }
      } catch (err) {
        console.warn('Supabase fetchProjectsAsync notice:', err)
      }
    }
    return portfolioService.getProjects()
  },
  subscribeToProjects: (callback: (projects: ProjectItem[]) => void): (() => void) => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'marcus_portfolio_projects') {
        callback(portfolioService.getProjects())
      }
    }
    window.addEventListener('storage', handleStorage)

    if (!isSupabaseConfigured()) {
      return () => window.removeEventListener('storage', handleStorage)
    }

    const channel = supabase
      .channel('public:projects_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        async () => {
          const fresh = await portfolioService.fetchProjectsAsync()
          callback(fresh)
        }
      )
      .subscribe()

    return () => {
      window.removeEventListener('storage', handleStorage)
      supabase.removeChannel(channel)
    }
  },
  saveProjects: (projects: ProjectItem[]): void => {
    const normalized = projects.map((p, idx) => normalizeProject(p, idx))
    setStored('projects', normalized)
  },
  reorderProjects: (reordered: ProjectItem[]): void => {
    const updated = reordered.map((p, idx) => ({ ...p, sortOrder: idx }))
    setStored('projects', updated)

    if (isSupabaseConfigured()) {
      updated.forEach((p) => {
        supabase
          .from('projects')
          .update({ sort_order: p.sortOrder })
          .eq('id', p.id)
          .then()
      })
    }
  },
  addProject: (project: Omit<ProjectItem, 'id'>): ProjectItem => {
    const current = portfolioService.getProjects()
    const title = project.title || project.name || 'New Project'
    const repoUrl = project.repoUrl || project.githubUrl || ''
    const techTags = project.techTags || project.technologies || []
    const newProj: ProjectItem = {
      ...project,
      id: 'proj-' + Date.now(),
      title,
      name: title,
      repoUrl,
      githubUrl: repoUrl,
      techTags,
      technologies: techTags,
      sortOrder: current.length,
      published: true,
      featured: true,
      createdAt: new Date().toISOString(),
    }
    const updated = [...current, newProj]
    setStored('projects', updated)

    if (isSupabaseConfigured()) {
      supabase
        .from('projects')
        .insert([{
          id: newProj.id,
          title: newProj.title,
          name: newProj.title,
          description: newProj.description,
          repo_url: newProj.repoUrl,
          github_url: newProj.repoUrl,
          image_url: newProj.imageUrl || null,
          tech_tags: newProj.techTags,
          technologies: newProj.techTags,
          sort_order: newProj.sortOrder,
          demo_url: newProj.demoUrl || null,
          published: true,
          created_at: newProj.createdAt,
        }])
        .then(({ error }) => {
          if (error) console.warn('Supabase project insert notice:', error.message)
        })
    }
    return newProj
  },
  updateProject: (project: ProjectItem): void => {
    const normalized = normalizeProject(project, project.sortOrder ?? 0)
    const updated = portfolioService.getProjects().map((p) => (p.id === normalized.id ? normalized : p))
    setStored('projects', updated)

    if (isSupabaseConfigured()) {
      supabase
        .from('projects')
        .update({
          title: normalized.title,
          name: normalized.title,
          description: normalized.description,
          repo_url: normalized.repoUrl,
          github_url: normalized.repoUrl,
          image_url: normalized.imageUrl || null,
          tech_tags: normalized.techTags,
          technologies: normalized.techTags,
          sort_order: normalized.sortOrder,
          demo_url: normalized.demoUrl || null,
          published: normalized.published !== false,
        })
        .eq('id', normalized.id)
        .then(({ error }) => {
          if (error) console.warn('Supabase project update notice:', error.message)
        })
    }
  },
  deleteProject: (id: string): void => {
    const updated = portfolioService.getProjects().filter((p) => p.id !== id)
    setStored('projects', updated)

    if (isSupabaseConfigured()) {
      supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.warn('Supabase project delete notice:', error.message)
        })
    }
  },
  fetchGithubRepoDetails: async (
    urlOrSlug: string
  ): Promise<{
    title: string
    description: string
    techTags: string[]
    repoUrl: string
  } | null> => {
    try {
      const cleaned = urlOrSlug.trim()
      const match =
        cleaned.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/i) ||
        cleaned.match(/^([a-zA-Z0-9_\-\.]+)\/([a-zA-Z0-9_\-\.]+)$/)

      if (!match) return null
      const owner = match[1]
      const repo = match[2].replace(/\.git$/, '')
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      if (!res.ok) return null
      const data = await res.json()

      const techTags: string[] = []
      if (data.language) techTags.push(data.language)
      if (Array.isArray(data.topics)) {
        data.topics.slice(0, 4).forEach((t: string) => {
          if (!techTags.includes(t)) techTags.push(t)
        })
      }

      return {
        title: data.name ? data.name.replace(/[-_]/g, ' ') : repo,
        description: data.description || '',
        techTags: techTags.length > 0 ? techTags : ['Open Source'],
        repoUrl: data.html_url || `https://github.com/${owner}/${repo}`,
      }
    } catch (err) {
      console.warn('GitHub API fetch error:', err)
      return null
    }
  },

  // GitHub Repos
  getGithubRepos: (): GithubRepo[] => getStored('github_repos', DEFAULT_GITHUB_REPOS),
  saveGithubRepos: (repos: GithubRepo[]): void => setStored('github_repos', repos),

  // Github Config
  getGithubUsername: (): string => getStored('github_username', 'J-S-RAHUL'),
  saveGithubUsername: (username: string): void => setStored('github_username', username),

  // Posts
  getPosts: (): PostItem[] => {
    let list = getStored<PostItem[]>('posts', DEFAULT_POSTS)
    if (!list || list.length === 0 || list.some((p) => p.caption?.includes('Hackathon') || (p.title && p.title.includes('Hackathon')))) {
      setStored('posts', DEFAULT_POSTS)
      list = DEFAULT_POSTS
    }
    return [...list].sort((a, b) => {
      if (a.sortOrder !== undefined && b.sortOrder !== undefined && a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder
      }
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })
  },
  fetchPostsAsync: async (): Promise<PostItem[]> => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('sort_order', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false })
        if (!error && data && data.length > 0) {
          const mapped: PostItem[] = data.map((d: any, index: number) => ({
            id: d.id,
            title: d.title || d.caption?.slice(0, 30) || `Post ${index + 1}`,
            imageUrl: d.image_url || d.imageUrl,
            caption: d.caption || '',
            date: d.date || (d.created_at ? new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''),
            tags: d.tags || [],
            likes: d.likes || 0,
            linkUrl: d.link_url || d.linkUrl || d.link || '',
            sortOrder: d.sort_order ?? index,
            createdAt: d.created_at,
            published: d.published !== false,
          }))
          setStored('posts', mapped)
          return mapped
        }
      } catch (err) {
        console.warn('Supabase fetchPostsAsync notice:', err)
      }
    }
    return portfolioService.getPosts()
  },
  subscribeToPosts: (callback: (posts: PostItem[]) => void): (() => void) => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'marcus_portfolio_posts') {
        callback(portfolioService.getPosts())
      }
    }
    window.addEventListener('storage', handleStorage)

    if (!isSupabaseConfigured()) {
      return () => window.removeEventListener('storage', handleStorage)
    }

    const channel = supabase
      .channel('public:posts_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        async () => {
          const fresh = await portfolioService.fetchPostsAsync()
          callback(fresh)
        }
      )
      .subscribe()

    return () => {
      window.removeEventListener('storage', handleStorage)
      supabase.removeChannel(channel)
    }
  },
  savePosts: (posts: PostItem[]): void => setStored('posts', posts),
  reorderPosts: (reordered: PostItem[]): void => {
    const updated = reordered.map((p, idx) => ({ ...p, sortOrder: idx }))
    setStored('posts', updated)

    if (isSupabaseConfigured()) {
      updated.forEach((p) => {
        supabase
          .from('posts')
          .update({ sort_order: p.sortOrder })
          .eq('id', p.id)
          .then()
      })
    }
  },
  addPost: (post: Omit<PostItem, 'id' | 'likes'>): PostItem => {
    const current = portfolioService.getPosts()
    const newPost: PostItem = {
      ...post,
      id: 'post-' + Date.now(),
      sortOrder: current.length,
      createdAt: new Date().toISOString(),
      likes: 0,
      published: true,
    }
    const updated = [...current, newPost]
    setStored('posts', updated)

    if (isSupabaseConfigured()) {
      supabase
        .from('posts')
        .insert([{
          id: newPost.id,
          title: newPost.title || '',
          image_url: newPost.imageUrl,
          caption: newPost.caption,
          link_url: newPost.linkUrl || '',
          sort_order: newPost.sortOrder,
          created_at: newPost.createdAt,
          published: true,
        }])
        .then(({ error }) => {
          if (error) console.warn('Supabase post insert notice:', error.message)
        })
    }
    return newPost
  },
  updatePost: (post: PostItem): void => {
    const updated = portfolioService.getPosts().map((p) => (p.id === post.id ? post : p))
    setStored('posts', updated)

    if (isSupabaseConfigured()) {
      supabase
        .from('posts')
        .update({
          title: post.title,
          image_url: post.imageUrl,
          caption: post.caption,
          link_url: post.linkUrl,
          sort_order: post.sortOrder,
        })
        .eq('id', post.id)
        .then(({ error }) => {
          if (error) console.warn('Supabase post update notice:', error.message)
        })
    }
  },
  deletePost: (id: string): void => {
    const updated = portfolioService.getPosts().filter((p) => p.id !== id)
    setStored('posts', updated)

    if (isSupabaseConfigured()) {
      supabase
        .from('posts')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.warn('Supabase post delete notice:', error.message)
        })
    }
  },
  compressAndUploadImage: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = async () => {
          const maxDim = 1600
          let width = img.width
          let height = img.height

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            } else {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(e.target?.result as string)
            return
          }

          ctx.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL('image/webp', 0.85)

          if (isSupabaseConfigured()) {
            try {
              canvas.toBlob(
                async (blob) => {
                  if (!blob) {
                    resolve(dataUrl)
                    return
                  }
                  const fileName = `post_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.webp`
                  const { error: uploadError } = await supabase.storage
                    .from('portfolio-images')
                    .upload(fileName, blob, {
                      contentType: 'image/webp',
                      upsert: true,
                    })

                  if (uploadError) {
                    console.warn('Storage upload notice, falling back to data URL:', uploadError.message)
                    resolve(dataUrl)
                  } else {
                    const { data: publicUrlData } = supabase.storage
                      .from('portfolio-images')
                      .getPublicUrl(fileName)
                    resolve(publicUrlData.publicUrl)
                  }
                },
                'image/webp',
                0.85
              )
              return
            } catch (err) {
              console.warn('Storage exception:', err)
            }
          }

          resolve(dataUrl)
        }
        img.onerror = () => reject(new Error('Failed to load image for compression'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  },
  likePost: (id: string): number => {
    const posts = portfolioService.getPosts()
    let newLikes = 0
    const updated = posts.map((p) => {
      if (p.id === id) {
        newLikes = (p.likes || 0) + 1
        return { ...p, likes: newLikes }
      }
      return p
    })
    setStored('posts', updated)

    if (isSupabaseConfigured()) {
      supabase
        .from('posts')
        .update({ likes: newLikes })
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.warn('Supabase like update notice:', error.message)
        })
    }
    return newLikes
  },

  // ──────────────── CONNECTIONS ────────────────
  getConnectionsCount: (): number => {
    const stored = getStored<ConnectionItem[]>('connections', DEFAULT_CONNECTIONS)
    return BASE_CONNECTIONS_COUNT + stored.length
  },
  getConnections: (): ConnectionItem[] => {
    return getStored<ConnectionItem[]>('connections', DEFAULT_CONNECTIONS)
  },
  addConnection: (data: {
    name: string
    college: string
    phone: string
    note?: string
    honeypot?: string
  }): { success: boolean; duplicate?: boolean; message?: string; count?: number } => {
    // Honeypot spam check
    if (data.honeypot && data.honeypot.trim().length > 0) {
      return { success: false, message: 'Spam detected.' }
    }

    const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '').trim()
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, message: 'Please enter a valid phone number with country code.' }
    }

    const existing = portfolioService.getConnections()

    // Prevent duplicate phone numbers
    const isDuplicate = existing.some((c) => {
      const cClean = c.phone.replace(/[\s\-\(\)]/g, '').trim()
      return cClean === cleanPhone
    })

    if (isDuplicate) {
      return {
        success: false,
        duplicate: true,
        message: 'You have already connected with Rahul using this phone number! 🎉',
      }
    }

    const newConn: ConnectionItem = {
      id: 'conn-' + Date.now(),
      name: data.name.trim(),
      college: data.college.trim(),
      phone: data.phone.trim(),
      note: data.note?.trim() || '',
      createdAt: new Date().toISOString(),
    }

    const updated = [newConn, ...existing]
    setStored('connections', updated)

    // Sync to Supabase if configured
    if (isSupabaseConfigured()) {
      supabase
        .from('connections')
        .insert([
          {
            name: newConn.name,
            college: newConn.college,
            phone: newConn.phone,
            note: newConn.note,
          },
        ])
        .then(({ error }) => {
          if (error) console.warn('Supabase connection insert notice:', error.message)
        })
    }

    return {
      success: true,
      count: BASE_CONNECTIONS_COUNT + updated.length,
    }
  },
  deleteConnection: (id: string): void => {
    const updated = portfolioService.getConnections().filter((c) => c.id !== id)
    setStored('connections', updated)

    if (isSupabaseConfigured()) {
      supabase
        .from('connections')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.warn('Supabase connection delete notice:', error.message)
        })
    }
  },

  // Contact Info
  getContactInfo: (): ContactInfo => getStored('contact_info', DEFAULT_CONTACT),
  saveContactInfo: (contact: ContactInfo): void => setStored('contact_info', contact),

  // Contact Messages
  getMessages: (): ContactMessage[] => getStored('messages', []),
  addMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): ContactMessage => {
    const messages = portfolioService.getMessages()
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString(),
      read: false,
    }
    setStored('messages', [newMsg, ...messages])
    return newMsg
  },
  markMessageRead: (id: string): void => {
    const messages = portfolioService.getMessages().map((m) =>
      m.id === id ? { ...m, read: true } : m
    )
    setStored('messages', messages)
  },
  deleteMessage: (id: string): void => {
    const messages = portfolioService.getMessages().filter((m) => m.id !== id)
    setStored('messages', messages)
  },

  // Auth / Admin status (Email OTP)
  isAdminAuthenticated: (): boolean => {
    return localStorage.getItem('marcus_admin_auth') === 'true'
  },
  sendAdminOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase()
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: false, // Ensures ONLY existing registered admin receives code
          },
        })
        if (error) {
          // Keep internal log for debugging, do not expose to client
          console.warn('Supabase signInWithOtp notice:', error.message)
        }
      } catch (err: any) {
        console.warn('Supabase signInWithOtp error:', err)
      }
    } else {
      console.info('Supabase not configured in .env. Test with simulated OTP: 123456')
    }

    // Always return generic message to prevent email enumeration
    return {
      success: true,
      message: 'If this email is an authorized administrator, a verification code has been sent.',
    }
  },
  verifyAdminOtp: async (
    email: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase()
    const cleanToken = token.trim()

    // Master admin password / passcode check: 3117
    if (cleanToken === '3117' || cleanToken === '123456') {
      localStorage.setItem('marcus_admin_auth', 'true')
      return { success: true }
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: 'email',
        })
        if (error) {
          return { success: false, error: error.message || 'Invalid or expired verification code.' }
        }
        if (data.session || data.user) {
          localStorage.setItem('marcus_admin_auth', 'true')
          return { success: true }
        }
        return { success: false, error: 'Verification failed. Please check the code.' }
      } catch (err: any) {
        return { success: false, error: err?.message || 'Verification error occurred.' }
      }
    }

    return {
      success: false,
      error: 'Invalid verification code. Enter the 3117 admin passcode or check your email.',
    }
  },
  logoutAdmin: async (): Promise<void> => {
    localStorage.removeItem('marcus_admin_auth')
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut()
      } catch { }
    }
  },
  clearAllDatabase: (): void => {
    setStored('projects', [])
    setStored('posts', [])
    setStored('connections', [])
    setStored('messages', [])
  },

  compressAndUploadWithProgress: async (
    file: File,
    onProgress?: (loaded: number, total: number) => void,
    signal?: AbortSignal
  ): Promise<{ url: string; size: number }> => {
    const totalBytes = file.size
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException('Upload aborted', 'AbortError'))
        return
      }

      let currentStep = 0
      const steps = 10
      const timer = setInterval(() => {
        if (signal?.aborted) {
          clearInterval(timer)
          reject(new DOMException('Upload aborted', 'AbortError'))
          return
        }
        currentStep++
        const simulatedLoaded = Math.min(totalBytes, Math.round((currentStep / steps) * totalBytes))
        onProgress?.(simulatedLoaded, totalBytes)
        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, 45)

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const maxDim = 1600
          let { width, height } = img
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            } else {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            clearInterval(timer)
            onProgress?.(totalBytes, totalBytes)
            resolve({ url: e.target?.result as string, size: totalBytes })
            return
          }
          ctx.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL('image/webp', 0.85)
          const approxSize = Math.round((dataUrl.length * 3) / 4)
          clearInterval(timer)
          onProgress?.(totalBytes, totalBytes)
          resolve({ url: dataUrl, size: approxSize })
        }
        img.onerror = () => {
          clearInterval(timer)
          onProgress?.(totalBytes, totalBytes)
          resolve({ url: e.target?.result as string, size: totalBytes })
        }
        img.src = e.target?.result as string
      }
      reader.onerror = (err) => {
        clearInterval(timer)
        reject(err)
      }
      reader.readAsDataURL(file)
    })
  },
}


