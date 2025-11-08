"use client"

import { useState } from "react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { FileTree } from "@/components/file-tree"
import { PdfViewer } from "@/components/pdf-viewer"
import DrawingCanvas from "@/components/drawing-canvas"

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<string>("/documents/sample.pdf")
  const [isFileTreeCollapsed, setIsFileTreeCollapsed] = useState(false)

  return (
    <div className="h-screen w-full bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={50} minSize={20}>
          <DrawingCanvas />
        </ResizablePanel>

        <ResizableHandle withHandle className="w-2 bg-border hover:bg-accent transition-colors" />

        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex flex-col h-full">
            <FileTree
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
              isCollapsed={isFileTreeCollapsed}
              onToggleCollapse={() => setIsFileTreeCollapsed(!isFileTreeCollapsed)}
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
