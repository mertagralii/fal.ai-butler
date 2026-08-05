# Reklam dramaturjisi

## İlk 3 saniye her şeydir

Sosyal medyada izleyici kaydırıyor. İlk üç saniyede bir şey olmuyorsa reklam bitmiştir —
kalan 57 saniye kimsenin görmediği içeriktir.

Hook kuralları:

- **Sorunu göster, anlatma.** "Görev takibi zor olabilir" değil: dağınık masa, üst üste düşen
  bildirimler, yorgun yüz.
- **Ürünü gösterme.** Logo ile açılan reklam atlanır. Ürün ortada girer.
- **Hareket olsun.** Sabit açılış kaydırılır.
- **Kısa tut.** Açılış sahnesi genelde en kısa sahnedir.

## Yapı

Beş evre. Sahne sayısı değişse de sıra değişmez:

| Evre | İşi | 60 sn / 6 sahnede |
|---|---|---|
| **Hook** | Dikkat çek, sorunu göster | 1 sahne · 5 sn |
| **Büyütme** | Sorunu izleyicinin kendi hayatına bağla | 2 sahne · 8 + 9 sn |
| **Dönüş** | Ürün girer — çözüm anı | 1 sahne · 13 sn |
| **Kanıt** | Ürünün işe yaradığını göster | 1 sahne · 13 sn |
| **CTA** | Ne yapılacağını söyle | 1 sahne · 12 sn |

Bu dağılım toplam 60 sn eder ve aşağıdaki aralıklarla uyumludur. Farklı süre veya sahne
sayısında **aralıkları esas al**, oran hesabı yapma — hook her zaman kısa, dönüş ve kanıt
her zaman uzundur.

Altı sahnede tipik dağılım: 1 hook, 2 büyütme, 1 dönüş, 1 kanıt, 1 CTA. Kısa sürelerde
büyütme ve kanıt birer sahneye iner.

## Süreyi eşit bölme

60 saniyeyi altıya bölüp her sahneye 10 saniye vermek amatör işidir ve kurguyu öldürür.

- **Hook kısa ve sert:** 4–6 sn. Uzun açılış izleyiciyi kaçırır.
- **Dönüş ve kanıt uzun:** 10–14 sn. Ürünün gerçekten ne yaptığı burada anlaşılır; acele edilirse
  reklam "ne satıyordu bu" hissi bırakır.
- **CTA net ama kısa:** 5–8 sn. Son kare CTA'yı taşımalı.
- **Ara sahneler:** kalanı paylaşır.

Toplam hedefi tuttur. Sapma varsa ara sahnelerden kırp, hook ve CTA'ya dokunma.

## Seslendirme metni

### Süreyi **hece** sayarak hesapla — kelime sayısı yanıltır

Türkçe sondan eklemelidir; kelime uzunlukları çok değişkendir. Sahada kelime bazlı tahmin
kullanıldı ve gerçek süreyle arasındaki fark **%140'a** ulaştı: 2,6 sn sanılan cümle 6,2 sn
sürdü ve 6 saniyelik sahneye sığmadı.

`fal-audio`'nun kullandığı formülün **aynısını** kullan:

```
tahmini süre = (hece sayısı / 5) + (cümle sayısı × 0.4) + 0.6
```

Yani saniyede ~5 hece, artı cümle başına nefes payı. 6 saniyelik bir sahneye kabaca **25 hece**
sığar.

Bunu metni yazarken uygularsan `fal-audio`'nun geri dönüş turu hiç gerekmez — o tur zincirdeki
tek geri dönüştür ve tamamen önlenebilir.

- **Sahnenin %85–95'ini doldur.** Aşırı kısa metin sessizlik bırakır; iki saniyeden uzun
  sessizlik izleyiciye "video bitti" hissi verir.
- **Görüntüyü tekrarlama.** Ekranda dağınık masa varsa "masası dağınıktı" deme; görüntünün
  söylemediğini söyle.

### Orta bölüm özellik listesi olmayacak

**Sahada çıkan kusur:** "seslendirilen metin yeterli değil, çok klasik olmuş."

Hook iyiydi ama gelişme bölümü ürün broşürü diline kaydı:

> ✗ "DevCareerAI, CV'ne tek bir yapay zeka değil, bir uzman paneli gibi bakıyor…"

Bu cümle bir özellik sıralaması. İzleyici reklamda özellik dinlemez, **bir an** yaşar.

Kural: ürünü **karakterin yaşadığı tek bir an** üzerinden anlat.

> ✓ "Puan 41 çıktı. Altında üç madde vardı — neyi eksik yazdığımı ilk kez biri söylüyordu."

**Somutluk kuralı:** soyut vaat yerine **ekranda görünen tek bir gerçek detay** kullan — bir
sayı, bir cümle, bir işaret. "Uzman paneli gibi bakıyor" soyuttur; "puan 41" somuttur ve
görüntüyle eşleşir.
- **Cümleleri kısa kur.** Yan cümleli uzun yapılar seslendirmede boğulur.
- **Sahne 1'de ürün adını anma.** İlk anış dönüş sahnesinde olur.

`fal-audio` metnin süresini hesaplayıp uyuşmazlık bildirirse metni kısalt — sahneyi uzatmak
ikinci tercih, çünkü toplam süre hedefi kullanıcıdan geliyor.

## CTA

- **Tek eylem.** "Siteyi ziyaret et, kaydol ve Discord'a katıl" hiçbiri yapılmaz demektir.
- **Kullanıcının verdiği CTA'yı birebir kullan.** Yeniden yazma, cilalama.
- **Son karede görünür olsun.** `fal-edit` bunu kontrol eder; sen CTA'nın son sahnede
  bulunduğundan emin ol.
- **Sürtünmeyi söyle.** Ücretsizse "ücretsiz" geçsin — dönüşümü en çok etkileyen tek kelimedir.

## Ürün-ekran odaklı anlatımda

Karakter yoksa dramaturji değişmez, özne değişir: acıyı yaşayan kişi yerine **ekranın kendisi**
anlatır. Hook, kötü bir "önce" durumu (dağınık liste, hata mesajı, sonsuz sekme) olur; dönüş,
arayüzün bunu çözdüğü an. Tutarlılık ihtiyacı yine vardır — bu sefer karakterin değil,
**arayüzün** aynı kalması gerekir (`character-bible.md` bunu da kapsar).
