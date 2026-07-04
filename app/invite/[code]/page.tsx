"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
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
  VolumeX,
  AlertCircle
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
import { ContactStep } from "@/components/steps/contact-step"
import { submitInvitationResponse, getInvitationResponse, logAnalyticsEvent } from "@/app/actions"
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
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
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
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ["#ff4b82", "#ff85a1", "#fbb6ce", "#fbd38d", "#f6ad55"]
    const particles = Array.from({ length: 85 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height * 0.42,
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
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.35
        p.vx *= 0.985
        p.rotation += p.rotationSpeed
        p.opacity -= 0.012
      })
      if (active) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    render()
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />
}

export default function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const code = resolvedParams.code

  const [verificationStatus, setVerificationStatus] = useState<"loading" | "valid" | "already_completed" | "invalid">("loading")
  const [isDark, setIsDark] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [floatingText, setFloatingText] = useState("")
  const [secondsElapsed, setSecondsElapsed] = useState(0)

  // Navigation flow state: 0 = proposal, 1 = date, 2 = time, 3 = spot, 4 = food, 5 = personality, 6 = summary, 7 = contact details, 8 = success
  const [flowStep, setFlowStep] = useState(0)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")

  // Proposal Game State
  const [noCount, setNoCount] = useState(0)
  const [noButtonPos, setNoButtonPos] = useState({ x: 60, y: 0 })

  // Form selections state
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("")
  const [selectedFood, setSelectedFood] = useState<string>("")
  const [personalityResult, setPersonalityResult] = useState<string>("")
  const [contactHandle, setContactHandle] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isGeneratingCard, setIsGeneratingCard] = useState(false)
  const shareCardRef = useRef<HTMLDivElement>(null)

  // Verify invitation on load
  useEffect(() => {
    initAudio()
    setIsAudioMuted(getMutedState())
    setFloatingText(getRandomRomanticText())

    const verifyCode = async () => {
      const res = await getInvitationResponse(code)
      if (res.success) {
        if (res.exists) {
          setVerificationStatus("already_completed")
        } else {
          setVerificationStatus("valid")
          // Log view event for this specific code
          const sessId = getSessionId()
          const sessionKey = `logged-event-invite_view_${code}`
          const hasLogged = sessionStorage.getItem(sessionKey)
          if (!hasLogged) {
            const logResult = await logAnalyticsEvent("view", sessId)
            if (logResult.success) {
              sessionStorage.setItem(sessionKey, "true")
            }
          }
        }
      } else {
        setVerificationStatus("invalid")
      }
    }
    verifyCode()
  }, [code])

  // Track page time
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Step-level analytics funnel tracking
  useEffect(() => {
    if (typeof window === "undefined" || verificationStatus !== "valid") return

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
          eventType = "reached_contact_step"
          break
        case 8:
          eventType = "submitted_proposal"
          break
      }

      if (eventType) {
        const sessionKey = `logged-event-${eventType}-${code}`
        const hasLogged = sessionStorage.getItem(sessionKey)
        if (!hasLogged) {
          const res = await logAnalyticsEvent(eventType, sessId)
          if (res.success) {
            sessionStorage.setItem(sessionKey, "true")
          }
        }
      }
    }

    trackStep()
  }, [flowStep, verificationStatus, code])

  // Preload html2canvas on final step
  useEffect(() => {
    if (flowStep === 8) {
      import("html2canvas").catch(() => {})
    }
  }, [flowStep])

  const triggerSuccessToast = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const toggleMute = () => {
    const nextMuted = !isAudioMuted
    setIsAudioMuted(nextMuted)
    setMutedState(nextMuted)
    if (!nextMuted) {
      setTimeout(() => playSoftClick(), 60)
    }
  }

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

  const navigateTo = (nextStep: number) => {
    playSwoosh()
    setDirection(nextStep > flowStep ? "forward" : "backward")
    setFlowStep(nextStep)
  }

  const handleYesClick = async () => {
    navigateTo(1)
    if (typeof window !== "undefined") {
      const sessId = getSessionId()
      const sessionKey = `logged-event-start_flow-${code}`
      const hasLoggedStart = sessionStorage.getItem(sessionKey)
      if (!hasLoggedStart) {
        const result = await logAnalyticsEvent("start_flow", sessId)
        if (result.success) {
          sessionStorage.setItem(sessionKey, "true")
        }
      }
    }
  }

  const handleNoHover = () => {
    playNoEscape()
    // Select a random button position
    const cardWidth = 320
    const cardHeight = 220
    const boundsX = cardWidth / 2 - 45
    const boundsY = cardHeight / 2 - 25

    let newX = (Math.random() - 0.5) * boundsX * 2
    let newY = (Math.random() - 0.5) * boundsY * 2

    // Safety checks to prevent overlaps
    if (Math.abs(newX - noButtonPos.x) < 40) {
      newX = newX < 0 ? newX - 40 : newX + 40
    }
    if (Math.abs(newY - noButtonPos.y) < 35) {
      newY = newY < 0 ? newY - 35 : newY + 35
    }
    
    setNoButtonPos({ x: newX, y: newY })
    setNoCount(prev => prev + 1)
  }

  const handleProposalSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError("")
    
    if (code === "demo") {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800))
        playSparkle()
        navigateTo(8)
      } catch (err) {
        setSubmitError("Failed to submit demo.")
      } finally {
        setIsSubmitting(false)
      }
      return
    }
    
    try {
      const result = await submitInvitationResponse({
        invitation_code: code,
        selected_date: selectedDate,
        selected_time: selectedTime,
        selected_restaurant: selectedRestaurant,
        selected_food: selectedFood,
        selected_archetype: personalityResult,
        contact_username: contactHandle,
      })
      
      if (result.success) {
        const sessId = getSessionId()
        await logAnalyticsEvent("submit", sessId)
        
        // Log submitted_proposal for funnel metrics
        const sessionKey = `logged-event-submitted_proposal-${code}`
        const hasLoggedSubmit = sessionStorage.getItem(sessionKey)
        if (!hasLoggedSubmit) {
          const res = await logAnalyticsEvent("submitted_proposal", sessId)
          if (res.success) {
            sessionStorage.setItem(sessionKey, "true")
          }
        }
        
        localStorage.setItem("date-sparks-last-submit", Date.now().toString())
        playSparkle()
        navigateTo(8)
      } else {
        setSubmitError(result.error || "Failed to submit proposal.")
      }
    } catch (err: any) {
      setSubmitError("Network connection error. Try again! 😭")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveImage = async () => {
    if (!shareCardRef.current || isGeneratingCard) return
    setIsGeneratingCard(true)
    playSoftClick()

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
      link.download = `Uchrashuv_${contactHandle.replace(/[@\s]+/g, "_") || "Vibe"}_Card.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      playCameraShutter()
      triggerSuccessToast("Card saved to device! 📸")
    } catch (err) {
      console.error("Failed to generate card image:", err)
      alert("Oops! Failed to save image. Please try again! 😭")
    } finally {
      setIsGeneratingCard(false)
    }
  }

  const getPlayfulTimeMessage = () => {
    if (flowStep === 1) return "lowkey hoping you pick a weekend 🤭"
    if (flowStep === 2) return "lowkey hoping you pick dinner 😌"
    if (flowStep === 3) return "this is getting suspiciously cute"
    if (flowStep === 4) return "okay wait this vibe kinda works"
    if (flowStep === 5) return "calculating compatibility vibes... 💘"
    if (flowStep === 6) return "almost official. lock it in! 🔐"
    if (flowStep === 7) return "only one final step left 😌"

    if (secondsElapsed < 10) return "pretending i'm calm rn 😭"
    if (secondsElapsed < 25) return `you've been here for ${secondsElapsed} seconds already 😌`
    return "locked into date invitation mode 💌"
  }

  return (
    <main className={`min-h-screen w-full relative overflow-hidden bg-romantic-mesh flex flex-col items-center justify-center p-4 transition-colors duration-500 ${isDark ? "dark" : ""}`}>
      {/* Compositor-thread Background Blurs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {bgParticles.map((particle, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-radial-blur animate-float-blur"
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
        
        {/* Floating Hearts */}
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

      {/* Main Mock Phone Container */}
      <div className="relative z-10 w-full max-w-[420px] aspect-[9/19] max-h-[850px] min-h-[660px] flex flex-col bg-white/60 dark:bg-black/70 border border-white/30 dark:border-white/10 rounded-[2.5rem] shadow-romantic overflow-hidden backdrop-blur-xl">
        {/* Notch Header */}
        <div className="flex justify-between items-center px-6 pt-5 pb-3 bg-white/5 dark:bg-black/20 border-b border-foreground/5 z-30 select-none">
          <div className="flex items-center gap-1.5">
            <Flame className="text-primary animate-pulse size-5 fill-primary" />
            <span className="font-bold tracking-tight text-sm text-gradient-romantic">Uchrashuv</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              size="icon-xs"
              onClick={toggleMute}
              className="rounded-full size-8"
              aria-label="Toggle Sound"
            >
              {isAudioMuted ? <VolumeX className="size-4 text-primary" /> : <Volume2 className="size-4 text-primary" />}
            </Button>
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 z-20 flex flex-col pb-6 scrollbar-none justify-center">
          
          {verificationStatus === "loading" && (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <RefreshCw className="size-8 text-primary animate-spin" />
              <p className="text-xs font-bold text-muted-foreground animate-pulse">Verifying invitation...</p>
            </div>
          )}

          {verificationStatus === "invalid" && (
            <div className="flex flex-col items-center justify-center text-center p-6 gap-4 animate-scale-in">
              <div className="size-16 bg-destructive/15 rounded-full flex items-center justify-center mb-1">
                <AlertCircle className="size-8 text-destructive" />
              </div>
              <h2 className="text-lg font-black text-gradient-romantic">Invalid Invitation Link</h2>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                This invitation code does not exist or has expired. Please ask the sender for a new link! 😭
              </p>
              <Button variant="romantic" className="mt-4 text-xs font-bold px-6 py-2 rounded-xl" onClick={() => router.push("/")}>
                Create Invitation 💌
              </Button>
            </div>
          )}

          {verificationStatus === "already_completed" && (
            <div className="flex flex-col items-center justify-center text-center p-6 gap-4 animate-scale-in">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-1 animate-heartbeat">
                <Check className="size-8 text-primary" />
              </div>
              <h2 className="text-lg font-black text-gradient-romantic">Invitation Accepted!</h2>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                The date planning for this invitation is already locked in! You can view the finalized date plan summary.
              </p>
              <Button variant="romantic" className="mt-4 text-xs font-black px-6 py-2 rounded-xl gap-2 shadow-romantic-glow" onClick={() => router.push(`/results/${code}`)}>
                View Date Plan 📊
              </Button>
            </div>
          )}

          {verificationStatus === "valid" && (
            <>
              {/* Playful Floating Thought Banner */}
              {flowStep <= 7 && (
                <div className="h-8 flex items-center justify-center mb-2 select-none overflow-hidden shrink-0">
                  <AnimatePresence mode="wait">
                    {floatingText && (
                      <motion.div
                        key={flowStep + floatingText}
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="text-center py-1.5 px-3 rounded-full bg-white/80 dark:bg-black/90 border border-white/20 dark:border-white/5 flex items-center justify-center gap-1.5 text-[9.5px] font-bold text-primary shadow-sm"
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                        </span>
                        <span>{getPlayfulTimeMessage()}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Progress Indicator */}
              {flowStep >= 1 && flowStep <= 7 && (
                <ProgressIndicator currentStep={flowStep} totalSteps={7} />
              )}

              {/* Steps Animation wrapper */}
              <div className="flex-1 flex flex-col mt-2 min-h-0">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`flow-step-${flowStep}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{ willChange: "transform, opacity" }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    {/* STEP 0: PROPOSAL */}
                    {flowStep === 0 && (
                      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
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
                            <p className="text-xs font-semibold text-foreground/80 leading-relaxed max-w-xs px-2">
                              I promise it will be filled with good food, premium laughs, and zero awkward silences.
                            </p>
                          </CardContent>

                          <CardFooter className="flex flex-col pt-4 border-t-0">
                            {/* Runaway button bounds */}
                            <div className="relative w-full h-[220px] flex items-center justify-center border-glass rounded-xl bg-black/5 dark:bg-white/5 overflow-hidden">
                              
                              {/* YES Button */}
                              <motion.div
                                style={{ x: -60, y: 0 }}
                                animate={{ scale: Math.min(1 + noCount * 0.15, 2.2) }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute z-20"
                              >
                                <Button 
                                  variant="romantic" 
                                  size="lg"
                                  onClick={handleYesClick}
                                  className="shadow-romantic-glow font-black text-sm uppercase tracking-wider px-6 cursor-pointer"
                                >
                                  YES 💖
                                </Button>
                              </motion.div>

                              {/* Escaping NO Button */}
                              <motion.div
                                style={{ x: noButtonPos.x, y: noButtonPos.y }}
                                className="absolute z-10"
                                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                              >
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onMouseEnter={handleNoHover}
                                  onClick={handleNoHover}
                                  className="text-xs font-extrabold text-muted-foreground/80 cursor-pointer border border-transparent hover:border-foreground/5 py-1 px-3"
                                >
                                  {noCount > 0 ? tooltips[Math.min(noCount - 1, tooltips.length - 1)] : "no"}
                                </Button>
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
                        onBack={() => navigateTo(0)}
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
                        onNext={() => navigateTo(7)}
                        onBack={() => navigateTo(5)}
                      />
                    )}

                    {/* STEP 7: CONTACT DETAILS INPUT */}
                    {flowStep === 7 && (
                      <ContactStep
                        selectedValue={contactHandle}
                        onChange={setContactHandle}
                        onSubmit={handleProposalSubmit}
                        onBack={() => navigateTo(6)}
                        isSubmitting={isSubmitting}
                        submitError={submitError}
                      />
                    )}

                    {/* STEP 8: SUCCESS CELEBRATION */}
                    {flowStep === 8 && (
                      <div className="w-full flex-1 flex flex-col justify-center min-h-[400px]">
                        <ConfettiExplosion />
                        <Card variant="glass" className="w-full flex-1 flex flex-col justify-between py-6 text-center border-primary/30 shadow-romantic-glow">
                          <CardHeader className="pb-0">
                            <div className="mx-auto size-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 relative">
                              <Heart className="size-10 text-primary fill-primary animate-ping absolute opacity-40" />
                              <Heart className="size-10 text-primary fill-primary z-10 animate-heartbeat" />
                            </div>
                            <CardTitle className="text-3xl font-black text-gradient-romantic tracking-wide animate-pulse">
                              {code === "demo" ? "DEMO COMPLETED! 🎮" : "IT'S BOOKED! 🎉"}
                            </CardTitle>
                            <CardDescription className="text-xs font-semibold text-primary/80 dark:text-rose-200/80 animate-pulse">
                              {code === "demo" ? "This is what your partner will see! 💌" : "proposal locked in 💌"}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="py-6 flex flex-col gap-3.5">
                            <p className="text-xs font-semibold leading-relaxed px-4 text-foreground/80">
                              {code === "demo" ? "Congratulations! Here is your demo Vibe Card:" : "Congratulations! Here is your locked Vibe Card:"}
                            </p>
                            
                            <div className="p-4 rounded-xl bg-white/20 dark:bg-black/20 border-glass text-xs text-left flex flex-col gap-2 max-w-xs mx-auto w-full">
                              <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                                <span className="text-muted-foreground">Username:</span>
                                <span className="font-bold">{contactHandle || "@crush"}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                                <span className="text-muted-foreground">Timeline:</span>
                                <span className="font-bold">June {selectedDate && selectedDate.includes("-") ? selectedDate.split("-")[2] : "12"}, 2026 🗓️</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                                <span className="text-muted-foreground">Time Slot:</span>
                                <span className="font-bold">{selectedTime || "7:00 PM"}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                                <span className="text-muted-foreground">Venue:</span>
                                <span className="font-bold truncate max-w-[150px]">{selectedRestaurant || "ARROWS & SPARROWS"}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                                <span className="text-muted-foreground">Palate:</span>
                                <span className="font-bold truncate max-w-[150px]">{selectedFood || "Turkish Menemen"}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Archetype:</span>
                                <span className="font-bold text-primary truncate max-w-[150px]">{personalityResult || "Fine Dining Romanticist 🌹"}</span>
                              </div>
                            </div>
 
                            {code === "demo" ? (
                              <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary inline-flex items-center justify-center gap-1.5 max-w-xs mx-auto">
                                <Sparkles className="size-3.5" /> Try creating your own invite now!
                              </div>
                            ) : (
                              <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 inline-flex items-center justify-center gap-1.5 max-w-xs mx-auto">
                                <Check className="size-3.5" /> Proposal locked in!
                              </div>
                            )}
                          </CardContent>
 
                          <CardFooter className="flex flex-col gap-2">
                            {code === "demo" ? (
                              <div className="flex flex-col gap-2 w-full">
                                <Button 
                                  variant="romantic" 
                                  className="w-full gap-2 font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-romantic-glow cursor-pointer"
                                  onClick={() => router.push("/")}
                                >
                                  Create My Own Invitation 💌
                                </Button>
                                <Button 
                                  variant="glass" 
                                  className="w-full gap-2 font-semibold text-xs border-primary/20 text-primary py-3 rounded-xl hover:bg-foreground/5 transition-colors cursor-pointer"
                                  onClick={handleSaveImage}
                                >
                                  Save Demo Vibe Card 📸
                                </Button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2 w-full">
                                <Button 
                                  variant="romantic" 
                                  className="gap-2 font-bold text-xs cursor-pointer"
                                  onClick={handleSaveImage}
                                >
                                  Save Image 📸
                                </Button>
                                <Button
                                  variant="glass"
                                  className="gap-2 font-bold text-xs text-primary border-primary/20 cursor-pointer"
                                  onClick={() => router.push(`/results/${code}`)}
                                >
                                  View Summary 📊
                                </Button>
                              </div>
                            )}
                          </CardFooter>
                        </Card>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}

        </div>

        {/* Aesthetic Success Toast */}
        <AnimatePresence>
          {showToast && toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute bottom-20 left-4 right-4 py-3 px-4 rounded-xl bg-emerald-500 text-white font-extrabold text-xs shadow-romantic-glow flex items-center justify-center gap-2 z-40 select-none border border-white/20"
            >
              <Sparkles className="size-3.5 fill-white text-white animate-sparkle" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden Export Card container */}
      {verificationStatus === "valid" && flowStep === 8 && (
        <ShareCard
          ref={shareCardRef}
          name={contactHandle}
          contact={contactHandle}
          date={selectedDate}
          time={selectedTime}
          restaurant={selectedRestaurant}
          food={selectedFood}
          personality={personalityResult}
        />
      )}

      {/* Export overlay */}
      <AnimatePresence>
        {isGeneratingCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col items-center justify-center select-none"
          >
            <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/45 border-glass flex flex-col items-center gap-4 text-center max-w-xs shadow-romantic">
              <RefreshCw className="size-8 text-primary animate-spin" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-black text-gradient-romantic">Generating Custom Vibe Card</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Rasterizing high resolution pixels</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
