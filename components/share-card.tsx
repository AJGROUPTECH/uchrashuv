"use client"

import React from "react"
import { Heart, Sparkles, Calendar, Clock, MapPin, Pizza, Award, Flame } from "lucide-react"

interface ShareCardProps {
  name: string
  contact: string
  date: string
  time: string
  restaurant: string
  food: string
  personality: string
}

export const ShareCard = React.forwardRef<HTMLDivElement, ShareCardProps>(
  ({ name, contact, date, time, restaurant, food, personality }, ref) => {
    
    const getReadableDate = (rawDate: string) => {
      if (!rawDate) return "Friday, June 12"
      const parts = rawDate.split("-")
      const day = parseInt(parts[2], 10)
      
      // Simple day of week calculation for June 2026 (June 1 is Monday)
      const dayOfWeekIdx = (day - 1) % 7
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      return `${days[dayOfWeekIdx]}, June ${day}`
    }

    return (
      <div
        ref={ref}
        style={{
          width: "440px",
          height: "780px",
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
        }}
        className="bg-romantic-mesh flex flex-col justify-between p-8 font-sans overflow-hidden select-none border border-white/20 relative"
      >
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 size-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 size-64 bg-amber-300/10 rounded-full blur-3xl" />

        {/* Decorative Floating Hearts */}
        <div className="absolute top-[8%] left-[10%] text-primary/30 animate-float-slow"><Heart size={20} fill="currentColor" /></div>
        <div className="absolute top-[15%] right-[12%] text-primary/20 animate-float-medium"><Heart size={16} fill="currentColor" /></div>
        <div className="absolute bottom-[20%] left-[8%] text-primary/25 animate-float-fast"><Heart size={24} fill="currentColor" /></div>
        <div className="absolute bottom-[35%] right-[10%] text-primary/15 animate-float-slow"><Heart size={18} fill="currentColor" /></div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center mt-4 z-10">
          <div className="size-12 bg-primary/15 rounded-full flex items-center justify-center mb-2.5 shadow-sm border border-primary/20 animate-heartbeat">
            <Heart className="size-6 text-primary fill-primary" />
          </div>
          <h1 className="text-xl font-black tracking-widest text-gradient-romantic">DateSparks Vibe Card</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Our locked proposal spark</p>
        </div>

        {/* Core Info Box */}
        <div className="flex-1 flex flex-col justify-center gap-6 z-10 my-4">
          
          {/* Main Glass Vibe Card */}
          <div className="p-5 rounded-3xl bg-white/45 dark:bg-black/45 border-glass shadow-romantic flex flex-col gap-4">
            
            {/* Candidate Sub-card */}
            <div className="text-center pb-2 border-b border-foreground/5">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-0.5">Proposed Candidate</span>
              <h2 className="text-lg font-black text-foreground truncate">{name || "Cutie McCute"}</h2>
              <span className="text-[9px] font-semibold text-muted-foreground block">{contact || "@handles"}</span>
            </div>

            {/* Selection list */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/15 text-primary shrink-0">
                  <Calendar className="size-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground block">Timeline</span>
                  <span className="text-xs font-bold text-foreground block">{getReadableDate(date)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/15 text-primary shrink-0">
                  <Clock className="size-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground block">Time Slot</span>
                  <span className="text-xs font-bold text-foreground block">{time || "Golden Hour Dinner"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/15 text-primary shrink-0">
                  <MapPin className="size-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground block">Spot</span>
                  <span className="text-xs font-bold text-foreground block truncate max-w-[280px]">{restaurant || "ARROWS & SPARROWS"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/15 text-primary shrink-0">
                  <Pizza className="size-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground block">Flavor Palate</span>
                  <span className="text-xs font-bold text-foreground block truncate max-w-[280px]">{food || "Truffle Pizza"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Archetype mini-card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-[#ff709b]/10 border border-primary/20 text-center relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-15 text-primary shrink-0">
              <Award size={64} />
            </div>
            
            <div className="flex items-center justify-center gap-1.5 mb-1 animate-pulse">
              <Flame className="size-4 text-primary fill-primary" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">Love Vibe Archetype</span>
            </div>

            <h3 className="font-extrabold text-sm text-gradient-romantic truncate">{personality || "Fine Dining Romanticist 🌹"}</h3>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col items-center gap-1.5 z-10 mb-2 select-none">
          <div className="flex items-center gap-1 text-[11px] font-black text-primary tracking-widest uppercase animate-pulse">
            <Sparkles className="size-3.5 fill-primary text-primary" />
            <span>Made with DateSparks ✨</span>
          </div>
          <span className="text-[8px] font-extrabold text-muted-foreground/80 tracking-wide uppercase">"proposal locked in 💌"</span>
        </div>
      </div>
    )
  }
)

ShareCard.displayName = "ShareCard"
