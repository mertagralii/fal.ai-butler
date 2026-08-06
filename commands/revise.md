---
description: Var olan bir kampanyanın workflow.json'unu revize eder — maliyeti düşürür ya da kurguyu değiştirir. Mevcut bir workflow.json olmadan çalışmaz.
argument-hint: "[kampanya-adı] [ne değişsin]"
---

# fal-butler revizyon

**Argümanlar:** `$ARGUMENTS`

İlk sözcük bir kampanya slug'ıyla eşleşiyorsa o kampanya seçilir; kalanı revizyon isteğidir.
Boşsa kampanyayı ve isteği sor.

Kullanıcı fal panelinde akışı ve gerçek fiyatı gördü, şimdi bir şey değiştirmek istiyor.
Maliyet de kurgu da aynı işi gerektirir: mevcut JSON'u okuyup değiştirmek.

## Önce beynini yükle

`fal-butler` skill'ini **şimdi** yükle.

Referanslar: `${CLAUDE_PLUGIN_ROOT}/skills/fal-butler/references/`
— `cost-model.md` (ucuzlatma taktikleri), `method.md`, `file-schemas.md`.

Alt agent'lara `${CLAUDE_PLUGIN_ROOT}` yolunu ve okuyacakları referansları adıyla ilet.

## Mutlak kurallar

1. **Hiçbir model çalıştırma, hiç para harcama.**
2. **Değiştirmeden önce yedekle.**
3. **Her değişiklikten sonra doğrula.**
4. **Kaliteyi kullanıcıya sormadan düşürme.** Her ucuzlatma bir takastır; kararı o verir.

## 1. Ön koşul — sert

`.fal-butler/campaigns/*/workflow.json` ara.

- **Hiç yoksa:** dur. "Henüz bir kampanya yok — önce `/fal-butler:campaign` çalıştır."
- **Birden fazla varsa:** hangisi olduğunu sor (argümanda verilmediyse).
- **Tek varsa:** onu kullan, hangisini seçtiğini söyle.

Bu komut mevcut bir `workflow.json` olmadan **çalışmaz**.

## 2. Yedekle

Değişiklikten **önce** kopyala:

```
.fal-butler/campaigns/<slug>/revisions/<YYYY-MM-DDTHH-mm-ss>-workflow.json
```

Zaman damgasında `:` kullanma — Windows'ta geçersiz dosya adı.

## 3. Ne isteniyor

### Maliyet revizyonu

Önce **nereye gittiğini göster** — `cost.md`'yi oku, güncelse kullan; katalog bayatladıysa
fiyatları tazele.

```
Maliyetin dağılımı: video %62 · görüntü %21 · ses %12 · montaj %5

Seçenekler:
1. Çözünürlük 1080p → 720p        −%35   feda: büyük ekranda netlik (sosyal medyada fark az)
2. Sahne süreleri 8 sn → 6 sn      −%18   feda: dönüş sahnesi acele hissi verebilir
3. Video modeli → <muadil>         −%28   feda: hareket akıcılığı bir tık düşer
4. Sahne sayısı 6 → 4              −%30   feda: kurgu; hangi sahnenin düşeceğine fal-director karar verir
```

Yüzdeleri **katalogdaki gerçek fiyatlardan hesapla**. Kullanıcı seçer, sen uygularsın.

**Asla önerme:** karakter sayfasını kaldırmak, zincirlemeyi kaldırmak. Bunlar ucuzlatma değil,
kampanyayı çöpe atmaktır — gerekçesiyle birlikte reddet.

### Kurgu revizyonu

**Önce sahneyi klibe çevir.** Kullanıcı "3. sahne" der ama üretim birimi klip; bir klip birden
fazla sahne taşıyabilir. `storyboard.md`'deki **sahne → klip eşlemesi** tablosuna bak.

**Bunun sonucunu kullanıcıya söyle:**

