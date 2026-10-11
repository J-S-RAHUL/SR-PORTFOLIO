export interface ProfileData {
  name: string
  title: string
  education: string
  college: string
  focus: string
  bio: string
  profileImage: string
  resumeUrl?: string
  socials: {
    github: string
    linkedin: string
    instagram: string
    twitter?: string
  }
}

export interface SkillItem {
  id: string
  name: string
  category: string
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  order: number
}

export interface HackathonItem {
  id: string
  name: string
  organization: string
  date: string
  teamName: string
  role: string
  projectName: string
  description: string
  technologies: string[]
  achievement: string
  imageUrl?: string
  certificateUrl?: string
  githubUrl?: string
  demoUrl?: string
  published: boolean
}

export interface ProjectItem {
  id: string
  title: string
  name?: string // backwards compatibility alias for title
  description: string
  repoUrl?: string
  githubUrl?: string // backwards compatibility alias for repoUrl
  imageUrl?: string // optional photo
  techTags: string[]
  technologies?: string[] // backwards compatibility alias for techTags
  sortOrder?: number
  demoUrl?: string
  date?: string
  featured?: boolean
  published?: boolean
  createdAt?: string
}

export interface GithubRepo {
  id: string
  name: string
  description: string
  language: string
  stars: number
  forks: number
  updatedAt: string
  url: string
  featured: boolean
}

export interface PostItem {
  id: string
  title?: string
  imageUrl: string
  caption: string
  date?: string
  tags?: string[]
  likes?: number
  linkUrl?: string
  sortOrder?: number
  createdAt?: string
  published?: boolean
}

export interface ConnectionItem {
  id: string
  name: string
  college: string
  phone: string
  note?: string
  createdAt: string
}

export interface ContactInfo {
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  instagram: string
  twitter: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
  read: boolean
}
