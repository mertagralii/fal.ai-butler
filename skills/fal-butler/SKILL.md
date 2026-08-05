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

   **Tek istisna: `ffmpeg-api` ailesi.** Montaj bir üretim modeli değil, altyapıdır; fal'ın
   `compose` / `merge-videos` / `merge-audio-video` / `merge-audios` endpoint'leri sabit
   isimlerle anılabilir. Yine de **şeması derleme anında okunur** (özellikle metin/altyazı
   track'i desteği) ve **fiyatı `get_pricing`'den alınır** — bu ikisi ezberden yazılmaz.
   Endpoint bulunamazsa katalogda `ffmpeg` araması yapılır.
3. **Onaydan önce dosya yazma.** `campaign` planı sunar, kullanıcı onaylar, *sonra* yazar.
4. **Kullanıcıya ham prompt gösterme.** `storyboard.md` düz Türkçedir. Prompt'lar
   `workflow.json`'un içinde kalır.
5. **Doğrulanmamış JSON teslim etme.** Bkz. `skills/fal-workflow-json/SKILL.md`.

6. **Teslim edilen `workflow.json` import edilir edilmez çalışmalıdır.** Kullanıcı fal
   panelinde **hiçbir alan doldurmamalı, hiçbir eksik tamamlamamalıdır.** İçeri aktar → başlık
   ver → Create → koşar.

   Bu, ürünün temel sözüdür. Sahada tutulamadı ve kullanıcı aynı şeyi üç kez istemek zorunda
   kaldı. Somut karşılıkları:

   - `contents.version`, `contents.output`, `contents.schema.output` **daima yazılır** —
     eksikse panel "Field required" der
   - `contents.schema.input` **boş `{}`** olur; seed ve diğer sabitler düğümlere gömülür.
     Panelde doldurulacak kutu bırakma
   - Referans görsel URL'i gerekiyorsa **kullanıcıdan önceden iste**, workflow'a boş girdi
     olarak bırakma
   - Teslimden önce zihinsel kontrol: *"bu dosyayı import eden biri Create'e basana kadar
     klavyeye dokunuyor mu?"* Cevap evet ise dosya hazır değildir.
6. **Sessizce kapsam düşürme.** Bir şey yapılamıyorsa (altyazı gömülemiyor, model kaldırılmış)
   söyle. Sessizce atlama.

## Referanslar

- **`references/method.md`** — üç komutun uçtan uca yöntemi ve onay kapıları
- **`references/interview.md`** — altı aşamalı röportaj: soru sırası, rehber tablolar, örnekler
- **`references/cache-discipline.md`** — canlı çekme, TTL, çevrimdışı davranış, hata tablosu
- **`references/cost-model.md`** — maliyet kalemleri, tahmin, ucuzlatma taktikleri
- **`references/file-schemas.md`** — `product.md`, `brief.md`, `storyboard.md`, `cost.md` biçimleri

## Yaratıcı ekip

Yedi agent, **dokuz adımda** çalışır. `fal-compiler` iki kez görünür: modelleri baştan seçer
(çünkü `fal-animator` ve `fal-promptsmith` şemalara ihtiyaç duyar), JSON'u sonda derler.

| Adım | Agent | Skill | Ne yapar |
|---|---|---|---|
| 0 | `fal-compiler` *(aşama 1)* | `skills/fal-workflow-json/` | model seçimi + şemalar |
| 1 | `fal-director` | `skills/fal-story/` | hikâye, süreler, VO metni |
| 2 | `fal-dop` | `skills/fal-visual/` | görsel reçeteler |
| 3 | `fal-animator` | `skills/fal-motion/` | hareket + zincirleme grafiği |
| 4 | `fal-audio` | `skills/fal-sound/` | ses + süre denetimi |
| 5 | `fal-animator` *(gerekirse)* | `skills/fal-motion/` | süre düzeltmesi — **tek tur** |
| 6 | `fal-editor` | `skills/fal-edit/` | kurgu + montaj yapısı |
| 7 | `fal-promptsmith` | `skills/fal-prompt/` | tüm prompt'lar |
| 8 | `fal-compiler` *(aşama 2)* | `skills/fal-workflow-json/` | `workflow.json` + doğrulama |

Adım 5 **en fazla bir kez** çalışır; bu zincirdeki tek geri dönüştür (bkz.
`skills/fal-sound/references/sync.md`). Başka geri besleme turu yoktur.

Adım 8, aşama 1'in seçtiği endpoint'leri `.fal-butler/cache/` üzerinden yeniden okur — alt agent
çağrıları durumsuzdur, adım 0'ın belleği adım 8'e taşınmaz.

**Her agent kendi skill'inin `SKILL.md`'sini ve `references/` dosyalarını okur** — agent'ların
`Skill` aracı yoktur, dosyaları `Read` ile açarlar.
