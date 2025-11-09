"use client"

import { useState } from "react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { FileTree, type UploadedFile } from "@/components/file-tree"
import { PdfViewer } from "@/components/pdf-viewer"
import DrawingCanvas from "@/components/drawing-canvas"

export default function Page() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [isFileTreeCollapsed, setIsFileTreeCollapsed] = useState(false)

  const handleFilesUpload = (newFiles: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...newFiles])
    // Auto-select the first uploaded file
    if (newFiles.length > 0) {
      setSelectedFile(newFiles[0])
    }
  }

  const handleFileSelect = (file: UploadedFile) => {
    setSelectedFile(file)
  }

  return (
    <div className="h-screen w-full bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={70} minSize={20}>
          <DrawingCanvas />
        </ResizablePanel>

        <ResizableHandle withHandle className="w-2 bg-border hover:bg-accent transition-colors" />

        <ResizablePanel defaultSize={30} minSize={30}>
          <div className="flex flex-col h-full">
            <FileTree
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile?.path || ""}
              isCollapsed={isFileTreeCollapsed}
              onToggleCollapse={() => setIsFileTreeCollapsed(!isFileTreeCollapsed)}
              uploadedFiles={uploadedFiles}
              onFilesUpload={handleFilesUpload}
            />
            <div className="flex-1 border-t border-border">
              <PdfViewer file={selectedFile} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
