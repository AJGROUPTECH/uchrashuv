"use client"

import { useState, useEffect } from "react"
import { Sparkles, Heart, Flame, Award, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

interface PersonalityStepProps {
  restaurant: string
  food: string
  time: string
  onNext: (personalityName: string) => void
  onBack: () => void
}

interface Archetype {
  title: string
  subtitle: string
  desc: string
  compatibility: string
  greenFlags: string[]
  redFlags: string[]
  stats: { label: string; val: number }[]
}

const statusMessages = [
  "Checking compatibility index... 🔍",
  "Calculating food sharing probability... 🍕",
  "Analyzing if they will text back... 🧐",
  "Pretending I'm calm right now... 😭",
  "Running heart rate simulation... 💓",
  "Scanning for red flags (none found yet)... 🟢",
  "Deduplicating green flags... ✅",
  "Analyzing date palate compatibility... 🍽️",
]

const archetypes: Record<string, Archetype> = {
  gamer: {
    title: "Arcade Gamer Soulmate 👾",
    subtitle: "High-score romantic who values fun matches",
    desc: "You thrive on playful competition and shared laughs! A ramen-eating arcade battle at late night is your absolute definition of peak romance. You express affection through friendly gaming rivalry.",
    compatibility: "99.8% Vibe Match",
    greenFlags: [
      "Can hold their own in Mario Kart 🏎️",
      "Doesn't mind messy ramen slurping 🥢",
      "Saves the last slice of pizza for you",
    ],
    redFlags: [
      "Might steal your controller 🎮",
      "Takes competitive gaming too seriously 💀",
    ],
    stats: [
      { label: "Playfulness", val: 98 },
      { label: "Cozy Rating", val: 72 },
      { label: "Sophistication", val: 65 },
    ],
  },
  classic: {
    title: "Fine Dining Romanticist 🌹",
    subtitle: "Traditional sweetheart who loves candlelight",
    desc: "You appreciate deep table conversations, slow moments, and traditional courtship. Garden patios, candlelight, and red wine make your heart flutter. You express affection through active listening.",
    compatibility: "98.5% Vibe Match",
    greenFlags: [
      "Uses cloth napkins properly 🍷",
      "Makes intense, romantic eye contact 🌹",
      "Walks on the street-side of the sidewalk",
    ],
    redFlags: [
      "Speaks mock French with a terrible accent 🥖",
      "Asks to split the check using exact math 📱",
    ],
    stats: [
      { label: "Playfulness", val: 68 },
      { label: "Cozy Rating", val: 92 },
      { label: "Sophistication", val: 89 },
    ],
  },
  dreamer: {
    title: "Skyline Aesthetician 🌌",
    subtitle: "Elevated dreamer with high standards",
    desc: "You enjoy panoramic skyscraper views, jazz, and sophisticated tapas. Sunset golden hour or rooftop late nights are your default vibes. You love curated details and aesthetic visual memories.",
    compatibility: "97.9% Vibe Match",
    greenFlags: [
      "Knows how to dress to impress 👔",
      "Has excellent photogenic camera angles 📸",
      "Appreciates ambient rooftop playlists",
    ],
    redFlags: [
      "Spends 15 minutes taking photos of the view 🌆",
      "Critiques the wine menu choices pretentiously",
    ],
    stats: [
      { label: "Playfulness", val: 74 },
      { label: "Cozy Rating", val: 78 },
      { label: "Sophistication", val: 96 },
    ],
  },
  botanist: {
    title: "Cozy Plant-Parent Sweetheart 🌿",
    subtitle: "Nature lover with a sweet tooth",
    desc: "You enjoy botanical glasshouses, warm bakeries, afternoon walks, and delicious chocolate desserts. You show love by sharing sweet treats, watering flowers, and recommending cozy book/music spaces.",
    compatibility: "99.2% Vibe Match",
    greenFlags: [
      "Appreciates quiet matcha aesthetics 🍵",
      "Actually knows the botanical names of plants 🌿",
      "Always orders dessert first",
    ],
    redFlags: [
      "Will probably talk to the cafe succulents 🌵",
      "Gets overly emotional in plant nurseries",
    ],
    stats: [
      { label: "Playfulness", val: 82 },
      { label: "Cozy Rating", val: 98 },
      { label: "Sophistication", val: 74 },
    ],
  },
}

function Typewriter({ text, speed = 25 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    let index = 0
    setDisplayedText("")
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index))
      index++
      if (index >= text.length) {
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return <span>{displayedText}</span>
}

export function PersonalityStep({ restaurant, food, time, onNext, onBack }: PersonalityStepProps) {
  const [archetype, setArchetype] = useState<Archetype>(archetypes.classic)
  const [loading, setLoading] = useState(true)
  const [statusIdx, setStatusIdx] = useState(0)

  // Calculate dating archetype
  useEffect(() => {
    let selectedType = "classic"
    if (restaurant.includes("Tokyo")) {
      selectedType = "gamer"
    } else if (restaurant.includes("Panorama")) {
      selectedType = "dreamer"
    } else if (restaurant.includes("Greenhouse") || restaurant.includes("JUNE")) {
      selectedType = "botanist"
    } else {
      if (food.includes("Pizza") || time.includes("9:00")) {
        selectedType = "gamer"
      } else if (food.includes("Cake") || food.includes("Matcha")) {
        selectedType = "botanist"
      }
    }
    setArchetype(archetypes[selectedType])
  }, [restaurant, food, time])

  // Cycle status messages
  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % statusMessages.length)
    }, 1100)

    const timer = setTimeout(() => {
      setLoading(false)
    }, 3600)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [loading])

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[380px] gap-5 px-4">
        {/* Fake AI Analyzer Screen */}
        <div className="relative size-20 flex items-center justify-center">
          {/* Animated radar rings */}
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border-2 border-primary/30"
          />
          <motion.div
            animate={{ scale: [1.2, 2.2, 1.2], opacity: [0.4, 0, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-primary/20"
          />
          <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center z-10 shadow-romantic">
            <Heart className="size-6 text-primary fill-primary animate-pulse" />
          </div>
        </div>

        <div className="text-center w-full max-w-xs">
          <div className="p-3.5 rounded-2xl bg-white/30 dark:bg-black/30 border-glass shadow-sm flex flex-col gap-1">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary block">AI Love Analyzer</span>
            <div className="font-bold text-xs text-foreground min-h-[32px] flex items-center justify-center text-center">
              <Typewriter text={statusMessages[statusIdx]} />
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground mt-3 italic">
            "pretending i'm calm rn 😭"
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-0.5 scrollbar-thin">
        <div className="text-center">
          <h2 className="text-lg font-black tracking-tight text-gradient-romantic">Your Date Personality</h2>
          <p className="text-xs text-muted-foreground">Calculated compatibility analysis.</p>
        </div>

        {/* Archetype Card */}
        <Card variant="glass" className="w-full py-5 px-4 text-center border-primary/25 relative overflow-hidden bg-primary/[0.02]">
          <div className="absolute top-2.5 right-2.5 text-primary/40">
            <Award className="size-4.5" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/15 px-2.5 py-1 rounded-full inline-block mb-1">
            {archetype.compatibility}
          </span>

          <h3 className="font-extrabold text-base text-gradient-romantic leading-snug mt-1.5">
            {archetype.title}
          </h3>
          <p className="text-[9px] font-semibold text-muted-foreground italic mt-0.5">
            {archetype.subtitle}
          </p>

          <p className="text-xs text-foreground/80 leading-normal mt-3 max-w-xs mx-auto">
            {archetype.desc}
          </p>

          {/* Green Flags vs Red Flags Vibe Match */}
          <div className="grid grid-cols-2 gap-3.5 text-left mt-4 border-t border-foreground/5 pt-4">
            {/* Green Flags */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="size-3.5" /> Green Flags
              </span>
              <ul className="flex flex-col gap-1">
                {archetype.greenFlags.map((flag, i) => (
                  <li key={i} className="text-[9.5px] leading-tight text-foreground/85 flex items-start gap-1">
                    <span className="text-emerald-500 select-none">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flags */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="size-3.5 text-rose-500" /> Red Flags
              </span>
              <ul className="flex flex-col gap-1">
                {archetype.redFlags.map((flag, i) => (
                  <li key={i} className="text-[9.5px] leading-tight text-foreground/85 flex items-start gap-1">
                    <span className="text-rose-400 select-none">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats Bar Indicators */}
          <div className="flex flex-col gap-2 mt-4 border-t border-foreground/5 pt-3 w-full">
            {archetype.stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-1 text-left">
                <div className="flex justify-between text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                  <span>{stat.label}</span>
                  <span className="text-primary font-black">{stat.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-foreground/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.val}%` }}
                    transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
                    className="h-full bg-primary/75 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto pt-2">
        <Button variant="ghost" className="w-1/3 text-xs" onClick={onBack}>
          Back
        </Button>
        <Button 
          variant="romantic" 
          className="w-2/3" 
          onClick={() => onNext(archetype.title)}
        >
          View Summary 📋
        </Button>
      </div>
    </div>
  )
}
