# Keyframe zincirleme

Karakterin altı sahne boyunca aynı kalmasını sağlayan mekanizma. Metinle "aynı kadın" demek
yetmez — modeli bir yüze bağlamak gerekir. Yöntem: **referans görsel + zincir**.

## Beş adım

### 1. Karakter sayfası — bir kez, **tek görsel**

Ayrı ayrı 3–5 görsel değil: **tek bir görselde, ızgara düzeninde bütün açılar.** Ön, sağ profil,
3/4 ve bir bağlam karesi. Ortam nötr, ışık düz — bu bir sahne değil, referans levhası.

Sebep: aynı görselin panelleri birbirini görerek üretilir, dolayısıyla **yapısı gereği aynı
kişidir**. Ayrı üretimlerde böyle bir bağ yoktur ve her biri biraz farklı bir insan olabilir.
Ayrıca tek üretim daha ucuz ve bağlanacak tek URL demek.

**`num_images: 1`** — çoklu açı prompt'ta istenir, üretim sayısıyla değil.

Tam düzen, prompt iskeleti ve yasaklar: `skills/fal-visual/references/character-sheet.md`.

Prompt'u karakter bible'ından birebir kur. Tüm kliplerin kaynağı bu görseldir; burada oluşan her
sapma bütün kliplere çarpan olarak yansır.

**Ürün-ekran anlatımında** karşılığı: arayüzün referans sayfası (ana ekran, liste, detay — yine
tek görselde). Aynı mantık.

### 2. Klip anahtar karesi — image-edit ile, **klip başına bir tane**

Her **klibin** başlangıç karesi, karakter sayfasından **image-edit / referanslı üretim** ile
türetilir. Sıfırdan text-to-image ile üretme — o karakteri yeniden icat eder.

Girdi: karakter sayfası görselleri (referans) + `fal-dop`'un o klibe ait görsel reçetesi.

**Sahne başına değil, klip başına.** Bir klip iki sahne taşıyorsa yine tek anahtar kare üretilir;
ikinci sahne kamera hareketiyle gelir (`duration-budget.md`).

**Bitiş karesi üretme** — yalnızca match cut planlandıysa ya da bir sahne bölündüyse, gerekçesiyle.

### 3. Anahtar kare → video

Anahtar kareyi image-to-video ile sahneye çevir. Hareket reçetesi `motion-prompting.md`'ye göre.

## ÖNCE OKU: zincir sapması gerçek bir risk

**Sahada ölçüldü (2026-08-05, 5 klip):** kimlik korundu — yüz hattı ve gözlük beş klipte de
aynı kaldı. **Ortam korunmadı:**

| Klip | Sapma |
|---|---|
| 1 | Doğru: sade duvar, tek laptop, düz gri sweatshirt |
| 3 | Duvar taşa döndü, **ikinci monitör belirdi** (bible'da yasaktı), kıyafet desenlendi |
| 4 | **Tam bozulma:** yüzde ve kıyafette neon gökkuşağı, kompozisyon dağıldı |
| 5 | Taş duvar ve ikinci monitör kalıcılaştı, kadraja masa lambası girdi |

Sebep: her anahtar kare bir öncekinin **üretilmiş** karesinden besleniyor; hata katlanarak
büyüyor. **Üçten fazla halka zincirlenirse ortam ve kıyafet sapması beklenmelidir.**

Kural: **kimlik zincirle korunur, çevre korunmaz.** Çevreyi korumak için aşağıdaki
seçeneklerden birini kullan.

## Üç mimari — kampanyaya göre seç

### A. Zincirsiz (varsayılan öneri)

Her anahtar kare **yalnızca karakter sayfasından** türer. Sahneler arası ortam küçük
farklılıklar gösterebilir ama **birikimli bozulma olmaz**. `extract-frame` düğümleri tamamen
kalkar, düğüm sayısı ve maliyet düşer.

**3'ten fazla klip varsa bunu seç.**

### B. Melez — ortam referansı ile (en iyi denge)

Karakter sayfasına ek olarak bir **ortam referans karesi** üret (masa, duvar, kupa, monitör
düzeni) ve her anahtar kareye **iki referansı birden** ver: karakter + ortam.

Zincir kurulmaz, sapma birikmez, ama çevre de sabitlenir. Maliyeti tek bir ek görsel.

### C. Çoklu referanslı video modeli

Bazı video modelleri (ör. `reference-to-video` uçları) doğrudan **9'a kadar referans görsel**
alır; anahtar kare üretmeye hiç gerek kalmaz, her klip bağımsız üretilir, zincir hiç kurulmaz.

En temiz sonuç ama **fiyat birimini kontrol et** — bu sınıf modeller genelde video-token
bazlı fiyatlanır ve saniye başına fiyatlanan bir modelden kat kat pahalı olabilir. Kalite/bütçe
takasını kullanıcıya sun (`skills/fal-butler/references/cost-model.md`).

### D. Zincir — yalnızca 2–3 klipte ve süreklilik şartsa

Aşağıdaki 5 adım. Kesintisiz bir eylemin devamı gerekiyorsa (bir hareketin ortasından devam)
zincir hâlâ doğru araçtır — ama kısa tut.

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
