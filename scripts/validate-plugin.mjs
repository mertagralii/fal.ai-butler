/**
 * Plugin yapısal bütünlük denetçisi.
 *
 * Markdown ağırlıklı bir plugin'de "test" budur: manifest geçerli mi, her skill'in
 * adı dizin adıyla eşleşiyor mu, her agent'ın adı dosya adıyla eşleşiyor mu, ve
 * agent/komut gövdelerinde anılan skill'ler gerçekten var mı.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseFrontmatter } from '../lib/frontmatter.mjs'

export const PLUGIN_ERROR = {
  BAD_MANIFEST: 'BAD_MANIFEST',
  MISSING_FRONTMATTER: 'MISSING_FRONTMATTER',
  MISSING_FIELD: 'MISSING_FIELD',
  NAME_MISMATCH: 'NAME_MISMATCH',
  MISSING_SKILL: 'MISSING_SKILL',
}

/**
 * Dizini özyinelemeli tarar. Claude Code isim uzaylı komutları alt dizinde tutar
 * (commands/campaign/quick.md) — düz tarama bunları sessizce denetim dışı bırakır.
 */
function mdFiles(dir) {
  if (!existsSync(dir)) return []
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...mdFiles(full))
    else if (entry.name.endsWith('.md')) out.push(full)
  }
  return out
}

/** Gövdede geçen `skills/<ad>/` yollarını toplar. */
const referencedSkills = (text) => [...text.matchAll(/skills\/([a-z0-9-]+)\//g)].map((m) => m[1])

export function validatePlugin(root) {
  const errors = []
  const push = (code, file, message) => errors.push({ code, file, message })

  // 1. Manifest
  const manifestPath = join(root, '.claude-plugin', 'plugin.json')
  if (!existsSync(manifestPath)) {
    push(PLUGIN_ERROR.BAD_MANIFEST, manifestPath, 'plugin.json yok.')
  } else {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
      for (const field of ['name', 'description', 'version']) {
        if (!manifest[field]) push(PLUGIN_ERROR.MISSING_FIELD, manifestPath, `"${field}" alanı yok.`)
      }
    } catch (err) {
      push(PLUGIN_ERROR.BAD_MANIFEST, manifestPath, `Geçersiz JSON: ${err.message}`)
    }
  }

  // 2. Skill'ler — dizin adı ile frontmatter name'i birebir eşleşmeli
  const skillsDir = join(root, 'skills')
  const skillNames = new Set()
  if (existsSync(skillsDir)) {
    for (const entry of readdirSync(skillsDir)) {
      const skillPath = join(skillsDir, entry)
      if (!statSync(skillPath).isDirectory()) continue
      skillNames.add(entry)

      const file = join(skillPath, 'SKILL.md')
      if (!existsSync(file)) {
        push(PLUGIN_ERROR.MISSING_SKILL, file, 'SKILL.md yok.')
        continue
      }
      const fm = parseFrontmatter(readFileSync(file, 'utf8'))
      if (!fm) {
        push(PLUGIN_ERROR.MISSING_FRONTMATTER, file, 'Frontmatter yok.')
        continue
      }
      if (!fm.description) push(PLUGIN_ERROR.MISSING_FIELD, file, '"description" yok.')
      if (fm.name !== entry) {
        push(PLUGIN_ERROR.NAME_MISMATCH, file, `name "${fm.name}" ≠ dizin adı "${entry}".`)
      }
    }
  }

  const checkSkillRefs = (file, text) => {
    for (const skill of referencedSkills(text)) {
      if (!skillNames.has(skill)) {
        push(PLUGIN_ERROR.MISSING_SKILL, file, `"${skill}" skill'i anılıyor ama yok.`)
      }
    }
  }

  // 3. Agent'lar
  for (const file of mdFiles(join(root, 'agents'))) {
    const text = readFileSync(file, 'utf8')
    const fm = parseFrontmatter(text)
    if (!fm) {
      push(PLUGIN_ERROR.MISSING_FRONTMATTER, file, 'Frontmatter yok.')
      continue
    }
    for (const field of ['name', 'description']) {
      if (!fm[field]) push(PLUGIN_ERROR.MISSING_FIELD, file, `"${field}" yok.`)
    }
    const expected = basename(file, '.md')
    if (fm.name && fm.name !== expected) {
      push(PLUGIN_ERROR.NAME_MISMATCH, file, `name "${fm.name}" ≠ dosya adı "${expected}".`)
    }
    checkSkillRefs(file, text)
  }

  // 4. Komutlar
  for (const file of mdFiles(join(root, 'commands'))) {
    const text = readFileSync(file, 'utf8')
    const fm = parseFrontmatter(text)
    if (!fm) {
      push(PLUGIN_ERROR.MISSING_FRONTMATTER, file, 'Frontmatter yok.')
      continue
    }
    if (!fm.description) push(PLUGIN_ERROR.MISSING_FIELD, file, '"description" yok.')
    checkSkillRefs(file, text)
  }

  return { valid: errors.length === 0, errors }
}

// --- CLI ---
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = process.argv[2] ?? process.cwd()
  const result = validatePlugin(root)

  if (result.valid) {
    console.log('✓ plugin yapısı geçerli')
    process.exit(0)
  }

  console.error(`✗ ${result.errors.length} sorun:`)
  for (const e of result.errors) {
    console.error(`  [${e.code}] ${e.file}: ${e.message}`)
  }
  process.exit(1)
}
