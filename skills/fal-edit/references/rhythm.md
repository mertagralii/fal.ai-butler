# Kurgu ritmi ve geçişler

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
