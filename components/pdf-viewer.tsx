"use client"

import { FileText } from "lucide-react"
import { OtterInteractive } from "./otter-interactive"

interface PdfViewerProps {
  file: string
}

export function PdfViewer({ file }: PdfViewerProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-background p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-xl">
              <FileText className="w-12 h-12 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-foreground">PDF Viewer</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Currently viewing: <span className="text-foreground font-medium">{file}</span>
            </p>
            <p className="text-xs text-muted-foreground pt-2">
              PDF rendering will be displayed here. Use react-pdf or pdf.js for actual PDF rendering.
            </p>
          </div>
        </div>
      </div>
      <OtterInteractive />
    </div>
  )
}
