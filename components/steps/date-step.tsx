"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DateStepProps {
  selectedValue: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

export function DateStep({ selectedValue, onChange, onNext, onBack }: DateStepProps) {
  // Calendar simulation for June 2026
  // June 1, 2026 is a Monday. June has 30 days.
  const daysInJune = 30
  const startDayOffset = 0 // Monday index starts at 0

  const weekdays = ["M", "T", "W", "T", "F", "S", "S"]
  
  const handleDateSelect = (dayNum: number) => {
    const formattedDate = `2026-06-${dayNum.toString().padStart(2, "0")}`
    onChange(formattedDate)
  }

  const getDayDisplayClass = (dayNum: number) => {
    const formattedDate = `2026-06-${dayNum.toString().padStart(2, "0")}`
    const isSelected = selectedValue === formattedDate
    
    // Friday/Saturday/Sunday highlight
    const dayOfWeek = (dayNum - 1 + startDayOffset) % 7
    const isWeekend = dayOfWeek >= 4 // Fri, Sat, Sun

    if (isSelected) {
      return "bg-primary text-white font-bold shadow-romantic-glow scale-110"
    }
    if (isWeekend) {
      return "bg-primary/5 text-primary hover:bg-primary/20 border border-primary/20"
    }
    return "bg-white/10 dark:bg-black/10 text-foreground hover:bg-foreground/5"
  }

  const getSelectedDayString = () => {
    if (!selectedValue) return "Select a date on the calendar"
    const day = parseInt(selectedValue.split("-")[2], 10)
    
    const dayOfWeekIdx = (day - 1 + startDayOffset) % 7
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    return `${days[dayOfWeekIdx]}, June ${day}, 2026 💖`
  }

  return (
    <div className="flex-1 flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col gap-3">
        <div className="text-center">
          <h2 className="text-lg font-black tracking-tight text-gradient-romantic">Pick a Date 🗓️</h2>
          <p className="text-xs text-muted-foreground">Select a day for our rendezvous.</p>
        </div>

        {/* Calendar Card */}
        <div className="p-4 rounded-2xl bg-white/20 dark:bg-black/20 border-glass shadow-sm flex flex-col gap-3.5">
          {/* Header */}
          <div className="flex justify-between items-center px-1">
            <span className="font-extrabold text-sm text-foreground">June 2026</span>
            <div className="flex gap-2">
              <button disabled className="opacity-30 size-6 flex items-center justify-center rounded-md border border-foreground/10"><ChevronLeft className="size-3" /></button>
              <button disabled className="opacity-30 size-6 flex items-center justify-center rounded-md border border-foreground/10"><ChevronRight className="size-3" /></button>
            </div>
          </div>

          {/* Weekday Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {weekdays.map((w, i) => (
              <span key={i} className="text-[10px] font-bold text-muted-foreground select-none">
                {w}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {Array.from({ length: daysInJune }).map((_, i) => {
              const dayNum = i + 1
              return (
                <button
                  key={i}
                  onClick={() => handleDateSelect(dayNum)}
                  className={`aspect-square text-xs rounded-xl flex items-center justify-center transition-all duration-300 ${getDayDisplayClass(
                    dayNum
                  )}`}
                >
                  {dayNum}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected date readout */}
        <div className="text-center py-2 min-h-[36px]">
          <p className="text-xs font-bold text-primary animate-pulse">
            {getSelectedDayString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        <Button variant="ghost" className="w-1/3 text-xs" onClick={onBack}>
          Cancel
        </Button>
        <Button 
          variant="romantic" 
          className="w-2/3" 
          disabled={!selectedValue} 
          onClick={onNext}
        >
          Next: Choose Time ⏰
        </Button>
      </div>
    </div>
  )
}
