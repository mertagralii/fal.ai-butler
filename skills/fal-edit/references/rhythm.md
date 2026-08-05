# Kurgu ritmi ve geçişler

## Elinde yalnızca sert kesim var — bunu baştan bil

`compose` şemasında geçiş alanı **yok** (`references/compose-schema.md`). Dissolve, fade ve
yumuşak match cut **render edilemez.** Aşağıdaki tablo geçişin *anlamını* öğretir ve kurgusal
kararın yerini korur — ama teknik olarak hepsi sert kesim olarak çıkar.

**Bunun sonucu kurgusal bir yükümlülük doğurur:** sert kesimle bağ kurmanın tek yolu **görsel
devamlılıktır.** Sahada bu kurulmadığı için sahneler "kopuk" hissettirdi — eşleşen hareket,
ortak nesne ya da devam eden kamera yönü yoktu.

**`fal-dop`'tan match cut planı iste.** Her sahne çiftinde şunlardan **en az biri** olmalı:

- Aynı plan ölçeği ve konu aynı kadraj bölgesinde (klasik match cut)
- Ortak bir nesne — bir sahnede çıkan, diğerinde giren (kupa, ekran, el)
- Devam eden kamera yönü — biri sağa kayarak biter, diğeri sağa kayarak başlar

`fal-dop` reçetesinde `Match cut notu` boşsa **geri iste**; bu, sert kesim kısıtı altında
akıcılığın tek kaynağıdır.

## Geçiş tipi anlam taşır

Rastgele seçilmez. Her geçiş izleyiciye bir şey söyler:

| Geçiş | Anlamı | Nerede |
|---|---|---|
| **Sert kesim** | Kesinlik, tempo, "ve sonra" | Varsayılan. Reklamın %80'i |
| **Dissolve (çapraz geçiş)** | Zaman geçti, yumuşama, rahatlama | Sona doğru, çözülme anında |
| **Match cut** | İki şey arasında bağ kur | Sorun→çözüm eşleşmesinde. Güçlü ama kompozisyon uyumu ister |
| **Karartma (fade)** | Bölüm bitti | Yalnızca en sonda, CTA'dan çıkarken |

**Kaçınılacaklar:** kayan geçişler, dönen küpler, ışık patlamaları. Reklamı 2000'lerin PowerPoint'ine
çevirirler.

## Nerede hangisi

Beş evrelik yapıda tipik geçiş şeması:

```
Hook ──sert──> Büyütme ──sert──> Büyütme ──sert/match──> Dönüş ──sert──> Kanıt ──dissolve──> CTA ──fade──> son
```

Mantığı: sorun anlatılırken kesimler sert ve tempolu; ürün girdikten sonra nefes alınır ve
geçişler yumuşar. Bu, izleyicinin duygusal yayını kurgunun kendisiyle destekler.

**Match cut'ı dönüş anına sakla.** Sorun sahnesindeki dağınık liste ile ürün sahnesindeki düzenli
liste aynı kadraj bölgesinde ve aynı ölçekteyse, sert kesim "sihir" hissi verir. `fal-dop`'un
kompozisyon notunda bu eşleşme varsa kullan; yoksa zorlama.

## Geçiş süreleri

- **Sert kesim:** 0 sn.
- **Dissolve:** 0,3–0,5 sn. Daha uzunu ağırlaştırır.
- **Fade:** 0,5–0,8 sn, yalnızca sonda.

Geçiş süresi toplam süreden yenir — zaman çizelgesini kurarken hesaba kat.

## Zaman çizelgesi **gerçek** klip sürelerinden kurulur

**Sahada çıkan en görünür kusur buydu:** "birinci sahne geliyor, sonra bir boşluk, sonra ikinci
sahne."

Sebep: `compose` keyframe'leri **talep edilen** sürelerden hesaplanmıştı (0 / 6000 / 11000 …).
Video modeli 6 sn istenen klibi 5,8 sn üretirse aradaki 200 ms **siyah boşluk** olarak görünür.
Beş klipte bu farklar birikir.

**Kural:** montaj zaman çizelgesi, klipler üretildikten sonra **ölçülen** sürelerden kurulur.
`ffmpeg-api/metadata` (saniyesi ~$0.0002, ihmal edilebilir) her klibin gerçek süresini verir;
`compose` düğümü bu değerlerle beslenir.

Düğüm yapısı:

```
node-video-s1 ─┬─→ node-meta-s1 ──┐
node-video-s2 ─┼─→ node-meta-s2 ──┼─→ node-compose  (keyframe timestamp/duration
node-video-s3 ─┴─→ node-meta-s3 ──┘                  bu metadata'dan hesaplanır)
```

Talep edilen süreleri **tahmin** olarak kullan (plan ve maliyet için), zaman çizelgesini
**ölçümle** kur. İkisini karıştırmak boşluk üretir.

## Zaman çizelgesi

Klipleri sıraya diz ve üç kanalı hizala:

```
0.0 ─ 6.0    video-1     | VO: "Gün başlamadan yorulmak…" (0.5–2.9) | müzik: seyrek
6.0 ─ 16.0   video-2     | VO: "Bildirimler bitmiyor." (6.4–8.2)    | müzik: ritim girer
16.0 ─ 24.0  video-3     | …                                        | …
```

**Kurallar:**

- Seslendirme sahne başında 0,3–0,5 sn sonra başlar; kesimle aynı anda başlamaz.
- Konuşma sahne sınırını aşabilir — görüntü değişirken ses devam ederse kurgu akıcılaşır.
  `fal-audio` bunu öneriyorsa uygula.
- Sahne sonunda konuşma bitmiş olmalı, aksi halde kesim cümleyi keser.
- **Sessiz boşluk bırakma.** İki saniyeden uzun sessizlik, izleyiciye video bitti hissi verir.
  Müzik boşluğu doldurur.

## Tempo

- Sahne süreleri kısaldıkça algılanan tempo artar. Hook'un kısa, dönüşün uzun olması bu yüzden
  hem dramaturjik hem ritmik bir karardır.
- **Ardışık üç sahne aynı uzunluktaysa** kurgu monotonlaşır. `fal-director`'ın verdiği süreler
  böyleyse bunu son kontrol raporunda belirt — sen değiştirme, o karar versin.

## Son kare

CTA son karede **duruyor** olmalı. Son klip hareketle bitip kesiliyorsa, CTA metni okunmadan
video biter. Son 1–1,5 saniyede görüntü sakinleşsin ve CTA overlay'i görünür kalsın.

Sosyal medyada video döngüye girer; son karenin ilk kareyle çarpışmaması için sonda fade kullan.
