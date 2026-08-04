# Model seçimi

## Kural: isim ezberleme

Bu dosyada hiçbir model adı yazmaz ve yazılmamalıdır. fal'ın kataloğu sürekli değişiyor;
sabit bir isim bugün çalışıp altı ay sonra `UNKNOWN_ENDPOINT` verir. Model her seferinde
**katalogdan aranır**.

## Kampanyanın ihtiyaç duyduğu modaliteler

| Sıra | Modalite | Ne için | Kaç düğüm |
|---|---|---|---|
| 1 | text-to-image | Karakter sayfası | 1 (çok görselli) |
| 2 | image-edit / referanslı image | Sahne anahtar kareleri | sahne sayısı kadar |
| 3 | image-to-video | Sahne videoları | sahne sayısı kadar |
| 4 | video-to-image | Son kare çıkarma (zincir) | sahne sayısı − 1 |
| 5 | text-to-speech | Seslendirme | 1 (kapsam açıksa) |
| 6 | text-to-music | Müzik | 1 (kapsam açıksa) |
| 7 | ffmpeg | Montaj ve kesimler | 1 + varyant sayısı |

4. sıra katalogda karşılığı olmayabilir — bkz. "Bulunamazsa" bölümü.

## Arama yöntemi

fal MCP'nin model arama aracını kullan. Modaliteyi ve ihtiyacı birlikte ara:

- Karakter sayfası → yüksek kaliteli, tutarlı yüz üreten text-to-image
- Anahtar kare → **referans görsel kabul eden** image-edit; bu şart, opsiyon değil
- Sahne videosu → image-to-video; ideal olarak first/last frame destekli
- Seslendirme → seçilen dili destekleyen TTS
- Montaj → `ffmpeg-api` ailesi

Sonuçları cache'e yaz (`skills/fal-butler/references/cache-discipline.md`).

## Adayı elemek — şemadan kontrol edilecekler

Bir modeli seçmeden önce şemasını çek ve şunlara bak:

| Kontrol | Neden | Kim kullanacak |
|---|---|---|
| `duration` kabul edilen değerler | Sahne süresi tutuyor mu | `fal-animator` |
| `aspect_ratio` / `resolution` | 9:16 destekliyor mu | `fal-animator`, `fal-edit` |
| **`image_urls` — dizi, en az 2 kabul ediyor mu** | Zincirleme mümkün mü | `fal-animator` |
| `end_image_url` benzeri | first/last frame var mı | `fal-animator` |
| `seed` | Determinizm mümkün mü | `fal-prompt` |
| `negative_prompt` | Negatif prompt yazılacak mı | `fal-prompt` |
| `strength` | Referansa bağlılık ayarlanabiliyor mu | `fal-prompt` |
| Prompt alanının biçimi | Hangi lehçe | `fal-prompt` |
| Fiyat ve birimi | Maliyet tahmini | `fal-butler` cost-model |
| Dil desteği (TTS) | Türkçe var mı | `fal-audio` |

**Referans görsel desteği olmayan bir model anahtar kare üretiminde kullanılamaz** — tutarlılık
stratejisi çöker. Bu eleme kriteri, kalite veya fiyattan önce gelir.

**Tekil `image_url` yetmez.** Zincirleme, anahtar kare N için **aynı anda iki referans** ister:
karakter sayfası *ve* sahne N−1'in son karesi (bkz.
`skills/fal-motion/references/keyframe-chaining.md`). Tek referans alan bir model bu filtreden
geçer gibi görünüp zinciri sessizce koparır. Şemadan **dizi alanı** ve kabul ettiği **azami
referans sayısı** doğrulanır. Yalnızca tekil referans varsa: karakter sayfasını referans al,
zinciri kur*ma*, ve bunu `fal-animator`'a ve kullanıcıya bildir.

## Fiyat ayrı bir araçtan gelir

`search_models` sonucu **fiyat taşımaz**. Fiyat için `get_pricing` aracını ayrıca çağır ve
sonucu kataloğa ekleyerek cache'e yaz. Maliyet tahmini buna dayanıyor
(`skills/fal-butler/references/cost-model.md`); fiyatsız katalogla onay kapısındaki tablo
boş çıkar.

## Seçim önceliği

1. **Yeteneği karşılıyor mu** — referans desteği, süre, oran. Karşılamıyorsa eleme.
2. **Kalite** — resmi örnekler ve model açıklaması.
3. **Fiyat** — eşit yetenekte ucuz olanı seç.
4. **Kararlılık** — deneysel/preview etiketli modelleri varsayılan yapma; kullanıcı istemedikçe
   kararlı sürümü tercih et.

## Tutarlılık kuralı

**Aynı modaliteyi tüm sahnelerde aynı modelle üret.** Sahne 1'i bir modelle, sahne 2'yi başkasıyla
üretmek karakteri değiştirir — model değişimi, prompt değişiminden daha yıkıcıdır.

## Bulunamazsa

**Son kare çıkarma (video-to-image) yoksa:** zinciri yalnızca karakter sayfası üzerinden kur.
Tutarlılık bir miktar zayıflar. Bunu `fal-animator`'a ve **kullanıcıya** bildir — sessizce zayıf
zincir kurma.

**Bir modalite hiç yoksa** (örneğin Türkçe TTS): kullanıcıya söyle ve seçenek sun — İngilizce
seslendirme mi, seslendirmesiz altyazılı mı. Karar onun.

**Seçilen model sonradan kaldırılmışsa:** aynı modalitede muadil ara, kurguyu bozmadan değiştir,
kullanıcıya bildir. Fiyat farkı varsa `cost.md`'yi güncelle.

## Teslim

`fal-promptsmith`'e her düğüm için şunu ver: seçilen endpoint id'si, şeması, resmi örnek
prompt'ları ve şemadan okunan kısıtlar. Prompt'u sen yazma — o yazar.
