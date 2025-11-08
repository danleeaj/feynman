"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, ChevronUp, File, Folder } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileNode {
  name: string
  type: "file" | "folder"
  path: string
  children?: FileNode[]
}

const mockFiles: FileNode[] = [
  {
    name: "documents",
    type: "folder",
    path: "/documents",
    children: [
      { name: "sample.pdf", type: "file", path: "/documents/sample.pdf" },
      { name: "report-2025.pdf", type: "file", path: "/documents/report-2025.pdf" },
      { name: "presentation.pdf", type: "file", path: "/documents/presentation.pdf" },
    ],
  },
  {
    name: "projects",
    type: "folder",
    path: "/projects",
    children: [
      { name: "proposal.pdf", type: "file", path: "/projects/proposal.pdf" },
      { name: "research.pdf", type: "file", path: "/projects/research.pdf" },
    ],
  },
  {
    name: "archive",
    type: "folder",
    path: "/archive",
    children: [{ name: "old-docs.pdf", type: "file", path: "/archive/old-docs.pdf" }],
  },
]

interface FileTreeProps {
  onFileSelect: (path: string) => void
  selectedFile: string
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function FileTree({ onFileSelect, selectedFile, isCollapsed, onToggleCollapse }: FileTreeProps) {
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
          <div className="space-y-1">
            {mockFiles.map((node) => (
              <TreeNode key={node.path} node={node} onFileSelect={onFileSelect} selectedFile={selectedFile} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface TreeNodeProps {
  node: FileNode
  onFileSelect: (path: string) => void
  selectedFile: string
  level?: number
}

function TreeNode({ node, onFileSelect, selectedFile, level = 0 }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(level === 0)

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <Folder className="w-4 h-4 text-primary" />
          <span>{node.name}</span>
        </button>
        {isOpen && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                onFileSelect={onFileSelect}
                selectedFile={selectedFile}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => onFileSelect(node.path)}
      className={cn(
        "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md transition-colors",
        selectedFile === node.path ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent",
      )}
      style={{ paddingLeft: `${level * 12 + 32}px` }}
    >
      <File className="w-4 h-4" />
      <span>{node.name}</span>
    </button>
  )
}
