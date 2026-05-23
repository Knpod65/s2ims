// Pure utility functions for the mock query layer (no side effects, no data imports)

export function computeDaysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}
