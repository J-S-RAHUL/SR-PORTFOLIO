import React from 'react'
import { LayoutGrid, Share2, FolderGit2, User } from 'lucide-react'

export type TabKey = 'posts' | 'platforms' | 'projects' | 'profile'

interface BottomNavProps {
  activeTab: TabKey
  onSelectTab: (tab: TabKey) => void
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
  { key: 'profile', label: 'Profile', Icon: User },
]

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  return (
    <nav
      aria-label="Portfolio navigation tabs"
      className="relative z-20 flex flex-col items-center w-full max-w-[420px] px-3 sm:px-0 mx-auto pointer-events-auto select-none"
    >
      {/* Floating White Bar */}
      <div
        className="w-full bg-white/95 backdrop-blur-md border border-black/10 shadow-[0_12px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] p-1.5 flex items-center justify-between"
        style={{
          borderRadius: 26,
        }}
      >
        {TABS.map(({ key, label, Icon }) => {
          const isActive = activeTab === key
          return (
            <button
              key={key}
              onClick={() => onSelectTab(key)}
              aria-label={label}
              className={`relative flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 transition-all duration-300 ease-out cursor-pointer select-none ${
                isActive
                  ? 'bg-[#1E1F2B] text-white px-3.5 sm:px-5 rounded-[20px] shadow-sm flex-1 max-w-[130px] sm:max-w-[150px]'
                  : 'text-black hover:opacity-75 px-2.5 sm:px-3.5 rounded-full flex-none'
              }`}
              style={{
                fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif',
              }}
            >
              <Icon size={18} className="flex-shrink-0" />
              {isActive && (
                <span className="text-[11px] sm:text-xs font-medium tracking-wide whitespace-nowrap animate-in fade-in duration-300">
                  {label}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Small grey home indicator line */}
      <div className="w-24 h-1 bg-neutral-400/80 rounded-full mt-2 shadow-sm pointer-events-none" />
    </nav>
  )
}
