export interface Color {
  hex: string
  hsl: { h: number; s: number; l: number }
  rgb: { r: number; g: number; b: number }
}

export type HarmonyMode = 
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'tetradic'
  | 'split-complementary'
  | 'monochromatic'

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 0 }
  
  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { r: 0, g: 0, b: 0 }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

export function generateRandomHue(): number {
  return Math.floor(Math.random() * 360)
}

export function generatePalette(baseHue: number, mode: HarmonyMode): Color[] {
  const baseSaturation = 65 + Math.random() * 20
  const baseLightness = 50 + Math.random() * 15

  let hues: number[] = []

  switch (mode) {
    case 'analogous':
      hues = [
        baseHue,
        (baseHue + 30) % 360,
        (baseHue + 60) % 360,
        (baseHue - 30 + 360) % 360,
        (baseHue - 60 + 360) % 360,
      ]
      break
    case 'complementary':
      hues = [
        baseHue,
        (baseHue + 180) % 360,
        (baseHue + 15) % 360,
        (baseHue + 180 + 15) % 360,
        (baseHue - 15 + 360) % 360,
      ]
      break
    case 'triadic':
      hues = [
        baseHue,
        (baseHue + 120) % 360,
        (baseHue + 240) % 360,
        (baseHue + 60) % 360,
        (baseHue + 180) % 360,
      ]
      break
    case 'tetradic':
      hues = [
        baseHue,
        (baseHue + 90) % 360,
        (baseHue + 180) % 360,
        (baseHue + 270) % 360,
        (baseHue + 45) % 360,
      ]
      break
    case 'split-complementary':
      hues = [
        baseHue,
        (baseHue + 150) % 360,
        (baseHue + 210) % 360,
        (baseHue + 30) % 360,
        (baseHue - 30 + 360) % 360,
      ]
      break
    case 'monochromatic':
      hues = [baseHue, baseHue, baseHue, baseHue, baseHue]
      break
  }

  return hues.map((hue, index) => {
    let saturation = baseSaturation
    let lightness = baseLightness

    if (mode === 'monochromatic') {
      saturation = baseSaturation - index * 5 + Math.random() * 10
      lightness = 30 + index * 12 + Math.random() * 5
    } else {
      saturation = Math.max(40, Math.min(90, baseSaturation + (Math.random() - 0.5) * 20))
      lightness = Math.max(35, Math.min(70, baseLightness + (Math.random() - 0.5) * 15))
    }

    const hex = hslToHex(hue, saturation, lightness)
    return {
      hex,
      hsl: { h: hue, s: Math.round(saturation), l: Math.round(lightness) },
      rgb: hexToRgb(hex),
    }
  })
}

export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function generatePaletteFromHex(hex: string, mode: HarmonyMode): Color[] {
  const hsl = hexToHsl(hex)
  return generatePalette(hsl.h, mode)
}

export function isValidHex(hex: string): boolean {
  return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

export function normalizeHex(hex: string): string {
  let normalized = hex.replace('#', '')
  if (normalized.length === 3) {
    normalized = normalized.split('').map(c => c + c).join('')
  }
  return `#${normalized.toLowerCase()}`
}
