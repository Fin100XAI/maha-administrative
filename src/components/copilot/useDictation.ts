import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Live dictation via the browser's Web Speech API. Recognition runs entirely
 * on the device in Chromium/Safari builds that support it; where it is missing
 * the hook reports `supported: false` so the UI can hide the control instead of
 * offering a dead button.
 */

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: any) => void) | null
  onerror: ((e: any) => void) | null
  onend: (() => void) | null
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === 'undefined') return null
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

/** Map the workspace language selector onto a BCP-47 recognition locale. */
export function speechLocale(langLabel: string): string {
  if (/marathi|मराठी/i.test(langLabel)) return 'mr-IN'
  if (/hindi|हिंदी/i.test(langLabel)) return 'hi-IN'
  return 'en-IN'
}

export function useDictation(locale: string, onText: (text: string) => void) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recRef = useRef<SpeechRecognitionLike | null>(null)
  const onTextRef = useRef(onText)
  onTextRef.current = onText

  const supported = !!getRecognitionCtor()

  const stop = useCallback(() => {
    recRef.current?.stop()
    recRef.current = null
    setListening(false)
  }, [])

  // Never leave the microphone open when the component unmounts.
  useEffect(() => () => { recRef.current?.abort() }, [])

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) {
      setError('Dictation is not supported in this browser.')
      return
    }
    setError(null)
    const rec = new Ctor()
    rec.lang = locale
    rec.continuous = true
    rec.interimResults = true

    rec.onresult = (e: any) => {
      let finalText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript
      }
      if (finalText.trim()) onTextRef.current(finalText.trim())
    }
    rec.onerror = (e: any) => {
      setError(
        e?.error === 'not-allowed'
          ? 'Microphone permission denied.'
          : e?.error === 'no-speech'
            ? 'No speech detected.'
            : 'Dictation stopped unexpectedly.'
      )
      setListening(false)
      recRef.current = null
    }
    rec.onend = () => {
      setListening(false)
      recRef.current = null
    }

    try {
      rec.start()
      recRef.current = rec
      setListening(true)
    } catch {
      setError('Could not start dictation.')
    }
  }, [locale])

  const toggle = useCallback(() => {
    if (listening) stop()
    else start()
  }, [listening, start, stop])

  return { supported, listening, error, start, stop, toggle, clearError: () => setError(null) }
}
