"use client"

let audioCtx: AudioContext | null = null
let isMuted = false

// Safe initialization of AudioContext on user interaction
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume()
  }
  return audioCtx
}

export const initAudio = () => {
  if (typeof window !== "undefined") {
    isMuted = localStorage.getItem("date-sparks-muted") === "true"
    // Listen for first interaction to warm up AudioContext
    const warmup = () => {
      getAudioContext()
      window.removeEventListener("click", warmup)
      window.removeEventListener("touchstart", warmup)
    }
    window.addEventListener("click", warmup)
    window.addEventListener("touchstart", warmup)
  }
}

export const setMutedState = (muted: boolean) => {
  isMuted = muted
  if (typeof window !== "undefined") {
    localStorage.setItem("date-sparks-muted", String(muted))
  }
}

export const getMutedState = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("date-sparks-muted") === "true"
  }
  return false
}

// Play helper that initializes nodes
const createSoundNode = (): { ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null => {
  const ctx = getAudioContext()
  if (!ctx || isMuted) return null

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  return { ctx, osc, gain }
}

// 1. Soft click sound (Short sine wave with quick decay)
export const playSoftClick = () => {
  const node = createSoundNode()
  if (!node) return

  const { ctx, osc, gain } = node
  osc.type = "sine"

  // Quick frequency drop
  osc.frequency.setValueAtTime(320, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.08)

  // Volume decay
  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.1)
}

// 2. Tiny hover pop (Extremely short, quiet, high pitch drop)
export const playHoverPop = () => {
  const node = createSoundNode()
  if (!node) return

  const { ctx, osc, gain } = node
  osc.type = "triangle"

  // Fast pitch slide
  osc.frequency.setValueAtTime(680, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.03)

  // Tiny volume
  gain.gain.setValueAtTime(0.03, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.05)
}

// 3. Swoosh transition sound (Warm pitch slide + volume sweep + lowpass filtering)
export const playSwoosh = () => {
  const node = createSoundNode()
  if (!node) return

  const { ctx, osc, gain } = node
  osc.type = "triangle"

  // Smooth upward sweep
  osc.frequency.setValueAtTime(140, ctx.currentTime)
  osc.frequency.linearRampToValueAtTime(380, ctx.currentTime + 0.26)

  // Envelope curve
  gain.gain.setValueAtTime(0.001, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.1)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

  // Lowpass filter to velvetize the sound
  const filter = ctx.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.setValueAtTime(900, ctx.currentTime)

  // Reroute osc through filter
  osc.disconnect(gain)
  osc.connect(filter)
  filter.connect(gain)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.32)
}

// 4. Success sparkle sound (Beautiful magical arpeggio)
export const playSparkle = () => {
  const ctx = getAudioContext()
  if (!ctx || isMuted) return

  const now = ctx.currentTime

  const playNote = (freq: number, delay: number, volume = 0.035) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(freq, now + delay)

    gain.gain.setValueAtTime(0.001, now + delay)
    gain.gain.linearRampToValueAtTime(volume, now + delay + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.16)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now + delay)
    osc.stop(now + delay + 0.2)
  }

  // Sparkling ascending chime notes: C6 -> E6 -> G6 -> C7
  playNote(1046.5, 0.0)
  playNote(1318.5, 0.05)
  playNote(1568.0, 0.10)
  playNote(2093.0, 0.15)
}

// 5. No-button escape sound (Playful sliding pitch drop)
export const playNoEscape = () => {
  const node = createSoundNode()
  if (!node) return

  const { ctx, osc, gain } = node
  osc.type = "sine"

  // Playful slide down
  osc.frequency.setValueAtTime(440, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.14)

  gain.gain.setValueAtTime(0.05, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.18)
}

// 6. Camera shutter click with sparkle (For saved screenshots)
export const playCameraShutter = () => {
  const ctx = getAudioContext()
  if (!ctx || isMuted) return

  const now = ctx.currentTime

  // White noise buffer generation for camera shutter sound
  const bufferSize = ctx.sampleRate * 0.06
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const channelData = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    channelData[i] = Math.random() * 2 - 1
  }

  const noiseSource = ctx.createBufferSource()
  noiseSource.buffer = buffer

  const bandpass = ctx.createBiquadFilter()
  bandpass.type = "bandpass"
  bandpass.frequency.setValueAtTime(1100, now)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.06, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

  noiseSource.connect(bandpass)
  bandpass.connect(gain)
  gain.connect(ctx.destination)

  noiseSource.start(now)
  noiseSource.stop(now + 0.06)

  // Delayed sparkle chime overlay
  setTimeout(() => {
    playSparkle()
  }, 80)
}
