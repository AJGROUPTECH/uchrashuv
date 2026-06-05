"use client"

import { Star, MapPin, Check, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { playHoverPop } from "@/lib/audio"

interface RestaurantStepProps {
  selectedValue: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

const restaurants = [
  {
    id: "arrows",
    name: "ARROWS & SPARROWS",
    cuisine: "Specialty Cafe",
    rating: "4.8",
    tags: ["Plant Lover", "Latte Art", "Vinyls"],
    desc: "Vibrant hipster sanctuary famous for artisan latte art and wisteria garden patios.",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "breadly",
    name: "BREADLY",
    cuisine: "Artisan Bakery",
    rating: "4.9",
    tags: ["Croissants", "Sourdough", "Warm Aroma"],
    desc: "Sun-drenched conservatory smelling of fresh-baked almond croissants and tea.",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "bon",
    name: "BON!",
    cuisine: "Parisian Cafe",
    rating: "4.7",
    tags: ["Street Patio", "Crepes", "Hot Cocoa"],
    desc: "Woven terrace chairs, vintage books, and chocolate-filled crepes under street lanterns.",
    img: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "benedict",
    name: "BENEDICT",
    cuisine: "Brunch Lounge",
    rating: "4.8",
    tags: ["Hollandaise", "Mimosas", "Sunlit"],
    desc: "Insta-famous brunch joint with flowing hollandaise eggs, pancakes, and sparkly drinks.",
    img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "june",
    name: "JUNE",
    cuisine: "Minimalist Matcha",
    rating: "4.9",
    tags: ["Matcha Art", "Aesthetic", "Quiet"],
    desc: "Clean light oak woods, serene sounds, and premium ceremonial whisked matcha.",
    img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "pie",
    name: "PIE REPUBLIC",
    cuisine: "Rustic Bakery",
    rating: "4.8",
    tags: ["Warm Hearth", "Fruit Pies", "Jazz"],
    desc: "Charming wood-cabin pie store playing soft retro vinyl tunes on spinning record players.",
    img: "https://images.unsplash.com/photo-1519869325930-281384150729?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "testo",
    name: "TESTO",
    cuisine: "Pasta & Pizza",
    rating: "4.7",
    tags: ["Handmade", "Candlelit", "Truffles"],
    desc: "Intimate exposed-brick cellar featuring hand-rolled tortellini and fresh basils.",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "yakamoz",
    name: "YAKAMOZ",
    cuisine: "Seaside Lounge",
    rating: "4.9",
    tags: ["Waves", "Lanterns", "Romantic"],
    desc: "Lantern-lit Mediterranean docks directly over quiet water waves. Pure magic.",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "zira",
    name: "ZIRA CAFE",
    cuisine: "Boho Tea Room",
    rating: "4.9",
    tags: ["Boho Rugs", "Mint Tea", "Floor Seats"],
    desc: "Warm cardamon tea served in glass cups amongst cozy velvet floor pillows.",
    img: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "safia",
    name: "SAFIA",
    cuisine: "Pink Patisserie",
    rating: "4.9",
    tags: ["Pink Velvet", "Macarons", "Flowers"],
    desc: "Heavenly dessert boutique with pastel flower walls, velvet sofas, and cake slices.",
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=60",
  },
]

export function RestaurantStep({ selectedValue, onChange, onNext, onBack }: RestaurantStepProps) {
  return (
    <div className="flex-1 flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col gap-3">
        <div className="text-center">
          <h2 className="text-lg font-black tracking-tight text-gradient-romantic">Aesthetic Cafes 📍</h2>
          <p className="text-xs text-muted-foreground">Select an Instagrammable date location.</p>
        </div>

        {/* 2-Column Restaurant Grid (Instagram Style) */}
        <div className="grid grid-cols-2 gap-3 max-h-[390px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20">
          {restaurants.map((rest) => {
            const isSelected = selectedValue === rest.name

            return (
              <button
                key={rest.id}
                onClick={() => onChange(rest.name)}
                onMouseEnter={playHoverPop}
                className={`group text-left rounded-2xl overflow-hidden border flex flex-col relative ${
                  isSelected
                    ? "bg-primary/5 border-primary shadow-romantic-glow scale-[1.01]"
                    : "bg-white/20 dark:bg-black/10 border-foreground/5 card-hover-glow"
                }`}
              >
                {/* Visual Header Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rest.img}
                    alt={rest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Glassmorphic Rating Badge */}
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/40 dark:bg-white/10 backdrop-blur-md text-[9px] font-black text-white px-1.5 py-0.5 rounded-md">
                    <Star className="size-2.5 fill-amber-400 text-amber-400" />
                    <span>{rest.rating}</span>
                  </div>

                  {/* Selection Overlay Indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/25 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border border-white/20 animate-heartbeat">
                        <Heart className="size-4 fill-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-extrabold text-[11px] text-foreground tracking-tight block truncate uppercase group-hover:text-primary transition-colors">
                      {rest.name}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground block">
                      {rest.cuisine}
                    </span>
                  </div>

                  {/* Vibe Tags Row */}
                  <div className="flex gap-1 overflow-x-auto scrollbar-none py-1 mt-1.5">
                    {rest.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-foreground/5 text-foreground/70 dark:bg-white/5 dark:text-rose-200/80 whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
          Next: Choose Food 🍕
        </Button>
      </div>
    </div>
  )
}
