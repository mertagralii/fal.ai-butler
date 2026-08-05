# Kompozisyon

## Dikey format kadrajın kendisidir

Reels ve TikTok 9:16. Yatay düşünüp sonra kırpmak işe yaramaz — kadraj baştan dikey kurulur.

- **Konu dikey ekseni doldursun.** Yanlarda geniş boşluk bırakmak, dikeyde kadrajın yarısını
  çöpe atmaktır.
- **Yatay yerleşimden kaçın.** Yan yana iki nesne dikeyde sığmaz; üst-alt diz.
- **Yakın çalış.** Dikeyde genel plan zayıftır; göğüs planı ve yakın plan taşır.

## Güvenli alanlar

Platform arayüzü kadrajın bir kısmını kapatır. Buralara **kritik hiçbir şey koyma**:

| Bölge | Ne kapatır |
|---|---|
| **Alt ~%20** | Açıklama metni, kullanıcı adı, ses bilgisi, etkileşim çubuğu |
| **Sağ ~%12** | Beğeni/yorum/paylaş ikonları |
| **Üst ~%10** | Durum çubuğu, geri tuşu, "Takip et" |

Yani asıl güvenli alan kadrajın ortasıdır. Yüz, ürün ve CTA metni oraya yerleşir.
Altyazı yerleşimi için ayrıca `skills/fal-edit/references/subtitles.md`.

## Denge

- **Üçler kuralı** — konuyu tam ortaya değil, dikey üçte bir çizgisine yerleştir. Ortalama yalnızca
  simetriyi bilinçli kullandığında (doğrudan kameraya bakış, CTA karesi) doğru seçimdir.
- **Bakış boşluğu** — kişi yana bakıyorsa baktığı yönde boşluk bırak. Burnun dibinde kadraj
  kenarı olması izleyiciyi rahatsız eder, sebebini anlamadan.
- **Baş boşluğu** — başın üstünde az bir pay bırak. Çok boşluk kişiyi küçültür, hiç boşluk
  sıkışık gösterir.

## Derinlik

Yapay görselin "yapay" görünmesinin ikinci sebebi düzlüktür. Üç katman kur:

1. **Ön plan** — kadrajın kenarında bulanık bir nesne (masa köşesi, bitki yaprağı, kupa)
2. **Orta** — konu, net
3. **Arka** — mekan, yumuşak

Ön plan katmanı en çok atlanan ve en çok işe yarayan detaydır.

## Ürün ekranı — gerçek görseli referans olarak kullan

Sahada en yüksek etkili düzeltme bu. Ürünün göründüğü kare, reklamın **tek anlatım anıydı** ve
okunaksız çıktı: puan göstergesi yanlış monitöre kaydı, metinler bulanıklaştı, arayüz uydurma
oldu.

**Kullanıcının gerçek ekran görüntüsü varsa** onu image-edit düğümüne referans görsel olarak
ver — bu modeller genelde birden çok referans kabul eder (`image_urls`). Model uydurmak yerine
o arayüzü yeniden üretmeye çalışır; bozuk yazı riski büyük ölçüde düşer.

Görsel bir URL'e konmalıdır (plugin dosya yüklemez — bkz.
`skills/fal-workflow-json/references/schema.md`). Kullanıcıya bunu **öner**, kendiliğinden
varsayma.

**Alternatif:** arayüzü tipografide güçlü ayrı bir modelle düz görsel olarak üret, sonra
montajda bindir. Ama `compose`'un `type: "image"` track'inde konum/opacity dokümante değil —
bunu denemeden vaat etme (`skills/fal-edit/references/compose-schema.md`).

**Ekran içeriği sahnenin işleviyle çelişmesin.** Sahada sahne 1'in ekranında yeşil onay işareti
vardı — görsel dil "başarı" diyordu, oysa sahnenin işlevi "başvurdun, geri dönüş yok"tu. Bu bir
model hatası değil, **reçete hatasıdır**: ekranda ne göründüğünü yazarken sahnenin duygusunu
kontrol et.

## Ürün-ekran kadrajı

- **Ekranı düz karşıdan ver** ya da hafif açıyla — ama arayüz metni okunur kalsın.
- **Arayüzün tamamını gösterme.** İlgili bölüme yaklaş; tam ekran arayüz dikeyde okunmaz.
- **Elle etkileşim ekle.** Ekrana dokunan/yazan bir el, statik arayüz görüntüsünü canlandırır.
- **Ekranı kadrajın ortasına al** — alt %20 kesilecek, oraya arayüz koyma.

## Sahne geçişlerinde kompozisyon

`fal-edit` match cut isteyecekse iki sahnenin kompozisyonu birbirini karşılamalı: aynı ölçek,
konu aynı kadraj bölgesinde. Bunu reçeteye not düş ki `fal-animator` ve `fal-editor` kullanabilsin.
