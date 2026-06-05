"use client"

import { useState, useEffect } from "react"
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
  Calendar,
  Utensils,
  Smile,
  Send,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressIndicator } from "@/components/progress-indicator"

// Step Components
import { DateStep } from "@/components/steps/date-step"
import { TimeStep } from "@/components/steps/time-step"
import { RestaurantStep } from "@/components/steps/restaurant-step"
import { FoodStep } from "@/components/steps/food-step"
import { PersonalityStep } from "@/components/steps/personality-step"
import { SummaryStep } from "@/components/steps/summary-step"
import { submitProposal } from "@/app/actions"

const tooltips = [
  "nice try 😭",
  "bro give up",
  "not happening 😌",
  "try again 😜",
  "impossible 💅",
  "error 404: click YES",
  "database says no 💻",
  "nice hover speed 🏃‍♂️",
  "clown behavior 🤡",
  "no is disabled 🚫",
]

// Custom directional swiping variants for Framer Motion (speed optimized to reduce INP delay)
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
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number], // Snappy easeOut
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

// Pre-configured static arrays to prevent CPU thrashing/re-renders caused by inline Math.random()
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

export default function Home() {
  const [activeTab, setActiveTab] = useState<"match" | "uikit">("match")
  const [isDark, setIsDark] = useState(false)
  
  // Navigation flow state: 0 = proposal, 1 = date, 2 = time, 3 = spot, 4 = food, 5 = personality, 6 = summary, 7 = success
  const [flowStep, setFlowStep] = useState(0)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  
  // Proposal Game State
  const [noCount, setNoCount] = useState(0)
  const [noButtonPos, setNoButtonPos] = useState({ x: 60, y: 0 })
  
  // Form selections state (persistent across steps)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("")
  const [selectedFood, setSelectedFood] = useState<string>("")
  const [personalityResult, setPersonalityResult] = useState<string>("")
  
  // Contacts
  const [userName, setUserName] = useState("")
  const [contactHandle, setContactHandle] = useState("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleProposalSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError("")
    
    try {
      const result = await submitProposal({
        candidate_name: userName,
        contact_info: contactHandle,
        selected_date: selectedDate,
        selected_time: selectedTime,
        selected_restaurant: selectedRestaurant,
        selected_food: selectedFood,
        selected_archetype: personalityResult,
      })
      
      if (result.success) {
        navigateTo(7) // Go to success step!
      } else {
        setSubmitError(result.error || "Failed to submit proposal.")
      }
    } catch (err: any) {
      setSubmitError("Network connection error. Try again! 😭")
    } finally {
      setIsSubmitting(false)
    }
  }

  const [secondsElapsed, setSecondsElapsed] = useState(0)

  // Track page time
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getPlayfulTimeMessage = () => {
    if (secondsElapsed < 10) return "pretending i'm calm rn 😭"
    if (secondsElapsed < 25) return `you've been here for ${secondsElapsed} seconds already 😌`
    if (secondsElapsed < 40) return "lowkey hoping you pick June or Yakamoz 🌸"
    if (secondsElapsed < 55) return "still planning? i'm already picking an outfit 💅"
    if (secondsElapsed < 75) return `${secondsElapsed}s in... are we dating yet? 🥺`
    return "at this rate, our grandkids will plan faster 💀"
  }

  // Initialize theme
  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark")
    setIsDark(isDarkTheme)
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Escaping "No" button math (relative to container center)
  const handleNoHover = () => {
    const rangeX = 125 
    const rangeY = 110 
    
    let newX = (Math.random() - 0.5) * 2 * rangeX
    let newY = (Math.random() - 0.5) * 2 * rangeY
    
    if (Math.abs(newX - noButtonPos.x) < 35) {
      newX = newX < 0 ? newX - 35 : newX + 35
    }
    if (Math.abs(newY - noButtonPos.y) < 35) {
      newY = newY < 0 ? newY - 35 : newY + 35
    }
    
    setNoButtonPos({ x: newX, y: newY })
    setNoCount(prev => prev + 1)
  }

  const navigateTo = (nextStep: number) => {
    setDirection(nextStep > flowStep ? "forward" : "backward")
    setFlowStep(nextStep)
  }

  const resetAll = () => {
    setDirection("backward")
    setFlowStep(0)
    setNoCount(0)
    setNoButtonPos({ x: 60, y: 0 })
    setSelectedDate("")
    setSelectedTime("")
    setSelectedRestaurant("")
    setSelectedFood("")
    setPersonalityResult("")
    setUserName("")
    setContactHandle("")
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-romantic-mesh transition-colors duration-500">
      
      {/* Ambient background particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {bgParticles.map((particle, idx) => (
          <motion.div
            key={`bg-particle-${idx}`}
            className="absolute rounded-full bg-primary/10 dark:bg-primary/5 blur-2xl"
            style={{
              width: particle.width,
              height: particle.height,
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              y: [0, particle.yOffset, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Floating Heart icons */}
        {floatingHeartParticles.map((heart, idx) => (
          <motion.div
            key={`heart-${idx}`}
            className="absolute text-primary/15 dark:text-primary/10"
            style={{
              left: heart.left,
              top: `${80 - idx * 8}%`,
            }}
            animate={{
              y: [0, heart.yOffset, 0],
              x: [0, heart.xOffset, 0],
              scale: [0.8, 1.25, 0.8],
              rotate: [0, 20, -20, 0],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart size={heart.size} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Main Glass Mock-Phone Container */}
      <div className="relative z-10 w-full max-w-[420px] aspect-[9/19] max-h-[850px] min-h-[660px] flex flex-col bg-white/40 dark:bg-black/40 border border-white/40 dark:border-white/10 rounded-[2.5rem] shadow-romantic overflow-hidden backdrop-blur-2xl">
        
        {/* Phone Notch/Header */}
        <div className="flex justify-between items-center px-6 pt-5 pb-3 bg-white/10 dark:bg-black/10 backdrop-blur-md z-30 select-none">
          <div className="flex items-center gap-1.5">
            <Flame className="text-primary animate-pulse size-5 fill-primary" />
            <span className="font-bold tracking-tight text-sm text-gradient-romantic">DateSparks</span>
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
        <div className="flex-1 overflow-y-auto px-4 py-4 z-20 flex flex-col pb-20 scrollbar-none">
          
          {/* Playful Floating Thought Banner */}
          {activeTab === "match" && flowStep <= 6 && (
            <div className="text-center py-1.5 px-3 rounded-full bg-white/20 dark:bg-black/25 border border-white/20 dark:border-white/5 backdrop-blur-md mb-2 flex items-center justify-center gap-1.5 text-[10px] font-bold text-primary shadow-sm select-none">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
              <span>{getPlayfulTimeMessage()}</span>
            </div>
          )}
          
          {/* Progress bar displayed inside the flow container (Steps 1 to 6) */}
          {activeTab === "match" && flowStep >= 1 && flowStep <= 6 && (
            <ProgressIndicator currentStep={flowStep} totalSteps={6} />
          )}

          <div className="flex-1 flex flex-col mt-2">
            <AnimatePresence mode="wait" custom={direction}>
              {activeTab === "match" ? (
                <motion.div
                  key={`flow-step-${flowStep}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex-1 flex flex-col"
                >
                  
                  {/* STEP 0: PROPOSAL */}
                  {flowStep === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[440px]">
                      <Card variant="glass" className="w-full flex-1 flex flex-col justify-between py-6">
                        <CardHeader className="text-center pb-2">
                          <div className="mx-auto size-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 animate-heartbeat">
                            <Heart className="size-9 text-primary fill-primary" />
                          </div>
                          <CardTitle className="text-2xl font-black tracking-tight leading-snug">
                            Will you go on a date with me? ❤️
                          </CardTitle>
                          <CardDescription className="text-xs font-semibold dark:text-rose-300/60">
                            Answer carefully... 🤫
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                          <p className="text-sm font-medium text-foreground/80 leading-relaxed max-w-xs px-2">
                            I promise it will be filled with good food, premium laughs, and zero awkward silences.
                          </p>
                        </CardContent>

                        <CardFooter className="flex flex-col pt-4 border-t-0">
                          {/* Interactive escaping button wrapper */}
                          <div className="relative w-full h-[220px] flex items-center justify-center border-glass rounded-xl bg-black/5 dark:bg-white/5 overflow-hidden">
                            
                            {/* YES Button */}
                            <motion.div
                              style={{ x: -60, y: 0 }}
                              animate={{ scale: Math.min(1 + noCount * 0.15, 2.2) }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="absolute z-10"
                            >
                              <Button
                                variant="romantic"
                                size="lg"
                                className="shadow-romantic-glow font-bold pr-5 pl-5 select-none animate-heartbeat"
                                onClick={() => navigateTo(1)}
                              >
                                Yes 💖
                              </Button>
                            </motion.div>

                            {/* NO Button (escapes on approach) */}
                            <motion.div
                              animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                              transition={{ type: "spring", stiffness: 380, damping: 22 }}
                              onMouseEnter={handleNoHover}
                              onClick={handleNoHover}
                              className="absolute z-20 cursor-pointer"
                            >
                              <div className="relative group">
                                {/* Speech bubble tooltip */}
                                {noCount > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={noCount}
                                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black text-[10px] px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg font-bold z-30"
                                  >
                                    {tooltips[(noCount - 1) % tooltips.length]}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black dark:border-t-white" />
                                  </motion.div>
                                )}
                                
                                <Button
                                  variant="glass"
                                  className="border-rose-300 text-rose-600 dark:text-rose-300 font-semibold cursor-pointer"
                                >
                                  No 😒
                                </Button>
                              </div>
                            </motion.div>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  )}

                  {/* STEP 1: DATE PICKER */}
                  {flowStep === 1 && (
                    <DateStep
                      selectedValue={selectedDate}
                      onChange={setSelectedDate}
                      onNext={() => navigateTo(2)}
                      onBack={resetAll}
                    />
                  )}

                  {/* STEP 2: TIME SELECTION */}
                  {flowStep === 2 && (
                    <TimeStep
                      selectedValue={selectedTime}
                      onChange={setSelectedTime}
                      onNext={() => navigateTo(3)}
                      onBack={() => navigateTo(1)}
                    />
                  )}

                  {/* STEP 3: RESTAURANT SELECTION */}
                  {flowStep === 3 && (
                    <RestaurantStep
                      selectedValue={selectedRestaurant}
                      onChange={setSelectedRestaurant}
                      onNext={() => navigateTo(4)}
                      onBack={() => navigateTo(2)}
                    />
                  )}

                  {/* STEP 4: FOOD SELECTION */}
                  {flowStep === 4 && (
                    <FoodStep
                      selectedValue={selectedFood}
                      onChange={setSelectedFood}
                      onNext={() => navigateTo(5)}
                      onBack={() => navigateTo(3)}
                    />
                  )}

                  {/* STEP 5: PERSONALITY RESULT */}
                  {flowStep === 5 && (
                    <PersonalityStep
                      restaurant={selectedRestaurant}
                      food={selectedFood}
                      time={selectedTime}
                      onNext={(res) => {
                        setPersonalityResult(res)
                        navigateTo(6)
                      }}
                      onBack={() => navigateTo(4)}
                    />
                  )}

                  {/* STEP 6: FINAL SUMMARY */}
                  {flowStep === 6 && (
                    <SummaryStep
                      date={selectedDate}
                      time={selectedTime}
                      restaurant={selectedRestaurant}
                      food={selectedFood}
                      personality={personalityResult}
                      name={userName}
                      contact={contactHandle}
                      onNameChange={setUserName}
                      onContactChange={setContactHandle}
                      onSubmit={handleProposalSubmit}
                      onBack={() => navigateTo(5)}
                      isSubmitting={isSubmitting}
                      submitError={submitError}
                    />
                  )}

                  {/* STEP 7: SUCCESS CELEBRATION */}
                  {flowStep === 7 && (
                    <div className="w-full flex-1 flex flex-col justify-center min-h-[440px]">
                      <Card variant="glass" className="w-full flex-1 flex flex-col justify-between py-6 text-center border-primary/30 shadow-romantic-glow">
                        <CardHeader className="pb-0">
                          <div className="mx-auto size-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 relative">
                            <Heart className="size-10 text-primary fill-primary animate-ping absolute opacity-40" />
                            <Heart className="size-10 text-primary fill-primary z-10 animate-heartbeat" />
                          </div>
                          <CardTitle className="text-3xl font-black text-gradient-romantic tracking-wide animate-pulse">
                            IT'S BOOKED! 🎉
                          </CardTitle>
                          <CardDescription className="text-xs font-semibold text-primary/80 dark:text-rose-200/80 animate-pulse">
                            proposal locked in 💌
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="py-6 flex flex-col gap-3.5">
                          <p className="text-xs font-semibold leading-relaxed px-4 text-foreground/80">
                            Congratulations! Here is your locked Vibe Card:
                          </p>
                          
                          <div className="p-4 rounded-xl bg-white/20 dark:bg-black/20 border-glass text-xs text-left flex flex-col gap-2 max-w-xs mx-auto w-full">
                            <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                              <span className="text-muted-foreground">Candidate:</span>
                              <span className="font-bold">{userName}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                              <span className="text-muted-foreground">Timeline:</span>
                              <span className="font-bold">June {selectedDate.split("-")[2]}, 2026 🗓️</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                              <span className="text-muted-foreground">Time Slot:</span>
                              <span className="font-bold">{selectedTime}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                              <span className="text-muted-foreground">Venue:</span>
                              <span className="font-bold truncate max-w-[150px]">{selectedRestaurant}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-foreground/5 pb-1">
                              <span className="text-muted-foreground">Palate:</span>
                              <span className="font-bold truncate max-w-[150px]">{selectedFood}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Archetype:</span>
                              <span className="font-bold text-primary truncate max-w-[150px]">{personalityResult}</span>
                            </div>
                          </div>

                          <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 inline-flex items-center justify-center gap-1.5 max-w-xs mx-auto">
                            <Check className="size-3.5" /> Notification Proposal locked in!
                          </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-2">
                          <Button 
                            variant="romantic" 
                            className="w-full gap-2 font-bold"
                            onClick={() => alert(`Sharing link with Instagram tag: ${contactHandle}`)}
                          >
                            Share Vibe Card 📱
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="w-full text-xs font-bold text-muted-foreground hover:text-primary gap-1"
                            onClick={resetAll}
                          >
                            <RefreshCw className="size-3" /> Restart Plan
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
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
                  className="flex flex-col gap-6 py-2"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-gradient-romantic">Romantic UI Kit</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Premium mobile-first aesthetic design tokens.
                    </p>
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

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Outline</span>
                          <Button variant="outline" className="w-full">Outline</Button>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Ghost</span>
                          <Button variant="ghost" className="w-full">Ghost</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Animation Utilities */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary/70 flex items-center gap-1">
                      <Sparkles className="size-3.5" /> Animation Utilities
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="p-3 bg-white/20 dark:bg-black/20 border-glass rounded-xl text-center flex flex-col items-center justify-center">
                        <Heart className="size-6 text-primary fill-primary animate-heartbeat" />
                        <span className="text-[9px] font-semibold mt-1">Heartbeat</span>
                      </div>

                      <div className="p-3 bg-white/20 dark:bg-black/20 border-glass rounded-xl text-center flex flex-col items-center justify-center animate-float-medium">
                        <Sparkles className="size-6 text-amber-500 fill-amber-500" />
                        <span className="text-[9px] font-semibold mt-1">Floating</span>
                      </div>

                      <div className="p-3 bg-white/20 dark:bg-black/20 border-glass rounded-xl text-center flex flex-col items-center justify-center">
                        <Flame className="size-6 text-rose-500 fill-rose-500 animate-sparkle" />
                        <span className="text-[9px] font-semibold mt-1">Sparkling</span>
                      </div>
                    </div>
                  </div>

                  {/* Specs Card */}
                  <Card variant="glass" className="bg-primary/5 border-primary/20">
                    <CardHeader className="py-2">
                      <CardTitle className="text-xs font-bold text-primary">System Specs</CardTitle>
                    </CardHeader>
                    <CardContent className="text-[11px] leading-relaxed text-foreground/80">
                      - <strong>Framework</strong>: Next.js 16 (React 19)<br />
                      - <strong>Styling</strong>: Tailwind CSS v4 inline themes<br />
                      - <strong>Animations</strong>: Framer Motion + custom CSS keyframes<br />
                      - <strong>Base</strong>: @base-ui/react primitives
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Tab Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/20 dark:bg-black/20 border-t border-white/20 dark:border-white/5 backdrop-blur-xl flex items-center justify-around px-6 z-30 select-none">
          <button
            onClick={() => setActiveTab("match")}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === "match" ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HeartHandshake className="size-5" />
            <span className="text-[9px] font-bold">Match POC</span>
          </button>

          <button
            onClick={() => setActiveTab("uikit")}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === "uikit" ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-5" />
            <span className="text-[9px] font-bold">UI System</span>
          </button>
        </div>
      </div>
    </div>
  )
}
