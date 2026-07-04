"use client"

import { useState, useEffect, useRef } from "react"
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
  RefreshCw,
  Volume2,
  VolumeX,
  Copy,
  Share2,
  BarChart3,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createInvitation, logAnalyticsEvent, getAnalyticsStats, type AnalyticsStats } from "@/app/actions"
import { getSessionId } from "@/lib/analytics"
import { getRandomRomanticText } from "@/lib/romantic-texts"
import { 
  initAudio, 
  setMutedState, 
  getMutedState, 
  playSoftClick, 
  playSparkle
} from "@/lib/audio"

// Pre-configured static arrays to prevent CPU thrashing/re-renders
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

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"match" | "uikit">("match")
  const [isDark, setIsDark] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)

  // Invitation creation states
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)

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

  const triggerSuccessToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }
    
    setToastMessage(msg)
    setShowToast(true)
    
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // Initialize theme & sound settings
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

    const isDarkTheme = document.documentElement.classList.contains("dark")
    setIsDark(isDarkTheme)
  }, [])

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

  // Handle invitation creation
  const handleCreateInvitation = async () => {
    setIsCreating(true)
    setCreateError("")
    playSoftClick()

    try {
      const res = await createInvitation()
      if (res.success && res.code) {
        setCreatedCode(res.code)
        setShowConfetti(true)
        playSparkle()
      } else {
        setCreateError(res.error || "Failed to create invitation.")
      }
    } catch (err: any) {
      setCreateError("Connection error. Please try again! 😭")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopyLink = () => {
    if (!createdCode) return
    playSoftClick()
    const url = `${window.location.origin}/invite/${createdCode}`
    navigator.clipboard.writeText(url)
    triggerSuccessToast("Invitation link copied! 📋")
  }

  const handleShareLink = async () => {
    if (!createdCode) return
    playSoftClick()
    const url = `${window.location.origin}/invite/${createdCode}`
    const text = "Plan the perfect date with me! 💌 Fill out your selections here:"
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Date Invitation",
          text: text,
          url: url,
        })
        triggerSuccessToast("Shared successfully! 🔗")
      } catch (err) {
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        window.open(shareUrl, "_blank")
      }
    } else {
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      window.open(shareUrl, "_blank")
    }
  }

  // Rotate thought banner messages
  useEffect(() => {
    if (createdCode) {
      setFloatingText("your special link is ready... 💘")
    } else {
      setFloatingText(getRandomRomanticText())
    }
  }, [createdCode])

  // Fetch admin dashboard stats
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

  const inviteUrl = createdCode && typeof window !== "undefined" 
    ? `${window.location.origin}/invite/${createdCode}` 
    : ""

  return (
    <div 
      onClick={handleGlobalClick}
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-romantic-mesh transition-colors duration-500 cursor-default"
    >
      {/* Confetti Explosion */}
      {showConfetti && <ConfettiExplosion />}

      {/* Ambient background particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
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
        <div className={`flex-1 overflow-y-auto px-4 py-4 z-20 flex flex-col pb-20 scrollbar-none ${activeTab === "match" ? "justify-center" : ""}`}>
          
          {/* Playful Floating Thought Banner */}
          {activeTab === "match" && (
            <div className="h-8 flex items-center justify-center mb-2 select-none overflow-hidden shrink-0">
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

          <div className={`flex-1 flex flex-col mt-2 min-h-0 ${activeTab === "match" ? "justify-center" : ""}`}>
            <AnimatePresence mode="wait">
              {activeTab === "match" ? (
                <motion.div
                  key={createdCode ? "invitation-ready" : "create-invitation"}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ willChange: "transform, opacity" }}
                  className="flex-1 flex flex-col justify-center"
                >
                  {!createdCode ? (
                    /* CREATE INVITATION SCREEN */
                    <Card variant="glass" className="w-full py-6 flex flex-col justify-between min-h-[380px]">
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto size-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 animate-heartbeat">
                          <Heart className="size-9 text-primary fill-primary" />
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight leading-snug">
                          Plan a Date Together ✨
                        </CardTitle>
                        <CardDescription className="text-xs font-semibold dark:text-rose-300/60 mt-1">
                          Lightweight, fun and frictionless
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="py-4 text-center flex-1 flex items-center justify-center">
                        <p className="text-xs font-semibold text-foreground/80 leading-relaxed max-w-xs px-2">
                          Create an invitation link and send it to your partner or crush. They will plan the date details, and you'll get a custom compatibility archetype card!
                        </p>
                      </CardContent>

                      <CardFooter className="flex flex-col gap-3 pt-4 border-t-0">
                        <Button
                          variant="romantic"
                          className="w-full font-black text-xs uppercase tracking-wider py-5 rounded-xl shadow-romantic-glow cursor-pointer"
                          disabled={isCreating}
                          onClick={handleCreateInvitation}
                        >
                          {isCreating ? (
                            <>
                              <RefreshCw className="size-4 animate-spin mr-2" /> Generating Link...
                            </>
                          ) : (
                            <>Create Date Invitation ✨</>
                          )}
                        </Button>

                        <Button
                          variant="glass"
                          className="w-full gap-2 font-bold text-xs uppercase tracking-wider py-4 rounded-xl border-primary/20 text-primary cursor-pointer hover:bg-foreground/5 transition-colors"
                          onClick={() => router.push("/invite/demo")}
                        >
                          Try Demo Flow 🎮
                        </Button>

                        {createError && (
                          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-[10px] font-bold text-destructive flex items-center gap-1.5 w-full justify-center">
                            <AlertCircle className="size-3.5" /> {createError}
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  ) : (
                    /* INVITATION READY SCREEN */
                    <Card variant="glass" className="w-full py-6 flex flex-col justify-between min-h-[420px]">
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto size-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3">
                          <Check className="size-9 text-emerald-500" />
                        </div>
                        <CardTitle className="text-2xl font-black text-gradient-romantic tracking-wide">
                          💌 Your invitation is ready
                        </CardTitle>
                        <CardDescription className="text-xs font-semibold text-primary/80 dark:text-rose-200/80 mt-1">
                          Share the link to lock in the plan!
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="py-4 flex flex-col gap-4">
                        <div className="p-3.5 rounded-2xl bg-white/10 dark:bg-black/20 border-glass text-xs flex flex-col gap-2 relative">
                          <span className="text-[8px] font-black uppercase text-primary tracking-widest text-left block">
                            Invitation Link:
                          </span>
                          <div className="flex items-center gap-1 bg-white/10 dark:bg-black/25 p-2 rounded-xl border border-foreground/5 min-w-0">
                            <span className="text-[10px] font-bold truncate flex-1 select-all text-left text-foreground">
                              {inviteUrl}
                            </span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex flex-col gap-2.5 pt-2 border-t-0">
                        <Button
                          variant="romantic"
                          className="w-full gap-2 font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-romantic-glow cursor-pointer"
                          onClick={handleCopyLink}
                        >
                          <Copy className="size-3.5" /> Copy Link
                        </Button>
                        
                        <Button
                          variant="glass"
                          className="w-full gap-2 font-semibold text-xs border-primary/20 text-primary py-4 rounded-xl hover:bg-foreground/5 transition-colors cursor-pointer"
                          onClick={handleShareLink}
                        >
                          <Share2 className="size-3.5" /> Share Link
                        </Button>

                        <Button
                          variant="romantic"
                          className="w-full gap-2 font-bold bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 border-none shadow-none text-white text-xs py-4 rounded-xl cursor-pointer"
                          onClick={() => router.push(`/results/${createdCode}`)}
                        >
                          <BarChart3 className="size-3.5" /> View Results 📊
                        </Button>

                        <button 
                          onClick={() => {
                            playSoftClick()
                            setCreatedCode(null)
                            setShowConfetti(false)
                          }}
                          className="text-[9px] font-bold text-muted-foreground/80 hover:text-primary transition-colors flex items-center justify-center gap-1 mt-1 cursor-pointer"
                        >
                          <RefreshCw className="size-3" /> Create New Invitation
                        </button>
                      </CardFooter>
                    </Card>
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

                  {/* Viral Analytics Dashboard Section */}
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
                    </div>
                  </div>
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
