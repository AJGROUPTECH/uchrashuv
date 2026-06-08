"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Pizza, Sparkles, MessageCircle, RefreshCw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface SummaryStepProps {
  date: string
  time: string
  restaurant: string
  food: string
  personality: string
  onNext: () => void
  onBack: () => void
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
  onNext,
  onBack,
}: SummaryStepProps) {
  const [starterIdx, setStarterIdx] = useState(0)
  const [selectedReward, setSelectedReward] = useState("")

  useEffect(() => {
    // Select a random starter on load
    setStarterIdx(Math.floor(Math.random() * conversationStarters.length))

    // Select a random reward on load with a dynamic percentage between 80% and 99%
    const percentage = Math.floor(Math.random() * (99 - 80 + 1)) + 80
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
  }, [])

  const rotateStarter = () => {
    setStarterIdx((prev) => (prev + 1) % conversationStarters.length)
  }

  const getReadableDate = (rawDate: string) => {
    if (!rawDate) return ""
    const day = parseInt(rawDate.split("-")[2], 10)
    return `June ${day}, 2026 🗓️`
  }

  return (
    <div className="flex-1 flex flex-col justify-between h-full gap-4 select-none">
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-0.5 scrollbar-none">
        <div className="text-center">
          <h2 className="text-lg font-black tracking-tight text-gradient-romantic">Review Your Vibe ✨</h2>
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
              className="flex items-center gap-0.5 hover:text-primary/70 transition-colors cursor-pointer"
            >
              <RefreshCw className="size-2.5" /> Next
            </button>
          </div>
          <p className="text-[11px] font-semibold text-foreground/80 leading-normal italic pr-4">
            "{conversationStarters[starterIdx]}"
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto pt-2">
        <Button 
          variant="ghost" 
          className="w-1/3 text-xs cursor-pointer" 
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          variant="romantic" 
          className="w-2/3 gap-2 cursor-pointer"
          onClick={onNext}
        >
          Continue 😌 <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
