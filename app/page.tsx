"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Heart, 
  Sparkles, 
  Moon, 
  Sun, 
  Flame, 
  Layers, 
  Check, 
  HeartHandshake,
  Calendar,
  Utensils,
  Smile,
  Send,
  RefreshCw,
  Volume2,
  VolumeX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressIndicator } from "@/components/progress-indicator"

// Step Components
import { DateStep } from "@/components/steps/date-step"
import { TimeStep } from "@/components/steps/time-step"
import { RestaurantStep } from "@/components/steps/restaurant-step"
import { FoodStep } from "@/components/steps/food-step"
import { PersonalityStep } from "@/components/steps/personality-step"
import { SummaryStep } from "@/components/steps/summary-step"
import { submitProposal, logAnalyticsEvent, getAnalyticsStats, type AnalyticsStats } from "@/app/actions"
import { getSessionId } from "@/lib/analytics"
import { getRandomRomanticText } from "@/lib/romantic-texts"
import { ShareCard } from "@/components/share-card"
import { 
  initAudio, 
  setMutedState, 
  getMutedState, 
  playSoftClick, 
  playHoverPop, 
  playSwoosh, 
  playSparkle, 
  playNoEscape, 
  playCameraShutter 
} from "@/lib/audio"

const tooltips = [
  "nice try 😭",
  "bro give up",
  "not happening 😌",
  "try again 😜",
  "impossible 💅",
  "error 404: click YES",
  "database says no 💻",
  "nice hover speed 🏃‍♂️",
  "clown behavior 🤡",
  "no is disabled 🚫",
]

// Custom directional swiping variants for Framer Motion (speed optimized to reduce INP delay)
const slideVariants = {
  enter: (direction: "forward" | "backward") => ({
    opacity: 0,
    x: direction === "forward" ? 40 : -40,
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number], // Snappy easeOut
    },
  },
  exit: (direction: "forward" | "backward") => ({
    opacity: 0,
    x: direction === "forward" ? -40 : 40,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
    },
  }),
}

// Pre-configured static arrays to prevent CPU thrashing/re-renders caused by inline Math.random()
const bgParticles = [
  { width: 220, height: 250, left: "10%", top: "15%", duration: 15, delay: 0, yOffset: -50 },
  { width: 180, height: 210, left: "75%", top: "45%", duration: 18, delay: 2, yOffset: -30 },
  { width: 280, height: 240, left: "45%", top: "80%", duration: 12, delay: 1, yOffset: -60 },
  { width: 200, height: 200, left: "20%", top: "60%", duration: 14, delay: 3, yOffset: -40 },
  { width: 140, height: 160, left: "85%", top: "10%", duration: 16, delay: 4, yOffset: -35 },
  { width: 260, height: 230, left: "55%", top: "30%", duration: 20, delay: 5, yOffset: -45 },
  { width: 180, height: 180, left: "5%", top: "90%", duration: 13, delay: 2, yOffset: -25 },
  { width: 210, height: 230, left: "65%", top: "75%", duration: 17, delay: 0, yOffset: -55 }
]

const floatingHeartParticles = [
  { left: "12%", delay: 0, size: 24, duration: 9, yOffset: -120, xOffset: 20 },
  { left: "24%", delay: 1.5, size: 18, duration: 11, yOffset: -140, xOffset: -30 },
  { left: "36%", delay: 3, size: 28, duration: 8, yOffset: -100, xOffset: 40 },
  { left: "48%", delay: 0.5, size: 16, duration: 10, yOffset: -130, xOffset: -20 },
  { left: "60%", delay: 2, size: 22, duration: 12, yOffset: -110, xOffset: 30 },
  { left: "72%", delay: 4, size: 20, duration: 7, yOffset: -150, xOffset: -10 },
  { left: "84%", delay: 1, size: 26, duration: 11, yOffset: -125, xOffset: 25 },
  { left: "90%", delay: 2.5, size: 14, duration: 9, yOffset: -135, xOffset: -15 }
]

