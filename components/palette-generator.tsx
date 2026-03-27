"use client"

import { useState, useCallback, useEffect } from "react"
import { RefreshCw, Download, Copy, Check, Keyboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Color, HarmonyMode, generatePalette, generateRandomHue, copyToClipboard } from "@/lib/color-utils"
import { ColorSwatch } from "./color-swatch"
import { HarmonySelector } from "./harmony-selector"

export function PaletteGenerator() {
  const [colors, setColors] = useState<Color[]>([])
  const [lockedIndexes, setLockedIndexes] = useState<Set<number>>(new Set())
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>("analogous")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showShortcut, setShowShortcut] = useState(true)

  const generateNewPalette = useCallback(() => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const baseHue = generateRandomHue()
      const newPalette = generatePalette(baseHue, harmonyMode)
      
      setColors((prevColors) => {
        if (prevColors.length === 0) return newPalette
        return newPalette.map((color, index) => 
          lockedIndexes.has(index) ? prevColors[index] : color
        )
      })
      
      setIsGenerating(false)
    }, 150)
  }, [harmonyMode, lockedIndexes])

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

  // Initialize and keyboard handler
  useEffect(() => {
    generateNewPalette()
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && e.target === document.body) {
        e.preventDefault()
        generateNewPalette()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    
    // Hide shortcut hint after 5 seconds
    const timer = setTimeout(() => setShowShortcut(false), 5000)
    
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      clearTimeout(timer)
    }
  }, [generateNewPalette])

  // Regenerate when harmony mode changes
  useEffect(() => {
    if (colors.length > 0) {
      generateNewPalette()
    }
  }, [harmonyMode])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Chromatic</h1>
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
                onClick={generateNewPalette}
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

      {/* Keyboard Shortcut Hint */}
      <div
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
          "flex items-center gap-2 px-4 py-2 rounded-full",
          "bg-card/90 backdrop-blur-sm border border-border",
          "text-sm text-muted-foreground",
          "transition-all duration-500",
          showShortcut ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <Keyboard className="w-4 h-4" />
        Press <kbd className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-mono text-xs">Space</kbd> to generate
      </div>
    </div>
  )
}
