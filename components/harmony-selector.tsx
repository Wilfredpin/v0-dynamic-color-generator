"use client"

import { cn } from "@/lib/utils"
import { HarmonyMode } from "@/lib/color-utils"

interface HarmonySelectorProps {
  mode: HarmonyMode
  onModeChange: (mode: HarmonyMode) => void
}

const modes: { value: HarmonyMode; label: string; description: string }[] = [
  { value: "analogous", label: "Analogous", description: "Similar hues" },
  { value: "complementary", label: "Complementary", description: "Opposite hues" },
  { value: "triadic", label: "Triadic", description: "Three evenly spaced" },
  { value: "tetradic", label: "Tetradic", description: "Four evenly spaced" },
  { value: "split-complementary", label: "Split", description: "Complement split" },
  { value: "monochromatic", label: "Mono", description: "Single hue" },
]

export function HarmonySelector({ mode, onModeChange }: HarmonySelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onModeChange(m.value)}
          className={cn(
            "px-3 py-2 md:px-4 md:py-2 rounded-full text-sm font-medium transition-all duration-300",
            "hover:scale-105 active:scale-95",
            mode === m.value
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          <span className="hidden sm:inline">{m.label}</span>
          <span className="sm:hidden">{m.label.slice(0, 4)}</span>
        </button>
      ))}
    </div>
  )
}
