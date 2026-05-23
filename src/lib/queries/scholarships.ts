// Pure query helpers for public scholarship listing
// All functions are pure, accept data as arguments, produce no side effects.

export function filterPublicScholarships<T extends { title_th: string; title_en: string; type: string }>(
  scholarships: T[],
  search: string,
  typeFilter: string
): T[] {
  const q = search.toLowerCase()
  return scholarships.filter(s => {
    const matchSearch =
      s.title_th.toLowerCase().includes(q) || s.title_en.toLowerCase().includes(q)
    const matchFilter = typeFilter === 'all' || s.type === typeFilter
    return matchSearch && matchFilter
  })
}
