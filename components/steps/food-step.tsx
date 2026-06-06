"use client"

import { Check, Heart, Phone, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { playHoverPop } from "@/lib/audio"
import { motion } from "framer-motion"

interface FoodStepProps {
  restaurantName: string
  selectedValue: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

const restaurantMenus: Record<string, {
  name: string
  img?: string
  desc: string
  tags: string[]
  phone: string
  menu: { name: string; emoji: string }[]
}> = {
  "ARROWS & SPARROWS": {
    name: "ARROWS & SPARROWS",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=60",
    desc: "Vibrant hipster sanctuary famous for artisan latte art and wisteria garden patios.",
    tags: ["Plant Lover", "Latte Art", "Vinyls"],
    phone: "+998 71 200-11-22",
    menu: [
      { name: "Turkish Menemen", emoji: "🍳" },
      { name: "English Breakfast", emoji: "🥓" },
      { name: "French Breakfast", emoji: "🥐" },
      { name: "Shakshuka", emoji: "🍅" },
    ]
  },
  "BREADLY": {
    name: "BREADLY",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=60",
    desc: "Sun-drenched conservatory smelling of fresh-baked almond croissants and tea.",
    tags: ["Croissants", "Sourdough", "Warm Aroma"],
    phone: "+998 71 200-33-44",
    menu: [
      { name: "Breadly Breakfast", emoji: "🥞" },
      { name: "French Breakfast", emoji: "🥐" },
      { name: "English Breakfast", emoji: "🍳" },
      { name: "Pancakes", emoji: "🥞" },
    ]
  },
  "BON!": {
    name: "BON!",
    img: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=400&auto=format&fit=crop&q=60",
    desc: "Woven terrace chairs, vintage books, and chocolate-filled crepes under street lanterns.",
    tags: ["Street Patio", "Crepes", "Hot Cocoa"],
    phone: "+998 71 200-55-66",
    menu: [
      { name: "Granola", emoji: "🥣" },
      { name: "Bon! Classic Breakfast", emoji: "🥐" },
      { name: "Continental Breakfast", emoji: "🍞" },
      { name: "Fruit Salad", emoji: "🍓" },
    ]
  },
  "BENEDICT": {
    name: "BENEDICT",
    img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop&q=60",
    desc: "Brunch lounge with egg benedicts, fluffy pancakes, and sunlit outdoor seats.",
    tags: ["Hollandaise", "Mimosas", "Sunlit"],
    phone: "+998 71 200-77-88",
    menu: [
      { name: "English Breakfast", emoji: "🍳" },
      { name: "Fitness Breakfast", emoji: "🥑" },
      { name: "Omelet", emoji: "🍳" },
      { name: "Pancakes", emoji: "🥞" },
    ]
  },
  "JUNE": {
    name: "JUNE",
    img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&auto=format&fit=crop&q=60",
    desc: "Clean light oak woods, serene sounds, and premium ceremonial whisked matcha.",
    tags: ["Matcha Art", "Aesthetic", "Quiet"],
    phone: "+998 71 200-99-00",
    menu: [
      { name: "Granola", emoji: "🥣" },
      { name: "Mortadella Croissant", emoji: "🥐" },
      { name: "Avocado Toast", emoji: "🥑" },
      { name: "Salmon Breakfast", emoji: "🍣" },
    ]
  },
  "PIE REPUBLIC": {
    name: "PIE REPUBLIC",
    img: "https://images.unsplash.com/photo-1519869325930-281384150729?w=400&auto=format&fit=crop&q=60",
    desc: "Charming wood-cabin pie store playing soft retro vinyl tunes on spinning record players.",
    tags: ["Warm Hearth", "Fruit Pies", "Jazz"],
    phone: "+998 71 300-11-22",
    menu: [
      { name: "Cheesecakes", emoji: "🍰" },
      { name: "Granola", emoji: "🥣" },
      { name: "Cottage Pancakes", emoji: "🥞" },
      { name: "English Breakfast", emoji: "🍳" },
    ]
  },
  "TESTO": {
    name: "TESTO",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=60",
    desc: "Intimate exposed-brick cellar featuring hand-rolled tortellini and fresh basils.",
    tags: ["Handmade", "Candlelit", "Truffles"],
    phone: "+998 71 300-33-44",
    menu: [
      { name: "Porridge", emoji: "🥣" },
      { name: "Syrniki", emoji: "🥞" },
      { name: "Pancakes", emoji: "🥞" },
      { name: "Shakshuka", emoji: "🍳" },
    ]
  },
  "YAKAMOZ": {
    name: "YAKAMOZ",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=60",
    desc: "Lantern-lit Mediterranean docks directly over quiet water waves. Pure magic.",
    tags: ["Waves", "Lanterns", "Romantic"],
    phone: "+998 71 300-55-66",
    menu: [
      { name: "Simit", emoji: "🥯" },
      { name: "Omelet", emoji: "🍳" },
      { name: "Turkish Breakfast Set", emoji: "🍽️" },
      { name: "Traditional Turkish Breakfast for 2", emoji: "👩‍❤️‍👨" },
    ]
  },
  "ZIRA CAFE": {
    name: "ZIRA CAFE",
    img: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&auto=format&fit=crop&q=60",
    desc: "Warm cardamon tea served in glass cups amongst cozy velvet floor pillows.",
    tags: ["Boho Rugs", "Mint Tea", "Floor Seats"],
    phone: "+998 71 300-77-88",
    menu: [
      { name: "Mortadella Benedict", emoji: "🍳" },
      { name: "Cottage Cheese Casserole", emoji: "🥮" },
      { name: "Syrniki", emoji: "🥞" },
      { name: "Omelet", emoji: "🍳" },
    ]
  },
  "SAFIA": {
    name: "SAFIA",
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=60",
    desc: "Heavenly dessert boutique with pastel flower walls, velvet sofas, and cake slices.",
    tags: ["Pink Velvet", "Macarons", "Flowers"],
    phone: "+998 71 300-99-00",
    menu: [
      { name: "Okroshka", emoji: "🥣" },
      { name: "Caprese Salad", emoji: "🥗" },
      { name: "Chicken Bitotchki with Rice and Guacamole", emoji: "🍛" },
      { name: "Bumble Coffee", emoji: "☕" },
      { name: "Melon Cherry Ice Latte", emoji: "🍹" },
      { name: "Peach Pear Lemonade", emoji: "🍋" },
      { name: "Melon Strawberry Lemonade", emoji: "🍓" },
    ]
  }
}

export function FoodStep({ restaurantName, selectedValue, onChange, onNext, onBack }: FoodStepProps) {
  // Fallback to SAFIA if restaurantName is missing or invalid
  const menuData = restaurantMenus[restaurantName] || restaurantMenus["SAFIA"]

  return (
    <div className="flex-1 flex flex-col justify-between h-full gap-3 select-none">
      <div className="flex flex-col gap-3">
        {/* Step Title Header */}
        <div className="text-center">
          <h2 className="text-lg font-black tracking-tight text-gradient-romantic">Taste of Romance 🍓</h2>
          <p className="text-[10px] text-muted-foreground">Select a culinary highlight for our date.</p>
        </div>

        {/* Animated Restaurant Header Info Card */}
        <div className="relative rounded-2xl overflow-hidden border border-foreground/5 bg-white/10 dark:bg-black/10 flex flex-col shadow-sm">
          {/* Header Image (with animated custom gradient fallback) */}
          <div className="relative h-28 w-full overflow-hidden bg-muted">
            {menuData.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={menuData.img}
                alt={menuData.name}
                className="w-full h-full object-cover animate-float-slow"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-pink-500/20 to-rose-400/20 flex flex-col items-center justify-center relative overflow-hidden">
                <Heart className="size-8 text-primary/45 fill-primary/10 animate-pulse" />
                <span className="absolute size-1 bg-primary/20 rounded-full animate-ping top-[20%] left-[30%]" />
                <span className="absolute size-1.5 bg-rose-400/30 rounded-full animate-ping top-[60%] left-[80%]" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-2.5 left-3 text-white">
              <span className="text-[8px] font-black tracking-widest uppercase text-rose-300 flex items-center gap-0.5">
                <Sparkles className="size-2.5 fill-rose-300" /> Selected Spot
              </span>
              <h3 className="font-black text-sm tracking-tight uppercase leading-tight mt-0.5">{menuData.name}</h3>
            </div>
          </div>

          {/* Details Row */}
          <div className="p-3 flex flex-col gap-2">
            <p className="text-[10.5px] text-foreground/80 dark:text-rose-100/70 leading-normal italic font-medium">
              "{menuData.desc}"
            </p>
            <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground mt-0.5 border-t border-foreground/5 pt-1.5">
              <span className="flex items-center gap-1">
                <Phone className="size-3 text-primary" /> {menuData.phone}
              </span>
              <div className="flex gap-1">
                {menuData.tags.map((tag, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded-full bg-foreground/5 dark:bg-white/5 text-primary">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Title */}
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-0.5 px-0.5">
          Menu highlights 🍽️
        </span>

        {/* Dynamic Food Option Cards (Constrained height scrollbar to prevent overflowing the phone mockup) */}
        <div className="flex flex-col gap-2 max-h-[190px] overflow-y-auto pr-0.5 scrollbar-none">
          {menuData.menu.map((item) => {
            const isSelected = selectedValue === item.name

            return (
              <button
                key={item.name}
                onClick={() => onChange(item.name)}
                onMouseEnter={playHoverPop}
                className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-3 transition-all duration-300 ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-romantic-glow scale-[1.01]"
                    : "bg-white/10 dark:bg-black/10 border-foreground/5 card-hover-glow"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{item.emoji}</span>
                  <span className="font-extrabold text-xs text-foreground truncate">{item.name}</span>
                </div>
                {isSelected && (
                  <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 border border-white/20 shadow-sm animate-heartbeat">
                    <Check className="size-3" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto pt-2">
        <Button variant="ghost" className="w-1/3 text-xs" onClick={onBack}>
          Back
        </Button>
        <Button 
          variant="romantic" 
          className="w-2/3 gap-1.5" 
          disabled={!selectedValue} 
          onClick={onNext}
        >
          Next: Vibe Match 💖
        </Button>
      </div>
    </div>
  )
}
