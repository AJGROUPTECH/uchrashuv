"use client"

import { Clock, Sun, Sunset, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TimeStepProps {
  selectedValue: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

const timeSlots = [
  {
    id: "brunch",
    time: "10:30 AM",
    label: "Morning Coffee & Brunch ☕",
    desc: "Cozy café, pastries, fresh morning light",
    icon: Sun,
    colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "afternoon",
    time: "2:00 PM",
    label: "Afternoon Walk & Gallery 🖼️",
    desc: "Exploring sights, bubble tea, art museum strolls",
    icon: Sun,
    colorClass: "text-sky-500 bg-sky-500/10 border-sky-500/20",
  },
  {
    id: "goldenhour",
    time: "6:30 PM",
    label: "Golden Hour Dinner & Sunset 🌅",
    desc: "Premium lighting, sunset views, Italian dinner",
    icon: Sunset,
    colorClass: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  },
  {
    id: "latenight",
    time: "9:00 PM",
    label: "Cocktails & Arcade Battle 👾",
    desc: "Glowing neon lights, mocktails, gaming competition",
    icon: Moon,
    colorClass: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  },
]

export function TimeStep({ selectedValue, onChange, onNext, onBack }: TimeStepProps) {
  return (
    <div className="flex-1 flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col gap-3">
        <div className="text-center">
          <h2 className="text-lg font-black tracking-tight text-gradient-romantic">Pick a Time ⏰</h2>
          <p className="text-xs text-muted-foreground">Select a time slot that matches your vibe.</p>
        </div>

        {/* Time Cards */}
        <div className="flex flex-col gap-3">
          {timeSlots.map((slot) => {
            const Icon = slot.icon
            const isSelected = selectedValue === slot.time

            return (
              <button
                key={slot.id}
                onClick={() => onChange(slot.time)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-romantic"
                    : "bg-white/20 dark:bg-black/10 border-foreground/5 hover:border-primary/40"
                }`}
              >
                {/* Icon wrapper */}
                <div className={`p-2.5 rounded-xl border shrink-0 ${slot.colorClass}`}>
                  <Icon className="size-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-sm text-foreground">{slot.time}</span>
                    {isSelected && <span className="text-[10px] font-extrabold text-primary uppercase tracking-wide">Selected</span>}
                  </div>
                  <span className="font-bold text-xs text-primary/95 mt-0.5 block truncate">{slot.label}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block leading-normal">{slot.desc}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        <Button variant="ghost" className="w-1/3 text-xs" onClick={onBack}>
          Back
        </Button>
        <Button 
          variant="romantic" 
          className="w-2/3" 
          disabled={!selectedValue} 
          onClick={onNext}
        >
          Next: Choose Place 📍
        </Button>
      </div>
    </div>
  )
}
