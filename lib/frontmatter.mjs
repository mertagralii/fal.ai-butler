/**
 * Bağımlılıksız, düz anahtar:değer frontmatter ayrıştırıcı.
 *
 * İç içe YAML, çok satırlı değer veya liste desteklemez — plugin dosyalarının
 * frontmatter'ı düz olduğu için gerekmiyor. Karmaşıklaşırsa gerçek bir YAML
 * ayrıştırıcıya geçmek gerekir, ama o zaman bağımlılık kuralını da gözden geçir.
 */
export function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)
  if (!match) return null

  const out = {}
  for (const line of match[1].split(/\r?\n/)) {
    // Yalnızca ilk iki nokta ayırıcıdır; değerin içindeki iki noktalar korunur.
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
    if (kv) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return out
}
