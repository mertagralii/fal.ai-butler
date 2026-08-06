# Karakter sayfası

Kampanyanın tutarlılığı buradan başlar. Bu görsel bir sahne değil — **referans levhasıdır** ve
sonraki bütün anahtar kareler ondan türer. Burada oluşan her sapma tüm kliplere çarpan olarak
yansır.

## Temel kural: **tek görsel, çoklu açı**

Dört ayrı görsel üretme. **Tek bir görselde, ızgara düzeninde bütün açılar** üretilir.

| | Ayrı ayrı 4 görsel | Tek sayfa, 4 panel |
|---|---|---|
| Tutarlılık | Her üretim biraz farklı kişi olabilir | **Yapısı gereği aynı kişi** — hepsi tek geçişte üretildi |
| Maliyet | 4 üretim | 1 üretim |
| Referans olarak | 4 URL bağlamak gerekir | Tek URL |
| Işık/kıyafet | Panelden panele kayabilir | Sabit |

Aynı görselin içindeki paneller birbirini görerek üretilir; ayrı üretimlerde böyle bir bağ yoktur.
**`num_images: 1` kullan**, çoklu açıyı prompt'ta iste.

## İki düzen

### A. Sade sayfa — 4 panel *(varsayılan)*

Reklam kampanyaları için yeterli:

```
┌───────────────┬───────────────┐
│  ön, göğüs    │  sağ profil   │
├───────────────┼───────────────┤
│  3/4 açı      │  bağlam karesi│
└───────────────┴───────────────┘
```

**Bağlam karesi** son paneldir ve karakteri asıl mekânında gösterir (masada, laptopla). Bu panel
sahne anahtar karelerine geçişi kolaylaştırır — model karakteri o ortamda zaten görmüş olur.

### B. Tam turnaround — profesyonel sayfa

Karakter birden fazla kampanyada kullanılacaksa veya tam gövde planları varsa:

```
üst sıra   : büyük ön portre  +  sol profil · 3/4 · sağ profil (baş çalışmaları)
alt sıra   : tam gövde ön · arka · yan · 3/4
köşe       : karakter adı etiketi
```

Arka görünüm yalnızca gerçekten gerekiyorsa — reklamda karakter arkadan görünmeyecekse israftır.

## Değişmezler — her panelde aynı

- **Arka plan nötr ve düz** — açık gri ya da beyaz. Sayfa bir sahne değil, referans levhası
- **Işık düz ve yumuşak**, panelden panele değişmez. Dramatik ışık burada kullanılmaz
- **Kıyafet birebir aynı** — panel arası kıyafet değişimi sayfayı işe yaramaz kılar
- **Aksesuar aynı** — gözlük varsa hepsinde, yoksa hiçbirinde
- **Yüz ifadesi nötr** *(bağlam karesi hariç)*

## En-boy oranı

Sayfa **kampanyanın oranına uymak zorunda değildir.** Kampanya 9:16 olsa da sayfa kare ya da
dikey ızgara olabilir; o bir referans, teslim edilecek kare değil. Modelin desteklediği en yüksek
çözünürlüğü seç — bu görsel ne kadar netse türetilen kareler o kadar sadık olur.

## Prompt iskeleti

`fal-promptsmith`'e verilecek reçete şu yapıyı taşır:

```
Character reference sheet of the same person, <N> panels in a <düzen> grid,
consistent lighting and identical clothing across all panels, plain light grey
background, neutral studio lighting.

Panel 1 — front view, chest up, looking at camera.
Panel 2 — right profile, chest up.
Panel 3 — three-quarter view, chest up.
Panel 4 — <bağlam>: <karakter> at <mekan>, <eylem>.

[SABİT KARAKTER BLOĞU — bible'dan birebir]

<fotogerçekçilik sözlüğü — skills/fal-prompt/references/photorealism.md>
```

**Panelleri numaralayarak ve tek tek tarif ederek iste.** "Birkaç açıdan göster" demek modelin
kaç panel ve hangi açılar üreteceğini belirsiz bırakır.

## Yasaklar

- **Panel arası kıyafet/ışık değişimi** — sayfanın tek işi sabitliktir
- **Sahne ışığı** — dramatik yan ışık burada değil, sahnelerde kullanılır
- **Metin** — panel etiketleri dışında yazı isteme; model bozuk yazı üretir
- **Aşırı yakın el/parmak paneli** — anatomi riski
  (`skills/fal-prompt/references/photorealism.md`)

## Sonra ne olur

Bu tek görsel, **her** anahtar kare düğümünün referansına bağlanır
(`skills/fal-motion/references/keyframe-chaining.md`). Zincir kurulmasa bile karakter sayfası
her klibe bağlı kalır — kimliğin tek kaynağı odur.
