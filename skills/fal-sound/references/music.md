# Müzik ve ton

## Müzik hikâyeyi taşır

Reklamda müzik dekor değil, duygunun taşıyıcısıdır. Sorun sahnelerinde gerilim, dönüşte açılma,
sonda çözülme. Tek düze bir loop, iyi kurgulanmış bir reklamı bile düzleştirir.

## Sahne tonuyla eşleştirme

| Evre | Müzik karakteri |
|---|---|
| **Hook** | Seyrek, tedirgin, tek enstrüman. Bazen sessizlik en güçlüsü |
| **Büyütme** | Ritim girer, tempo hafif artar, katman eklenir |
| **Dönüş** | Açılma anı — akor değişir, parlaklık gelir. Reklamın müzikal doruğu |
| **Kanıt** | Sabit, kendinden emin, sürükleyici |
| **CTA** | Sadeleşir ya da net bir vuruşla biter. Söz duyulsun |

Tek parça müzik üretiyorsan bu yayı **tek prompt'ta** tarif et: "seyrek ve tedirgin başlayan,
ortasında açılan, sonunda kendinden emin biten 60 saniyelik enstrümantal".

## Prompt'ta ne belirtilir

| Alan | Örnek |
|---|---|
| **Tür** | ambient elektronik, akustik indie, minimal piyano, lo-fi |
| **Tempo** | yavaş (70–90 BPM), orta (100–120), hızlı (130+) |
| **Enstrümantasyon** | "yumuşak sentezleyici pad, hafif perküsyon, bas yok" |
| **Yay** | "seyrek başlar, 20. saniyede açılır, sonda sadeleşir" |
| **Süre** | Toplam video süresi + 2 sn pay |
| **Vokal** | **"vokal yok"** — neredeyse her zaman. Söz, seslendirmeyle çakışır |

Son madde önemli: müzik modelleri istenmedikçe de vokal ekleyebiliyor. "enstrümantal, vokal yok"
diye açıkça yaz.

## Marka tonuyla uyum

`product.md`'deki marka tonu müziği belirler:

- **Kurumsal/güvenilir** → temiz, minimal, akustik ya da orkestral dokunuşlu
- **Genç/enerjik** → elektronik, belirgin ritim, parlak
- **Sıcak/samimi** → akustik gitar, piyano, yumuşak
- **Teknik/geliştirici** → minimal elektronik, lo-fi, gösterişsiz

Ton ile müzik çelişirse reklam sahte hissettirir — kurumsal bir ürünün altına trap koymak
izleyiciyi ürünün ne olduğu konusunda yanıltır.

## Süre ve döngü

- Müziği **toplam video süresinden 2 saniye uzun** üret; montajda fade-out için pay kalsın.
- Model kısa süre üretiyorsa döngülenebilir bir parça iste ve `fal-editor`'ın uç uca eklemesini
  planla — ama ek yerinin duyulmaması için "kesintisiz döngülenebilir" diye belirt.
- Son 1,5 saniyede **fade-out** uygula; ani kesilen müzik ucuz durur.

## Ses efekti

Reklamda genelde gereksiz. Sadece iki durumda değer katar:

1. **Bildirim sesi** — hook'ta sorunu duyulur kılar. Kısa, tek, abartısız.
2. **Onay sesi** — dönüş anında "tamamlandı" hissi. Marka sesi varsa o.

Üçten fazla efekt kullanma; reklam gürültüye döner.

## Kapsam kapalıysa

`brief.md`'de müzik kapalıysa müzik düğümü **hiç oluşturulmaz** — sessiz düğüm ekleme, maliyet
satırı yazma. Seslendirme varsa tek kanallı, yoksa tamamen sessiz bir montaj planı teslim et
ve bunu `fal-editor`'a açıkça bildir.
