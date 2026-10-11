import React, { useState, useRef, useEffect, useCallback } from 'react'
import { UploadCloud, Trash2, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { portfolioService } from '../services/portfolioData'

export interface UploadedFileItem {
  id: string
  name: string
  size: number
  url: string
}

interface UploadingState {
  file: File
  name: string
  loaded: number
  total: number
  abortController: AbortController
}

interface AdminFileUploadProps {
  files: UploadedFileItem[]
  onFilesChange: (files: UploadedFileItem[]) => void
  maxFiles?: number
  accept?: string
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function AdminFileUpload({
  files,
  onFilesChange,
  maxFiles = 5,
  accept = 'image/*',
}: AdminFileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingState[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Clear error after 5s
  useEffect(() => {
    if (!errorMessage) return
    const timer = setTimeout(() => setErrorMessage(null), 5000)
    return () => clearTimeout(timer)
  }, [errorMessage])

  // Handle single file upload with compression and real progress
  const processAndUploadFile = useCallback(
    async (file: File) => {
      // 10MB limit check
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the 10 MB maximum size limit.`)
        return
      }

      if (files.length >= maxFiles) {
        setErrorMessage(`Maximum limit of ${maxFiles} file(s) reached. Remove an existing file first.`)
        return
      }

      const abortController = new AbortController()
      const uploadItem: UploadingState = {
        file,
        name: file.name,
        loaded: 0,
        total: file.size,
        abortController,
      }

      setUploadingFiles((prev) => [...prev, uploadItem])

      try {
        const result = await portfolioService.compressAndUploadWithProgress(
          file,
          (loaded, total) => {
            setUploadingFiles((prev) =>
              prev.map((item) =>
                item.file === file ? { ...item, loaded, total } : item
              )
            )
          },
          abortController.signal
        )

        // Upload finished: remove from uploading, add to finished files
        setUploadingFiles((prev) => prev.filter((item) => item.file !== file))
        const newFileItem: UploadedFileItem = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: result.size,
          url: result.url,
        }
        onFilesChange([...files, newFileItem])
      } catch (err: any) {
        setUploadingFiles((prev) => prev.filter((item) => item.file !== file))
        if (err?.name !== 'AbortError') {
          console.error('File upload error:', err)
          setErrorMessage(`Failed to upload "${file.name}": ${err?.message || 'Upload failed'}`)
        }
      }
    },
    [files, maxFiles, onFilesChange]
  )

  const handleFilesSelected = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return
    Array.from(selectedFiles).forEach((f) => processAndUploadFile(f))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files)
    }
  }

  // Cancel in-flight upload
  const handleCancelUpload = (item: UploadingState) => {
    item.abortController.abort()
    setUploadingFiles((prev) => prev.filter((u) => u !== item))
  }

  // Remove finished file
  const handleRemoveFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id))
  }

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile()
          if (file) {
            processAndUploadFile(file)
            break
          }
        }
      }
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [processAndUploadFile])

  // Collapsing logic: If more than 2 files, show last 2 and collapse older ones behind 3 dots
  const shouldCollapse = files.length > 2 && !isExpanded
  const visibleFiles = shouldCollapse ? files.slice(files.length - 2) : files
  const hiddenCount = shouldCollapse ? files.length - 2 : 0

  return (
    <div className="w-full flex flex-col space-y-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* ──────────────── DROP ZONE ──────────────── */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full h-[280px] sm:h-[300px] rounded-[14px] flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all duration-200 select-none ${
          isDragOver ? 'bg-[#E5E5E5]' : 'bg-[#F0F0F0]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="hidden"
        />

        {/* White Rounded-Square Icon Box (~86px, radius ~22px) */}
        <div
          className={`w-[86px] h-[86px] rounded-[22px] bg-white flex items-center justify-center shadow-xs transition-transform duration-200 mb-4 ${
            isDragOver ? '-translate-y-1 shadow-md' : ''
          }`}
        >
          <UploadCloud size={34} strokeWidth={1.5} className="text-black" />
        </div>

        {/* Text */}
        <p className="text-[17px] sm:text-[19px] font-medium text-black">
          Drop your files here or{' '}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
            className="text-black underline underline-offset-2 hover:opacity-75 transition-opacity font-medium cursor-pointer"
          >
            browse
          </button>
        </p>

        {/* Grey Info Line */}
        <p className="text-[13px] text-[#777] mt-1.5 font-normal">
          Max file size up to 10 MB
        </p>
      </div>

      {/* ──────────────── ERROR BANNER ──────────────── */}
      {errorMessage && (
        <div className="w-full px-4 py-3 bg-[#FDE8E8] border border-[#F8B4B4] rounded-[16px] text-[#9B1C1C] text-xs flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ──────────────── UPLOADING ROWS (~120px tall) ──────────────── */}
      {uploadingFiles.map((item, idx) => {
        const percent = item.total > 0 ? Math.round((item.loaded / item.total) * 100) : 0
        const progressFormatted = `${formatBytes(item.loaded)} of ${formatBytes(item.total)}`

        return (
          <div
            key={`uploading-${idx}`}
            className="w-full min-h-[110px] sm:h-[120px] bg-white border-2 border-[#CFCFCF] rounded-[20px] p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all animate-fade-in"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-[14px] bg-[#F0F0F0] flex items-center justify-center flex-shrink-0 text-[#777]">
                  <ImageIcon size={28} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[16px] sm:text-[19px] font-medium text-black truncate">
                    {item.name}
                  </h4>
                  <p className="text-[12px] sm:text-[13px] text-[#777] mt-0.5 font-normal">
                    {progressFormatted} ({percent}%)
                  </p>
                </div>
              </div>

              {/* Thin X Cancel Button */}
              <button
                type="button"
                onClick={() => handleCancelUpload(item)}
                aria-label="Cancel upload"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#777] hover:text-black hover:bg-[#F0F0F0] transition-colors cursor-pointer flex-shrink-0"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* 8px fully rounded progress bar: track #E8E8E8, fill black */}
            <div className="w-full h-2 bg-[#E8E8E8] rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-black rounded-full transition-all duration-150 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )
      })}

      {/* ──────────────── 3 GREY DOTS (COLLAPSE / EXPAND) ──────────────── */}
      {shouldCollapse && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full py-2 flex items-center justify-center gap-2 hover:opacity-75 transition-opacity cursor-pointer group"
          title={`Click to show ${hiddenCount} older file(s)`}
        >
          <span className="w-3.5 h-3.5 rounded-full bg-[#D6D6D6] group-hover:bg-[#999] transition-colors" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#D6D6D6] group-hover:bg-[#999] transition-colors" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#D6D6D6] group-hover:bg-[#999] transition-colors" />
        </button>
      )}

      {/* Collapse back button if expanded */}
      {files.length > 2 && isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="text-xs text-[#777] hover:text-black self-center underline cursor-pointer"
        >
          Show fewer files
        </button>
      )}

      {/* ──────────────── FINISHED FILE ROWS (~100px tall) ──────────────── */}
      {visibleFiles.map((file) => (
        <div
          key={file.id}
          className="w-full h-[96px] sm:h-[100px] bg-white border-2 border-[#CFCFCF] rounded-[20px] p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs transition-all hover:border-[#A0A0A0]"
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            {/* ~76px Rounded Thumbnail */}
            <div className="w-[68px] h-[68px] sm:w-[74px] sm:h-[74px] rounded-[16px] bg-[#F0F0F0] overflow-hidden flex items-center justify-center flex-shrink-0 border border-black/5">
              {file.url ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-mono font-medium text-[#777] uppercase">
                  {file.name.split('.').pop() || 'IMG'}
                </span>
              )}
            </div>

            {/* Middle: File name & size */}
            <div className="min-w-0 flex-1">
              <h4 className="text-[17px] sm:text-[20px] font-medium text-black truncate">
                {file.name}
              </h4>
              <p className="text-[12px] sm:text-[13px] text-[#777] mt-0.5 font-normal">
                {formatBytes(file.size)}
              </p>
            </div>
          </div>

          {/* Right: Thin-line Trash Icon */}
          <button
            type="button"
            onClick={() => handleRemoveFile(file.id)}
            aria-label="Delete file"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#777] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0"
          >
            <Trash2 size={20} strokeWidth={1.5} />
          </button>
        </div>
      ))}
    </div>
  )
}