function ConfettiExplosion() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    
    // Resize
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ["#ff4b82", "#ff85a1", "#fbb6ce", "#fbd38d", "#f6ad55"]
    const particles = Array.from({ length: 85 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height * 0.42, // Center of phone mockup
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.75) * 16 - 6,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
    }))

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let active = false
      particles.forEach((p) => {
        if (p.opacity <= 0) return
        active = true

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()

        // Physics
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.35 // Gravity
        p.vx *= 0.985 // Friction
        p.rotation += p.rotationSpeed
        p.opacity -= 0.012 // Fade out
      })

      if (active) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"match" | "uikit">("match")
  const [isDark, setIsDark] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  
  // Initialize audio preference & log view event & init thought pool text
  useEffect(() => {
    initAudio()
    setIsAudioMuted(getMutedState())
    setFloatingText(getRandomRomanticText())

    // Log website view once per session
    const logViewEvent = async () => {
      if (typeof window === "undefined") return
      const sessId = getSessionId()
      const hasLoggedView = sessionStorage.getItem("date-sparks-logged-view")
      if (!hasLoggedView) {
        const result = await logAnalyticsEvent("view", sessId)
        if (result.success) {
          sessionStorage.setItem("date-sparks-logged-view", "true")
        }
      }
    }
    logViewEvent()
  }, [])

  const toggleMute = () => {
    const nextMuted = !isAudioMuted
    setIsAudioMuted(nextMuted)
    setMutedState(nextMuted)
    // Small feedback chirp right after unmuting
    if (!nextMuted) {
      setTimeout(() => playSoftClick(), 60)
    }
  }
  
  // Navigation flow state: 0 = proposal, 1 = date, 2 = time, 3 = spot, 4 = food, 5 = personality, 6 = summary, 7 = success
  const [flowStep, setFlowStep] = useState(0)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  
  // Proposal Game State
  const [noCount, setNoCount] = useState(0)
  const [noButtonPos, setNoButtonPos] = useState({ x: 60, y: 0 })
  
  // Form selections state (persistent across steps)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("")
  const [selectedFood, setSelectedFood] = useState<string>("")
  const [personalityResult, setPersonalityResult] = useState<string>("")
  
  // Contacts
  const [userName, setUserName] = useState("")
  const [contactHandle, setContactHandle] = useState("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Dynamic romantic thought system state
  const [floatingText, setFloatingText] = useState("")

  // Admin Analytics Dashboard state
  const [adminStats, setAdminStats] = useState<AnalyticsStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState("")


  // Click heart explosion particles state & handler
  const [clickHearts, setClickHearts] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([])

  const handleGlobalClick = (e: React.MouseEvent) => {
    const newHearts = Array.from({ length: 2 }).map((_, i) => ({
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 10 + 10,
      delay: i * 0.03,
    }))
    setClickHearts((prev) => [...prev, ...newHearts].slice(-12))
  }

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const triggerSuccessToast = () => {
    const messages = [
      "✨ ready for the story post",
      "📸 copied to camera roll energy",
      "👀 story post pending..."
    ]
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]
    
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }
    
    setToastMessage(randomMsg)
    setShowToast(true)
    
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    }
  }, [])

  // Successful selections sound moments
  useEffect(() => {
    if (selectedDate) playHoverPop()
  }, [selectedDate])

  useEffect(() => {
    if (selectedTime) playHoverPop()
  }, [selectedTime])

  useEffect(() => {
    if (selectedRestaurant) playHoverPop()
  }, [selectedRestaurant])

  useEffect(() => {
    if (selectedFood) playHoverPop()
  }, [selectedFood])

  // Save Vibe Card export states
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [isGeneratingCard, setIsGeneratingCard] = useState(false)
  const [generatingStatus, setGeneratingStatus] = useState("")
  const [copyFeedback, setCopyFeedback] = useState(false)

  const handleSaveImage = async () => {
    if (!shareCardRef.current) return
    setIsGeneratingCard(true)
    setGeneratingStatus("creating your vibe card... 💫")
    
    // Slight artificial delay for smooth experience
    await new Promise((resolve) => setTimeout(resolve, 850))
    
    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      })
      
      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `Uchrashuv_${userName.replace(/\s+/g, "_") || "Vibe"}_Card.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      playCameraShutter()
      triggerSuccessToast()
    } catch (err) {
      console.error("Failed to generate card image:", err)
      alert("Oops! Failed to save image. Please try again! 😭")
    } finally {
      setIsGeneratingCard(false)
    }
  }

  const handleCopyImage = async () => {
    if (!shareCardRef.current) return
    setIsGeneratingCard(true)
    setGeneratingStatus("creating your vibe card... 💫")
    
    try {
      const html2canvas = (await import("html2canvas")).default
      
      // Promise-based clipboard write (retains user gesture context)
      const blobPromise = new Promise<Blob>(async (resolve, reject) => {
        try {
          const canvas = await html2canvas(shareCardRef.current!, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
          })
          canvas.toBlob((b) => {
            if (b) resolve(b)
            else reject(new Error("Canvas toBlob failed"))
          }, "image/png")
        } catch (err) {
          reject(err)
        }
      })
      
      const clipboardItem = new ClipboardItem({
        "image/png": blobPromise
      })
      
      await navigator.clipboard.write([clipboardItem])
      
      playCameraShutter()
      triggerSuccessToast()
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error("Failed to copy card image:", err)
      alert("Oops! Failed to copy image. Please use Save Image instead! 💖")
    } finally {
      setIsGeneratingCard(false)
    }
  }

  const handleShareTelegram = () => {
    playSoftClick()
    const day = selectedDate ? selectedDate.split("-")[2] : "12"
    const text = `Check out our Uchrashuv Vibe Card! 📸 Locked in for June ${day} at ${selectedTime || "7:00 PM"}. Spot: ${selectedRestaurant || "ARROWS & SPARROWS"}. Food: ${selectedFood || "Truffle Pizza"}. Archetype: ${personalityResult || "Fine Dining Romanticist 🌹"} 💌`
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`
    window.open(shareUrl, "_blank")
  }

  const handleProposalSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError("")
    
    try {
      const result = await submitProposal({
        candidate_name: userName,
        contact_info: contactHandle,
        selected_date: selectedDate,
        selected_time: selectedTime,
        selected_restaurant: selectedRestaurant,
        selected_food: selectedFood,
        selected_archetype: personalityResult,
      })
      
      if (result.success) {
        const sessId = getSessionId()
        await logAnalyticsEvent("submit", sessId)
        
        // Step funnel submit logging (Feature 1)
        const hasLoggedSubmit = sessionStorage.getItem("logged-event-submitted_proposal")
        if (!hasLoggedSubmit) {
          const res = await logAnalyticsEvent("submitted_proposal", sessId)
          if (res.success) {
            sessionStorage.setItem("logged-event-submitted_proposal", "true")
          }
        }
        
        localStorage.setItem("date-sparks-last-submit", Date.now().toString())
        playSparkle()
        navigateTo(7) // Go to success step!
      } else {
        setSubmitError(result.error || "Failed to submit proposal.")
      }
    } catch (err: any) {
      setSubmitError("Network connection error. Try again! 😭")
    } finally {
      setIsSubmitting(false)
    }
  }

  const [secondsElapsed, setSecondsElapsed] = useState(0)

  // Track page time
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Step-level analytics funnel tracking (Feature 1)
  useEffect(() => {
    if (typeof window === "undefined") return

    const trackStep = async () => {
      const sessId = getSessionId()
      if (!sessId) return

      let eventType: "landing_view" | "clicked_yes" | "selected_date" | "selected_time" | "selected_restaurant" | "selected_food" | "selected_vibe" | "reached_contact_step" | "submitted_proposal" | null = null

      switch (flowStep) {
        case 0:
          eventType = "landing_view"
          break
        case 1:
          eventType = "clicked_yes"
          break
        case 2:
          eventType = "selected_date"
          break
        case 3:
          eventType = "selected_time"
          break
        case 4:
          eventType = "selected_restaurant"
          break
        case 5:
          eventType = "selected_food"
          break
        case 6:
          eventType = "selected_vibe"
          break
        case 7:
          eventType = "submitted_proposal"
          break
      }

      if (eventType) {
        const sessionKey = `logged-event-${eventType}`
        const hasLogged = sessionStorage.getItem(sessionKey)
        if (!hasLogged) {
          const res = await logAnalyticsEvent(eventType, sessId)
          if (res.success) {
            sessionStorage.setItem(sessionKey, "true")
          }
        }

        // Special case: Step 6 is both selected_vibe (completing step 5) and reached_contact_step!
        if (flowStep === 6) {
          const contactKey = `logged-event-reached_contact_step`
          const hasLoggedContact = sessionStorage.getItem(contactKey)
          if (!hasLoggedContact) {
            const res = await logAnalyticsEvent("reached_contact_step", sessId)
            if (res.success) {
              sessionStorage.setItem(contactKey, "true")
            }
          }
        }
      }
    }

    trackStep()
  }, [flowStep])

  // Rotate thought banner messages on step changes (Feature 3)
  useEffect(() => {
    if (flowStep > 0) {
      setFloatingText((prev) => getRandomRomanticText(prev))
    }
  }, [flowStep])

  // Fetch admin dashboard stats when activeTab is 'uikit' (Feature 1)
  const fetchStats = async () => {
    setIsLoadingStats(true)
    setStatsError("")
    try {
      const res = await getAnalyticsStats()
      if (res.success && res.stats) {
        setAdminStats(res.stats)
      } else {
        setStatsError(res.error || "Failed to load statistics")
      }
    } catch (err) {
      setStatsError("Failed to fetch database analytics stats")
    } finally {
      setIsLoadingStats(false)
    }
  }

  useEffect(() => {
    if (activeTab === "uikit") {
      fetchStats()
    }
  }, [activeTab])

  // Preload html2canvas when entering the success step (Step 7) to avoid user activation context expiry
  useEffect(() => {
    if (flowStep === 7) {
      import("html2canvas").catch(() => {})
    }
  }, [flowStep])

  const getPlayfulTimeMessage = () => {
    if (flowStep === 1) return "lowkey hoping you pick a weekend 🤭"
    if (flowStep === 2) return "lowkey hoping you pick dinner 😌"
    if (flowStep === 3) return "this is getting suspiciously cute"
    if (flowStep === 4) return "okay wait this vibe kinda works"
    if (flowStep === 5) return "calculating compatibility vibes... 💘"
    if (flowStep === 6) return "almost official. lock it in! 🔐"

    if (secondsElapsed < 10) return "pretending i'm calm rn 😭"
    if (secondsElapsed < 25) return `you've been here for ${secondsElapsed} seconds already 😌`
    if (secondsElapsed < 40) return "lowkey hoping you pick June or Yakamoz 🌸"
    if (secondsElapsed < 55) return "still planning? i'm already picking an outfit 💅"
    if (secondsElapsed < 75) return `${secondsElapsed}s in... are we dating yet? 🥺`
    return "at this rate, our grandkids will plan faster 💀"
  }

  // Initialize theme
  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark")
    setIsDark(isDarkTheme)
  }, [])

  const toggleTheme = () => {
    playSoftClick()
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Escaping "No" button math (relative to container center)
  const handleNoHover = () => {
    playNoEscape()
    const rangeX = 125 
    const rangeY = 110 
    
    let newX = (Math.random() - 0.5) * 2 * rangeX
    let newY = (Math.random() - 0.5) * 2 * rangeY
    
    if (Math.abs(newX - noButtonPos.x) < 35) {
      newX = newX < 0 ? newX - 35 : newX + 35
    }
    if (Math.abs(newY - noButtonPos.y) < 35) {
      newY = newY < 0 ? newY - 35 : newY + 35
    }
    
    setNoButtonPos({ x: newX, y: newY })
    setNoCount(prev => prev + 1)
  }

  const navigateTo = (nextStep: number) => {
    playSwoosh()
    setDirection(nextStep > flowStep ? "forward" : "backward")
    setFlowStep(nextStep)
  }

  const handleYesClick = async () => {
    navigateTo(1)
    if (typeof window !== "undefined") {
      const sessId = getSessionId()
      const hasLoggedStart = sessionStorage.getItem("date-sparks-logged-start")
      if (!hasLoggedStart) {
        const result = await logAnalyticsEvent("start_flow", sessId)
        if (result.success) {
          sessionStorage.setItem("date-sparks-logged-start", "true")
        }
      }
    }
  }

  const resetAll = () => {
    playSoftClick()
    setDirection("backward")
    setFlowStep(0)
    setNoCount(0)
    setNoButtonPos({ x: 60, y: 0 })
    setSelectedDate("")
    setSelectedTime("")
    setSelectedRestaurant("")
    setSelectedFood("")
    setPersonalityResult("")
    setUserName("")
    setContactHandle("")
  }

  return (
    <div 
      onClick={handleGlobalClick}
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-romantic-mesh transition-colors duration-500 cursor-default"
    >
      
      {/* Ambient background particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {bgParticles.map((particle, idx) => (
          <div
            key={`bg-particle-${idx}`}
            className="absolute rounded-full bg-primary/10 dark:bg-primary/5 blur-2xl animate-float-blur"
            style={{
              width: particle.width,
              height: particle.height,
              left: particle.left,
              top: particle.top,
              ["--y-blur" as any]: `${particle.yOffset}px`,
              ["--blur-duration" as any]: `${particle.duration}s`,
              ["--blur-delay" as any]: `${particle.delay}s`,
            }}
          />
        ))}
        
        {/* Floating Heart icons */}
        {floatingHeartParticles.map((heart, idx) => (
          <div
            key={`heart-${idx}`}
            className="absolute text-primary/15 dark:text-primary/10 animate-float-heart"
            style={{
              left: heart.left,
              top: `${80 - idx * 8}%`,
              ["--x-float" as any]: `${heart.xOffset}px`,
              ["--y-float" as any]: `${heart.yOffset}px`,
              ["--float-duration" as any]: `${heart.duration}s`,
              ["--float-delay" as any]: `${heart.delay}s`,
            }}
          >
            <Heart size={heart.size} fill="currentColor" />
          </div>
        ))}
      </div>

      {/* Main Glass Mock-Phone Container */}
      <div className="relative z-10 w-full max-w-[420px] aspect-[9/19] max-h-[850px] min-h-[660px] flex flex-col bg-white/60 dark:bg-black/70 border border-white/30 dark:border-white/10 rounded-[2.5rem] shadow-romantic overflow-hidden backdrop-blur-xl">
        
        {/* Phone Notch/Header */}
        <div className="flex justify-between items-center px-6 pt-5 pb-3 bg-white/5 dark:bg-black/20 border-b border-foreground/5 z-30 select-none">
          <div className="flex items-center gap-1.5">
            <Flame className="text-primary animate-pulse size-5 fill-primary" />
            <span className="font-bold tracking-tight text-sm text-gradient-romantic">Uchrashuv</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              size="icon-xs"
              onClick={toggleTheme}
              className="rounded-full size-8"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-primary" />}
            </Button>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto px-4 py-4 z-20 flex flex-col pb-20 scrollbar-none">
          
          {/* Playful Floating Thought Banner (Feature 3) */}
          {activeTab === "match" && flowStep <= 6 && (
            <div className="h-8 flex items-center justify-center mb-2 select-none overflow-hidden">
              <AnimatePresence mode="wait">
                {floatingText && (
                  <motion.div
                    key={floatingText}
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="text-center py-1.5 px-3 rounded-full bg-white/80 dark:bg-black/90 border border-white/20 dark:border-white/5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-primary shadow-sm"
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                    </span>
                    <span>{floatingText}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Progress bar displayed inside the flow container (Steps 1 to 6) */}
          {activeTab === "match" && flowStep >= 1 && flowStep <= 6 && (
            <ProgressIndicator currentStep={flowStep} totalSteps={6} />
          )}

          <div className="flex-1 flex flex-col mt-2">
            <AnimatePresence mode="wait" custom={direction}>
              {activeTab === "match" ? (
                <motion.div
                  key={`flow-step-${flowStep}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ willChange: "transform, opacity" }}
                  className="flex-1 flex flex-col"
                >
                  
                  {/* STEP 0: PROPOSAL */}
                  {flowStep === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[440px]">
                      <Card variant="glass" className="w-full flex-1 flex flex-col justify-between py-6">
                        <CardHeader className="text-center pb-2">
                          <div className="mx-auto size-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 animate-heartbeat">
                            <Heart className="size-9 text-primary fill-primary" />
                          </div>
                          <CardTitle className="text-2xl font-black tracking-tight leading-snug">
                            Will you go on a date with me? ❤️
                          </CardTitle>
                          <CardDescription className="text-xs font-semibold dark:text-rose-300/60">
                            Answer carefully... 🤫
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                          <p className="text-sm font-medium text-foreground/80 leading-relaxed max-w-xs px-2">
                            I promise it will be filled with good food, premium laughs, and zero awkward silences.
                          </p>
                        </CardContent>

                        <CardFooter className="flex flex-col pt-4 border-t-0">
                          {/* Interactive escaping button wrapper */}
                          <div className="relative w-full h-[220px] flex items-center justify-center border-glass rounded-xl bg-black/5 dark:bg-white/5 overflow-hidden">
                            
                            {/* YES Button */}
                            <motion.div
                              style={{ x: -60, y: 0 }}
                              animate={{ scale: Math.min(1 + noCount * 0.15, 2.2) }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="absolute z-10"
                            >
                              <Button
                                variant="romantic"
                                size="lg"
                                className="shadow-romantic-glow font-bold pr-5 pl-5 select-none animate-heartbeat"
                                onClick={handleYesClick}
                              >
                                Yes 💖
                              </Button>
                            </motion.div>

                            {/* NO Button (escapes on approach) */}
                            <motion.div
                              animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                              transition={{ type: "spring", stiffness: 380, damping: 22 }}
                              onMouseEnter={handleNoHover}
                              onClick={handleNoHover}
                              className="absolute z-20 cursor-pointer"
                            >
                              <div className="relative group">
                                {/* Speech bubble tooltip */}
                                {noCount > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={noCount}
                                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black text-[10px] px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg font-bold z-30"
                                  >
                                    {tooltips[(noCount - 1) % tooltips.length]}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black dark:border-t-white" />
                                  </motion.div>
                                )}
                                
                                <Button
                                  variant="glass"
                                  className="border-rose-300 text-rose-600 dark:text-rose-300 font-semibold cursor-pointer"
                                >
                                  No 😒
                                </Button>
                              </div>
                            </motion.div>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  )}

                  {/* STEP 1: DATE PICKER */}
                  {flowStep === 1 && (
                    <DateStep
                      selectedValue={selectedDate}
                      onChange={setSelectedDate}
                      onNext={() => navigateTo(2)}
                      onBack={resetAll}
                    />
                  )}

                  {/* STEP 2: TIME SELECTION */}
                  {flowStep === 2 && (
                    <TimeStep
                      selectedValue={selectedTime}
                      onChange={setSelectedTime}
                      onNext={() => navigateTo(3)}
                      onBack={() => navigateTo(1)}
                    />
                  )}

                  {/* STEP 3: RESTAURANT SELECTION */}
                  {flowStep === 3 && (
                    <RestaurantStep
                      selectedValue={selectedRestaurant}
                      onChange={setSelectedRestaurant}
                      onNext={() => navigateTo(4)}
                      onBack={() => navigateTo(2)}
                    />
                  )}

                  {/* STEP 4: FOOD SELECTION */}
                  {flowStep === 4 && (
                    <FoodStep
                      restaurantName={selectedRestaurant}
                      selectedValue={selectedFood}
                      onChange={setSelectedFood}
                      onNext={() => navigateTo(5)}
                      onBack={() => navigateTo(3)}
                    />
                  )}

                  {/* STEP 5: PERSONALITY RESULT */}
                  {flowStep === 5 && (
                    <PersonalityStep
                      restaurant={selectedRestaurant}
                      food={selectedFood}
                      time={selectedTime}
                      onNext={(res) => {
                        setPersonalityResult(res)
                        navigateTo(6)
                      }}
                      onBack={() => navigateTo(4)}
                    />
                  )}

                  {/* STEP 6: FINAL SUMMARY */}
                  {flowStep === 6 && (
                    <SummaryStep
                      date={selectedDate}
                      time={selectedTime}
                      restaurant={selectedRestaurant}
                      food={selectedFood}
                      personality={personalityResult}
                      name={userName}
                      contact={contactHandle}
                      onNameChange={setUserName}
                      onContactChange={setContactHandle}
                      onSubmit={handleProposalSubmit}
                      onBack={() => navigateTo(5)}
                      isSubmitting={isSubmitting}
                      submitError={submitError}
                    />
                  )}

                  {/* STEP 7: SUCCESS CELEBRATION */}
                  {flowStep === 7 && (
                    <div className="w-full flex-1 flex flex-col justify-center min-h-[440px]">
                      <ConfettiExplosion />
                      <Card variant="glass" className="w-full flex-1 flex flex-col justify-between py-6 text-center border-primary/30 shadow-romantic-glow">
                        <CardHeader className="pb-0">
                          <div className="mx-auto size-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 relative">
                            <Heart className="size-10 text-primary fill-primary animate-ping absolute opacity-40" />
                            <Heart className="size-10 text-primary fill-primary z-10 animate-heartbeat" />
                          </div>
                          <CardTitle className="text-3xl font-black text-gradient-romantic tracking-wide animate-pulse">
                            IT'S BOOKED! 🎉
                          </CardTitle>
                          <CardDescription className="text-xs font-semibold text-primary/80 dark:text-rose-200/80 animate-pulse">
                            proposal locked in 💌
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="py-6 flex flex-col gap-3.5">
                          <p className="text-xs font-semibold leading-relaxed px-4 text-foreground/80">
                            Congratulations! Here is your locked Vibe Card:
                          </p>
                          
                          <div className="p-4 rounded-xl bg-white/20 dark:bg-black/20 border-glass text-xs text-left flex flex-col gap-2 max-w-xs mx-auto w-full">
                            <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                              <span className="text-muted-foreground">Candidate:</span>
                              <span className="font-bold">{userName}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                              <span className="text-muted-foreground">Timeline:</span>
                              <span className="font-bold">June {selectedDate.split("-")[2]}, 2026 🗓️</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                              <span className="text-muted-foreground">Time Slot:</span>
                              <span className="font-bold">{selectedTime}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                              <span className="text-muted-foreground">Venue:</span>
                              <span className="font-bold truncate max-w-[150px]">{selectedRestaurant}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                              <span className="text-muted-foreground">Palate:</span>
                              <span className="font-bold truncate max-w-[150px]">{selectedFood}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Archetype:</span>
                              <span className="font-bold text-primary truncate max-w-[150px]">{personalityResult}</span>
                            </div>
                          </div>

                          <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 inline-flex items-center justify-center gap-1.5 max-w-xs mx-auto">
                            <Check className="size-3.5" /> Notification Proposal locked in!
                          </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-2">
                          <div className="grid grid-cols-2 gap-2 w-full">
                            <Button 
                              variant="romantic" 
                              className="gap-2 font-bold text-xs"
                              onClick={handleSaveImage}
                            >
                              Save Image 📸
                            </Button>
                            <Button 
                              variant="glass" 
                              className="gap-2 font-semibold text-xs border-primary/20 text-primary"
                              onClick={handleCopyImage}
                            >
                              {copyFeedback ? "Copied! 📋" : "Copy Image"}
                            </Button>
                          </div>
                          
                          <Button 
                            variant="romantic" 
                            className="w-full gap-2 font-bold bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 border-none shadow-none text-white text-xs"
                            onClick={handleShareTelegram}
                          >
                            Share to Telegram ✈️
                          </Button>

                          <Button 
                            variant="ghost" 
                            className="w-full text-xs font-bold text-muted-foreground hover:text-primary gap-1 mt-1"
                            onClick={resetAll}
                          >
                            <RefreshCw className="size-3" /> Restart Plan
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  )}

                </motion.div>
              ) : (
                /* UI KIT SHOWCASE TAB */
                <motion.div
                  key="uikit-tab"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ willChange: "transform, opacity" }}
                  className="flex flex-col gap-6 py-2"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-gradient-romantic">Romantic UI Kit</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Premium mobile-first aesthetic design tokens.
                    </p>
                  </div>

                  {/* Viral Analytics Dashboard Section (Feature 1) */}
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center w-full">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-primary/70 flex items-center gap-1.5">
                        <Sparkles className="size-3.5 animate-sparkle" /> Viral Analytics
                      </h3>
                      <Button
                        variant="glass"
                        size="icon-xs"
                        disabled={isLoadingStats}
                        onClick={fetchStats}
                        className="rounded-full size-7 hover:scale-110 active:scale-95 transition-all text-primary"
                        aria-label="Refresh Statistics"
                      >
                        <RefreshCw className={`size-3.5 ${isLoadingStats ? "animate-spin text-primary" : ""}`} />
                      </Button>
                    </div>

                    <Card variant="glass" className="border-primary/20 shadow-romantic-glow">
                      <CardContent className="p-4 flex flex-col gap-4">
                        {isLoadingStats ? (
                          <div className="flex flex-col gap-3 py-4 text-center items-center justify-center">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            <span className="text-xs font-bold text-muted-foreground animate-pulse">
                              calculating dashboard metrics... 📊
                            </span>
                          </div>
                        ) : statsError ? (
                          <div className="text-center py-4 text-xs font-semibold text-rose-500">
                            ⚠️ {statsError}
                          </div>
                        ) : adminStats ? (
                          <>
                            {/* Grid metrics */}
                            <div className="grid grid-cols-3 gap-2">
                              <div className="p-2 rounded-xl bg-white/10 dark:bg-black/20 border border-foreground/5 text-center flex flex-col gap-0.5">
                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">Views</span>
                                <span className="text-sm font-black text-foreground">{adminStats.totalViews}</span>
                              </div>
                              <div className="p-2 rounded-xl bg-white/10 dark:bg-black/20 border border-foreground/5 text-center flex flex-col gap-0.5">
                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">Starts</span>
                                <span className="text-sm font-black text-primary">{adminStats.totalStarts}</span>
                              </div>
                              <div className="p-2 rounded-xl bg-white/10 dark:bg-black/20 border border-foreground/5 text-center flex flex-col gap-0.5">
                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">Submits</span>
                                <span className="text-sm font-black text-green-500">{adminStats.totalSubmits}</span>
                              </div>
                            </div>

                            {/* Conversion rate bar */}
                            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex flex-col gap-1.5">
                              <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-primary">
                                <span>Conversion Rate</span>
                                <span className="font-black text-xs">{adminStats.conversionRate}%</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-primary/10 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                                  style={{ width: `${Math.min(adminStats.conversionRate, 100)}%` }}
                                />
                              </div>
                              <span className="text-[8px] font-semibold text-muted-foreground text-right">
                                formula: submits / starts * 100
                              </span>
                            </div>

                            {/* Daily stats list */}
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">
                                Daily statistics history
                              </span>
                              <div className="max-h-[140px] overflow-y-auto pr-1 flex flex-col gap-1.5 scrollbar-none">
                                {adminStats.dailyStats.length === 0 ? (
                                  <span className="text-[10px] italic text-muted-foreground py-2 text-center">
                                    no dates logged yet
                                  </span>
                                ) : (
                                  adminStats.dailyStats.map((day) => (
                                    <div
                                      key={day.date}
                                      className="flex justify-between items-center text-[10px] p-2 rounded-lg bg-white/5 dark:bg-black/10 border border-foreground/5"
                                    >
                                      <span className="font-extrabold text-foreground">{day.date}</span>
                                      <div className="flex gap-2 font-bold text-muted-foreground">
                                        <span>👁️ {day.views}</span>
                                        <span className="text-primary">💖 {day.starts}</span>
                                        <span className="text-green-500">✅ {day.submits}</span>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4 text-xs text-muted-foreground">
                            click refresh to load stats
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Cards Section */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary/70 flex items-center gap-1">
                      <Layers className="size-3.5" /> Reusable Cards
                    </h3>
                    
                    <Card variant="glass">
                      <CardHeader>
                        <CardTitle className="text-sm">Glassmorphism Card</CardTitle>
                        <CardDescription className="text-xs">
                          Translucent background with borders and soft pink shadows.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-foreground/70 leading-relaxed">
                          This card features a high-grade glass look utilizing backdrop blurs and subtle white transparency overlays.
                        </p>
                      </CardContent>
                      <CardFooter className="justify-between text-[10px] text-muted-foreground">
                        <span>Variant: Glass</span>
                        <Check className="size-3 text-green-500" />
                      </CardFooter>
                    </Card>

                    <Card variant="default">
                      <CardHeader>
                        <CardTitle className="text-sm">Default Solid Card</CardTitle>
                        <CardDescription className="text-xs">
                          Standard card theme with crisp borders.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Clean backup container suitable for high contrast layouts.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Buttons Section */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary/70 flex items-center gap-1">
                      <Flame className="size-3.5" /> Reusable Buttons
                    </h3>
                    
                    <div className="flex flex-col gap-3">
                      <div>
                        <span className="text-[10px] font-semibold text-muted-foreground block mb-1.5">Romantic Custom Gradient Variant</span>
                        <Button variant="romantic" className="w-full">
                          Romantic Button <Heart className="size-3.5 fill-white ml-1.5 animate-heartbeat" />
                        </Button>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-muted-foreground block mb-1.5">Glassmorphic Variant</span>
                        <Button variant="glass" className="w-full">
                          Glass Button <Sparkles className="size-3.5 ml-1.5" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Default</span>
                          <Button variant="default" className="w-full">Default</Button>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Secondary</span>
                          <Button variant="secondary" className="w-full">Secondary</Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Outline</span>
                          <Button variant="outline" className="w-full">Outline</Button>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Ghost</span>
                          <Button variant="ghost" className="w-full">Ghost</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Animation Utilities */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary/70 flex items-center gap-1">
                      <Sparkles className="size-3.5" /> Animation Utilities
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="p-3 bg-white/20 dark:bg-black/20 border-glass rounded-xl text-center flex flex-col items-center justify-center">
                        <Heart className="size-6 text-primary fill-primary animate-heartbeat" />
                        <span className="text-[9px] font-semibold mt-1">Heartbeat</span>
                      </div>

                      <div className="p-3 bg-white/20 dark:bg-black/20 border-glass rounded-xl text-center flex flex-col items-center justify-center animate-float-medium">
                        <Sparkles className="size-6 text-amber-500 fill-amber-500" />
                        <span className="text-[9px] font-semibold mt-1">Floating</span>
                      </div>

                      <div className="p-3 bg-white/20 dark:bg-black/20 border-glass rounded-xl text-center flex flex-col items-center justify-center">
                        <Flame className="size-6 text-rose-500 fill-rose-500 animate-sparkle" />
                        <span className="text-[9px] font-semibold mt-1">Sparkling</span>
                      </div>
                    </div>
                  </div>

                  {/* Specs Card */}
                  <Card variant="glass" className="bg-primary/5 border-primary/20">
                    <CardHeader className="py-2">
                      <CardTitle className="text-xs font-bold text-primary">System Specs</CardTitle>
                    </CardHeader>
                    <CardContent className="text-[11px] leading-relaxed text-foreground/80">
                      - <strong>Framework</strong>: Next.js 16 (React 19)<br />
                      - <strong>Styling</strong>: Tailwind CSS v4 inline themes<br />
                      - <strong>Animations</strong>: Framer Motion + custom CSS keyframes<br />
                      - <strong>Base</strong>: @base-ui/react primitives
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Tab Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-black/95 border-t border-white/20 dark:border-white/5 flex items-center justify-around px-6 z-30 select-none">
          <button
            onClick={() => {
              playSoftClick()
              setActiveTab("match")
            }}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === "match" ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HeartHandshake className="size-5" />
            <span className="text-[9px] font-bold">Match POC</span>
          </button>

          <button
            onClick={() => {
              playSoftClick()
              setActiveTab("uikit")
            }}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === "uikit" ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-5" />
            <span className="text-[9px] font-bold">UI System</span>
          </button>
        </div>

        {/* Aesthetic Success Toast */}
        <AnimatePresence>
          {showToast && toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ willChange: "transform, opacity" }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 bg-white/95 dark:bg-black/95 border border-primary/20 shadow-romantic-glow rounded-full py-2 px-4 text-[10px] font-black uppercase tracking-wider text-primary flex items-center justify-center gap-1.5 select-none"
            >
              <Sparkles className="size-3.5 fill-primary text-primary animate-sparkle" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden share card optimized for export */}
      <ShareCard
        ref={shareCardRef}
        name={userName}
        contact={contactHandle}
        date={selectedDate}
        time={selectedTime}
        restaurant={selectedRestaurant}
        food={selectedFood}
        personality={personalityResult}
      />

      {/* Export loading overlay */}
      <AnimatePresence>
        {isGeneratingCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <div className="bg-white/10 border-glass p-8 rounded-3xl flex flex-col items-center justify-center max-w-[320px] text-center shadow-romantic-glow">
              <div className="relative size-16 mb-4 flex items-center justify-center">
                <Heart className="size-10 text-primary fill-primary animate-ping absolute opacity-45" />
                <Heart className="size-10 text-primary fill-primary z-10 animate-heartbeat" />
              </div>
              <p className="text-sm font-black text-white tracking-wide uppercase animate-pulse">
                {generatingStatus}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating mute/unmute button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          variant="glass"
          size="icon"
          onClick={toggleMute}
          className="rounded-full size-12 bg-white/60 dark:bg-black/60 shadow-romantic border-glass hover:scale-115 active:scale-95 transition-all text-primary flex items-center justify-center cursor-pointer"
          aria-label="Toggle sound"
        >
          {isAudioMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </Button>
      </div>

      {/* Click Heart Explosion Particles */}
      <AnimatePresence>
        {clickHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, scale: 0.2, x: heart.x, y: heart.y }}
            animate={{
              opacity: 0,
              scale: 1.25,
              y: heart.y - (Math.random() * 120 + 80),
              x: heart.x + (Math.random() * 80 - 40),
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: heart.delay }}
            className="fixed pointer-events-none text-primary/75 z-[9999]"
            style={{
              left: 0,
              top: 0,
              marginTop: -heart.size / 2,
              marginLeft: -heart.size / 2,
              willChange: "transform, opacity",
            }}
          >
            <Heart size={heart.size} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
