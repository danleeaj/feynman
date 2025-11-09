"use client"

import { FileText } from "lucide-react"
import { OtterInteractive } from "./otter-interactive"
import type { UploadedFile } from "./file-tree"

interface PdfViewerProps {
  file: UploadedFile | null
}

export function PdfViewer({ file }: PdfViewerProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 bg-background">
        {file ? (
          <iframe
            src={file.url}
            className="w-full h-full border-0"
            title={file.name}
          />
        ) : (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center space-y-4 max-w-md">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <FileText className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-foreground">No PDF Selected</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Upload a PDF file using the file browser above to view it here.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <OtterInteractive />
    </div>
  )
}
