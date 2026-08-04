---
name: fal-sound
description: Seslendirme, müzik ve ses-görüntü senkronu — TTS seçimi, konuşma süresi hesabı, müziğin sahne tonuyla eşleşmesi, ducking. fal-audio agent'ı bunu okur. Use for voiceover TTS, speech duration estimation, background music, audio mixing and ducking.
---

# fal-sound — ses tasarımı

İki iş: seslendirme ve müzik reçetelerini kurmak, bir de **süre denetimi** yapmak — bu ikincisi
zincirdeki tek geri besleme noktasıdır.

## Referanslar

- **`references/sync.md`** — konuşma süresi hesabı, uyuşmazlık bildirimi, miksaj planı
- **`references/music.md`** — sahne tonuyla müzik eşleştirme, ducking seviyeleri

## Girdin ve çıktın

**Girdi:** seslendirme metni (`fal-director`'dan) + sahne süreleri (`fal-animator`'dan, yuvarlanmış hali)
**Çıktı:** TTS reçetesi + müzik reçetesi + miksaj planı + **süre uyuşmazlığı raporu**

## Kapsam kampanyaya göre değişir

`brief.md`'de seslendirme, müzik ve altyazı ayrı ayrı açılıp kapatılır. Kapalı olanı **üretme** —
düğüm ekleme, maliyet yazma. Üçü de kapalıysa yalnızca "ses yok" raporu döndür ve zinciri
`fal-editor`'a geçir.

Altyazı senin işin değil — `fal-edit`'in. Ama seslendirme metni altyazının kaynağıdır; metni
zamanlanabilir cümle parçaları hâlinde teslim et.
