"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Type, Eraser, Trash2 } from "lucide-react"

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [mode, setMode] = useState<"draw" | "text" | "erase">("draw")
  const [textInput, setTextInput] = useState("")
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null)
  const [showTextInput, setShowTextInput] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1

      // Save current canvas content
      const tempCanvas = document.createElement("canvas")
      const tempCtx = tempCanvas.getContext("2d")
      if (tempCtx) {
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        tempCtx.drawImage(canvas, 0, 0)
      }

      // Set display size
      const displayWidth = container.offsetWidth
      const displayHeight = container.offsetHeight

      // Set actual canvas size (accounting for device pixel ratio)
      canvas.width = displayWidth * dpr
      canvas.height = displayHeight * dpr

      // Set display size via CSS
      canvas.style.width = `${displayWidth}px`
      canvas.style.height = `${displayHeight}px`

      // Scale context to match device pixel ratio
      ctx.scale(dpr, dpr)

      // Restore canvas content
      if (tempCtx) {
        ctx.drawImage(tempCanvas, 0, 0)
      }

      // Reset drawing styles after resize
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineWidth = 2
      ctx.strokeStyle = "#000000"
    }

    // Initial size
    resizeCanvas()

    // Watch for resize
    const resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!sessionStarted) return

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionStarted])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    if (mode === "text") {
      setTextPosition({ x, y })
      setShowTextInput(true)
      return
    }

    setIsDrawing(true)
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode === "text") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    if (mode === "erase") {
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineWidth = 20
    } else {
      ctx.globalCompositeOperation = "source-over"
      ctx.lineWidth = 2
    }

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const addText = () => {
    if (!textInput || !textPosition) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.font = "20px Geist, sans-serif"
    ctx.fillStyle = "#000000"
    ctx.fillText(textInput, textPosition.x, textPosition.y)

    setTextInput("")
    setShowTextInput(false)
    setTextPosition(null)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const toggleSession = () => {
    if (sessionStarted) {
      setSessionStarted(false)
      setElapsedTime(0)
      addLog("Session ended")
    } else {
      setSessionStarted(true)
      addLog("Session started")
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div ref={containerRef} className="flex h-full flex-col bg-muted/30">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant={sessionStarted ? "outline" : "default"} size="sm" onClick={toggleSession}>
            {sessionStarted ? "End Session" : "Start Session"}
          </Button>
          {sessionStarted && (
            <span className="text-sm font-medium text-foreground tabular-nums">{formatTime(elapsedTime)}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant={mode === "draw" ? "default" : "outline"} size="sm" onClick={() => setMode("draw")}>
            <Pencil className="h-4 w-4" />
            <span className="ml-2">Draw</span>
          </Button>

          <Button variant={mode === "text" ? "default" : "outline"} size="sm" onClick={() => setMode("text")}>
            <Type className="h-4 w-4" />
            <span className="ml-2">Text</span>
          </Button>

          <Button variant={mode === "erase" ? "default" : "outline"} size="sm" onClick={() => setMode("erase")}>
            <Eraser className="h-4 w-4" />
            <span className="ml-2">Erase</span>
          </Button>

          <div className="mx-2 h-6 w-px bg-border" />

          <Button variant="outline" size="sm" onClick={clearCanvas}>
            <Trash2 className="h-4 w-4" />
            <span className="ml-2">Clear</span>
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="cursor-crosshair bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Text Input Popup */}
        {showTextInput && textPosition && (
          <div
            className="absolute rounded-md border bg-background p-3 shadow-lg"
            style={{
              left: textPosition.x,
              top: textPosition.y,
            }}
          >
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter text..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addText()
                  } else if (e.key === "Escape") {
                    setShowTextInput(false)
                    setTextInput("")
                  }
                }}
                autoFocus
                className="w-48"
              />
              <Button size="sm" onClick={addText}>
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowTextInput(false)
                  setTextInput("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="border-t bg-background px-4 py-2 text-center text-sm text-muted-foreground">
        {mode === "draw" && "Press and hold to draw on the canvas"}
        {mode === "text" && "Click anywhere on the canvas to add text"}
        {mode === "erase" && "Press and hold to erase parts of your drawing"}
      </div>

      {/* Console */}
      <div className="border-t bg-black px-4 py-2 h-48 overflow-y-auto">
        <div className="font-mono text-xs text-white space-y-1">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
