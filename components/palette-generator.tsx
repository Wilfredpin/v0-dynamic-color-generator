"use client"

import { useState, useCallback, useEffect } from "react"
import { RefreshCw, Download, Copy, Check, ArrowLeft, Shuffle, ImageDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Color, HarmonyMode, generatePaletteFromHex, hexToHsl, hslToHex, copyToClipboard } from "@/lib/color-utils"
import { ColorSwatch } from "./color-swatch"
import { HarmonySelector } from "./harmony-selector"
import { WelcomeScreen } from "./welcome-screen"

export function PaletteGenerator() {
  const [baseColor, setBaseColor] = useState<string | null>(null)
  const [colors, setColors] = useState<Color[]>([])
  const [lockedIndexes, setLockedIndexes] = useState<Set<number>>(new Set())
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>("analogous")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateNewPalette = useCallback((hex: string, mode: HarmonyMode, locked: Set<number>, prevColors: Color[]) => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const newPalette = generatePaletteFromHex(hex, mode)
      
      if (prevColors.length === 0) {
        setColors(newPalette)
      } else {
        setColors(newPalette.map((color, index) => 
          locked.has(index) ? prevColors[index] : color
        ))
      }
      
      setIsGenerating(false)
    }, 150)
  }, [])

  const handleColorSubmit = (hex: string) => {
    setBaseColor(hex)
    generateNewPalette(hex, harmonyMode, new Set(), [])
  }

  const handleRegenerate = () => {
    if (!baseColor) return
    generateNewPalette(baseColor, harmonyMode, lockedIndexes, colors)
  }

  const handleRandomize = () => {
    // Generate a random base color
    const randomHue = Math.floor(Math.random() * 360)
    const randomSat = 60 + Math.random() * 25
    const randomLight = 45 + Math.random() * 20
    const newHex = hslToHex(randomHue, randomSat, randomLight)
    setBaseColor(newHex)
    setLockedIndexes(new Set())
    generateNewPalette(newHex, harmonyMode, new Set(), [])
  }

  const toggleLock = (index: number) => {
    setLockedIndexes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleCopyAll = async () => {
    const colorList = colors.map(c => c.hex.toUpperCase()).join(", ")
    await copyToClipboard(colorList)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportCSS = async () => {
    const cssVars = colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n")
    const css = `:root {\n${cssVars}\n}`
    await copyToClipboard(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadImage = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const swatchWidth = 200
    const swatchHeight = 300
    const labelHeight = 50
    const padding = 20
    
    canvas.width = colors.length * swatchWidth
    canvas.height = swatchHeight + labelHeight

    // Draw each color swatch
    colors.forEach((color, index) => {
      const x = index * swatchWidth

      // Draw color rectangle
      ctx.fillStyle = color.hex
      ctx.fillRect(x, 0, swatchWidth, swatchHeight)

      // Draw label background
      ctx.fillStyle = "#1a1a2e"
      ctx.fillRect(x, swatchHeight, swatchWidth, labelHeight)

      // Draw hex code text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 16px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(
        color.hex.toUpperCase(),
        x + swatchWidth / 2,
        swatchHeight + labelHeight / 2
      )
    })

    // Download the canvas as image
    const link = document.createElement("a")
    link.download = `chromatic-palette-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const handleBack = () => {
    setBaseColor(null)
    setColors([])
    setLockedIndexes(new Set())
  }

  // Keyboard handler for space to regenerate
  useEffect(() => {
    if (!baseColor) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && e.target === document.body) {
        e.preventDefault()
        handleRegenerate()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [baseColor, harmonyMode, lockedIndexes, colors])

  // Regenerate when harmony mode changes (only if we have a base color)
  useEffect(() => {
    if (baseColor && colors.length > 0) {
      generateNewPalette(baseColor, harmonyMode, lockedIndexes, colors)
    }
  }, [harmonyMode])

  // Show welcome screen if no base color is set
  if (!baseColor) {
    return <WelcomeScreen onColorSubmit={handleColorSubmit} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Back & Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className={cn(
                  "p-2 rounded-full bg-secondary text-secondary-foreground",
                  "hover:bg-secondary/80 transition-all duration-200",
                  "hover:scale-105 active:scale-95"
                )}
                title="Start over"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">Chromatic</h1>
              </div>
              {/* Base Color Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: baseColor }}
                />
                <span className="text-sm text-muted-foreground font-mono">{baseColor.toUpperCase()}</span>
              </div>
            </div>

            {/* Harmony Mode Selector */}
            <HarmonySelector mode={harmonyMode} onModeChange={setHarmonyMode} />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAll}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                  "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  "transition-all duration-300 hover:scale-105 active:scale-95"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy All</span>
                  </>
                )}
              </button>

              <button
                onClick={handleExportCSS}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                  "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  "transition-all duration-300 hover:scale-105 active:scale-95"
                )}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">CSS</span>
              </button>

              <button
                onClick={handleDownloadImage}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                  "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  "transition-all duration-300 hover:scale-105 active:scale-95"
                )}
                title="Download as image"
              >
                <ImageDown className="w-4 h-4" />
                <span className="hidden sm:inline">Image</span>
              </button>

              <button
                onClick={handleRandomize}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                  "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  "transition-all duration-300 hover:scale-105 active:scale-95"
                )}
                title="Random color"
              >
                <Shuffle className="w-4 h-4" />
                <span className="hidden sm:inline">Random</span>
              </button>

              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                  "bg-primary text-primary-foreground",
                  "transition-all duration-300 hover:scale-105 active:scale-95",
                  "shadow-lg shadow-primary/25",
                  isGenerating && "opacity-80"
                )}
              >
                <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
                <span className="hidden sm:inline">Generate</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Palette Display */}
      <main className="flex-1 flex flex-col md:flex-row">
        {colors.map((color, index) => (
          <ColorSwatch
            key={`${color.hex}-${index}`}
            color={color}
            index={index}
            isLocked={lockedIndexes.has(index)}
            onToggleLock={() => toggleLock(index)}
            isExpanded
          />
        ))}
      </main>
    </div>
  )
}
