import { useEffect, useRef, useState } from 'react'

const WS_URL = 'wss://feynman-server-hs0d.onrender.com/ws'

// This is for local dev purposes:
// const WS_URL = 'ws://0.0.0.0:10000/ws'

interface UseWebSocketProps {
  onLog?: (message: string, color?: string) => void
  shouldConnect?: boolean
  onDisconnect?: () => void
}

export interface CurrentState {
  canvas?: string // base64 image
  transcript?: string
  timestamp: number
}

export function useWebSocket({ onLog, shouldConnect = true, onDisconnect }: UseWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const onDisconnectRef = useRef(onDisconnect)

  // Keep ref in sync
  useEffect(() => {
    onDisconnectRef.current = onDisconnect
  }, [onDisconnect])

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
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(event.data)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      setIsConnected(false)
      onDisconnectRef.current?.()
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
