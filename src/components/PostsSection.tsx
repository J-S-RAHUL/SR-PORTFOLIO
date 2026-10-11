import React, { useState } from 'react'
import type { PostItem } from '../types'
import { ExternalLink, X } from 'lucide-react'

interface PostsSectionProps {
  posts: PostItem[]
}

export function PostsSection({ posts }: PostsSectionProps) {
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null)

  const publishedPosts = posts.filter((p) => p.published !== false)

  return (
    <section
      id="posts"
      className="relative w-full bg-[#f4f4f4] text-[#111111] py-24 px-6 sm:px-12 lg:px-20 border-t border-black/10"
      style={{ fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-black/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-black/40 mb-2 block font-mono">
              06 // Updates &amp; Articles
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111]">
              Posts &amp; Activity
            </h2>
          </div>
          <p className="text-sm text-black/50 max-w-md mt-4 md:mt-0 leading-relaxed font-light">
            Behind-the-scenes engineering logs, technical deep dives, and system architecture updates.
          </p>
        </div>

        {/* Posts Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white border border-black/10 hover:border-black/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between overflow-hidden"
            >
              {/* Image Header */}
              {post.imageUrl && (
                <div className="relative h-64 w-full overflow-hidden bg-[#e8e8e8]">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent opacity-60" />
                </div>
              )}

              {/* Post Content */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-black/35 mb-3 font-mono">
                    <span>{post.date}</span>
                    <span className="uppercase text-[10px] tracking-wider text-black/50">
                      Post Log
                    </span>
                  </div>

                  <h3 className="text-xl font-normal text-[#111] mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-black/60 font-light leading-relaxed mb-6 line-clamp-3">
                    {post.caption}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(post.tags || []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 bg-[#f4f4f4] border border-black/10 text-black/55"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-black/10 text-xs text-black/45">
                    <span className="font-mono text-[11px] group-hover:text-[#111] transition-colors">
                      Read full update &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white border border-black/15 max-w-2xl w-full p-8 sm:p-10 relative my-8"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: '"Helvetica Neue ME", Helvetica, Arial, sans-serif' }}
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 text-black/40 hover:text-[#111] transition-colors p-2"
            >
              <X size={24} />
            </button>

            <span className="text-xs text-black/40 uppercase tracking-widest font-mono block mb-2">
              {selectedPost.date}
            </span>

            <h3 className="text-2xl sm:text-3xl font-normal text-[#111] mb-6">
              {selectedPost.title}
            </h3>

            {selectedPost.imageUrl && (
              <div className="mb-6 overflow-hidden border border-black/10 max-h-96">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="text-black/70 text-base font-light leading-relaxed mb-6 whitespace-pre-line">
              {selectedPost.caption}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {(selectedPost.tags || []).map((t) => (
                <span
                  key={t}
                  className="text-xs font-mono px-2.5 py-1 bg-[#f4f4f4] border border-black/10 text-[#111]"
                >
                  #{t}
                </span>
              ))}
            </div>

            {selectedPost.linkUrl && (
              <a
                href={selectedPost.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#111] text-white font-medium text-xs uppercase tracking-wider hover:bg-black transition-colors"
              >
                <span>View Attachment / Project Link</span>
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
