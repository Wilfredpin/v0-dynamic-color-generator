"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowRight, Pipette } from "lucide-react"
import { cn } from "@/lib/utils"
import { isValidHex, normalizeHex } from "@/lib/color-utils"

interface WelcomeScreenProps {
  onColorSubmit: (hex: string) => void
}

export function WelcomeScreen({ onColorSubmit }: WelcomeScreenProps) {
  const [inputValue, setInputValue] = useState("")
  const [pickerColor, setPickerColor] = useState("#6366f1")
  const [error, setError] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    textInputRef.current?.focus()
  }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    
    const colorToUse = inputValue.trim() || pickerColor
    
    if (!isValidHex(colorToUse)) {
      setError("Please enter a valid hex color (e.g., #FF5733 or FF5733)")
      return
    }
    
    setError("")
    onColorSubmit(normalizeHex(colorToUse))
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setError("")
  }

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setPickerColor(newColor)
    setInputValue(newColor)
    setError("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  const openColorPicker = () => {
    colorInputRef.current?.click()
  }

  const previewColor = isValidHex(inputValue) ? normalizeHex(inputValue) : pickerColor

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-primary-foreground" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Chromatic</h1>
        </div>

        {/* Welcome Text */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-medium text-foreground text-balance">
            Welcome! Let&apos;s help you solve color-matching
          </h2>
          <p className="text-muted-foreground text-lg">
            Enter a color to generate a beautiful, harmonious palette
          </p>
        </div>

        {/* Color Input Section */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            {/* Color Preview Circle */}
            <div 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-border transition-colors duration-200"
              style={{ backgroundColor: previewColor }}
            />

            {/* Text Input */}
            <input
              ref={textInputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="#FF5733 or FF5733"
              className={cn(
                "w-full pl-16 pr-28 py-4 text-lg rounded-2xl",
                "bg-card border-2 text-foreground placeholder:text-muted-foreground",
                "transition-all duration-300 outline-none",
                isFocused ? "border-primary shadow-lg shadow-primary/10" : "border-border",
                error && "border-destructive"
              )}
            />

            {/* Color Picker Button */}
            <button
              type="button"
              onClick={openColorPicker}
              className={cn(
                "absolute right-16 top-1/2 -translate-y-1/2",
                "p-2 rounded-lg bg-secondary hover:bg-secondary/80",
                "transition-all duration-200 hover:scale-105 active:scale-95"
              )}
              title="Open color picker"
            >
              <Pipette className="w-5 h-5 text-secondary-foreground" />
            </button>

            {/* Hidden Native Color Picker */}
            <input
              ref={colorInputRef}
              type="color"
              value={pickerColor}
              onChange={handlePickerChange}
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "p-2 rounded-xl bg-primary text-primary-foreground",
                "transition-all duration-200 hover:scale-105 active:scale-95",
                "shadow-lg shadow-primary/25"
              )}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-destructive text-sm text-center animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}
        </form>

        {/* Quick Colors */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">Or try one of these:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { color: "#FF6B6B", name: "Coral" },
              { color: "#4ECDC4", name: "Teal" },
              { color: "#45B7D1", name: "Sky" },
              { color: "#96CEB4", name: "Sage" },
              { color: "#FFEAA7", name: "Butter" },
              { color: "#DDA0DD", name: "Plum" },
            ].map((preset) => (
              <button
                key={preset.color}
                onClick={() => {
                  setInputValue(preset.color)
                  setPickerColor(preset.color)
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full",
                  "bg-card border border-border hover:border-primary/50",
                  "transition-all duration-200 hover:scale-105 active:scale-95"
                )}
              >
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: preset.color }}
                />
                <span className="text-sm text-foreground">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
