export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString()
}

export const isWithinDays = (date: Date, days: number): boolean => {
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= days && diffDays >= 0
}
