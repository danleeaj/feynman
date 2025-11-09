import { useEffect, useRef, useCallback } from 'react'
import type { CurrentState } from './use-websocket'

interface UseSpeechTranscriptionProps {
  sessionStarted: boolean
  sendStateUpdate: (state: CurrentState) => void
  onLog?: (message: string, color?: string) => void
}

// TypeScript declarations for Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  start(): void
  stop(): void
  abort(): void
}

declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition
    }
    webkitSpeechRecognition: {
      new(): SpeechRecognition
    }
  }
}

export function useSpeechTranscription({
  sessionStarted,
  sendStateUpdate,
  onLog
}: UseSpeechTranscriptionProps) {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isListeningRef = useRef(false)
  const sessionStartedRef = useRef(sessionStarted)
  const sendStateUpdateRef = useRef(sendStateUpdate)
  const onLogRef = useRef(onLog)

  // Keep refs in sync
  useEffect(() => {
    sessionStartedRef.current = sessionStarted
    sendStateUpdateRef.current = sendStateUpdate
    onLogRef.current = onLog
  })

  useEffect(() => {
    if (!sessionStarted) {
      // Stop recognition when session ends
      if (recognitionRef.current && isListeningRef.current) {
        isListeningRef.current = false
        recognitionRef.current.stop()
        recognitionRef.current = null
        onLogRef.current?.('Speech recognition stopped', '#ffaa00')
      }
      return
    }

    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      onLogRef.current?.('Speech Recognition is not supported in this browser', '#ff0000')
      return
    }

    if (isListeningRef.current) {
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      // Configure recognition
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        isListeningRef.current = true
        onLogRef.current?.('Speech recognition started', '#00ff00')
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        // Log transcript chunks to console
        if (finalTranscript) {
          onLogRef.current?.(`[FINAL] ${finalTranscript.trim()}`, '#00aaff')

          // Send final transcript to WebSocket
          sendStateUpdateRef.current({
            transcript: finalTranscript.trim(),
            timestamp: Date.now()
          })
        } else if (interimTranscript) {
          onLogRef.current?.(`[INTERIM] ${interimTranscript}`, '#888888')
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        onLogRef.current?.(`Speech recognition error: ${event.error}`, '#ff0000')

        // Restart on certain errors
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
          setTimeout(() => {
            if (isListeningRef.current && sessionStartedRef.current) {
              recognition.start()
            }
          }, 1000)
        }
      }

      recognition.onend = () => {
        onLogRef.current?.('Speech recognition ended', '#ffaa00')

        // Restart if session is still active
        if (isListeningRef.current && sessionStartedRef.current) {
          setTimeout(() => {
            try {
              recognition.start()
            } catch (error) {
              onLogRef.current?.('Failed to restart recognition', '#ff0000')
            }
          }, 500)
        }
      }

      recognition.start()
    } catch (error) {
      onLogRef.current?.(`Failed to start speech recognition: ${error}`, '#ff0000')
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current && isListeningRef.current) {
        isListeningRef.current = false
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [sessionStarted])

  return {
    isListening: isListeningRef.current
  }
}
