export const romanticTexts = [
  "this might be the best decision of your week 😌",
  "you stayed here longer than expected 👀",
  "lowkey hoping you pick dinner",
  "okay this vibe kinda works",
  "this is getting suspiciously cute 😭",
]

export function getRandomRomanticText(excludeText?: string): string {
  const filtered = excludeText ? romanticTexts.filter((t) => t !== excludeText) : romanticTexts
  const randomIndex = Math.floor(Math.random() * filtered.length)
  return filtered[randomIndex]
}
