export function ContentPanel() {
  return (
    <div className="h-full flex flex-col bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-medium text-foreground">Document Workspace</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A professional interface for viewing and managing documents. Navigate files on the right panel and preview
            PDFs instantly.
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <div className="space-y-2">
            <h2 className="text-xl font-medium text-foreground">Features</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Resizable panels with smooth drag interaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Integrated file browser for easy navigation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>High-quality PDF rendering and viewing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Clean, minimal interface optimized for focus</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 space-y-2">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Getting Started</h3>
            <p className="text-muted-foreground leading-relaxed">
              Select a document from the file browser to view it in the PDF panel. Drag the divider to adjust panel
              sizes to your preference.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
