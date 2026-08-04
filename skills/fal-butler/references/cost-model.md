# Maliyet modeli

Plugin para harcamaz, ama **ne kadar tutacağını söylemek zorundadır** — kullanıcı fal'da
"çalıştır"a basmadan önce neye evet dediğini bilmeli.

## Fiyat nereden gelir

Her modelin fiyatı fal kataloğunda durur. `fal-compiler` bir modeli seçerken şemasıyla birlikte
fiyatını da çeker ve cache'e yazar. **Fiyatı ezberden yazma** — kataloğa bak.

Fiyatlandırma biriminin modele göre değiştiğine dikkat et: görüntü başına, saniye başına,
megapiksel başına, token başına. Birimi karıştırmak tahmini on kat şaşırtır.

## Kalem dökümü

`cost.md` şu yapıyı taşır — her düğüm ayrı satır:

| Kalem | Adet | Birim fiyat | Tutar |
|---|---|---|---|
| Karakter sayfası (image) | 4 görsel | $X/görsel | $A |
| Sahne anahtar kareleri (image-edit) | 6 görsel | $X/görsel | $B |
| Sahne videoları (i2v) | 6 × 8 sn | $X/sn | $C |
| Seslendirme (TTS) | ~60 sn | $X/1k karakter | $D |
| Müzik | 60 sn | $X/üretim | $E |
| Montaj (ffmpeg) | ~60 sn | $0.0002/sn | $F |
| **Toplam** | | | **$T** |

Sonuna **payın nerede olduğunu** yaz: "maliyetin %N'i video üretiminde". Ucuzlatma konuşması
buradan başlar.

## Gerçekçi beklenti

Video üretimi baskın kalemdir; görüntü ve ses genelde yanında küçük kalır. Montaj neredeyse
bedavadır. Yani "pahalı" şikâyeti geldiğinde bakılacak ilk yer her zaman video düğümleridir.

## Ucuzlatma taktikleri — etkiden sıraya

Kullanıcıya seçenek sunarken **her birinin ne kadar düşürdüğünü ve neyi feda ettiğini** söyle.
Yüzdeleri kataloğun gerçek fiyatlarından hesapla, buradan kopyalama.

1. **Çözünürlük düşür** (1080p → 720p). En iyi takas: maliyet belirgin düşer, sosyal medyada fark
   çoğu izleyici için görünmez. **İlk öneri bu olsun.**
2. **Sahne sürelerini kısalt.** Saniye başına fiyatlanan modellerde doğrudan orantılı. 8 sn yerine
   6 sn çoğu sahnede hikâyeyi bozmaz — ama açılış hook'unu ve CTA sahnesini kısaltma.
3. **Sahne sayısını azalt.** 6 → 4 sahne. Kurguyu etkiler; hangi sahnenin düşeceğine `fal-director`
   karar vermeli, rastgele değil. Genelde "sorunu büyüten" ara sahneler feda edilebilir.
4. **Daha ucuz video modeli.** Aynı modalitede muadil ara. Kalite farkını **somut söyle**: hareket
   akıcılığı mı, karakter tutarlılığı mı, çözünürlük tavanı mı düşüyor.
5. **Karakter sayfasını küçült.** 5 açı yerine 3. Tutarlılığı bir miktar zayıflatır — yalnızca
   sahneler arası mekan değişimi azsa öner.
6. **Müziği çıkar, hazır müzik kullan.** Kullanıcının elinde telifsiz müzik varsa üretim düğümü
   tamamen kalkar.

## Asla önerme

- **Karakter sayfasını tamamen kaldırmak.** Tutarlılık stratejisinin temeli budur; kaldırılırsa
  altı sahnede altı farklı insan çıkar ve reklam kullanılamaz hale gelir. Ucuzlamış olmaz, çöp olur.
- **Zincirlemeyi kaldırmak.** Aynı gerekçe.
- **Kullanıcıya sormadan kaliteyi düşürmek.** Her ucuzlatma bir takastır; kararı o verir.

## Tahminin dürüstlüğü

Tahmin **tahmindir**. Şunu açıkça söyle: gerçek tutarı fal panelinde göreceksin, plugin katalog
fiyatlarından hesaplıyor ve yeniden deneme (retry) gerekirse artabilir. Tahmini kesin fiyat gibi sunma.
