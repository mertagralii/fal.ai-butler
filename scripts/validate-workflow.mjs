/**
 * fal workflow JSON bütünlük denetçisi.
 *
 * Şemanın tanımı ve kaynakları: skills/fal-workflow-json/references/schema.md
 * Özet: düğümler `contents.nodes` altında; `run` düğümleri `app` + `input`,
 * `display` düğümleri `fields` kullanır; `input` sanal bir düğümdür ve
 * `contents.schema.input` ile tanımlanır.
 */

import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export const ERROR = {
  NOT_OBJECT: 'NOT_OBJECT',
  MISSING_CONTENTS: 'MISSING_CONTENTS',
  MISSING_NODES: 'MISSING_NODES',
  MISSING_INPUT_SCHEMA: 'MISSING_INPUT_SCHEMA',
  MISSING_OUTPUT_NODE: 'MISSING_OUTPUT_NODE',
  NODE_ID_MISMATCH: 'NODE_ID_MISMATCH',
  UNKNOWN_DEPENDENCY: 'UNKNOWN_DEPENDENCY',
  UNRESOLVED_REFERENCE: 'UNRESOLVED_REFERENCE',
  UNKNOWN_INPUT_FIELD: 'UNKNOWN_INPUT_FIELD',
  REFERENCE_NOT_DECLARED: 'REFERENCE_NOT_DECLARED',
  CYCLE: 'CYCLE',
  UNKNOWN_ENDPOINT: 'UNKNOWN_ENDPOINT',
}

/** `input` gerçek bir düğüm değildir; şemadan gelen sanal kaynaktır. */
const VIRTUAL_INPUT = 'input'

const isPlainObject = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v)

/**
 * "$dugum-id.alan.yol" ifadesini bir düğüm id'sine çözer.
 *
 * Düğüm id'leri eğik çizgi ve nokta içerebildiği için (fal_ai/bytedance/seedream/v4/edit_2)
 * regex ile ayrıştırmak güvenilir değil; bilinen id'lere karşı en uzun önek eşlemesi yapılır.
 */
export function resolveRef(ref, nodeIds) {
  if (typeof ref !== 'string' || !ref.startsWith('$')) return null
  const body = ref.slice(1)
  let best = null
  for (const id of nodeIds) {
    if (body === id || body.startsWith(id + '.')) {
      if (best === null || id.length > best.length) best = id
    }
  }
  return best
}

/** Bir referansın düğüm id'sinden sonraki alan yolunu döndürür. */
function refPath(ref, nodeId) {
  const body = ref.slice(1)
  return body === nodeId ? '' : body.slice(nodeId.length + 1)
}

/**
 * Katalog dosyasını zarfından çıkarır.
 *
 * `lib/cache.mjs` veriyi `{ fetchedAt, data }` zarfına sarar; `--catalog` ile verilen dosya
 * doğrudan o zarftır. Zarfsız (elle yazılmış) katalog da kabul edilir.
 */
export function unwrapCatalog(raw) {
  if (!isPlainObject(raw)) return null
  return isPlainObject(raw.data) ? raw.data : raw
}

/** Bir değerin içindeki tüm "$..." string'lerini toplar (nesne ve dizilerde derinlemesine). */
function collectRefs(value, out = []) {
  if (typeof value === 'string') {
    if (value.startsWith('$')) out.push(value)
  } else if (Array.isArray(value)) {
    for (const v of value) collectRefs(v, out)
  } else if (isPlainObject(value)) {
    for (const v of Object.values(value)) collectRefs(v, out)
  }
  return out
}

