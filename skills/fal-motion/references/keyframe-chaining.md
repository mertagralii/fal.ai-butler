# Keyframe zincirleme

Karakterin altı sahne boyunca aynı kalmasını sağlayan mekanizma. Metinle "aynı kadın" demek
yetmez — modeli bir yüze bağlamak gerekir. Yöntem: **referans görsel + zincir**.

## Beş adım

### 1. Karakter sayfası — bir kez

Aynı kişinin 3–5 farklı açıdan görselini üret: **ön, 3/4, profil, yakın portre**. Ortam nötr,
ışık düz — bu görseller sahne değil, referans.

Prompt'u karakter bible'ından birebir kur. Tüm sahnelerin kaynağı bu görsellerdir; burada
oluşan her sapma altı sahneye çarpan olarak yansır.

**Ürün-ekran anlatımında** karşılığı: arayüzün referans görselleri (ana ekran, liste, detay).
Aynı mantık.

### 2. Sahne anahtar karesi — image-edit ile

Her sahnenin başlangıç karesi, karakter sayfasından **image-edit / referanslı üretim** ile
türetilir. Sıfırdan text-to-image ile üretme — o karakteri yeniden icat eder.

Girdi: karakter sayfası görselleri (referans) + `fal-dop`'un o sahneye ait görsel reçetesi.

### 3. Anahtar kare → video

Anahtar kareyi image-to-video ile sahneye çevir. Hareket reçetesi `motion-prompting.md`'ye göre.

### 4. Zincir — sahne N'in son karesi, N+1'in referansına

Kritik adım. Sahne N'in **son karesi** çıkarılır ve sahne N+1'in anahtar karesini üretirken
referans setine **eklenir** (karakter sayfasının yerine geçmez, yanına gelir).

```
karakter-sayfası ──┬─→ anahtar-kare-1 → video-1 ──(son kare)──┐
                   │                                          │
                   ├─────────────────────────────────────────→ anahtar-kare-2 → video-2 ──(son kare)──┐
                   │                                                                                  │
                   └─────────────────────────────────────────────────────────────────────────────────→ anahtar-kare-3 → …
```

Karakter sayfası **her** sahneye bağlı kalır — zincir uzadıkça sapmanın birikmesini bu engeller.
Yalnızca önceki sahneye zincirlemek, altıncı sahnede tanınmaz bir yüz üretir.

Son kareyi çıkarmak için ayrı bir düğüm gerekir (video → görüntü). Katalogda bu işi yapan bir
endpoint ara; yoksa `fal-compiler`'a bildir ve zinciri karakter sayfası üzerinden kur —
tutarlılık bir miktar zayıflar, bunu kullanıcıya söyle.

### 5. Seed sabitle

Tüm üretim düğümlerinde aynı seed'i kullan (model destekliyorsa). Aynı seed, aynı referans ve
aynı prompt iskeleti → sapma minimum. Seed'i `workflow.json`'da açıkça yaz; modele bırakma.

## Zincirleme grafiğini nasıl teslim edersin

`fal-compiler`'ın `depends` ilişkilerini kuracağı şey budur. Düğüm bazında, açık yaz:

```
node-character-sheet   ← input
node-keyframe-1        ← node-character-sheet
node-video-1           ← node-keyframe-1
node-lastframe-1       ← node-video-1
node-keyframe-2        ← node-character-sheet, node-lastframe-1
node-video-2           ← node-keyframe-2
…
```

Her sahne için aynı desen. Düğüm adlarını sen belirle; tutarlı ve okunur tut.

## Tutarlılığı bozan yaygın hatalar

| Hata | Sonuç |
|---|---|
| Sahneleri paralel üretmek, zincir kurmamak | Altı farklı insan |
| Yalnızca önceki sahneye zincirlemek | Sapma birikir, son sahnede karakter kaybolur |
| Karakter tarifini her sahnede yeniden yazmak | Eş anlamlı kelimeler farklı yüz üretir — bible'ı **birebir** kopyala |
| Seed'i boş bırakmak | Her çalıştırmada farklı sonuç, revizyon imkânsızlaşır |
| Kıyafet/aksesuarı belirtmemek | Model her sahnede yeniden giydirir |
| Sahneler arası ışığı sert değiştirmek | Aynı kişi farklı mekanda sanılır |

## Zincir yine de bozulursa

`revise` ile sahne bazlı yeniden üretim yapılır: bozulan sahnenin anahtar karesi, karakter
sayfasına daha güçlü ağırlıkla yeniden türetilir. Tüm kampanyayı baştan üretmek son çaredir ve
maliyeti kullanıcıya söylenir.
