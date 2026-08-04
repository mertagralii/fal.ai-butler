# Montaj ve platform kesimleri

## Tek master, çok varyant

Hikâye bir kez kurulur. Platform farkı üç şeyde ortaya çıkar: **en-boy oranı**, **toplam süre**,
**açılış hook'unun sertliği**. Karakter, sahne sırası ve mesaj değişmez.

| Platform | Oran | Tipik süre | Not |
|---|---|---|---|
| Instagram Reels / TikTok / Shorts | 9:16 | 15–60 sn | Ana hedef. Dikey üretilir |
| Instagram feed | 1:1 | 15–60 sn | Merkezden kırpma |
| YouTube | 16:9 | 30–120 sn | Yatay; dikey masterdan kırpmak zayıf sonuç verir |

**Üretim dikey yapılır**, kırpma dikeyden diğerlerine iner. 9:16'dan 1:1'e kırpmak üstten ve alttan
kesmektir — konu ortadaysa sorunsuz. 9:16'dan 16:9'a inmek agresif bir kesimdir; `fal-dop`'un
kompozisyonunda konu ortadaysa çalışır, değilse varyantı üretme ve kullanıcıya söyle.

## Kırparken karakteri kaybetme

- Kırpma penceresi **yüz merkezli** olsun, geometrik merkez değil.
- Karakter kadraj kenarına yakınsa (bakış boşluğu bırakılmışsa) merkezden kırpma onu keser —
  pencereyi kaydır.
- Kırpma parametrelerini sahne bazında ver, tüm videoya tek pencere uygulama.
- CTA ve altyazı her varyantta güvenli alanda kalmalı; oranı değişince güvenli alan da değişir.

## `ffmpeg-api/compose` track yapısı

Montaj `ffmpeg-api` ailesinin `compose` endpoint'iyle yapılır — altyapı olduğu için adıyla
anılabilen tek istisna (bkz. `skills/fal-butler/SKILL.md`). **Şemasını ve fiyatını derleme
anında oku**; alan adlarını ve saniye ücretini buradan ezberleme. Montaj tipik olarak toplam
maliyetin ihmal edilebilir bir payıdır, ama rakamı `get_pricing` verir.

Kurulacak yapı kavramsal olarak şudur:

| Track | İçerik |
|---|---|
| **video** | Klipler sırayla, geçiş süreleriyle |
| **audio-1** | Seslendirme, sahne bazında zamanlanmış |
| **audio-2** | Müzik, ducking uygulanmış, sonda fade-out |
| **text** *(destekleniyorsa)* | Altyazı ve CTA overlay |

Her track keyframe'lerle zamanlanır: hangi kaynak, hangi saniyede başlar, ne kadar sürer.

**Alternatif endpoint'ler:** `merge-videos` (yalnızca birleştirme), `merge-audio-video`
(video + ses), `merge-audios` (ses karıştırma). `compose` yetmezse bunları zincirleyerek aynı
sonucu kurabilirsin — ama önce `compose`'u dene, tek düğüm daha az kırılgandır.

## Düğüm yapısı

```
node-compose-master   ← tüm video klipleri + ses düğümleri
node-cut-9x16         ← node-compose-master
node-cut-1x1          ← node-compose-master        (istenmişse)
node-cut-16x9         ← node-compose-master        (istenmişse)
output                ← tüm kesim düğümleri
```

Master bir kez üretilir, varyantlar ondan kırpılır — her varyantı sıfırdan üretmek maliyeti
katlar ve tutarlılığı bozar.

**Yalnızca `brief.md`'de istenen platformların varyantını üret.** Kullanıcı sadece Instagram
dediyse 16:9 düğümü ekleme; kullanılmayan düğüm maliyet ve karmaşıklıktır.

## Çıktı formatı

- **Codec:** H.264, MP4 kabı — her platform kabul eder.
- **fps:** Kliplerin fps'i farklıysa montajda eşitle; karışık fps takılma yaratır.
- **Ses:** AAC, 128 kbps yeterli.
- **Çözünürlük:** 9:16 için 1080×1920. Klipler daha düşük çözünürlükte üretildiyse yukarı
  ölçekleme yapma — bulanıklaşır; master'ı klip çözünürlüğünde bırak ve bunu rapor et.
