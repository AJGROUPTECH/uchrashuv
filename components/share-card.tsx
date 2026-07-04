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
      if (!rawDate) return "Friday, July 12"
      const parts = rawDate.split("-")
      const month = parts[1]
      const day = parseInt(parts[2], 10)
      
      const offset = month === "06" ? 0 : 2
      const dayOfWeekIdx = (day - 1 + offset) % 7
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      const monthLabel = month === "06" ? "June" : "July"
      return `${days[dayOfWeekIdx]}, ${monthLabel} ${day}`
    }

    return (
      /* Wrapper container that is fixed off-screen and invisible to the user but rendered in the DOM layout */
      <div style={{ position: "fixed", width: 0, height: 0, overflow: "hidden", zIndex: -1000, left: 0, top: 0 }}>
        <div
          ref={ref}
          style={{
            width: "440px",
            height: "780px",
            background: "linear-gradient(135deg, #ffe5ec 0%, #fdedd5 50%, #fccde2 100%)",
            color: "#2d1419",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "2rem",
            fontFamily: "sans-serif",
            overflow: "hidden",
            userSelect: "none",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            position: "relative",
          }}
        >
          {/* Glow Effects */}
          <div className="absolute top-1/4 left-1/4 size-64 rounded-full blur-3xl" style={{ backgroundColor: "rgba(255, 75, 130, 0.15)" }} />
          <div className="absolute bottom-1/4 right-1/4 size-64 rounded-full blur-3xl" style={{ backgroundColor: "rgba(253, 237, 213, 0.1)" }} />

          {/* Decorative Floating Hearts */}
          <div className="absolute top-[8%] left-[10%] animate-float-slow" style={{ color: "rgba(255, 75, 130, 0.3)" }}><Heart size={20} fill="currentColor" /></div>
          <div className="absolute top-[15%] right-[12%] animate-float-medium" style={{ color: "rgba(255, 75, 130, 0.2)" }}><Heart size={16} fill="currentColor" /></div>
          <div className="absolute bottom-[20%] left-[8%] animate-float-fast" style={{ color: "rgba(255, 75, 130, 0.25)" }}><Heart size={24} fill="currentColor" /></div>
          <div className="absolute bottom-[35%] right-[10%] animate-float-slow" style={{ color: "rgba(255, 75, 130, 0.15)" }}><Heart size={18} fill="currentColor" /></div>

          {/* Header Section */}
          <div className="flex flex-col items-center text-center mt-4 z-10">
            <div className="size-12 rounded-full flex items-center justify-center mb-2.5 shadow-sm animate-heartbeat" style={{ backgroundColor: "rgba(255, 75, 130, 0.15)", border: "1px solid rgba(255, 75, 130, 0.2)" }}>
              <Heart className="size-6" style={{ color: "#ff4b82", fill: "#ff4b82" }} />
            </div>
            <h1 className="text-xl font-black tracking-widest text-gradient-romantic" style={{ color: "#ff4b82" }}>Uchrashuv Vibe Card</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: "#8e767a" }}>Our locked proposal spark</p>
          </div>

          {/* Core Info Box */}
          <div className="flex-1 flex flex-col justify-center gap-6 z-10 my-4">
            
            {/* Main Glass Vibe Card */}
            <div className="p-5 rounded-3xl shadow-romantic flex flex-col gap-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.55)", border: "1px solid rgba(255, 255, 255, 0.4)" }}>
              
              {/* Candidate Sub-card */}
              <div className="text-center pb-2" style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}>
                <span className="text-[9px] font-black uppercase tracking-widest block mb-0.5" style={{ color: "#ff4b82" }}>Unlocked By</span>
                <h2 className="text-lg font-black text-foreground truncate">{name || "@username"}</h2>
              </div>

              {/* Selection list */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl flex items-center justify-center shrink-0 border" style={{ backgroundColor: "rgba(255, 75, 130, 0.1)", borderColor: "rgba(255, 75, 130, 0.15)", color: "#ff4b82" }}>
                    <Calendar className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] font-bold uppercase tracking-wider block" style={{ color: "#8e767a" }}>Timeline</span>
                    <span className="text-xs font-bold text-foreground block">{getReadableDate(date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl flex items-center justify-center shrink-0 border" style={{ backgroundColor: "rgba(255, 75, 130, 0.1)", borderColor: "rgba(255, 75, 130, 0.15)", color: "#ff4b82" }}>
                    <Clock className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] font-bold uppercase tracking-wider block" style={{ color: "#8e767a" }}>Time Slot</span>
                    <span className="text-xs font-bold text-foreground block">{time || "Golden Hour Dinner"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl flex items-center justify-center shrink-0 border" style={{ backgroundColor: "rgba(255, 75, 130, 0.1)", borderColor: "rgba(255, 75, 130, 0.15)", color: "#ff4b82" }}>
                    <MapPin className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] font-bold uppercase tracking-wider block" style={{ color: "#8e767a" }}>Spot</span>
                    <span className="text-xs font-bold text-foreground block truncate max-w-[280px]">{restaurant || "ARROWS & SPARROWS"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl flex items-center justify-center shrink-0 border" style={{ backgroundColor: "rgba(255, 75, 130, 0.1)", borderColor: "rgba(255, 75, 130, 0.15)", color: "#ff4b82" }}>
                    <Pizza className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] font-bold uppercase tracking-wider block" style={{ color: "#8e767a" }}>Flavor Palate</span>
                    <span className="text-xs font-bold text-foreground block truncate max-w-[280px]">{food || "Truffle Pizza"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Archetype mini-card */}
            <div className="p-4 rounded-2xl border text-center relative overflow-hidden" style={{ background: "linear-gradient(to right, rgba(255, 75, 130, 0.08), rgba(255, 112, 155, 0.08))", borderColor: "rgba(255, 75, 130, 0.2)" }}>
              <div className="absolute -right-4 -bottom-4 opacity-15 shrink-0" style={{ color: "#ff4b82" }}>
                <Award size={64} />
              </div>
              
              <div className="flex items-center justify-center gap-1.5 mb-1 animate-pulse" style={{ color: "#ff4b82" }}>
                <Flame className="size-4 fill-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest">Love Vibe Archetype</span>
              </div>

              <h3 className="font-extrabold text-sm truncate" style={{ color: "#ff4b82" }}>{personality || "Fine Dining Romanticist 🌹"}</h3>
            </div>
          </div>

          {/* Footer Section */}
          <div className="flex flex-col items-center gap-1.5 z-10 mb-2 select-none">
            <div className="flex items-center gap-1 text-[11px] font-black tracking-widest uppercase animate-pulse" style={{ color: "#ff4b82" }}>
              <Sparkles className="size-3.5 fill-primary" />
              <span>Made with Uchrashuv ✨</span>
            </div>
            <span className="text-[8px] font-extrabold tracking-wide uppercase" style={{ color: "#8e767a" }}>"proposal locked in 💌"</span>
          </div>
        </div>
      </div>
    )
  }
)

ShareCard.displayName = "ShareCard"
