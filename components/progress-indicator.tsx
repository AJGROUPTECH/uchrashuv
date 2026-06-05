"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, UtensilsCrossed, Pizza, Sparkles, FileCheck } from "lucide-react"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

const stepIcons = [
  { icon: Calendar, label: "Date" },
  { icon: Clock, label: "Time" },
  { icon: UtensilsCrossed, label: "Place" },
  { icon: Pizza, label: "Food" },
  { icon: Sparkles, label: "Vibe" },
  { icon: FileCheck, label: "Lock" },
]

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  // Calculate percentage progress
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full flex flex-col gap-3 py-3 px-1 select-none">
      {/* Mini Top Summary */}
      <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
        <span>Plan Phase</span>
        <span className="text-primary">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-1.5 w-full bg-foreground/5 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute h-full bg-gradient-to-r from-primary to-[oklch(0.72_0.18_350)] shadow-romantic-glow rounded-full"
        />
      </div>

      {/* Tiny Icons Progress dots */}
      <div className="flex justify-between items-center w-full px-0.5">
        {stepIcons.map((step, idx) => {
          const Icon = step.icon
          const stepNumber = idx + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isCompleted
                    ? "oklch(0.66 0.201 340)" // primary
                    : isActive
                    ? "oklch(0.94 0.035 340)" // secondary
                    : "rgba(255, 255, 255, 0.0)", // transparent/inactive
                  color: isCompleted
                    ? "#ffffff"
                    : isActive
                    ? "oklch(0.66 0.201 340)"
                    : "oklch(0.55 0.04 340)", // muted
                }}
                className={`size-7 rounded-full flex items-center justify-center border transition-colors ${
                  isCompleted 
                    ? "border-primary"
                    : isActive
                    ? "border-primary/40 shadow-sm"
                    : "border-foreground/10"
                }`}
              >
                <Icon className="size-3.5" />
              </motion.div>
              <span 
                className={`text-[8px] font-bold tracking-tight ${
                  isActive ? "text-primary font-black" : "text-muted-foreground/80"
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
