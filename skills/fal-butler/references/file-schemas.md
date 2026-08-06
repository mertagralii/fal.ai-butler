# Dosya biçimleri

Komutlar ve agent'lar aynı biçimi üretsin diye. Başlıkları birebir kullan — `revise` bu
başlıklara göre okuyup güncelliyor.

## `.fal-butler/product.md`

`setup` üretir, git'te durur, kampanyalar arasında yeniden kullanılır.

```markdown
# Ürün profili: <Ürün Adı>

**Çıkarım tarihi:** YYYY-MM-DD
**Kaynaklar:** https://urunum.com (ana sayfa, /pricing) · README.md · app/page.tsx
<!-- Neye baktığın. Site varsa adresi ve hangi sayfalar. Site bayatlayabilir; kullanıcı
     neye bakıldığını görebilmeli. -->

## Ne yapıyor
<Bir paragraf. Teknik mimari değil, kullanıcıya ne sağladığı.>

## Kim kullanıyor
<Hedef kitle. Rol, bağlam, teknik seviye.>

## Hangi sorunu çözüyor
<İzleyicinin kendini tanıyacağı acı. Reklamın açılış sahnesi buradan doğar.>

## Ana iddia
<Tek cümlelik vaat. Landing page'de varsa onun gerçek dilini kullan.>

## Farklılaşma
<Rakiplerden ayrıldığı yer. Çıkaramadıysan sor.>

## Marka tonu
<Sıcak / kurumsal / esprili / teknik. Çıkaramadıysan sor.>

## Görsel kimlik
<Renk paleti, arayüz karakteri, varsa logo. Ekran görüntülerinden çıkar.>

## Reklamda kullanılmayacaklar
<Kullanıcının istemediği şeyler. Yoksa "belirtilmedi" yaz.>

## Kaynak çelişkileri
<Repo ile site farklı şey söylüyorsa buraya yaz. Site kazanır ama fark kayda geçsin.
 Çelişki yoksa bu bölümü hiç yazma.>
```

## `.fal-butler/campaigns/<slug>/brief.md`

Röportaj cevapları. Slug: `YYYY-MM-DD-<kısa-ad>`.

```markdown
# Kampanya brief'i: <Ad>

**Tarih:** YYYY-MM-DD

| Alan | Değer | Kaynak |
|---|---|---|
| Amaç | lansman | kullanıcı |
| Platform | Instagram Reels | kullanıcı |
| Süre | 60 sn | kullanıcı |
| Sahne sayısı | 6 | önerildi, onaylandı |
| Anlatım biçimi | karakterli hikaye | kullanıcı |
| **Mekan** | **tek mekan — ev ofisi** | kullanıcı |
| Ton | sıcak, esprili | kullanıcı |
| Dil | TR | kullanıcı |
| Seslendirme | **üretilsin** — metni plugin yazacak | kullanıcı |
| Müzik | **sonra kendim eklerim** | kullanıcı |
| Altyazı | **üretilsin** — .srt olarak | kullanıcı |
| CTA | "Ücretsiz dene" | kullanıcı |
| **Kalite tercihi** | **tahmini gördükten sonra karar** | kullanıcı |
| Seed | 731914 | üretildi |

## Karakter tarifi (kullanıcının kendi sözleri)
> <birebir alıntı — yorumlanmadan, kısaltılmadan>

## Mekan tarifi (kullanıcının kendi sözleri)
> <birebir alıntı — negatif tanımlar dahil: "ikinci monitör olmasın" gibi>

## Reklamda yasaklar
<kullanıcının saydıkları; product.md'dekiler teyit edildiyse "product.md ile aynı" yaz>

## Sabit karakter bloğu (İngilizce)
<fal-promptsmith'in ürettiği blok, BİREBİR. Her sahne prompt'una değişmeden yapıştırılır.>
```
A woman in her early thirties with shoulder-length dark brown straight hair parted in the
middle, wearing a beige linen shirt with rolled sleeves and a thin silver necklace. No glasses,
no hat, no visible tattoos.
```

## Profilden türetilenler
<--quick kullanıldıysa hangi alanların product.md'den türetildiği. Kullanılmadıysa "yok".>

## Revizyon geçmişi
<revise her çalıştığında bir satır ekler: tarih, ne değişti, yeni maliyet.>
```

**Seed ve sabit karakter bloğu `revise`'ın deterministik olmasının şartıdır.** Seed her
çalıştırmada yeniden üretilirse değişmeyen sahneler de değişir; karakter bloğu Türkçe bible'dan
her seferinde yeniden çevrilirse farklı bir İngilizce metin çıkar ve altı sahne kayar. İkisi de
burada yazılı kalır ve `revise` bunları **yeniden üretmeden okur**.

