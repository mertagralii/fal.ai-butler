/**
 * Bağımlılıksız frontmatter ayrıştırıcı.
 *
 * Desteklenen: düz `anahtar: değer`, blok skaler `anahtar: |` (satırlar korunur) ve
 * katlanmış skaler `anahtar: >` (satırlar boşlukla birleşir).
 *
 * Blok skaler desteği şart: agent frontmatter'ları `description: |` altında çok satırlı
 * <example> blokları taşır. Bunu okuyamayan bir ayrıştırıcı, description'ı "|" sanıp
 * geri kalanı sessizce yutar ve bozuk agent'ları geçerli gösterir.
 *
 * Desteklenmeyen: iç içe haritalar, listeler, çapa/referanslar. Bunlara ihtiyaç doğarsa
 * gerçek bir YAML ayrıştırıcıya geç — ama o zaman sıfır-bağımlılık kuralını da gözden geçir.
 */

/** Sadece dengeli tırnakları soyar; `fal'in workflow'u` gibi değerler bozulmaz. */
function unquote(value) {
  if (value.length >= 2) {
    const first = value[0]
    const last = value[value.length - 1]
    if ((first === '"' || first === "'") && first === last) return value.slice(1, -1)
  }
  return value
}

export function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)
  if (!match) return null

  const lines = match[1].split(/\r?\n/)
  const out = {}

  for (let i = 0; i < lines.length; i++) {
    // Yalnızca girintisiz satırlar yeni bir anahtar başlatabilir; girintili satırlar
    // bir blok skalerin gövdesidir ve aşağıda tüketilir.
    const kv = /^([A-Za-z0-9_-]+):[ \t]*(.*)$/.exec(lines[i])
    if (!kv) continue

    const [, key, rawValue] = kv
    const value = rawValue.trim()

    if (value === '|' || value === '>' || value === '|-' || value === '>-') {
      const folded = value.startsWith('>')
      const body = []
      let j = i + 1
      for (; j < lines.length; j++) {
        const line = lines[j]
        // Boş satır bloğun parçasıdır; girintisiz dolu satır bloğu bitirir.
        if (line.trim() !== '' && !/^[ \t]/.test(line)) break
        body.push(line.replace(/^[ \t]{1,4}/, ''))
      }
      while (body.length > 0 && body[body.length - 1].trim() === '') body.pop()

      out[key] = folded
        ? body.map((l) => l.trim()).filter(Boolean).join(' ')
        : body.join('\n')

      i = j - 1
      continue
    }

    out[key] = unquote(value)
  }

  return out
}
