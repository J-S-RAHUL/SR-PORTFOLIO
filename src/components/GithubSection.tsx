import React, { useState } from 'react'
import type { GithubRepo } from '../types'
import { GitBranch, Star, GitFork, RefreshCw, ExternalLink } from 'lucide-react'

interface GithubSectionProps {
  repos: GithubRepo[]
  username: string
  onSyncRepos?: () => Promise<void>
}

export function GithubSection({ repos, username, onSyncRepos }: GithubSectionProps) {
  const [syncing, setSyncing] = useState(false)

  const handleSync = async () => {
    if (!onSyncRepos) return
    setSyncing(true)
    try {
      await onSyncRepos()
    } finally {
      setSyncing(false)
    }
  }

  const featuredRepos = repos.filter((r) => r.featured !== false)

  return (
    <section
      id="github"
      className="relative w-full bg-white text-[#111111] py-24 px-6 sm:px-12 lg:px-20 border-t border-black/10"
      style={{ fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-black/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-black/40 mb-2 block font-mono">
              05 // Open Source &amp; Code
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111]">
              GitHub Repositories
            </h2>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="text-xs font-mono text-black/40">
              @{username}
            </span>
            {onSyncRepos && (
              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-4 py-2 border border-black/20 text-[#111] hover:bg-black/5 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                <span>{syncing ? 'Syncing...' : 'Sync GitHub'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredRepos.map((repo) => (
            <div
              key={repo.id}
              className="bg-[#f8f8f8] border border-black/10 p-8 hover:border-black/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 font-mono text-sm text-[#111] font-medium">
                    <GitBranch size={18} />
                    <span className="group-hover:text-black transition-colors">
                      {repo.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 bg-white border border-black/10 text-black/70">
                    {repo.language || 'Code'}
                  </span>
                </div>

                <p className="text-sm text-black/55 font-light leading-relaxed mb-6 line-clamp-2">
                  {repo.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-black/10 text-xs font-mono text-black/40">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-amber-500" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={14} />
                    {repo.forks}
                  </span>
                </div>

                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-black/55 hover:text-[#111] transition-colors"
                >
                  <span>View Repository</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
