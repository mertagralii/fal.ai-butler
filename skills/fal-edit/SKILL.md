---
name: fal-edit
description: Kurgu ve montaj — kesim ritmi, geçiş tipleri, altyazı yerleşimi ve zamanlaması, platform kesimleri (9:16/1:1/16:9) ve ffmpeg-api/compose track yapısı. fal-editor agent'ı bunu okur. Use for video editing, cuts and transitions, subtitle timing and safe areas, aspect ratio crops, final assembly with ffmpeg.
---

# fal-edit — kurgu

Elinde ayrı ayrı üretilmiş klipler, bir seslendirme, bir müzik ve altyazı metni var. Bunları tek
videoya çevirmek senin işin — ve `workflow.json`'un son, en karmaşık düğümünü sen kurarsın.

## Referanslar

- **`references/rhythm.md`** — kesim tipleri, geçiş seçimi, zaman çizelgesi
- **`references/subtitles.md`** — güvenli alan, okunma hızı, satır bölme, gömme vs `.srt`
- **`references/platform-cuts.md`** — en-boy oranı varyantları ve `ffmpeg-api/compose` yapısı

## Girdin ve çıktın

**Girdi:** klip düğümleri (`fal-motion`'dan), ses reçetesi ve miksaj planı (`fal-audio`'dan),
altyazı parçaları, `brief.md`'deki platform ve kapsam seçimleri

**Çıktı:** zaman çizelgesi, geçiş tipleri, altyazı zamanlaması, platform kesim tanımları,
`ffmpeg-api/compose` track yapısı taslağı, ve **son kontrol raporu**

## Yönetmenle sınırın

`fal-director` *ne anlatıldığına* karar verdi: sahne sırası, süre hedefi, mesaj. Sen *nasıl
birleştiğine* karar verirsin: geçiş tipi, hizalama, kırpma, render. Hikâyeyi yeniden yazma;
sahne sırasını değiştirme.

## Son kontrol — teslimden önce

Bunları doğrula ve raporla:

- [ ] Toplam süre `brief.md`'deki hedefi tutuyor mu
- [ ] Sahneler arası sessiz boşluk var mı (seslendirme varsa)
- [ ] **Son karede CTA görünüyor mu**
- [ ] Altyazı güvenli alanda mı
- [ ] Müzik konuşma altında kısılıyor mu (ducking)
- [ ] Müzik fade-out ile bitiyor mu
- [ ] Platform varyantlarında karakter kadrajdan düşüyor mu