> Sahne 3, klip 2'nin içinde — o klip sahne 3 ve 4'ü birlikte taşıyor. Sahne 3'ü düzeltmek için
> klibi yeniden üretmem gerekiyor, yani **sahne 4 de değişecek.** Sahne 4'ten memnunsan
> ikisini ayrı kliplere bölebilirim ama o zaman aradaki geçiş sert kesim olur ve akıcılık düşer.
>
> Nasıl ilerleyelim?

Bu, sahne–klip ayrımının kaçınılmaz bedeli ve kullanıcı bunu **önceden** bilmeli. Sessizce
komşu sahneyi değiştirme.

Etkilenen klibi belirledikten sonra ilgili agent'ı yeniden çalıştır, zincirin kalanını koru:

| İstek | Kim çalışır | Etki |
|---|---|---|
| "3. sahne daha aydınlık" | `fal-dop` → `fal-promptsmith` → `fal-compiler` | **sahnenin bulunduğu klip** yeniden üretilir — o klipteki tüm sahneler değişir |
| "3. sahne daha yavaş" | `fal-animator` → `fal-promptsmith` → `fal-compiler` | aynı — klip bazında |
| "3. sahneyi at, 5'i uzat" | `fal-director` → `fal-animator` → tüm zincir | süre değişti, **klip paketlemesi yeniden hesaplanır** |
| "sahne 3 ile 4 ayrı klip olsun" | `fal-animator` → sonrası | klip sayısı artar, aradaki geçiş sert kesim olur |
| "karakter daha genç olsun" | `fal-director` → tüm zincir | **karakter sayfası + tüm klipler yeniden** |
| "müziği çıkar" | `fal-audio` → `fal-editor` → `fal-compiler` | düğüm silinir |
| "müziği ben ekleyeceğim" | `fal-editor` → `fal-compiler` | müzik track'i kaldırılır, video müziksiz teslim edilir |
| "altyazı ekle" | `fal-audio` → `fal-editor` → `fal-compiler` | `.srt` üretilir — videoya gömülemez, söyle |

**Süre veya sahne sayısı değişen her istekte `fal-animator` yeniden çalışır** — klip
paketlemesi süreye bağlı (`ceil(süre ÷ model tavanı)`), sahne eklenip çıkarılınca eşleme
geçersizleşir. `storyboard.md`'deki eşleme tablosunu da güncelle.

**Karakter değişiyorsa** bunu maliyetiyle birlikte söyle **önce onay al**: karakter sayfası ve
altı sahnenin tamamı yeniden üretilecek, yani neredeyse yeni bir kampanya maliyeti.

**Seed'i koru.** `brief.md`'deki seed aynı kalırsa değişmeyen sahneler değişmeden kalır. Yeni
seed üretmek her şeyi değiştirir.

## 4. Doğrula

Her değişiklikten sonra:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/validate-workflow.mjs" ".fal-butler/campaigns/<slug>/workflow.json" --catalog ".fal-butler/cache/models.json"
```

Geçmezse düzelt ve tekrar doğrula. Geçmeyen dosyayı teslim etme.

## 5. Güncelle ve raporla

- `cost.md`'yi yeni tutarla güncelle
- Kurgu değiştiyse `storyboard.md`'yi güncelle
- `brief.md`'ye revizyon notu düş

```
## Revizyon tamam

**Değişen:** çözünürlük 1080p → 720p (tüm video düğümleri)
**Yeni tahmini maliyet:** $28 (önceki $43, −%35)
**Etkilenmeyen:** kurgu, karakter, sahne süreleri
**Yedek:** revisions/2026-08-05T14-32-10-workflow.json
**Doğrulama:** ✓ geçti

Yeni dosyayı fal'da yeniden import et.
```

## Geri alma

Kullanıcı "önceki hâli iyiydi" derse `revisions/` altındaki dosyayı geri yaz — ama önce
mevcut hâli de yedekle ki ileri-geri gidebilsin.
