# Maliyet modeli

Plugin para harcamaz, ama **ne kadar tutacağını söylemek zorundadır** — kullanıcı fal'da
"çalıştır"a basmadan önce neye evet dediğini bilmeli.

## Fiyat nereden gelir — ve asıl mesele fiyat değil, **birim**

Katalog (`search_models`) fiyat taşımaz; `get_pricing` ayrıca çağrılır. Ama asıl tuzak orada
değil: `get_pricing`'in döndürdüğü `unit` dizesi **her zaman anlamlı değildir.**

```json
{ "unit_price": 0.0112, "unit": "units", "currency": "USD" }
```

Sahada bu `"units"` dizesi "saniye" sanıldı. Gerçek birim **1.000 video token**'dı:

```
tokens = (genişlik × yükseklik × FPS × süre) / 1024
720p dikey, 24 FPS, 1 sn → (1280 × 720 × 24) / 1024 = 21.600 token = 21,6 birim
21,6 × $0.0112 = $0.242/saniye        ← dokümandaki fiyatla birebir
```

Yani gerçek maliyet tahmin edilenin **21 katıydı** ve bu hata model seçimini tersine çevirdi:
"6 kat pahalı" diye elenen model aslında 3 kat ucuzdu.

### Bilinen birimler

| ham `unit` | Anlamı | Hesap |
|---|---|---|
| `seconds` | Üretilen video saniyesi | fiyat × süre |
| `videos` | Video başına sabit | fiyat × klip sayısı |
| `images` | Görsel başına | fiyat × görsel sayısı |
| `minutes` | Dakika başına | fiyat × dakika |
| `compute seconds` | **GPU işlem saniyesi — çıktı süresiyle 1:1 DEĞİL** | Çarpanı dokümante değil; "tahmini" işaretle |
| `units` | **Modele göre değişir, tek başına anlamsız** | Dokümandan çöz |

### Sert kural

`unit` değeri `seconds` / `images` / `videos` / `minutes` değilse, `search_docs` ile o modelin
fiyat sayfasını bul ve birimi çöz. **Çözemiyorsan o modeli seçme** — birimi bilinmeyen bir
modelin maliyet tahmini onay kapısında yalan söyler, ve kullanıcı fal panelinde gerçek fiyatı
görene kadar bunu fark etmez.

`fal-compiler` raporunda **ham `unit` dizesini her zaman aynen yaz**, yorumu ayrı satırda ver.
Sahada yorumla ham değer karışınca hata iki tur boyunca fark edilmedi.

## Kalem dökümü

`cost.md` şu yapıyı taşır — her düğüm ayrı satır:

| Kalem | Adet | Birim fiyat | Tutar |
|---|---|---|---|
| Karakter sayfası (image) | **1 görsel** (çok panelli sayfa) | $X/görsel | $A |
| Sahne anahtar kareleri (image-edit) | 6 görsel | $X/görsel | $B |
| Sahne videoları (i2v) | **klip** sayısı × süre | $X/sn | $C |
| Seslendirme (TTS) | ~60 sn | $X/1k karakter | $D |
| Müzik | 60 sn | $X/üretim | $E |
| Montaj (ffmpeg) | ~60 sn | `get_pricing`'den | $F |
| **Toplam** | | | **$T** |

Sonuna **payın nerede olduğunu** yaz: "maliyetin %N'i video üretiminde". Ucuzlatma konuşması
buradan başlar.

**Sahne ≠ klip.** Modelin klip süre sınırı aşılıyorsa `fal-animator` sahneyi böler
(`skills/fal-motion/references/duration-budget.md`) ve o sahne iki üretim düğümü olur. Uzun
sahneler ve ayrık süre seçenekleri düşünüldüğünde bölünme **istisna değil kural**. Maliyeti
sahne sayısından değil, `fal-animator`'ın verdiği **zincirleme grafiğindeki gerçek düğüm
sayısından** hesapla — aksi halde onay kapısındaki rakam düşük çıkar. Aynı şey son kare çıkarma
düğümleri için de geçerlidir: sayıları klip sayısına bağlıdır, sahne sayısına değil.

## Gerçekçi beklenti

Video üretimi baskın kalemdir; görüntü ve ses genelde yanında küçük kalır. Montaj neredeyse
bedavadır. Yani "pahalı" şikâyeti geldiğinde bakılacak ilk yer her zaman video düğümleridir.

## Ucuzlatma taktikleri — etkiden sıraya

Kullanıcıya seçenek sunarken **her birinin ne kadar düşürdüğünü ve neyi feda ettiğini** söyle.
Yüzdeleri kataloğun gerçek fiyatlarından hesapla, buradan kopyalama.

**Önce fiyatlandırma birimine bak, sonra taktik seç.** Aşağıdaki sıra evrensel değil; hangi
taktiğin işe yaradığı modelin nasıl fiyatlandığına bağlı.

1. **Çözünürlük düşür** (1080p → 720p) — **yalnızca fiyatı piksele/çözünürlüğe bağlı modellerde.**
   Saniye başına fiyatlanan bir video modelinde etkisi **sıfırdır**; orada çözünürlük anahtar kare
   üretiminde belirlenir ve video maliyetini hiç değiştirmez. Sahada bu öneri geçersiz çıktı —
   birimi kontrol etmeden önerme.
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