**Kaynak sütunu önemli:** ikinci çalıştırmada neyin kullanıcıdan, neyin varsayımdan geldiği
görünsün.

## `.fal-butler/campaigns/<slug>/storyboard.md`

Onay kapısında sunulan dosya. **Düz Türkçe, ham prompt yok.**

```markdown
# Storyboard: <Ad>

**Toplam:** 60 sn · 6 sahne · 9:16 · Instagram Reels

## Üretim yapısı

6 sahne **3 klipte** üretilecek. Sahneler arası geçişleri kamera hareketi taşıyor — bu, ayrı
ayrı üretip birleştirmeye göre daha akıcı ve daha az kırılgan.

| Klip | Süre | Sahneler | Geçiş |
|---|---|---|---|
| 1 | 10 sn | 1 → 2 | kamera geniş plandan yakına yaklaşıyor |
| 2 | 10 sn | 3 → 4 | kamera ekrana kayıyor |
| 3 | 10 sn | 5 → 6 | kamera geri çekiliyor |

## Karakter
**Ayşe** — 30'lu yaşların başı, omuz hizası koyu saç, sade bej gömlek, gündelik ofis ortamı.
Altı sahne boyunca değişmeyenler: yüz, saç, kıyafet, masa düzeni.

## Görsel çizgi
Soğuk-nötr palette başlar, sahne 4'ten sonra ısınır. Doğal pencere ışığı. 35 mm his.

## Sahneler

### Sahne 1 — Hook (0:00–0:06)
**Ne oluyor:** Dağınık masa, üst üste düşen bildirimler. Ayşe ekrana bakıyor, bunalmış.
**Plan:** Yakın plan, hafif yukarıdan.
**Işık:** Sabah, soğuk yan ışık.
**Ses:** "Gün başlamadan yorulmak…"
**Geçiş:** Sert kesim.
**Model:** <endpoint> · 6 sn · ~$X

### Sahne 2 — … (0:06–0:16)
…

## Toplam tahmini maliyet
**~$T** — döküm için `cost.md`.
```

Her sahnede **Ne oluyor / Plan / Işık / Ses / Geçiş / Model** alanları bulunur. Seslendirme
kapalıysa "Ses" satırını yazma.

## `.fal-butler/campaigns/<slug>/cost.md`

```markdown
# Maliyet tahmini: <Ad>

**Hesaplama tarihi:** YYYY-MM-DD
**Katalog tarihi:** YYYY-MM-DD   <!-- cache'teki fetchedAt -->

| Kalem | Adet | Birim | Birim fiyat | Tutar |
|---|---|---|---|---|
| … | … | … | … | … |
| **Toplam** | | | | **$T** |

**Payın dağılımı:** video %N · görüntü %N · ses %N · montaj %N

## Ucuzlatma seçenekleri
1. <seçenek> → **-%N** · feda edilen: <ne>
2. …

> Bu bir tahmindir. Gerçek tutarı fal panelinde göreceksin; yeniden denemeler artırabilir.
```

## `.fal-butler/campaigns/<slug>/subtitles.srt`

Altyazı **üretilsin** seçildiyse ayrı bir dosya olarak yazılır — `storyboard.md`'nin içine
gömülmez, çünkü kullanıcı bunu doğrudan Instagram/TikTok yükleme ekranına verecek.

```
1
00:00:00,500 --> 00:00:02,900
Gün başlamadan yorulmak…

2
00:00:06,400 --> 00:00:08,200
Bildirimler bitmiyor.
```

Zaman damgasında **virgül** (nokta değil), saat alanı iki hane, numaralar 1'den başlar.

Teslimde bu dosyanın yolunu ver ve **videoya gömülemediğini** hatırlat
(`skills/fal-edit/references/compose-schema.md`).

Seslendirme **"sonra kendim yaparım"** seçildiyse aynı klasöre `voiceover-script.md` yaz:
sahne bazında metin, başlangıç saniyesi ve tahmini süre — kullanıcı kendi kaydını buna göre
yapacak.

## `.fal-butler/campaigns/<slug>/revisions/`

`revise` her değişiklikten **önce** mevcut `workflow.json`'u buraya kopyalar:

```
revisions/2026-08-05T14-32-10-workflow.json
```

Zaman damgasında `:` kullanma — Windows dosya adında geçersizdir.
