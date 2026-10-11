import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { portfolioService } from '../services/portfolioData'
import { AdminFileUpload, type UploadedFileItem } from '../components/AdminFileUpload'
import type { ProjectItem, PostItem } from '../types'
import {
  Code2,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  GripVertical,
  ArrowUp,
  ArrowDown,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react'

type TabType = 'posts' | 'projects'

// Symmetric vertical background lines running full page height, spaced ~13.5% apart
const SYMMETRIC_VERTICAL_LINES = [9.5, 23.0, 36.5, 50.0, 63.5, 77.0, 90.5]

export function AdminDashboard() {
  const navigate = useNavigate()

  // Authentication Guard
  useEffect(() => {
    if (!portfolioService.isAdminAuthenticated()) {
      navigate('/admin/login')
    }
  }, [navigate])

  const [activeTab, setActiveTab] = useState<TabType>('posts')
  const [posts, setPosts] = useState<PostItem[]>(portfolioService.getPosts())
  const [projects, setProjects] = useState<ProjectItem[]>(portfolioService.getProjects())
  const [notification, setNotification] = useState<string>('')
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')

  // Async initial fetch
  useEffect(() => {
    portfolioService.fetchPostsAsync().then((fresh) => {
      if (fresh && fresh.length > 0) setPosts(fresh)
    })
    portfolioService.fetchProjectsAsync().then((fresh) => {
      if (fresh && fresh.length > 0) setProjects(fresh)
    })
  }, [])

  const showNotify = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification(msg)
    setNotificationType(type)
    setTimeout(() => setNotification(''), 4000)
  }

  const handleLogout = () => {
    portfolioService.logoutAdmin()
    navigate('/')
  }

  /* ──────────────── Posts Management ──────────────── */
  const [editingPost, setEditingPost] = useState<Partial<PostItem> | null>(null)
  const [postFiles, setPostFiles] = useState<UploadedFileItem[]>([])
  const [newPostTag, setNewPostTag] = useState('')
  const [draggedPostIndex, setDraggedPostIndex] = useState<number | null>(null)

  const openNewPostForm = () => {
    setPostFiles([])
    setEditingPost({
      title: '',
      caption: '',
      imageUrl: '',
      linkUrl: '',
      tags: ['Build', 'Design'],
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openEditPostForm = (post: PostItem) => {
    const existing: UploadedFileItem[] = post.imageUrl
      ? [
          {
            id: `post-img-${post.id}`,
            name: post.title ? `${post.title.replace(/\s+/g, '_')}.webp` : 'post_image.webp',
            size: 250000,
            url: post.imageUrl,
          },
        ]
      : []
    setPostFiles(existing)
    setEditingPost(post)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault()
    const activeImage = postFiles[0]?.url || editingPost?.imageUrl || ''
    if (!editingPost || !activeImage || !editingPost.caption?.trim()) {
      showNotify('Please upload an image and write a caption.', 'error')
      return
    }

    if (editingPost.id) {
      const updatedPost: PostItem = {
        id: editingPost.id,
        title: editingPost.title || '',
        imageUrl: activeImage,
        caption: editingPost.caption,
        linkUrl: editingPost.linkUrl || '',
        date: editingPost.date || 'Today',
        tags: editingPost.tags || [],
        likes: editingPost.likes || 0,
        sortOrder: editingPost.sortOrder ?? 0,
        createdAt: editingPost.createdAt || new Date().toISOString(),
        published: editingPost.published ?? true,
      }
      portfolioService.updatePost(updatedPost)
      setPosts(portfolioService.getPosts())
      showNotify('Post updated successfully!')
    } else {
      portfolioService.addPost({
        title: editingPost.title || '',
        imageUrl: activeImage,
        caption: editingPost.caption,
        linkUrl: editingPost.linkUrl || '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        tags: editingPost.tags || [],
        published: true,
      })
      setPosts(portfolioService.getPosts())
      showNotify('New post published to showcase!')
    }
    setEditingPost(null)
    setPostFiles([])
  }

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      portfolioService.deletePost(id)
      setPosts(portfolioService.getPosts())
      showNotify('Post deleted.')
    }
  }

  const handleMovePost = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= posts.length) return
    const reordered = [...posts]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)
    portfolioService.reorderPosts(reordered)
    setPosts(portfolioService.getPosts())
    showNotify(`Post moved ${direction}. Showcase updated!`)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPostIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedPostIndex === null || draggedPostIndex === dropIndex) return
    const reordered = [...posts]
    const [moved] = reordered.splice(draggedPostIndex, 1)
    reordered.splice(dropIndex, 0, moved)
    setDraggedPostIndex(null)
    portfolioService.reorderPosts(reordered)
    setPosts(portfolioService.getPosts())
    showNotify('Posts reordered successfully!')
  }

  const handleAddPostTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return
    e.preventDefault()
    const trimmed = newPostTag.trim()
    if (!trimmed || !editingPost) return
    const existing = editingPost.tags || []
    if (!existing.includes(trimmed)) {
      setEditingPost({ ...editingPost, tags: [...existing, trimmed] })
    }
    setNewPostTag('')
  }

  const handleRemovePostTag = (tagToRemove: string) => {
    if (!editingPost) return
    setEditingPost({
      ...editingPost,
      tags: (editingPost.tags || []).filter((t) => t !== tagToRemove),
    })
  }

  /* ──────────────── Projects Management ──────────────── */
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null)
  const [projectFiles, setProjectFiles] = useState<UploadedFileItem[]>([])
  const [newProjectTag, setNewProjectTag] = useState('')
  const [isAutofillingGithub, setIsAutofillingGithub] = useState(false)
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null)

  const openNewProjectForm = () => {
    setProjectFiles([])
    setEditingProject({
      title: '',
      description: '',
      imageUrl: '',
      repoUrl: '',
      demoUrl: '',
      techTags: ['React', 'TypeScript', 'TailwindCSS'],
      featured: true,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openEditProjectForm = (project: ProjectItem) => {
    const existing: UploadedFileItem[] = project.imageUrl
      ? [
          {
            id: `proj-img-${project.id}`,
            name: `${(project.title || 'project').replace(/\s+/g, '_')}.webp`,
            size: 320000,
            url: project.imageUrl,
          },
        ]
      : []
    setProjectFiles(existing)
    setEditingProject(project)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAutofillGithub = async () => {
    const url = editingProject?.repoUrl || editingProject?.githubUrl
    if (!url || !url.trim()) {
      showNotify('Please enter a GitHub repository URL or user/repo first.', 'error')
      return
    }
    setIsAutofillingGithub(true)
    try {
      const details = await portfolioService.fetchGithubRepoDetails(url)
      if (details) {
        setEditingProject((prev) => ({
          ...prev,
          title: details.title,
          name: details.title,
          description: details.description || prev?.description || '',
          techTags: details.techTags,
          technologies: details.techTags,
          repoUrl: details.repoUrl,
          githubUrl: details.repoUrl,
        }))
        showNotify('Auto-filled repo name, description, and languages!')
      } else {
        showNotify('Could not find public repo. Ensure format is https://github.com/OWNER/REPO or OWNER/REPO.', 'error')
      }
    } catch (err: any) {
      showNotify('Auto-fill error: ' + (err?.message || 'Failed'), 'error')
    } finally {
      setIsAutofillingGithub(false)
    }
  }

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault()
    const projTitle = (editingProject?.title || editingProject?.name || '').trim()
    if (!editingProject || !projTitle) {
      showNotify('Please enter a project title.', 'error')
      return
    }

    const activeImage = projectFiles[0]?.url || editingProject.imageUrl || ''
    const tags =
      editingProject.techTags && editingProject.techTags.length > 0
        ? editingProject.techTags
        : editingProject.technologies && editingProject.technologies.length > 0
        ? editingProject.technologies
        : ['Full Stack']
    const repo = (editingProject.repoUrl || editingProject.githubUrl || '').trim()

    if (editingProject.id) {
      const updatedItem: ProjectItem = {
        id: editingProject.id,
        title: projTitle,
        name: projTitle,
        description: editingProject.description || '',
        imageUrl: activeImage || undefined,
        techTags: tags,
        technologies: tags,
        repoUrl: repo,
        githubUrl: repo,
        demoUrl: editingProject.demoUrl || '',
        sortOrder: editingProject.sortOrder ?? 0,
        featured: editingProject.featured ?? true,
        published: editingProject.published ?? true,
        createdAt: editingProject.createdAt,
      }
      portfolioService.updateProject(updatedItem)
      setProjects(portfolioService.getProjects())
      showNotify('Project updated successfully!')
    } else {
      portfolioService.addProject({
        title: projTitle,
        name: projTitle,
        description: editingProject.description || '',
        imageUrl: activeImage || undefined,
        techTags: tags,
        technologies: tags,
        repoUrl: repo,
        githubUrl: repo,
        demoUrl: editingProject.demoUrl || '',
        featured: true,
        published: true,
      })
      setProjects(portfolioService.getProjects())
      showNotify('New project added to portfolio viewer!')
    }
    setEditingProject(null)
    setProjectFiles([])
  }

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      portfolioService.deleteProject(id)
      setProjects(portfolioService.getProjects())
      showNotify('Project deleted.')
    }
  }

  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= projects.length) return
    const reordered = [...projects]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)
    portfolioService.reorderProjects(reordered)
    setProjects(portfolioService.getProjects())
    showNotify(`Project moved ${direction}. Viewer sequence updated.`)
  }

  const handleProjectDragStart = (e: React.DragEvent, index: number) => {
    setDraggedProjectIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleProjectDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleProjectDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedProjectIndex === null || draggedProjectIndex === dropIndex) return
    const reordered = [...projects]
    const [moved] = reordered.splice(draggedProjectIndex, 1)
    reordered.splice(dropIndex, 0, moved)
    setDraggedProjectIndex(null)
    portfolioService.reorderProjects(reordered)
    setProjects(portfolioService.getProjects())
    showNotify('Projects reordered successfully!')
  }

  const handleAddProjectTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return
    e.preventDefault()
    const trimmed = newProjectTag.trim()
    if (!trimmed || !editingProject) return
    const existing = editingProject.techTags || editingProject.technologies || []
    if (!existing.includes(trimmed)) {
      setEditingProject({ ...editingProject, techTags: [...existing, trimmed] })
    }
    setNewProjectTag('')
  }

  const handleRemoveProjectTag = (tagToRemove: string) => {
    if (!editingProject) return
    const existing = editingProject.techTags || editingProject.technologies || []
    setEditingProject({
      ...editingProject,
      techTags: existing.filter((t) => t !== tagToRemove),
    })
  }

  const isEditingPost = editingPost !== null
  const isEditingProject = editingProject !== null

  return (
    <div
      className="relative min-h-screen w-full bg-[#F0F0F0] text-black flex flex-col items-center selection:bg-black selection:text-white overflow-x-hidden pt-[50px] sm:pt-[60px] pb-[80px] sm:pb-[100px] px-4 sm:px-6"
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* ──────────────── SYMMETRIC 1px VERTICAL BACKGROUND LINES ──────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden w-full h-full">
        {SYMMETRIC_VERTICAL_LINES.map((pct, idx) => (
          <div
            key={`line-${idx}`}
            className="absolute top-0 bottom-0 w-[1px] bg-[#DADADA]"
            style={{ left: `${pct}%` }}
          />
        ))}
      </div>

      {/* ──────────────── FIXED NOTIFICATION BANNER ──────────────── */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in pointer-events-none">
          <div
            className={`px-6 py-3 rounded-full text-sm font-medium shadow-lg border-2 ${
              notificationType === 'success'
                ? 'bg-[#EAF7EE] border-[#BCE5C8] text-[#1D6F39]'
                : 'bg-[#FDE8E8] border-[#F8B4B4] text-[#9B1C1C]'
            }`}
          >
            {notification}
          </div>
        </div>
      )}

      {/* ──────────────── TOP CENTERED CONTROLS BAR ──────────────── */}
      <header className="relative z-10 w-full max-w-[600px] mx-auto flex items-center justify-between gap-3 mb-8">
        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border-2 border-[#CFCFCF] rounded-full shadow-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('posts')
              setEditingPost(null)
              setEditingProject(null)
            }}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'posts'
                ? 'bg-black text-white shadow-sm'
                : 'text-[#666] hover:text-black'
            }`}
          >
            <MessageSquare size={14} />
            <span>Posts ({posts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('projects')
              setEditingPost(null)
              setEditingProject(null)
            }}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'projects'
                ? 'bg-black text-white shadow-sm'
                : 'text-[#666] hover:text-black'
            }`}
          >
            <Code2 size={14} />
            <span>Projects ({projects.length})</span>
          </button>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-4 py-2 bg-white border-2 border-[#CFCFCF] text-black text-xs font-semibold rounded-full hover:border-black transition-colors"
          >
            <span>Live Portfolio</span>
            <ExternalLink size={12} />
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1 px-4 py-2 bg-white border-2 border-[#CFCFCF] text-black text-xs font-semibold rounded-full hover:border-red-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* ──────────────── CENTERED ELEGANT TITLE & SUBTITLE ──────────────── */}
      <div className="relative z-10 w-full text-center mb-8 sm:mb-10 max-w-[600px] mx-auto">
        <h1
          className="text-[34px] sm:text-[44px] text-black font-normal tracking-tight font-serif"
          style={{ fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif' }}
        >
          {activeTab === 'posts'
            ? isEditingPost
              ? editingPost.id
                ? 'Edit Post'
                : 'Add Post'
              : 'Posts Showcase'
            : isEditingProject
            ? editingProject.id
              ? 'Edit Project'
              : 'Add Project'
            : 'Projects Portfolio'}
        </h1>
        <p className="text-[#666] text-[18px] sm:text-[20px] font-normal mt-2 tracking-tight">
          {isEditingPost || isEditingProject
            ? 'Upload your images and add the details.'
            : activeTab === 'posts'
            ? 'Manage showcase moments, stories, and feed images.'
            : 'Manage software repositories and 3D animated showcase items.'}
        </p>
      </div>

      {/* ──────────────── TAB: POSTS ──────────────── */}
      {activeTab === 'posts' && (
        <div className="relative z-10 w-full max-w-[600px] mx-auto flex flex-col items-center">
          {/* 1. ADD / EDIT POST FORM (SINGLE CENTERED WHITE CARD) */}
          {isEditingPost ? (
            <form
              onSubmit={handleSavePost}
              className="w-full bg-white rounded-[36px] p-6 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col space-y-6 animate-fade-in"
            >
              {/* FILE UPLOAD COMPONENT (Drop zone, uploading rows, uploaded rows) */}
              <AdminFileUpload
                files={postFiles}
                onFilesChange={(files) => {
                  setPostFiles(files)
                  if (files[0]?.url) {
                    setEditingPost((prev) => (prev ? { ...prev, imageUrl: files[0].url } : null))
                  }
                }}
                maxFiles={1}
                accept="image/*"
              />

              {/* RESTYLED EXISTING FORM DETAILS */}
              <div className="space-y-5 pt-2">
                {/* Title (Optional) */}
                <div>
                  <label className="text-[13px] sm:text-[14px] text-[#777] block mb-2 font-normal">
                    Title / Heading (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    placeholder="e.g. Night engineering sprint"
                    className="w-full bg-white border-2 border-[#CFCFCF] rounded-[20px] px-5 py-4 text-[16px] sm:text-[18px] text-black placeholder-[#999] focus:border-black outline-none transition-colors"
                  />
                </div>

                {/* Caption (Required) * */}
                <div>
                  <label className="text-[13px] sm:text-[14px] text-[#777] block mb-2 font-normal">
                    Caption (Required) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingPost.caption || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, caption: e.target.value })}
                    placeholder="Write a clear, expressive story or caption for this moment..."
                    className="w-full bg-white border-2 border-[#CFCFCF] rounded-[20px] px-5 py-4 text-[16px] sm:text-[18px] text-black placeholder-[#999] focus:border-black outline-none transition-colors resize-none"
                  />
                </div>

                {/* Link URL (Optional) */}
                <div>
                  <label className="text-[13px] sm:text-[14px] text-[#777] block mb-2 font-normal">
                    Link URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingPost.linkUrl || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, linkUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white border-2 border-[#CFCFCF] rounded-[20px] px-5 py-4 text-[16px] sm:text-[18px] text-black placeholder-[#999] focus:border-black outline-none transition-colors"
                  />
                </div>

                {/* Direct Image URL fallback */}
                <div>
                  <label className="text-[13px] sm:text-[14px] text-[#777] block mb-2 font-normal">
                    Or Paste Direct Image URL
                  </label>
                  <input
                    type="text"
                    value={editingPost.imageUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      setEditingPost({ ...editingPost, imageUrl: val })
                      if (val && !postFiles[0]) {
                        setPostFiles([
                          {
                            id: `direct-${Date.now()}`,
                            name: 'linked_image.webp',
                            size: 200000,
                            url: val,
                          },
                        ])
                      }
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border-2 border-[#CFCFCF] rounded-[20px] px-5 py-4 text-[15px] sm:text-[16px] text-black placeholder-[#999] focus:border-black outline-none transition-colors"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-[13px] sm:text-[14px] text-[#777] block mb-2 font-normal">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(editingPost.tags || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0F0F0] border border-[#E4E4E4] text-xs sm:text-sm font-medium text-black"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePostTag(tag)}
                          className="hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPostTag}
                      onChange={(e) => setNewPostTag(e.target.value)}
                      onKeyDown={handleAddPostTag}
                      placeholder="Add tag and press Enter"
                      className="flex-1 bg-white border-2 border-[#CFCFCF] rounded-[20px] px-4 py-3 text-[15px] text-black placeholder-[#999] focus:border-black outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleAddPostTag}
                      className="px-5 py-3 rounded-full bg-white border-2 border-[#CFCFCF] hover:border-black text-black text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS (Solid black pill & white pill secondary) */}
              <div className="pt-4 flex flex-col space-y-3">
                <button
                  type="submit"
                  className="w-full h-[64px] rounded-full bg-black hover:bg-[#222] text-white text-[18px] font-semibold transition-all shadow-sm flex items-center justify-center cursor-pointer active:scale-[0.99]"
                >
                  {editingPost.id ? 'Save & Update Post' : 'Save & Publish Post'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPost(null)
                    setPostFiles([])
                  }}
                  className="w-full h-[64px] rounded-full bg-white border-2 border-[#CFCFCF] hover:border-black text-black text-[18px] font-semibold transition-all flex items-center justify-center cursor-pointer"
                >
                  Cancel &amp; Back to List
                </button>
              </div>
            </form>
          ) : (
            /* 2. POSTS LIST VIEW (CENTERED) */
            <div className="w-full flex flex-col space-y-4">
              {/* Primary + Add Post Button */}
              <button
                type="button"
                onClick={openNewPostForm}
                className="w-full h-[64px] rounded-full bg-black hover:bg-[#222] text-white text-[18px] font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Plus size={20} strokeWidth={2.5} />
                <span>Add New Post</span>
              </button>

              {posts.length > 1 && (
                <p className="text-center text-xs text-[#777] font-normal py-1">
                  Drag items or use the arrows to reorder the sequence in the smooth scroll showcase.
                </p>
              )}

              {/* List Cards */}
              <div className="space-y-3 w-full">
                {posts.map((post, idx) => (
                  <div
                    key={post.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, idx)}
                    className="w-full bg-white border-2 border-[#CFCFCF] rounded-[24px] p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-[#999] transition-all"
                  >
                    {/* Left: Drag Handle & Thumbnail */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="cursor-grab active:cursor-grabbing text-[#999] hover:text-black hidden sm:block">
                        <GripVertical size={18} />
                      </div>
                      <div className="w-[68px] h-[85px] sm:w-[74px] sm:h-[92px] rounded-[16px] bg-[#F0F0F0] overflow-hidden flex-shrink-0 border border-black/5">
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title || 'Post'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-[#999]">
                            No img
                          </div>
                        )}
                      </div>

                      {/* Middle: Content */}
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-mono text-[#777] uppercase">
                            #{idx + 1}
                          </span>
                          {post.title && (
                            <h3 className="text-[16px] sm:text-[18px] font-semibold text-black truncate">
                              {post.title}
                            </h3>
                          )}
                        </div>
                        <p className="text-[13px] text-[#555] line-clamp-2 leading-relaxed font-normal">
                          {post.caption}
                        </p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.slice(0, 3).map((t, tidx) => (
                              <span
                                key={tidx}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0F0F0] text-[#555] font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      {/* Reorder Arrows */}
                      <div className="flex flex-col gap-1 mr-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMovePost(idx, 'up')}
                          aria-label="Move post up"
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#777] hover:text-black hover:bg-[#F0F0F0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === posts.length - 1}
                          onClick={() => handleMovePost(idx, 'down')}
                          aria-label="Move post down"
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#777] hover:text-black hover:bg-[#F0F0F0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => openEditPostForm(post)}
                        aria-label="Edit post"
                        className="px-3 sm:px-4 py-2 rounded-full border-2 border-[#CFCFCF] hover:border-black text-black text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 size={13} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        aria-label="Delete post"
                        className="p-2 sm:p-2.5 rounded-full text-[#777] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────── TAB: PROJECTS ──────────────── */}
      {activeTab === 'projects' && (
        <div className="relative z-10 w-full max-w-[600px] mx-auto flex flex-col items-center">
          {/* 1. ADD / EDIT PROJECT FORM (SINGLE CENTERED WHITE CARD) */}
          {isEditingProject ? (
            <form
              onSubmit={handleSaveProject}
              className="w-full bg-white rounded-[36px] p-6 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col space-y-6 animate-fade-in"
            >
              {/* FILE UPLOAD COMPONENT (Drop zone, uploading rows, uploaded rows) */}
              <AdminFileUpload
                files={projectFiles}
                onFilesChange={(files) => {
                  setProjectFiles(files)
                  if (files[0]?.url) {
                    setEditingProject((prev) => (prev ? { ...prev, imageUrl: files[0].url } : null))
                  }
                }}
                maxFiles={1}
                accept="image/*"
              />

              {/* RESTYLED EXISTING FORM DETAILS */}
              <div className="space-y-5 pt-2">
                {/* Project Title / Name (Required) * */}
                <div>
                  <label className="text-[13px] sm:text-[14px] text-[#777] block mb-2 font-normal">
                    Project Title / Name (Required) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || editingProject.name || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        title: e.target.value,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. Distributed Stream & Telemetry Gateway"
                    className="w-full bg-white border-2 border-[#CFCFCF] rounded-[20px] px-5 py-4 text-[16px] sm:text-[18px] text-black placeholder-[#999] focus:border-black outline-none transition-colors"
                  />
                </div>

                {/* GitHub Repository URL & Auto-fill */}
                <div>
                  <label className="text-[13px] sm:text-[14px] text-[#777] block mb-2 font-normal">
                    GitHub Repository URL (Optional)
                  </label>
                  <div className="space-y-2.5">
                    <input
                      type="text"
                      value={editingProject.repoUrl || editingProject.githubUrl || ''}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          repoUrl: e.target.value,
                          githubUrl: e.target.value,
                        })
                      }
                      placeholder="https://github.com/USER/REPO or USER/REPO"
                      className="w-full bg-white border-2 border-[#CFCFCF] rounded-[20px] px-5 py-4 text-[15px] sm:text-[17px] text-black placeholder-[#999] focus:border-black outline-none transition-colors"
                    />

                    <button
                      type="button"
                      disabled={isAutofillingGithub}
                      onClick={handleAutofillGithub}
                      className="w-full h-[52px] rounded-full bg-white border-2 border-[#CFCFCF] hover:border-black text-black text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isAutofillingGithub ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-black" />
                          <span>Fetching GitHub Repo Metadata...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>Auto-fill from GitHub</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Description (Required) * */}
                <div>
                  <label className="text-[13px] sm:text-[14px] text-[#777] block mb-2 font-normal">
                    Project Description (Required) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingProject.description || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    placeholder="Describe key engineering architecture, impact, and technology stack..."
                    className="w-full bg-white border-2 border-[#CFCFCF] rounded-[20px] px-5 py-4 text-[16px] sm:text-[18px] text-black placeholder-[#999] focus:border-black outline-none transition-colors resize-none"
                  />
                </div>

                {/* Live Demo URL */}
                <div>
                  <label className="text-[13px] sm:text-[14px] text-[#777] block mb-2 font-normal">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingProject.demoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white border-2 border-[#CFCFCF] rounded-[20px] px-5 py-4 text-[16px] sm:text-[18px] text-black placeholder-[#999] focus:border-black outline-none transition-colors"
                  />
                </div>

                {/* Direct Image URL fallback */}
                <div>
                  <label className="text-[13px] sm:text-[14px] text-[#777] block mb-2 font-normal">
                    Or Paste Direct Image URL (Leave blank for auto gradient)
                  </label>
                  <input
                    type="text"
                    value={editingProject.imageUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      setEditingProject({ ...editingProject, imageUrl: val })
                      if (val && !projectFiles[0]) {
                        setProjectFiles([
                          {
                            id: `direct-proj-${Date.now()}`,
                            name: 'project_cover.webp',
                            size: 250000,
                            url: val,
                          },
                        ])
                      }
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border-2 border-[#CFCFCF] rounded-[20px] px-5 py-4 text-[15px] sm:text-[16px] text-black placeholder-[#999] focus:border-black outline-none transition-colors"
                  />
                </div>

                {/* Tech Tags */}
                <div>
                  <label className="text-[13px] sm:text-[14px] text-[#777] block mb-2 font-normal">
                    Technologies / Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(editingProject.techTags || editingProject.technologies || []).map(
                      (tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0F0F0] border border-[#E4E4E4] text-xs sm:text-sm font-medium text-black"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProjectTag(tag)}
                            className="hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <X size={13} />
                          </button>
                        </span>
                      )
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newProjectTag}
                      onChange={(e) => setNewProjectTag(e.target.value)}
                      onKeyDown={handleAddProjectTag}
                      placeholder="Add tech tag and press Enter"
                      className="flex-1 bg-white border-2 border-[#CFCFCF] rounded-[20px] px-4 py-3 text-[15px] text-black placeholder-[#999] focus:border-black outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleAddProjectTag}
                      className="px-5 py-3 rounded-full bg-white border-2 border-[#CFCFCF] hover:border-black text-black text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS (Solid black pill & white pill secondary) */}
              <div className="pt-4 flex flex-col space-y-3">
                <button
                  type="submit"
                  className="w-full h-[64px] rounded-full bg-black hover:bg-[#222] text-white text-[18px] font-semibold transition-all shadow-sm flex items-center justify-center cursor-pointer active:scale-[0.99]"
                >
                  {editingProject.id ? 'Save & Update Project' : 'Save & Publish Project'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null)
                    setProjectFiles([])
                  }}
                  className="w-full h-[64px] rounded-full bg-white border-2 border-[#CFCFCF] hover:border-black text-black text-[18px] font-semibold transition-all flex items-center justify-center cursor-pointer"
                >
                  Cancel &amp; Back to List
                </button>
              </div>
            </form>
          ) : (
            /* 2. PROJECTS LIST VIEW (CENTERED) */
            <div className="w-full flex flex-col space-y-4">
              {/* Primary + Add Project Button */}
              <button
                type="button"
                onClick={openNewProjectForm}
                className="w-full h-[64px] rounded-full bg-black hover:bg-[#222] text-white text-[18px] font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Plus size={20} strokeWidth={2.5} />
                <span>Add New Project</span>
              </button>

              {projects.length > 1 && (
                <p className="text-center text-xs text-[#777] font-normal py-1">
                  Drag items or use the arrows to reorder the sequence in the 3D animated viewer.
                </p>
              )}

              {/* List Cards */}
              <div className="space-y-3 w-full">
                {projects.map((project, idx) => (
                  <div
                    key={project.id}
                    draggable
                    onDragStart={(e) => handleProjectDragStart(e, idx)}
                    onDragOver={handleProjectDragOver}
                    onDrop={(e) => handleProjectDrop(e, idx)}
                    className="w-full bg-white border-2 border-[#CFCFCF] rounded-[24px] p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-[#999] transition-all"
                  >
                    {/* Left: Drag Handle & Thumbnail */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="cursor-grab active:cursor-grabbing text-[#999] hover:text-black hidden sm:block">
                        <GripVertical size={18} />
                      </div>
                      <div className="w-[68px] h-[68px] sm:w-[74px] sm:h-[74px] rounded-[16px] bg-[#F0F0F0] overflow-hidden flex-shrink-0 border border-black/5 flex items-center justify-center">
                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.title || project.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-700 to-amber-950 flex items-center justify-center text-white text-xs font-mono font-medium">
                            3D
                          </div>
                        )}
                      </div>

                      {/* Middle: Content */}
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-mono text-[#777] uppercase">
                            #{idx + 1}
                          </span>
                          <h3 className="text-[16px] sm:text-[18px] font-semibold text-black truncate">
                            {project.title || project.name}
                          </h3>
                        </div>
                        <p className="text-[13px] text-[#555] line-clamp-2 leading-relaxed font-normal">
                          {project.description}
                        </p>
                        {(project.techTags || project.technologies) && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(project.techTags || project.technologies || []).slice(0, 3).map((t, tidx) => (
                              <span
                                key={tidx}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0F0F0] text-[#555] font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      {/* Reorder Arrows */}
                      <div className="flex flex-col gap-1 mr-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveProject(idx, 'up')}
                          aria-label="Move project up"
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#777] hover:text-black hover:bg-[#F0F0F0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === projects.length - 1}
                          onClick={() => handleMoveProject(idx, 'down')}
                          aria-label="Move project down"
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#777] hover:text-black hover:bg-[#F0F0F0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => openEditProjectForm(project)}
                        aria-label="Edit project"
                        className="px-3 sm:px-4 py-2 rounded-full border-2 border-[#CFCFCF] hover:border-black text-black text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 size={13} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project.id)}
                        aria-label="Delete project"
                        className="p-2 sm:p-2.5 rounded-full text-[#777] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
