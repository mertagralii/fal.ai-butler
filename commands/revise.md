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

İlgili agent'ı yeniden çalıştır, zincirin kalanını koru:

| İstek | Kim çalışır | Etki |
|---|---|---|
| "3. sahne daha aydınlık" | `fal-dop` → `fal-promptsmith` → `fal-compiler` | tek düğüm |
| "3. sahne daha yavaş" | `fal-animator` → `fal-promptsmith` → `fal-compiler` | tek düğüm |
| "3. sahneyi at, 5'i uzat" | `fal-director` → tüm zincir | süre dengesi bozulur |
| "karakter daha genç olsun" | `fal-director` → tüm zincir | **karakter sayfası + tüm sahneler yeniden** |
| "müziği çıkar" | `fal-audio` → `fal-editor` → `fal-compiler` | düğüm silinir |
| "altyazı ekle" | `fal-audio` → `fal-editor` → `fal-compiler` | destek kontrolü tekrar |

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
