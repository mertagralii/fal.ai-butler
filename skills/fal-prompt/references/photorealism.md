# Fotogerçekçilik ve anatomi

**Kaynak:** higgsfield.ai/seedance-4k galerisindeki üretimlerin prompt'ları, 2026-08-05'te
tarayıcıyla incelendi (iki örnek tam okundu, biri önceki oturumdan).

## Mutlak kural: anatomi bozukluğu kabul edilemez

Eksik uzuv, fazladan parmak, üç göz, gövdeye bağlanmayan el, deforme yüz — bunlar "AI videosu
böyledir" diye geçiştirilemez. Teslim edilen hiçbir karede bulunmamalıdır.

`negative_prompt` çoğu yeni modelde **yok** (bkz. `negative-prompts.md`), dolayısıyla anatomi
"olmasın" diyerek değil, **olumlu ve somut tarif ederek** korunur.

### Anatomiyi olumlu cümleyle sabitle

Referans prompt'ların hiçbiri negatif prompt kullanmıyor. Kaliteyi şununla alıyorlar:

| Yerine | Bunu yaz |
|---|---|
| "bozuk el olmasın" | "both hands fully visible with five fingers each, natural finger articulation" |
| "uzuv eksik olmasın" | "left forearm entering frame from the left, shoulder visible at frame edge" |
| "yüz bozulmasın" | "photoreal skin with visible pores, fine facial texture, natural subsurface scattering" |
| "saç garip olmasın" | "realistic hair physics with individual strand detail" |

### Kadraj kuralı

**Eller ve uzuvlar için aşırı yakın plan kurma.** Gövdeye bağlanmayan bir uzuv kadraja girerse
model boşluğu halüsinasyonla doldurur — sahada "uçan el" tam olarak böyle çıktı. El
gösterilecekse **kol hattı da kadrajda olsun.**

### Riskli kadrajları baştan eleme

- İki kişinin elleri birbirine değiyor → parmak karışması
- Eller yüze yakın → parmak/yüz füzyonu
- Hızlı el hareketi → hareket bulanıklığında parmak kaybı
- Aynada/ekranda yansıyan yüz → ikinci bozuk yüz

Bunlar gerekiyorsa **planı değiştir**, riski kabul etme.

---

## Referans prompt kalıbı

İncelenen üretimlerin ikisi de aynı yapıyı kullanıyor. Bu, **kopyalanacak iskelettir**:

```
ASPECT RATIO: <oran> — LOCKED. Do not crop to vertical or square.

SHOT 1 — <kısa ad>
<kamera hareketi tek akış olarak; @Image N referansları cümlenin içinde>

SHOT 2 — <kısa ad>
<...>

STYLE (apply to all shots):
<kamera gövdesi, lens, kontrast, halation, shutter, fotogerçekçilik sözlüğü, grain, süre, ton>

CONTINUITY NOTES (for matching <önceki>):
<açık eşleştirme talimatları>
```

### Blok blok ne yapıyor

**ASPECT RATIO … LOCKED.** Oranı kilitleyen açık bir cümle. Bizim dikey (9:16) kampanyalarımızda
karşılığı: `ASPECT RATIO: 9:16 vertical, mobile cinematic frame — LOCKED. Do not crop to
horizontal or square.`

**SHOT 1 / SHOT 2 — tek üretimde birden fazla plan.** Referans prompt'lar kesme işini montaja
değil **modele** yaptırıyor: *"Camera starts wide/medium … moves in smoothly, arcing around to
the front of her, coming to rest in a close-up."* Kamera hareketi kesintisiz bir akış olarak
tarif ediliyor ve kadro değişimi üretimin içinde oluyor.

Bu, bizim **sahneler arası kopukluk** sorunumuzun kökten çözümüdür — `compose` yalnızca sert
kesim yapabildiği için (`skills/fal-edit/references/compose-schema.md`) geçişi modele
yaptırmak tek akıcı yol.

**Model destekliyorsa iki beat'i tek klipte üret.** Klip sayısı düşer, montaj boşluğu riski
azalır, geçiş doğal olur.

**STYLE — hepsine uygulanan tek blok.** Her sahnede yeniden yazılmaz; bir kez yazılıp
"apply to all shots" denir. Sahnelere göre değişmemesi gereken şey buradadır.

**CONTINUITY NOTES.** Ne eşleşmeli, açıkça: *"Match bike speed/lean at tunnel exit to the last
frame of Video 1"*, *"Match light direction/color temp (golden hour, sun angle) to avoid a jump
cut in lighting"*, *"Match helmet state."*

Bizde karşılığı: karakterin duruşu, ışık yönü/sıcaklığı, kıyafet durumu, elindeki nesne.

**Süreyi prompt'un içinde de yaz** — referanslarda `10 seconds` STYLE bloğunun içinde geçiyor.

---

## Fotogerçekçilik sözlüğü

İncelenen prompt'lardan birebir alınan, işe yaradığı görülen terimler. Türkçe reçeteyi
İngilizceye çevirirken bunları kullan:

**Cilt ve yüz**
> photoreal skin with visible pores · fine facial texture · natural subsurface scattering ·
> unretouched skin · natural skin grain · micro-texture · warm natural skin tones

**Saç ve kumaş**
> realistic hair physics with individual strand detail · true-to-life fabric movement

**Kamera ve optik**
> shot on ARRI Alexa · 35mm · Cooke prime lens character · gentle contrast ·
> mild halation around highlights · smooth highlight roll-off ·
> natural 180-degree shutter motion blur · fine 35mm film grain throughout

**Genel**
> hyper-realistic live-action footage · cinematic, observational art-film realism ·
> photoreal <mekan> with natural imperfections · cinematic color grading ·
> minimalist editorial framing

### "Natural imperfections" en önemli terim

Sahada "çok AI kokuyor" şikâyetinin panzehiri budur. Model varsayılan olarak fazla temiz, fazla
simetrik, fazla parlak üretir. **Kusuru açıkça iste:** doğal cilt dokusu, hafif grain, dağınık
saç teli, mekânda gerçek kullanım izleri.

---

## Kalite ayarları

Referans üretimlerin künyesi: **Seedance 2 · 4k · Bitrate: High · 3840×2160**.

Bizim sahadaki çıktımız 1080×1920 klipler + 720×1280 final montajdı. Aradaki farkın önemli bir
kısmı **model sınıfı ve çözünürlük/bitrate tercihinden** geliyor, prompt'tan değil.

Şema izin veriyorsa çözünürlük ve bitrate'i **en yükseğe** ayarla ve maliyet farkını onay
kapısında kullanıcıya göster. Kalite bir bütçe kararıdır ve karar kullanıcınındır — ama seçeneği
sunmak bizim işimiz. `compose`'un çıktıyı 720p'ye düşürdüğünü de aynı yerde söyle.
