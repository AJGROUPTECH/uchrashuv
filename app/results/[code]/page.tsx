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
  Calendar,
  Clock,
  MapPin,
  Pizza,
  Award,
  Share2,
  RefreshCw,
  Volume2,
  VolumeX,
  AlertCircle,
  Copy,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getInvitationResponse, logAnalyticsEvent } from "@/app/actions"
import { getSessionId } from "@/lib/analytics"
import { ShareCard } from "@/components/share-card"
import { 
  initAudio, 
  setMutedState, 
  getMutedState, 
  playSoftClick, 
  playSparkle, 
  playCameraShutter 
} from "@/lib/audio"

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

export default function ResultsPage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const code = resolvedParams.code

  const [status, setStatus] = useState<"loading" | "pending" | "completed" | "invalid">("loading")
  const [isDark, setIsDark] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [responseData, setResponseData] = useState<any>(null)
  
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isGeneratingCard, setIsGeneratingCard] = useState(false)
  const shareCardRef = useRef<HTMLDivElement>(null)

  const fetchResults = async () => {
    setStatus("loading")
    const res = await getInvitationResponse(code)
    if (res.success) {
      if (res.exists) {
        setResponseData(res.data)
        setStatus("completed")
      } else {
        setStatus("pending")
      }
    } else {
      setStatus("invalid")
    }
  }

  useEffect(() => {
    initAudio()
    setIsAudioMuted(getMutedState())
    fetchResults()
  }, [code])

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

  const handleCopyLink = () => {
    playSoftClick()
    const url = `${window.location.origin}/invite/${code}`
    navigator.clipboard.writeText(url)
    triggerSuccessToast("Invitation link copied! 📋")
  }

  const handleSaveImage = async () => {
    if (!shareCardRef.current || isGeneratingCard || !responseData) return
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
      link.download = `Uchrashuv_${responseData.contact_username.replace(/[@\s]+/g, "_") || "Vibe"}_Card.png`
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

  const getReadableDate = (rawDate: string) => {
    if (!rawDate) return ""
    const parts = rawDate.split("-")
    const month = parts[1]
    const day = parseInt(parts[2], 10)
    const monthLabel = month === "06" ? "June" : "July"
    return `${monthLabel} ${day}, 2026 🗓️`
  }

  return (
    <main className={`min-h-screen w-full relative overflow-hidden bg-romantic-mesh flex flex-col items-center justify-center p-4 transition-colors duration-500 ${isDark ? "dark" : ""}`}>
      {/* Background blurs */}
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

      {/* Mock Phone Container */}
      <div className="relative z-10 w-full max-w-[420px] aspect-[9/19] max-h-[850px] min-h-[660px] flex flex-col bg-white/60 dark:bg-black/70 border border-white/30 dark:border-white/10 rounded-[2.5rem] shadow-romantic overflow-hidden backdrop-blur-xl">
        {/* Notch Header */}
        <div className="flex justify-between items-center px-6 pt-5 pb-3 bg-white/5 dark:bg-black/20 border-b border-foreground/5 z-30 select-none">
          <div className="flex items-center gap-1.5" onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 z-20 flex flex-col pb-6 scrollbar-none justify-center">

          {status === "loading" && (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <RefreshCw className="size-8 text-primary animate-spin" />
              <p className="text-xs font-bold text-muted-foreground animate-pulse">Loading date results...</p>
            </div>
          )}

          {status === "invalid" && (
            <div className="flex flex-col items-center justify-center text-center p-6 gap-4 animate-scale-in">
              <div className="size-16 bg-destructive/15 rounded-full flex items-center justify-center mb-1">
                <AlertCircle className="size-8 text-destructive" />
              </div>
              <h2 className="text-lg font-black text-gradient-romantic">Invalid Invitation Link</h2>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                This results link does not exist. Please check the URL or create a new invitation! 😭
              </p>
              <Button variant="romantic" className="mt-4 text-xs font-bold px-6 py-2 rounded-xl" onClick={() => router.push("/")}>
                Create Invitation 💌
              </Button>
            </div>
          )}

          {status === "pending" && (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[440px] text-center p-4 animate-scale-in">
              <Card variant="glass" className="w-full py-6 flex flex-col justify-between h-full min-h-[380px]">
                <CardHeader className="pb-2">
                  <div className="mx-auto size-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-3 animate-pulse">
                    <Heart className="size-9 text-amber-500 fill-amber-500/10" />
                  </div>
                  <CardTitle className="text-xl font-black tracking-tight text-gradient-romantic">
                    Waiting for acceptance... ⏳
                  </CardTitle>
                  <CardDescription className="text-xs font-semibold leading-relaxed max-w-xs mx-auto">
                    Your date has not accepted the invitation yet.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="py-4 flex flex-col gap-4">
                  <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed px-2">
                    Send them the link below so they can answer and plan the date!
                  </p>
                  
                  <div className="p-3.5 rounded-2xl bg-white/10 dark:bg-black/20 border-glass text-xs flex flex-col gap-2 relative">
                    <span className="text-[8px] font-black uppercase text-primary tracking-widest text-left block">
                      Shareable Invitation Link:
                    </span>
                    <div className="flex items-center gap-1 bg-white/10 dark:bg-black/25 p-2 rounded-xl border border-foreground/5 min-w-0">
                      <span className="text-[10px] font-bold truncate flex-1 select-all text-left">
                        {typeof window !== "undefined" ? `${window.location.origin}/invite/${code}` : `/invite/${code}`}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-2.5">
                  <Button variant="romantic" className="w-full gap-2 font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-romantic-glow cursor-pointer" onClick={handleCopyLink}>
                    <Copy className="size-3.5" /> Copy Invitation Link
                  </Button>
                  
                  <button 
                    onClick={fetchResults}
                    className="text-[9px] font-bold text-muted-foreground/80 hover:text-primary transition-colors flex items-center justify-center gap-1 mt-1 cursor-pointer"
                  >
                    <RefreshCw className="size-3" /> Refresh Status
                  </button>
                </CardFooter>
              </Card>
            </div>
          )}

          {status === "completed" && responseData && (
            <div className="w-full flex-1 flex flex-col justify-center min-h-[440px] animate-scale-in">
              <Card variant="glass" className="w-full flex-1 flex flex-col justify-between py-6 text-center border-primary/30 shadow-romantic-glow">
                <CardHeader className="pb-0">
                  <div className="mx-auto size-14 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                    <Heart className="size-7 text-primary fill-primary animate-heartbeat" />
                  </div>
                  <CardTitle className="text-2xl font-black text-gradient-romantic tracking-wide">
                    💌 Date Plan Complete
                  </CardTitle>
                  <CardDescription className="text-xs font-semibold text-primary/80 dark:text-rose-200/80">
                    selections locked in!
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="py-6 flex flex-col gap-3">
                  <div className="p-4 rounded-xl bg-white/20 dark:bg-black/20 border-glass text-xs text-left flex flex-col gap-2.5 max-w-xs mx-auto w-full">
                    <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                      <span className="text-muted-foreground">Username:</span>
                      <span className="font-extrabold text-foreground">{responseData.contact_username}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                      <span className="text-muted-foreground">Timeline:</span>
                      <span className="font-extrabold text-foreground">
                        {responseData.selected_date && responseData.selected_date.includes("-")
                          ? `${responseData.selected_date.split("-")[1] === "06" ? "June" : "July"} ${responseData.selected_date.split("-")[2]}`
                          : "July 12"
                        }, 2026 🗓️
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                      <span className="text-muted-foreground">Time Slot:</span>
                      <span className="font-extrabold text-foreground">{responseData.selected_time}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                      <span className="text-muted-foreground">Venue:</span>
                      <span className="font-extrabold text-foreground truncate max-w-[150px]">{responseData.selected_restaurant}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                      <span className="text-muted-foreground">Palate:</span>
                      <span className="font-extrabold text-foreground truncate max-w-[150px]">{responseData.selected_food}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Archetype:</span>
                      <span className="font-extrabold text-primary truncate max-w-[150px]">{responseData.selected_archetype}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                  <Button 
                    variant="romantic" 
                    className="w-full gap-2 font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-romantic-glow cursor-pointer"
                    onClick={handleSaveImage}
                  >
                    Download Vibe Card 📸
                  </Button>
                  <Button
                    variant="glass"
                    className="w-full text-xs font-bold py-3.5 rounded-xl border-foreground/5 hover:bg-foreground/5 transition-colors cursor-pointer"
                    onClick={() => router.push("/")}
                  >
                    Create New Invitation 💌
                  </Button>
                </CardFooter>
              </Card>
            </div>
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

      {/* Hidden share card for canvas export */}
      {status === "completed" && responseData && (
        <ShareCard
          ref={shareCardRef}
          name={responseData.contact_username}
          contact={responseData.contact_username}
          date={responseData.selected_date}
          time={responseData.selected_time}
          restaurant={responseData.selected_restaurant}
          food={responseData.selected_food}
          personality={responseData.selected_archetype}
        />
      )}

      {/* Export loading */}
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
