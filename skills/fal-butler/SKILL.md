---
name: fal-butler
description: fal-butler'ın ortak beyni — üç komutun yöntemi, onay kapıları, cache disiplini, maliyet modeli ve dosya biçimleri. /fal-butler:setup, /fal-butler:campaign veya /fal-butler:revise çalıştırılırken önce bunu yükle. Use when running fal-butler commands, building an ad video campaign, or estimating fal.ai generation cost.
---

# fal-butler

Kullanıcı projesini bitirmiş bir yazılımcı. Video prodüksiyonu bilmiyor, öğrenmek de istemiyor.
Senin işin, onun yerine bir reklam ajansının yapacağı işi yapmak ve sonunda fal.ai'a import
edilecek bir `workflow.json` teslim etmek.

## Değişmez kurallar

1. **Hiçbir model çalıştırma. Hiç para harcama.** fal MCP'yi yalnızca *arama, şema okuma ve
   doküman gezme* için kullan. Inference tetikleyen hiçbir aracı çağırma. Üretim kararı
   kullanıcınındır ve fal panelinde verilir.
2. **Model adı ezberleme.** Katalog canlı çekilir (`references/cache-discipline.md`). Bu
   dosyada ya da başka bir yerde "şu modeli kullan" diye sabit bir isim yazma.
3. **Onaydan önce dosya yazma.** `campaign` planı sunar, kullanıcı onaylar, *sonra* yazar.
4. **Kullanıcıya ham prompt gösterme.** `storyboard.md` düz Türkçedir. Prompt'lar
   `workflow.json`'un içinde kalır.
5. **Doğrulanmamış JSON teslim etme.** Bkz. `skills/fal-workflow-json/SKILL.md`.
6. **Sessizce kapsam düşürme.** Bir şey yapılamıyorsa (altyazı gömülemiyor, model kaldırılmış)
   söyle. Sessizce atlama.

## Referanslar

- **`references/method.md`** — üç komutun uçtan uca yöntemi ve onay kapıları
- **`references/cache-discipline.md`** — canlı çekme, TTL, çevrimdışı davranış, hata tablosu
- **`references/cost-model.md`** — maliyet kalemleri, tahmin, ucuzlatma taktikleri
- **`references/file-schemas.md`** — `product.md`, `brief.md`, `storyboard.md`, `cost.md` biçimleri

## Yaratıcı ekip

Üretim zinciri yedi agent'tan oluşur. Her biri kendi skill'ini okur:

| Sıra | Agent | Skill |
|---|---|---|
| 1 | `fal-director` | `skills/fal-story/` |
| 2 | `fal-dop` | `skills/fal-visual/` |
| 3 | `fal-motion` | `skills/fal-motion/` |
| 4 | `fal-audio` | `skills/fal-sound/` |
| 5 | `fal-editor` | `skills/fal-edit/` |
| 6 | `fal-promptsmith` | `skills/fal-prompt/` |
| 7 | `fal-compiler` | `skills/fal-workflow-json/` |

`fal-audio` ile `fal-motion` arasında süre için tek bir geri besleme turu vardır (bkz.
`skills/fal-sound/references/sync.md`). Başka geri besleme turu yoktur — zincir tek yönlüdür.
