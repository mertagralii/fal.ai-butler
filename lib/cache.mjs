import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DAY_MS = 86_400_000

/**
 * Cache anahtarını güvenli bir dosya adına çevirir.
 * Endpoint id'leri eğik çizgi içerdiği için (fal-ai/flux/dev) doğrudan dosya adı olamazlar.
 */
export function cacheKeyToFile(key) {
  return key.replace(/[^a-zA-Z0-9._-]/g, '__') + '.json'
}

/**
 * Veriyi zaman damgasıyla birlikte cache'e yazar. Dizin yoksa oluşturur.
 * `now` testler için enjekte edilebilir.
 */
export function writeCache(dir, key, data, { now = Date.now() } = {}) {
  mkdirSync(dir, { recursive: true })
  const payload = { fetchedAt: new Date(now).toISOString(), data }
  writeFileSync(join(dir, cacheKeyToFile(key)), JSON.stringify(payload, null, 2), 'utf8')
  return payload
}

/**
 * Cache'ten okur. Bayat veriyi silmez — `stale: true` ile birlikte yine döndürür,
 * çünkü fal erişilemediğinde bayat veriyle uyararak devam etmek hiç veri olmamasından iyidir.
 */
export function readCache(dir, key, { ttlDays = 7, now = Date.now() } = {}) {
  const miss = { hit: false, stale: false, data: null, fetchedAt: null }
  const file = join(dir, cacheKeyToFile(key))
  if (!existsSync(file)) return miss

  let payload
  try {
    payload = JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return miss
  }

  const age = now - Date.parse(payload.fetchedAt)
  return {
    hit: true,
    stale: !Number.isFinite(age) || age > ttlDays * DAY_MS,
    data: payload.data ?? null,
    fetchedAt: payload.fetchedAt ?? null,
  }
}
