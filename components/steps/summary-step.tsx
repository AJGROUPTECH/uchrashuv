"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Pizza, Sparkles, Send, User, Share2, MessageCircle, RefreshCw, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"


interface SummaryStepProps {
  date: string
  time: string
  restaurant: string
  food: string
  personality: string
  name: string
  contact: string
  onNameChange: (val: string) => void
  onContactChange: (val: string) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting?: boolean
  submitError?: string
}

const conversationStarters = [
  "Are we holding hands on the first date or are you shy? 🤭",
  "If we play arcade, I'm not letting you win. Prepare to lose! 👾",
  "Who pays: rock-paper-scissors, or whoever eats more? 🍕",
  "Should I dress casual-cozy or 'wow-you're-overdressed' style? 💅",
  "If our date was a TikTok, what audio would be playing? 🎵",
]

export function SummaryStep({
  date,
  time,
  restaurant,
  food,
  personality,
  name,
  contact,
  onNameChange,
  onContactChange,
  onSubmit,
  onBack,
  isSubmitting = false,
  submitError = "",
}: SummaryStepProps) {
  const [validationError, setValidationError] = useState("")
  const [starterIdx, setStarterIdx] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0)
  const [selectedReward, setSelectedReward] = useState("")

  useEffect(() => {
    // Select a random starter on load
    setStarterIdx(Math.floor(Math.random() * conversationStarters.length))

    // Select a random reward on load (Feature 2)
    const percentage = Math.floor(Math.random() * (99 - 80 + 1)) + 80 // Dynamic 80 to 99
    const rewards = [
      `🌹 Romanticist Score: ${percentage}%`,
      `☕ Green Flag Energy: ${percentage}%`,
      `✨ Date Potential: ${percentage}%`,
      `💌 Chemistry Prediction: ${percentage}%`,
      `🎭 Main Character Rating: ${percentage}%`,
      `🌙 Late Night Conversation Chance: ${percentage}%`,
    ]
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)]
    setSelectedReward(randomReward)

    const checkCooldown = () => {
      const lastSubmitStr = localStorage.getItem("date-sparks-last-submit")
      if (lastSubmitStr) {
        const lastSubmit = parseInt(lastSubmitStr, 10)
        const elapsed = Date.now() - lastSubmit
        const cooldownMs = 5 * 60 * 1000 // 5 minutes
        if (elapsed < cooldownMs) {
          setCooldownRemaining(Math.ceil((cooldownMs - elapsed) / 1000))
        } else {
          setCooldownRemaining(0)
        }
      }
    }

    checkCooldown()
    const timer = setInterval(checkCooldown, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCooldownTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const rotateStarter = () => {
    if (isSubmitting) return
    setStarterIdx((prev) => (prev + 1) % conversationStarters.length)
  }

  const getReadableDate = (rawDate: string) => {
    if (!rawDate) return ""
    const day = parseInt(rawDate.split("-")[2], 10)
    return `June ${day}, 2026 🗓️`
  }

  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  const handleSubmit = () => {
    if (isSubmitting) return
    if (!name.trim()) {
      setValidationError("Please enter your name!")
      triggerShake()
      return
    }
    if (!contact.trim()) {
      setValidationError("Please enter your Instagram or Telegram username!")
      triggerShake()
      return
    }
    setValidationError("")
    onSubmit()
  }

  const activeError = validationError || submitError

  return (
    <div className="flex-1 flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-0.5 scrollbar-none">
        <div className="text-center">
          <h2 className="text-lg font-black tracking-tight text-gradient-romantic">Lock It In! 🔒💖</h2>
          <p className="text-xs text-muted-foreground">"almost official. lock it in! 🔐"</p>
        </div>

        {/* Plan Recaps */}
        <div className="p-3.5 rounded-2xl bg-white/20 dark:bg-black/20 border-glass shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-foreground/5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" /> Date
            </span>
            <span className="font-extrabold text-foreground">{getReadableDate(date)}</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-foreground/5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" /> Time
            </span>
            <span className="font-extrabold text-foreground">{time}</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-foreground/5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" /> Spot
            </span>
            <span className="font-extrabold text-foreground truncate max-w-[200px] text-right">{restaurant}</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-foreground/5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Pizza className="size-3.5 text-primary" /> Food
            </span>
            <span className="font-extrabold text-foreground truncate max-w-[200px] text-right">{food}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary animate-pulse" /> Archetype
            </span>
            <span className="font-extrabold text-primary truncate max-w-[200px] text-right">{personality}</span>
          </div>
        </div>

        {/* Bonus Unlocked Card (Feature 2) */}
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.05 }}
            className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-primary/15 via-[#ff709b]/10 to-amber-500/10 border border-white/25 dark:border-white/10 shadow-romantic-glow flex flex-col items-center text-center gap-2 select-none"
          >
            {/* Pulsing Soft Glow Background Element */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-primary/10 to-amber-400/10 rounded-full blur-2xl opacity-75 pointer-events-none" />
            
            <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5 z-10">
              🎁 Bonus Unlocked
            </span>
            <h3 className="text-sm font-black text-gradient-romantic tracking-tight py-1 select-none z-10">
              {selectedReward}
            </h3>
            <p className="text-[9.5px] font-bold text-foreground/80 dark:text-rose-100/70 leading-normal z-10">
              You're one step away from unlocking the full vibe 😌
            </p>
          </motion.div>
        )}

        {/* Playful Conversation Starters Section */}
        <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-1.5 relative">
          <div className="flex justify-between items-center w-full text-[9px] font-extrabold uppercase tracking-wider text-primary">
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3 text-primary fill-primary/10" /> Flirtatious Starters
            </span>
            <button 
              onClick={rotateStarter}
              disabled={isSubmitting}
              className="flex items-center gap-0.5 hover:text-primary/70 transition-colors cursor-pointer disabled:opacity-30"
            >
              <RefreshCw className="size-2.5" /> Next
            </button>
          </div>
          <p className="text-[11px] font-semibold text-foreground/80 leading-normal italic pr-4">
            "{conversationStarters[starterIdx]}"
          </p>
        </div>

        {/* Inputs */}
        <div className={`flex flex-col gap-3 transition-transform duration-100 ${isShaking ? "animate-shake" : ""}`}>
          {/* User Name input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <User className="size-3" /> Candidate Name
            </label>
            <input
              type="text"
              placeholder="Cutie McCute 💖"
              value={name}
              disabled={isSubmitting}
              onChange={(e) => {
                onNameChange(e.target.value)
                if (validationError) setValidationError("")
              }}
              className="w-full text-xs p-3 rounded-xl bg-white/10 dark:bg-black/10 border border-foreground/10 outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
            />
          </div>

          {/* User Contact handle */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Share2 className="size-3" /> Contact Details
            </label>
            <input
              type="text"
              placeholder="@instagram or @telegram"
              value={contact}
              disabled={isSubmitting}
              onChange={(e) => {
                onContactChange(e.target.value)
                if (validationError) setValidationError("")
              }}
              className="w-full text-xs p-3 rounded-xl bg-white/10 dark:bg-black/10 border border-foreground/10 outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
            />
            <p className="text-[9.5px] text-muted-foreground font-semibold leading-normal mt-0.5 px-0.5">
              Leave your Instagram or Telegram username so I know who unlocked this vibe 😌
            </p>
          </div>
        </div>

        <AnimatePresence>
          {cooldownRemaining > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="mt-2 p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 dark:border-amber-500/10 text-center flex flex-col items-center justify-center gap-1.5 shadow-sm select-none"
            >
              <p className="text-[11px] font-black tracking-wide text-amber-500 dark:text-amber-400 whitespace-pre-line leading-normal">
                too many vibes too fast 😭
                try again in a few minutes
              </p>
              <div className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                </span>
                cooldown: {formatCooldownTime(cooldownRemaining)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeError && (
          <p className="text-[10px] font-bold text-destructive text-center mt-1 animate-shake">
            ⚠️ {activeError}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto pt-2">
        <Button 
          variant="ghost" 
          className="w-1/3 text-xs" 
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          variant="romantic" 
          className="w-2/3 gap-2"
          disabled={!name.trim() || !contact.trim() || isSubmitting || cooldownRemaining > 0}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              Locking in... <Heart className="size-3.5 fill-white animate-heartbeat" />
            </>
          ) : (
            <>
              Send Proposal <Send className="size-3.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
