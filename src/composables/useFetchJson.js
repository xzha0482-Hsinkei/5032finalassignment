export async function useFetchJson(path, fallback = []) {
  try {
    const res = await fetch(path, { cache: 'no-cache' })
    if (res.ok) {
      const data = await res.json()
      return Array.isArray(data) ? data : fallback
    }
  } catch {}
  return fallback
}
