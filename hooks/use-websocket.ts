import { useEffect, useRef, useState } from 'react'

const WS_URL = 'wss://feynman-server-hs0d.onrender.com/ws'

// This is for local dev purposes:
// const WS_URL = 'ws://0.0.0.0:10000/ws'

interface UseWebSocketProps {
  onLog?: (message: string, color?: string) => void
  shouldConnect?: boolean
}

export interface CurrentState {
  canvas?: string // base64 image
  transcript?: string
  timestamp: number
}

export function useWebSocket({ onLog, shouldConnect = true }: UseWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!shouldConnect) {
      // Disconnect if already connected
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      return
    }

    // Connect to WebSocket
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(event.data)

        // Debug: log the actual message structure
        console.log('WebSocket message received:', data)

        if (data.type === 'ping') {
          onLog?.(data.body || JSON.stringify(data), 'yellow')
        } else if (data.type === 'message') {
          onLog?.(data.body || JSON.stringify(data), 'white')
        } else {
          // Log unknown message types
          onLog?.(`Unknown message type: ${JSON.stringify(data)}`, 'gray')
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    }

    // Cleanup: disconnect when component unmounts or shouldConnect changes
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close()
      }
    }
  }, [onLog, shouldConnect])

  const sendMessage = (message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message)
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  const sendStateUpdate = (state: CurrentState) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: 'state_update',
        data: state
      })
      wsRef.current.send(message)
      onLog?.(`State update sent (canvas: ${state.canvas ? 'yes' : 'no'}, transcript: ${state.transcript ? 'yes' : 'no'})`, '#00aaff')
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  return {
    isConnected,
    lastMessage,
    sendMessage,
    sendStateUpdate,
  }
}