export function validateWorkflow(workflow, { catalog = null } = {}) {
  const errors = []
  const push = (code, node, message) => errors.push({ code, node, message })

  if (!isPlainObject(workflow)) {
    push(ERROR.NOT_OBJECT, null, 'Workflow bir JSON nesnesi olmalı.')
    return { valid: false, errors }
  }

  const contents = workflow.contents
  if (!isPlainObject(contents)) {
    push(ERROR.MISSING_CONTENTS, null, '"contents" nesnesi yok. Düğümler contents.nodes altındadır.')
    return { valid: false, errors }
  }

  const nodes = contents.nodes
  if (!isPlainObject(nodes)) {
    push(ERROR.MISSING_NODES, null, '"contents.nodes" nesnesi yok.')
    return { valid: false, errors }
  }

  const inputSchema = contents.schema?.input
  if (!isPlainObject(inputSchema)) {
    push(ERROR.MISSING_INPUT_SCHEMA, null, '"contents.schema.input" yok — workflow girdileri tanımsız.')
  }
  const inputFields = isPlainObject(inputSchema) ? Object.keys(inputSchema) : []

  const ids = Object.keys(nodes)
  const resolvable = [...ids, VIRTUAL_INPUT]

  if (!ids.some((id) => nodes[id]?.type === 'display')) {
    push(ERROR.MISSING_OUTPUT_NODE, null, 'type:"display" olan bir çıkış düğümü yok.')
  }

  for (const id of ids) {
    const node = nodes[id]
    const depends = Array.isArray(node?.depends) ? node.depends : []

    if (node?.id !== undefined && node.id !== id) {
      push(ERROR.NODE_ID_MISMATCH, id, `Düğümün "id" alanı "${node.id}" ama haritadaki anahtar "${id}".`)
    }

    for (const dep of depends) {
      if (dep !== VIRTUAL_INPUT && !ids.includes(dep)) {
        push(ERROR.UNKNOWN_DEPENDENCY, id, `"${dep}" diye bir düğüm yok.`)
      }
    }

    // run düğümleri "input", display düğümleri "fields" kullanır — ikisini de tara.
    for (const ref of collectRefs(node?.input).concat(collectRefs(node?.fields))) {
      const target = resolveRef(ref, resolvable)

      if (target === null) {
        push(ERROR.UNRESOLVED_REFERENCE, id, `"${ref}" hiçbir düğüme veya input'a çözülmüyor.`)
        continue
      }

      if (target === VIRTUAL_INPUT) {
        const field = refPath(ref, VIRTUAL_INPUT).split('.')[0]
        if (inputFields.length > 0 && field && !inputFields.includes(field)) {
          push(ERROR.UNKNOWN_INPUT_FIELD, id, `"${ref}" — "${field}" contents.schema.input içinde tanımlı değil.`)
        }
      }

      if (!depends.includes(target)) {
        push(
          ERROR.REFERENCE_NOT_DECLARED,
          id,
          `"${ref}" ifadesi "${target}" düğümüne işaret ediyor ama depends listesinde yok.`,
        )
      }
    }

    // Katalog verildiyse, çalıştırılan modelin gerçekten var olduğunu doğrula.
    if (catalog && node?.type === 'run') {
      const known =
        isPlainObject(catalog.endpoints) &&
        typeof node.app === 'string' &&
        Object.prototype.hasOwnProperty.call(catalog.endpoints, node.app)
      if (!known) {
        push(
          ERROR.UNKNOWN_ENDPOINT,
          id,
          node.app
            ? `"${node.app}" katalogda yok — kaldırılmış veya yanlış yazılmış olabilir.`
            : '"app" alanı yok — run düğümü hangi modeli çalıştıracağını bildirmeli.',
        )
      }
    }
  }

  // Döngü tespiti — DFS, üç renkli işaretleme (0 beyaz, 1 gri, 2 siyah).
  // Sanal "input" düğümü grafikte yer almaz, dolayısıyla döngüye giremez.
  const color = new Map(ids.map((id) => [id, 0]))
  const reported = new Set()

  const visit = (id, stack) => {
    if (color.get(id) === 2) return
    if (color.get(id) === 1) {
      const chain = stack.slice(stack.indexOf(id)).concat(id).join(' → ')
      if (!reported.has(chain)) {
        reported.add(chain)
        push(ERROR.CYCLE, id, `Döngü: ${chain}`)
      }
      return
    }
    color.set(id, 1)
    stack.push(id)
    const depends = Array.isArray(nodes[id]?.depends) ? nodes[id].depends : []
    for (const dep of depends) {
      if (color.has(dep)) visit(dep, stack)
    }
    stack.pop()
    color.set(id, 2)
  }

  for (const id of ids) visit(id, [])

  return { valid: errors.length === 0, errors }
}

// --- CLI ---
// pathToFileURL kullanılıyor: Windows'ta ham process.argv[1] karşılaştırması
// yol ayracı ve sürücü harfi yüzünden sessizce eşleşmez.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2)
  const file = args.find((a) => !a.startsWith('--'))
  const catalogIndex = args.indexOf('--catalog')

  if (!file) {
    console.error('Kullanım: node scripts/validate-workflow.mjs <workflow.json> [--catalog <catalog.json>]')
    process.exit(2)
  }

  let workflow
  let catalog = null
  try {
    workflow = JSON.parse(readFileSync(file, 'utf8'))
    if (catalogIndex !== -1) {
      const catalogFile = args[catalogIndex + 1]
      if (!catalogFile) {
        console.error('--catalog bir dosya yolu bekliyor.')
        process.exit(2)
      }
      catalog = unwrapCatalog(JSON.parse(readFileSync(catalogFile, 'utf8')))
    }
  } catch (err) {
    console.error(`Dosya okunamadı veya geçersiz JSON: ${err.message}`)
    process.exit(2)
  }

  const result = validateWorkflow(workflow, { catalog })

  if (result.valid) {
    console.log(`✓ ${file} geçerli`)
    process.exit(0)
  }

  console.error(`✗ ${file} — ${result.errors.length} sorun:`)
  for (const e of result.errors) {
    console.error(`  [${e.code}]${e.node ? ` ${e.node}:` : ''} ${e.message}`)
  }
  process.exit(1)
}
