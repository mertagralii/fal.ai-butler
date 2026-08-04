# Video hareket prompt'lama

Durağan görsel prompt'u ile video prompt'u ayrı gramerlerdir. Durağan prompt bir **anı** tarif
eder; video prompt bir **değişimi** tarif eder. Aynı metni ikisine vermek, video modelinin ya
donuk bir klip ya da rastgele savrulan bir sahne üretmesine yol açar.

## Temel ayrım

| Durağan prompt | Video prompt |
|---|---|
| "Kadın masada oturuyor, yorgun" | "Kadın ekrandan başını kaldırıyor, omuzları düşüyor, derin nefes veriyor" |
| Durum | Fiil |
| Sıfat yığını | Zaman içinde tek bir eylem |

## Kurallar

**1. Sahne başına tek eylem.** "Ayağa kalkıyor, pencereye yürüyor ve gülümsüyor" üç eylemdir;
model üçünü 8 saniyeye sıkıştırırken hepsini bozar. Bir eylem seç, kalanını sonraki sahneye bırak.

**2. Küçük hareket, büyük etki.** Reklamda en güvenilir hareketler mikro hareketlerdir: baş çevirme,
göz kırpma, omuz düşmesi, nefes, elin klavyeye uzanması. Büyük gövde hareketleri deformasyon
riskini katlar.

**3. Kamera hareketini ayrı cümlede söyle.** Konu hareketiyle kamera hareketini aynı cümlede
vermek ikisini karıştırır:
> Kadın ekrandan başını kaldırıyor. Kamera yavaşça yaklaşıyor.

**4. Hızı belirt.** "Yavaşça", "hafifçe", "ağır ağır". Belirtilmezse model hızlı ve tedirgin
hareket üretme eğilimindedir — reklamda neredeyse her zaman yanlış.

**5. Sahne değişimi tarif etme.** Kesme, geçiş, "sonra" gibi ifadeler tek klip içinde işlemez;
model ya yok sayar ya sahneyi ortasından kırar. Geçişler `fal-edit`'in işidir.

**6. Arka planı sabit tut.** "Arka plan sabit kalıyor" cümlesi, modelin mekanı kaydırmasını
belirgin şekilde azaltır. Mekan kayması, sahneler arası tutarlılığı bozan en yaygın hatadır.

## Kamera hareketi sözlüğü

`fal-dop`'un niyetini video diline çevirirsin:

| Niyet | Video prompt karşılığı |
|---|---|
| Sabit | "Kamera sabit." |
| Hafif içeri yaklaşma | "Kamera yavaşça ve düz bir şekilde yaklaşıyor." |
| Hafif geri çekilme | "Kamera yavaşça geriye çekiliyor, mekan açılıyor." |
| Yatay kaydırma | "Kamera yavaşça sağa kayıyor." |
| Takip | "Kamera konuyla birlikte hareket ediyor, mesafe sabit." |

"Düz bir şekilde" ve "mesafe sabit" gibi kısıtlar, modelin hareketi abartmasını engeller.

## Yöntem seçimi

| Durum | Yöntem |
|---|---|
| Karakter tutarlılığı gereken her sahne | **image-to-video** — anahtar kareden başla |
| Sahnenin nerede biteceği belliyse (zincirin bir sonraki halkasını besliyorsa) | **first-frame + last-frame** — model varsa |
| Soyut/motion sahneleri, karakter yok | text-to-video kabul edilebilir |

**Varsayılan image-to-video'dur.** Text-to-video, karakteri her klipte yeniden icat eder;
tutarlılık stratejimizle bağdaşmaz. Karakterli anlatımda kullanma.

## Ürün-ekran sahnelerinde

- Arayüz hareketi tarif et: "imleç listeye doğru hareket ediyor, bir görev tamamlandı olarak
  işaretleniyor".
- **Metin üretimini modele bırakma.** Model arayüz metnini okunaksız üretir. Ekranda okunması
  gereken metin varsa bunu `fal-edit`'e overlay olarak bırak ve reçeteye not düş.
- Kamera neredeyse her zaman sabit; arayüzün kendisi hareket eder.

## Negatif hareket

Model destekliyorsa negatif prompt'a şunları koy: ani sıçrama, kamera sarsıntısı, deformasyon,
fazladan parmak, yüz kayması, morphing, arka plan kayması. Destek durumu için
`skills/fal-prompt/references/negative-prompts.md`.
