"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, ChevronUp, File, Folder, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UploadedFile {
  name: string
  path: string
  url: string
  size: number
}

interface FileTreeProps {
  onFileSelect: (file: UploadedFile) => void
  selectedFile: string
  isCollapsed: boolean
  onToggleCollapse: () => void
  uploadedFiles: UploadedFile[]
  onFilesUpload: (files: UploadedFile[]) => void
}

export function FileTree({ onFileSelect, selectedFile, isCollapsed, onToggleCollapse, uploadedFiles, onFilesUpload }: FileTreeProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setError(null)

    const files = Array.from(e.dataTransfer.files)
    const pdfFiles = files.filter(file => file.type === 'application/pdf')

    if (pdfFiles.length === 0) {
      setError('Please upload PDF files only')
      setTimeout(() => setError(null), 3000)
      return
    }

    const oversizedFiles = pdfFiles.filter(file => file.size > 2 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError('Files must be smaller than 2MB')
      setTimeout(() => setError(null), 3000)
      return
    }

    const newFiles: UploadedFile[] = await Promise.all(
      pdfFiles.map(async (file) => {
        const url = URL.createObjectURL(file)
        return {
          name: file.name,
          path: `/${file.name}`,
          url,
          size: file.size,
        }
      })
    )

    onFilesUpload(newFiles)
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const files = Array.from(e.target.files || [])
    const pdfFiles = files.filter(file => file.type === 'application/pdf')

    if (pdfFiles.length === 0) {
      setError('Please upload PDF files only')
      setTimeout(() => setError(null), 3000)
      return
    }

    const oversizedFiles = pdfFiles.filter(file => file.size > 2 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError('Files must be smaller than 2MB')
      setTimeout(() => setError(null), 3000)
      return
    }

    const newFiles: UploadedFile[] = await Promise.all(
      pdfFiles.map(async (file) => {
        const url = URL.createObjectURL(file)
        return {
          name: file.name,
          path: `/${file.name}`,
          url,
          size: file.size,
        }
      })
    )

    onFilesUpload(newFiles)
  }

  return (
    <div className="border-b border-border bg-muted/30 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Files</h3>
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-accent rounded-md transition-colors"
          aria-label={isCollapsed ? "Expand file browser" : "Collapse file browser"}
        >
          <ChevronUp
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-300",
              isCollapsed && "rotate-180",
            )}
          />
        </button>
      </div>
      {!isCollapsed && (
        <div className="p-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 mb-4 transition-colors cursor-pointer",
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
              error && "border-destructive"
            )}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2 text-center">
                <Upload className={cn("w-8 h-8", isDragging ? "text-primary" : "text-muted-foreground")} />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {isDragging ? "Drop files here" : "Drag & drop PDFs"}
                  </p>
                  <p className="text-xs text-muted-foreground">or click to browse (max 2MB)</p>
                </div>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
            </label>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-destructive/10 border border-destructive rounded-md">
              <p className="text-xs text-destructive text-center">{error}</p>
            </div>
          )}

          <div className="space-y-1">
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No files uploaded yet</p>
              </div>
            ) : (
              uploadedFiles.map((file) => (
                <button
                  key={file.path}
                  onClick={() => onFileSelect(file)}
                  className={cn(
                    "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md transition-colors",
                    selectedFile === file.path ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent",
                  )}
                >
                  <File className="w-4 h-4" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}


