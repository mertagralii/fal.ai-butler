import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readCache, writeCache, cacheKeyToFile } from '../lib/cache.mjs'

const DAY = 86_400_000
const T0 = Date.parse('2026-08-05T00:00:00.000Z')

function tmp() {
  return mkdtempSync(join(tmpdir(), 'falcache-'))
}

test('yazilan cache taze okunur', () => {
  const dir = tmp()
  writeCache(dir, 'models', { a: 1 }, { now: T0 })
  const r = readCache(dir, 'models', { ttlDays: 7, now: T0 + DAY })
  assert.equal(r.hit, true)
  assert.equal(r.stale, false)
  assert.deepEqual(r.data, { a: 1 })
  rmSync(dir, { recursive: true, force: true })
})

test('TTL asilinca bayat isaretlenir ama veri yine doner', () => {
  const dir = tmp()
  writeCache(dir, 'models', { a: 1 }, { now: T0 })
  const r = readCache(dir, 'models', { ttlDays: 7, now: T0 + 8 * DAY })
  assert.equal(r.hit, true)
  assert.equal(r.stale, true)
  assert.deepEqual(r.data, { a: 1 })
  rmSync(dir, { recursive: true, force: true })
})

test('olmayan anahtar hit:false doner, hata atmaz', () => {
  const dir = tmp()
  const r = readCache(dir, 'yok', { now: T0 })
  assert.equal(r.hit, false)
  assert.equal(r.data, null)
  rmSync(dir, { recursive: true, force: true })
})

test('egik cizgili endpoint anahtari dosya adina cevrilir', () => {
  assert.equal(cacheKeyToFile('fal-ai/flux/dev'), 'fal-ai__flux__dev.json')
})

test('egik cizgili anahtar yazilip okunabilir', () => {
  const dir = tmp()
  writeCache(dir, 'fal-ai/flux/dev', { schema: true }, { now: T0 })
  const r = readCache(dir, 'fal-ai/flux/dev', { now: T0 })
  assert.deepEqual(r.data, { schema: true })
  rmSync(dir, { recursive: true, force: true })
})

test('bozuk JSON cache hata atmaz, hit:false doner', () => {
  const dir = tmp()
  writeFileSync(join(dir, cacheKeyToFile('bozuk')), '{ bu json degil', 'utf8')
  const r = readCache(dir, 'bozuk', { now: T0 })
  assert.equal(r.hit, false)
  assert.equal(r.data, null)
  rmSync(dir, { recursive: true, force: true })
})

test('olmayan dizine yazmak dizini olusturur', () => {
  const dir = join(tmp(), 'ic', 'ice')
  writeCache(dir, 'models', { a: 1 }, { now: T0 })
  assert.deepEqual(readCache(dir, 'models', { now: T0 }).data, { a: 1 })
  rmSync(dir, { recursive: true, force: true })
})
