# Negatif prompt ve parametreler

## Önce şemaya bak

`negative_prompt` alanı **her modelde yok**. Şemada yoksa yazma — desteklenmeyen alan ya hata
verir ya sessizce yok sayılır, ikisi de istenmez.

## Ne yazılır

Negatif prompt bir dilek listesi değildir; modelin **bilinen bozulma eğilimlerini** bastırır.
Uzun liste etkiyi seyreltir — 8–12 terim yeterli.

**Görüntü düğümleri için:**
```
deformed hands, extra fingers, extra limbs, distorted face, asymmetric eyes,
watermark, text, logo, low quality, blurry, oversaturated
```

`text` ve `watermark` önemli: modeller kadraja rastgele yazı ve filigran eklemeyi sever, bu da
reklamı kullanılamaz hale getirir.

**Video düğümleri için** ek olarak:
```
sudden jump, camera shake, morphing, face drift, background shift, flickering, frame tearing
```

`face drift` ve `background shift` doğrudan tutarlılık stratejimizi korur.

**Ürün-ekran sahnelerinde:**
```
unreadable text, garbled interface, screen glare, reflection on screen, distorted UI
```

## Ne yazılmaz

- **Pozitif prompt'ta olan şeyin zıddı.** "beige shirt" yazıp negatife "blue shirt" koymak
  gereksiz; model zaten beje yönlendirildi.
- **Soyut kalite dilekleri.** "bad", "ugly" gibi terimler ölçülemez ve etkisi öngörülemez.
- **Aynı terimin varyasyonları.** "blurry, blur, out of focus, unfocused" — biri yeter.

## Seed

**Her üretim düğümünde aynı seed'i kullan** (şemada `seed` varsa). Sebep:

- Aynı seed + aynı referans + aynı prompt iskeleti → sahneler arası sapma azalır
- Kullanıcı "bu sahneyi biraz değiştir" dediğinde geri kalan sabit kalır
- `revise` deterministik çalışır; aksi halde her revizyon her şeyi değiştirir

Seed'i `workflow.json`'a **açıkça yaz**. Boş bırakırsan her çalıştırma farklı sonuç verir ve
revizyon imkânsızlaşır.

Kampanya başına tek bir seed seç ve tüm düğümlerde kullan. Bu seed'i `brief.md`'ye not düş ki
sonraki revizyonlarda aynısı kullanılabilsin.

## Diğer parametreler

Şemada varsa ayarla, yoksa dokunma:

| Parametre | Ne yapar | Reklam için |
|---|---|---|
| `guidance_scale` / `cfg` | Prompt'a bağlılık | Orta değer. Yüksek değer görüntüyü yakar ve doğallığı bozar |
| `num_inference_steps` | Kalite/süre takası | Varsayılanı bırak. Artırmak maliyeti artırır, kazanç azalan getirili |
| `strength` (image-edit) | Referanstan sapma miktarı | **Düşük tut** — karakter sayfasına sadık kalmalı. Yüksek değer tutarlılığı öldürür |
| `motion_strength` (video) | Hareket şiddeti | Düşük-orta. Yüksek değer deformasyon riskini katlar |
| `aspect_ratio` | En-boy oranı | Dikey üretim için 9:16; desteklenmiyorsa en yakını + `fal-edit` kırpar |
| `num_images` | Üretim adedi | Karakter sayfası dışında **1**. Fazlası doğrudan maliyettir |

**`strength` en kritik olanıdır.** Sahne anahtar karelerini karakter sayfasından türetirken
düşük tutulmazsa her sahne biraz daha farklı bir insan üretir — zincirin en sık koptuğu yer burası.

## Parametreyi uydurma

Şemada olmayan bir parametreyi eklemek, düğümü doğrulamada düşürür (`UNKNOWN_ENDPOINT` değil ama
fal tarafında hata). Şema neyi kabul ediyorsa onu yaz; emin değilsen alanı hiç koyma ve modelin
varsayılanına bırak.
