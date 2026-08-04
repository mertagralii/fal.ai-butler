# Altyazı

## Neden zorunlu gibi davranmalı

Sosyal medya videolarının büyük çoğunluğu **sessiz** izlenir. Altyazısız bir reklamda seslendirme
hiç duyulmamış sayılır. `brief.md`'de kapatılmadıysa altyazı üretilir.

## Güvenli alan

Platform arayüzü kadrajın altını kapatır. Altyazı **alt %20'ye konmaz** —
bkz. `skills/fal-visual/references/composition.md`.

**Doğru yerleşim:** kadrajın alt-orta bölgesi, ama tabandan yukarıda — 9:16'da (1080×1920)
altyazının alt kenarı **y ≈ 1450–1550** aralığında olur. Sağ tarafta ikon sütunu olduğu için
metin yatayda ortalanır ve genişliği kadrajın %80'ini geçmez.

## Okunma hızı

- **Satırda en fazla ~40 karakter.** Uzun satır dikeyde taşar ve okunmaz.
- **Aynı anda en fazla 2 satır.** Üç satır ekranı kaplar ve görüntüyü öldürür.
- **Ekranda kalma süresi:** okunması gereken karakter sayısı / 15 karakter-saniye, en az 1,2 sn.
  Yani 30 karakterlik bir altyazı en az 2 saniye durur.
- **Konuşmayla senkron.** Altyazı, sesten 0,1–0,2 sn önce girebilir; sonra girmemeli.

## Satır bölme

Anlamlı öbek sınırında böl, kelime ortasından **asla**:

```
İyi:                            Kötü:
"Artık her şey                  "Artık her şey tek ekranda, toplantıya
tek ekranda"                     gerek kal-"
```

Türkçede sondan eklemeli yapı yüzünden kelimeler uzun; sıfat tamlamalarını bölme
("dağınık / masa" değil, "dağınık masa" birlikte).

## Biçim

- **Sans-serif, kalın.** İnce font küçük ekranda kaybolur.
- **Beyaz metin + koyu kontur veya yarı saydam arka plan.** Kontursuz beyaz metin, açık renkli
  sahnede tamamen kaybolur — bu en sık yapılan hatadır.
- **Boyut:** 1080 genişlikte ~48–56 px.
- **Marka rengini vurgu için kullan** — ürün adı ve CTA renkli, kalanı beyaz.

## Gömme mi, `.srt` mi

**Bu doğrulanması gereken bir noktadır.** `ffmpeg-api/compose`'un video üzerine metin gömme
desteği fal dokümanında netleştirilmemiştir.

**Derleme anında yap:**

1. `fal-compiler`'dan `compose` endpoint'inin güncel şemasını iste.
2. Şemada metin/altyazı track'i veya drawtext benzeri bir alan **varsa** → altyazıyı videoya göm.
3. **Yoksa** → altyazıyı ayrı bir `.srt` dosyası olarak üret ve **kullanıcıya açıkça söyle**:

> "Altyazı videoya gömülemedi — fal'ın montaj endpoint'i metin gömmeyi desteklemiyor.
> Altyazıyı `subtitles.srt` olarak ürettim; Instagram/TikTok yükleme ekranında altyazı dosyası
> olarak ekleyebilir ya da bir video düzenleyicide gömebilirsin."

**Sessizce atlama.** Altyazı istendi ve verilemiyorsa bu söylenir.

## `.srt` biçimi

```
1
00:00:00,500 --> 00:00:02,900
Gün başlamadan yorulmak…

2
00:00:06,400 --> 00:00:08,200
Bildirimler bitmiyor.
```

Zaman damgasında **virgül** kullanılır (nokta değil), saat alanı iki hane. Numaralar 1'den başlar
ve boşluksuz artar.

## CTA overlay

CTA altyazıdan ayrıdır ve son sahnede **duran** bir metindir. Altyazı akarken CTA sabit kalır;
ikisi çakışırsa CTA yukarı, altyazı aşağı yerleşir. Son 1,5 saniyede altyazı biter, CTA kalır.
