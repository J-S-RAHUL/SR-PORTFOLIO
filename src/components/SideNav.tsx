import React from 'react'
import { LayoutGrid, Share2, FolderGit2 } from 'lucide-react'

export type TabKey = 'posts' | 'platforms' | 'projects'

interface SideNavProps {
  activeTab: TabKey
  onSelectTab: (tab: TabKey) => void
  isVisible: boolean
}

interface TabDef {
  key: TabKey
  label: string
  Icon: React.ComponentType<{ size: number; className?: string }>
}

const TABS: TabDef[] = [
  { key: 'posts', label: 'Posts', Icon: LayoutGrid },
  { key: 'platforms', label: 'Platforms', Icon: Share2 },
  { key: 'projects', label: 'Projects', Icon: FolderGit2 },
]

export function SideNav({ activeTab, onSelectTab, isVisible }: SideNavProps) {
  return (
    <nav
      aria-label="Navigation"
      className={`fixed bottom-4 sm:bottom-auto left-1/2 -translate-x-1/2 sm:left-6 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 z-50 transition-all duration-500 ease-out select-none ${
        isVisible
          ? 'opacity-100 pointer-events-auto translate-y-0 sm:translate-x-0'
          : 'opacity-0 pointer-events-none translate-y-8 sm:translate-y-0 sm:-translate-x-12'
      }`}
    >
      <div className="flex flex-row sm:flex-col items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white/95 backdrop-blur-xl border border-black/10 shadow-[0_12px_40px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.06)] rounded-full">
        {TABS.map(({ key, label, Icon }) => {
          const isActive = activeTab === key
          return (
            <div key={key} className="relative group">
              <button
                onClick={() => onSelectTab(key)}
                aria-label={label}
                className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#1E1F2B] text-white shadow-md scale-105'
                    : 'text-black/65 hover:text-black hover:bg-black/5'
                }`}
                style={{
                  fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif',
                }}
              >
                <Icon size={18} className="flex-shrink-0" />
                {isActive && (
                  <span className="hidden sm:block absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3 rounded-r bg-white/80" />
                )}
                {isActive && (
                  <span className="sm:hidden absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-white/80" />
                )}
              </button>

              {/* Floating Tooltip Label on Hover / Active */}
              <div
                className={`hidden sm:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-wider uppercase whitespace-nowrap shadow-lg pointer-events-none transition-all duration-200 z-50 ${
                  isActive
                    ? 'bg-[#1E1F2B] text-white opacity-100 scale-100'
                    : 'bg-black/85 text-white opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {label}
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E1F2B]" />
              </div>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
