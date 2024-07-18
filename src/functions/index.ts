export function hexToRGBA(hex: string, alpha: number): string {
  // Remove the leading # if present
  hex = hex.replace('#', '')

  // Validate hex string length and characters
  const validHex = /^[0-9A-Fa-f]{6}$/
  if (!validHex.test(hex)) {
    throw new Error('Invalid hex color string')
  }

  // Parse the r, g, b values
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Create the rgba string
  const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`

  return rgba
}
