import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseFrontmatter } from '../lib/frontmatter.mjs'
import { validatePlugin, PLUGIN_ERROR } from '../scripts/validate-plugin.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const has = (r, code) => r.errors.some((e) => e.code === code)

/** Geçerli, minimal bir plugin ağacı kurar; testler üstünde bozma yapar. */
function scaffold() {
  const dir = mkdtempSync(join(tmpdir(), 'falplugin-'))
  mkdirSync(join(dir, '.claude-plugin'), { recursive: true })
  writeFileSync(
    join(dir, '.claude-plugin', 'plugin.json'),
    JSON.stringify({ name: 'x', description: 'y', version: '0.1.0' }),
    'utf8',
  )
  mkdirSync(join(dir, 'skills', 'ornek-skill'), { recursive: true })
  writeFileSync(
    join(dir, 'skills', 'ornek-skill', 'SKILL.md'),
    '---\nname: ornek-skill\ndescription: Ornek\n---\n\ngovde',
    'utf8',
  )
  mkdirSync(join(dir, 'agents'), { recursive: true })
  mkdirSync(join(dir, 'commands'), { recursive: true })
  return dir
}

// --- frontmatter ---

test('frontmatter ayristirilir', () => {
  const fm = parseFrontmatter('---\nname: fal-director\ndescription: Senarist\nmodel: sonnet\n---\n\ngovde')
  assert.equal(fm.name, 'fal-director')
  assert.equal(fm.description, 'Senarist')
  assert.equal(fm.model, 'sonnet')
})

test('frontmatter yoksa null doner', () => {
  assert.equal(parseFrontmatter('# baslik\nmetin'), null)
})

test('frontmatter tirnaklari soyar', () => {
  assert.equal(parseFrontmatter('---\nname: "abc"\n---\n').name, 'abc')
})

test('frontmatter icindeki iki nokta degeri bozmaz', () => {
  const fm = parseFrontmatter('---\ndescription: Sunu yapar: bunu\n---\n')
  assert.equal(fm.description, 'Sunu yapar: bunu')
})

// --- plugin ağacı ---

test('mevcut plugin agaci gecerli', () => {
  const r = validatePlugin(ROOT)
  assert.deepEqual(r.errors, [])
  assert.equal(r.valid, true)
})

test('iskelet plugin gecerli', () => {
  const dir = scaffold()
  assert.equal(validatePlugin(dir).valid, true)
  rmSync(dir, { recursive: true, force: true })
})

test('manifest yoksa yakalanir', () => {
  const dir = scaffold()
  rmSync(join(dir, '.claude-plugin', 'plugin.json'))
  assert.ok(has(validatePlugin(dir), PLUGIN_ERROR.BAD_MANIFEST))
  rmSync(dir, { recursive: true, force: true })
})

test('manifestte eksik alan yakalanir', () => {
  const dir = scaffold()
  writeFileSync(join(dir, '.claude-plugin', 'plugin.json'), JSON.stringify({ name: 'x' }), 'utf8')
  assert.ok(has(validatePlugin(dir), PLUGIN_ERROR.MISSING_FIELD))
  rmSync(dir, { recursive: true, force: true })
})

test('skill adi dizin adiyla uyusmazsa yakalanir', () => {
  const dir = scaffold()
  writeFileSync(
    join(dir, 'skills', 'ornek-skill', 'SKILL.md'),
    '---\nname: baska-ad\ndescription: Ornek\n---\n',
    'utf8',
  )
  assert.ok(has(validatePlugin(dir), PLUGIN_ERROR.NAME_MISMATCH))
  rmSync(dir, { recursive: true, force: true })
})

test('SKILL.md olmayan skill dizini yakalanir', () => {
  const dir = scaffold()
  mkdirSync(join(dir, 'skills', 'bos-skill'), { recursive: true })
  assert.ok(has(validatePlugin(dir), PLUGIN_ERROR.MISSING_SKILL))
  rmSync(dir, { recursive: true, force: true })
})

test('agent adi dosya adiyla uyusmazsa yakalanir', () => {
  const dir = scaffold()
  writeFileSync(join(dir, 'agents', 'fal-x.md'), '---\nname: fal-y\ndescription: d\n---\n', 'utf8')
  assert.ok(has(validatePlugin(dir), PLUGIN_ERROR.NAME_MISMATCH))
  rmSync(dir, { recursive: true, force: true })
})

test('agentin andigi olmayan skill yakalanir', () => {
  const dir = scaffold()
  writeFileSync(
    join(dir, 'agents', 'fal-x.md'),
    '---\nname: fal-x\ndescription: d\n---\n\nskills/hayalet-skill/references/a.md oku',
    'utf8',
  )
  assert.ok(has(validatePlugin(dir), PLUGIN_ERROR.MISSING_SKILL))
  rmSync(dir, { recursive: true, force: true })
})

test('agentin andigi var olan skill sorun cikarmaz', () => {
  const dir = scaffold()
  writeFileSync(
    join(dir, 'agents', 'fal-x.md'),
    '---\nname: fal-x\ndescription: d\n---\n\nskills/ornek-skill/references/a.md oku',
    'utf8',
  )
  assert.equal(validatePlugin(dir).valid, true)
  rmSync(dir, { recursive: true, force: true })
})

test('frontmatteri olmayan komut yakalanir', () => {
  const dir = scaffold()
  writeFileSync(join(dir, 'commands', 'setup.md'), '# Setup\n\nfrontmatter yok', 'utf8')
  assert.ok(has(validatePlugin(dir), PLUGIN_ERROR.MISSING_FRONTMATTER))
  rmSync(dir, { recursive: true, force: true })
})

test('descriptionu olmayan komut yakalanir', () => {
  const dir = scaffold()
  writeFileSync(join(dir, 'commands', 'setup.md'), '---\nargument-hint: "[x]"\n---\n', 'utf8')
  assert.ok(has(validatePlugin(dir), PLUGIN_ERROR.MISSING_FIELD))
  rmSync(dir, { recursive: true, force: true })
})
