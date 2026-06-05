"use client"

import { Pizza, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FoodStepProps {
  selectedValue: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

const dishes = [
  {
    id: "pizza",
    name: "Gourmet Truffle Pizza 🍕",
    detail: "Crispy thin crust, white truffle cream, fresh mozzarella, basil",
    highlight: "Savory & comforting sharing food",
  },
  {
    id: "sushi",
    name: "Dragon Sushi Roll Combo 🍣",
    detail: "Premium unagi eel, avocado layers, spicy crunchy tuna, microgreens",
    highlight: "Light, clean, and delicious bites",
  },
  {
    id: "pasta",
    name: "Tuscan Pasta Carbonara 🍝",
    detail: "Handmade egg pasta, pecorino romano, crispy guanciale, yolk glaze",
    highlight: "Warm, rich, classic candlelight dinner",
  },
  {
    id: "dessert",
    name: "Warm Red Velvet Lava Cake 🍰",
    detail: "Molten chocolate center, vanilla bean gelato, raspberry coulis",
    highlight: "Decadent sweet endings",
  },
]

export function FoodStep({ selectedValue, onChange, onNext, onBack }: FoodStepProps) {
  return (
    <div className="flex-1 flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col gap-3">
        <div className="text-center">
          <h2 className="text-lg font-black tracking-tight text-gradient-romantic">Pick a Dish 🍕</h2>
          <p className="text-xs text-muted-foreground">Select a culinary highlight for the date.</p>
        </div>

        {/* Dishes Cards */}
        <div className="flex flex-col gap-3">
          {dishes.map((dish) => {
            const isSelected = selectedValue === dish.name

            return (
              <button
                key={dish.id}
                onClick={() => onChange(dish.name)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex flex-col gap-1 ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-romantic"
                    : "bg-white/20 dark:bg-black/10 border-foreground/5 hover:border-primary/40"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-extrabold text-sm text-foreground block truncate">{dish.name}</span>
                  {isSelected && <Heart className="size-3.5 text-primary fill-primary" />}
                </div>

                <p className="text-[10px] text-muted-foreground leading-normal">{dish.detail}</p>
                
                <span className="text-[9px] font-bold text-primary/80 mt-1 block">
                  ✨ {dish.highlight}
                </span>
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
          Next: Vibe Match 💖
        </Button>
      </div>
    </div>
  )
}
