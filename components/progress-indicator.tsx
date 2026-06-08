"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, UtensilsCrossed, Pizza, Sparkles, Eye, FileCheck } from "lucide-react"

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
  { icon: Eye, label: "Review" },
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
                animate={isActive ? {
                  scale: [1.1, 1.22, 1.1],
                  boxShadow: [
                    "0 0 0 0px rgba(255, 75, 130, 0.3)",
                    "0 0 0 8px rgba(255, 75, 130, 0)",
                    "0 0 0 0px rgba(255, 75, 130, 0.3)"
                  ],
                  backgroundColor: "oklch(0.94 0.035 340)",
                  color: "oklch(0.66 0.201 340)"
                } : {
                  scale: 1,
                  boxShadow: "0 0 0 0px rgba(0, 0, 0, 0)",
                  backgroundColor: isCompleted
                    ? "oklch(0.66 0.201 340)" // primary
                    : "rgba(255, 255, 255, 0.0)", // transparent/inactive
                  color: isCompleted
                    ? "#ffffff"
                    : "oklch(0.55 0.04 340)", // muted
                }}
                transition={isActive ? {
                  scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                } : { duration: 0.22 }}
                className={`size-7 rounded-full flex items-center justify-center border transition-colors ${
                  isCompleted 
                    ? "border-primary"
                    : isActive
                    ? "border-primary"
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
