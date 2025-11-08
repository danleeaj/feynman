import { useEffect, useRef, useState } from 'react'

const AGENT_ID = 'agent_1401k9hdpwfxfq7r82nev6t4wj02'
const WS_URL = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`

interface UseWebSocketProps {
  onLog?: (message: string, color?: string) => void
  shouldConnect?: boolean
}

export function useWebSocket({ onLog, shouldConnect = true }: UseWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!shouldConnect) {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      return
    }

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected to ElevenLabs')
      setIsConnected(true)
      onLog?.('Connected to ElevenLabs Agent', 'green')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(event.data)

        console.log('ElevenLabs message:', data)

        switch (data.type) {
          case 'conversation_initiation_metadata':
            const convId = data.conversation_initiation_metadata_event?.conversation_id
            setConversationId(convId)
            onLog?.(`Connected! Conversation ID: ${convId}`, 'green')
            break
          
          case 'audio':
            const audioLength = data.audio_event?.audio_base_64?.length || 0
            onLog?.(` Audio received (${audioLength} chars)`, 'cyan')
            break
          
          case 'agent_response':
            const response = data.agent_response_event?.agent_response
            if (response) {
              onLog?.(`Agent: ${response}`, 'white')
            }
            break
          
          case 'user_transcript':
            const transcript = data.user_transcription_event?.user_transcript
            if (transcript) {
              onLog?.(`You: ${transcript}`, 'yellow')
            }
            break
          
          case 'ping':
            const latency = data.ping_event?.ping_ms
            onLog?.(`Ping: ${latency}ms`, 'gray')
            break
          
          case 'interruption':
            onLog?.('Interrupted', 'orange')
            break
          
          case 'agent_response_correction':
            onLog?.('Agent corrected previous response', 'orange')
            break
          
          default:
            onLog?.(`Unknown type: ${data.type}`, 'gray')
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      onLog?.('WebSocket error occurred', 'red')
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
      setConversationId(null)
      onLog?.('Disconnected from ElevenLabs', 'red')
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close()
      }
    }
  }, [onLog, shouldConnect])

  // send audio data as base64 string   
  const sendAudio = (audioBase64: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        user_audio_chunk: audioBase64
      })
      wsRef.current.send(message)
    } else {
      console.warn('WebSocket is not connected')
    }
  }


  // send context update to the agent
  const sendContextUpdate = (context: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: 'contextual_update',
        text: context
      })
      wsRef.current.send(message)
      onLog?.(`Context: ${context}`, '#00aaff')
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  return {
    isConnected,
    lastMessage,
    conversationId,
    sendMessage,
    sendAudio,
    sendContextUpdate,
  }
}