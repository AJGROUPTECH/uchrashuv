"use client"

import { useState } from "react"
import { Send, Heart, AlertCircle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { playHoverPop } from "@/lib/audio"

interface ContactStepProps {
  selectedValue: string
  onChange: (value: string) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting?: boolean
  submitError?: string
}

export function ContactStep({
  selectedValue,
  onChange,
  onSubmit,
  onBack,
  isSubmitting = false,
  submitError = "",
}: ContactStepProps) {
  const [validationError, setValidationError] = useState("")
  const [isShaking, setIsShaking] = useState(false)

  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  const validateUsername = (username: string): boolean => {
    const trimmed = username.trim()
    if (!trimmed) {
      setValidationError("Please enter your Instagram or Telegram username! 🥺")
      return false
    }

    // Automatically prepend @ if user forgot it
    let normalized = trimmed
    if (!normalized.startsWith("@")) {
      normalized = "@" + normalized
    }

    // Telegram and Instagram username rules: Alphanumeric and underscores, 3 to 30 chars
    // Allows @ at the start, followed by alphanumeric/underscores
    const usernameRegex = /^@[a-zA-Z0-9_]{3,30}$/

    if (!usernameRegex.test(normalized)) {
      setValidationError("Please enter a valid username (letters, numbers, underscores only, e.g. @komol) 👀")
      return false
    }

    // Guard against spammy inputs containing repeats of non-alphanumeric or too simple
    // (e.g. check if the part after @ has actual letters/numbers)
    const handlePart = normalized.slice(1)
    if (/^_+$/.test(handlePart)) {
      setValidationError("Username cannot contain only underscores! 🤫")
      return false
    }

    setValidationError("")
    onChange(normalized) // Save normalized version back to state
    return true
  }

  const handleSubmit = () => {
    if (isSubmitting) return

    // If the input starts with something, let's normalize and validate it
    const trimmedVal = selectedValue.trim()
    
    // Automatically add @ on submit if it is missing
    let finalVal = trimmedVal
    if (trimmedVal && !trimmedVal.startsWith("@")) {
      finalVal = "@" + trimmedVal
    }

    if (validateUsername(finalVal)) {
      onSubmit()
    } else {
      triggerShake()
    }
  }

  const activeError = validationError || submitError

  return (
    <div className="flex-1 flex flex-col justify-between h-full gap-4 select-none">
      <div className="flex flex-col gap-5 mt-4">
        {/* Step Header */}
        <div className="text-center flex flex-col gap-2">
          <div className="mx-auto size-14 bg-primary/10 rounded-full flex items-center justify-center mb-1 animate-heartbeat">
            <Heart className="size-7 text-primary fill-primary" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-gradient-romantic">
            💌 Who unlocked this vibe?
          </h2>
          <div className="text-xs text-muted-foreground leading-relaxed px-2">
            Leave your Instagram or Telegram username.
            <br />
            Otherwise this date remains a mystery 😭
          </div>
        </div>

        {/* Input & Helper Area */}
        <div className={`flex flex-col gap-4 transition-transform duration-100 ${isShaking ? "animate-shake" : ""}`}>
          <div className="flex flex-col gap-2.5">
            <label className="text-[10.5px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 px-0.5">
              Instagram or Telegram 👀
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="@instagram or @telegram"
                value={selectedValue}
                disabled={isSubmitting}
                onChange={(e) => {
                  onChange(e.target.value)
                  if (validationError) setValidationError("")
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit()
                  }
                }}
                className="w-full text-sm p-4 rounded-2xl bg-white/10 dark:bg-black/25 border border-foreground/10 outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 font-medium tracking-wide shadow-inner focus:shadow-romantic-glow"
              />
            </div>
            
            {/* Examples list helper */}
            <div className="flex flex-wrap gap-1.5 items-center mt-1 text-[10px] text-muted-foreground font-bold px-1">
              <span className="text-primary/70">Examples:</span>
              <button
                type="button"
                onClick={() => {
                  onChange("@molli")
                  setValidationError("")
                }}
                className="px-2 py-0.5 rounded-full bg-foreground/5 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                @molli
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("@komol")
                  setValidationError("")
                }}
                className="px-2 py-0.5 rounded-full bg-foreground/5 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                @komol
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("@javlonbek")
                  setValidationError("")
                }}
                className="px-2 py-0.5 rounded-full bg-foreground/5 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                @javlonbek
              </button>
            </div>
          </div>

          {activeError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[10.5px] font-bold flex items-start gap-2"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{activeError}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-auto pt-6">
        <Button 
          variant="romantic" 
          size="lg"
          className="w-full py-6 rounded-2xl text-sm font-black tracking-wider uppercase gap-2 shadow-romantic-glow hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          disabled={!selectedValue.trim() || isSubmitting}
          onClick={handleSubmit}
          onMouseEnter={playHoverPop}
        >
          {isSubmitting ? (
            <>
              Locking in... <Heart className="size-4 fill-white animate-heartbeat" />
            </>
          ) : (
            <>
              💌 Lock My Vibe
            </>
          )}
        </Button>

        <Button 
          variant="ghost" 
          className="w-full text-xs font-bold text-muted-foreground hover:text-foreground py-2 cursor-pointer transition-colors" 
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back to Review
        </Button>
      </div>
    </div>
  )
}
