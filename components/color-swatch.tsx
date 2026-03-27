"use client"

import { useState } from "react"
import { Check, Copy, Lock, Unlock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Color, getContrastColor, copyToClipboard } from "@/lib/color-utils"

interface ColorSwatchProps {
  color: Color
  index: number
  isLocked: boolean
  onToggleLock: () => void
  isExpanded?: boolean
}

export function ColorSwatch({ color, index, isLocked, onToggleLock, isExpanded = false }: ColorSwatchProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const textColor = getContrastColor(color.hex)

  const handleCopy = async (value: string, type: string) => {
    await copyToClipboard(value)
    setCopied(type)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between transition-all duration-500 ease-out",
        isExpanded ? "flex-1 min-h-[300px] md:min-h-[400px]" : "flex-1 min-h-[200px]"
      )}
      style={{
        backgroundColor: color.hex,
        animationDelay: `${index * 75}ms`,
      }}
    >
      {/* Lock button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onToggleLock}
          className={cn(
            "p-2 rounded-full transition-all duration-300",
            "opacity-0 group-hover:opacity-100 focus:opacity-100",
            "hover:scale-110 active:scale-95"
          )}
          style={{
            backgroundColor: `${textColor}20`,
            color: textColor,
          }}
          aria-label={isLocked ? "Unlock color" : "Lock color"}
        >
          {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>
      </div>

      {/* Color info */}
      <div
        className={cn(
          "mt-auto p-4 md:p-6 space-y-3",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        )}
        style={{ color: textColor }}
      >
        {/* HEX */}
        <button
          onClick={() => handleCopy(color.hex, "hex")}
          className="flex items-center gap-2 font-mono text-lg md:text-xl font-semibold hover:opacity-80 transition-opacity w-full"
        >
          {color.hex.toUpperCase()}
          {copied === "hex" ? (
            <Check className="w-4 h-4 animate-in zoom-in duration-200" />
          ) : (
            <Copy className="w-4 h-4 opacity-50" />
          )}
        </button>

        {/* RGB */}
        <button
          onClick={() => handleCopy(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, "rgb")}
          className="flex items-center gap-2 font-mono text-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
          {copied === "rgb" && <Check className="w-3 h-3 animate-in zoom-in duration-200" />}
        </button>

        {/* HSL */}
        <button
          onClick={() => handleCopy(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, "hsl")}
          className="flex items-center gap-2 font-mono text-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          HSL({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
          {copied === "hsl" && <Check className="w-3 h-3 animate-in zoom-in duration-200" />}
        </button>
      </div>

      {/* Hex label always visible */}
      <div
        className={cn(
          "absolute bottom-4 left-4 md:bottom-6 md:left-6",
          "font-mono text-sm md:text-base font-medium",
          "group-hover:opacity-0 transition-opacity duration-300"
        )}
        style={{ color: textColor }}
      >
        {color.hex.toUpperCase()}
      </div>

      {/* Lock indicator */}
      {isLocked && (
        <div
          className="absolute top-4 left-4"
          style={{ color: textColor }}
        >
          <Lock className="w-4 h-4 opacity-60" />
        </div>
      )}
    </div>
  )
}
