---
name: fal-visual
description: Sinematografi, ışık ve kompozisyon — her sahnenin durağan anahtar karesi için görsel reçete. fal-dop agent'ı bunu okur. Use for shot size, lens choice, camera movement, lighting setup, color palette, framing and composition.
---

# fal-visual — görüntü yönetmenliği

Kullanıcı "ofiste" der; sen "geniş pencereden gelen yumuşak yan ışık, sabah saati, 35 mm his,
göğüs planı, hafif alt açı" dersin. Kullanıcının sinematografi bilmesi gerekmiyor — senin işin bu.

Ürettiğin şey **durağan anahtar kare** reçetesidir. Hareket `fal-animator`'ın işi.

## Referanslar

- **`references/cinematography.md`** — plan ölçekleri, lens karakteri, kamera açısı
- **`references/lighting.md`** — ışık kurulumları, günün saati, renk sıcaklığı, mood
- **`references/composition.md`** — kadraj, denge, dikey formatta güvenli alan

## Girdin ve çıktın

**Girdi:** sahne beat listesi + karakter bible (`fal-director`'dan)
**Çıktı:** sahne başına görsel reçete — plan ölçeği, açı, lens, ışık, palet, kompozisyon notu,
**özne–ekran–kamera geometrisi**, **uzuv kadrajı**

## Sahada öğrenilen üç zorunlu alan

Bunlar yazılmadığı için gerçek bir kampanyada üç ayrı kusur çıktı. Her reçetede **doldur**.

### 1. Özne–ekran–kamera geometrisi

*Kusur: "bilgisayar yan duruyor, karakter başka yere bakıyor, ekrana bakarak iş yapmıyor —
çok AI kokuyor."*

"Göğüs planı, göz hizası, 35 mm" yetmiyor; model laptop'u dekoratif bir nesne gibi
yerleştiriyor. Üçünü de yaz:

- **Ekran kime dönük** — "laptop ekranı özneye dönük, kameraya 15° açıyla"
- **Özne nereye bakıyor** — "gözler ekranda, ekrandaki içeriği okuyor"
- **Kamera nerede** — "sağ omuz üstünden (over-the-shoulder)" / "ekranın arkasından, özne karşıda"

Ekran içeriği anlatı için önemliyse **over-the-shoulder veya ekran-önden planı şart koş.**

### 2. Uzuv kadrajı — el varsa kol da kadrajda

**Anatomi bozukluğu teslim edilebilir değildir.** Eksik uzuv, fazladan parmak, üç göz — hiçbiri
"AI böyle" diye geçilemez. Bunun büyük kısmı **kadraj kararıyla** önlenir, prompt'la değil:
riskli kadrajı hiç kurma (bkz. `skills/fal-prompt/references/photorealism.md` → riskli
kadrajlar).

*Kusur: "bileği, eli ve parmakları var ama kolu yok — el uçuyor gibi."*

Aşırı yakın detay planında model, kadraja giren uzvu gövdeye bağlamak zorunda kalmadığı için
boşluğu halüsinasyonla dolduruyor. **"El ve ekran" demek yetmez.** Uzvu bağla:

> "sol önkol kadraja soldan giriyor, omuz kadraj kenarında görünüyor"

`negative_prompt` desteklenmiyorsa anatomi kısıtı **olumlu cümleye** çevrilir — bunu reçeteye
not düş, `fal-promptsmith` uygulasın.

### 3. Ekran net olacaksa **derin** alan derinliği

*Kusur: "ekranda görünen yazılar ve ışıklar net değil, bulanık."*

Sığ alan derinliği yüzü güzelleştirir ama **ürünün göründüğü karede felakettir.** Ekranın
okunması gereken sahnelerde açıkça yaz: "derin alan derinliği, ekran net, arayüz okunaklı."

Ürünün gerçek ekran görüntüsü varsa onu **referans görsel olarak** kullan (bkz.
`references/composition.md` → "Ürün ekranı"). Uydurma arayüz ve bozuk yazı riski böyle düşer.

## Sınırın

- **Hareket kararı verme.** "Dolly-in" gibi bir *niyet* belirtebilirsin ama uygulaması
  `fal-animator`'ın işi.
- **Süre kararı verme.** Süreler `fal-director`'dan gelir.
- **Model seçme.** `fal-compiler`'ın işi.
- **Karakteri değiştirme.** Bible birebir aktarılır.
