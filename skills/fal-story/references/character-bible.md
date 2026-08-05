# Karakter bible

Altı sahne boyunca "aynı kişi" hissini kuran şey, üretim zincirine verilen sabit tanımdır.
Kullanıcı "kadın, 30'larında, ofiste" der; senin işin bunu modelin her seferinde aynı şekilde
canlandırabileceği kadar somutlaştırmak.

## Sabitlenecek alanlar

Bunların hepsi doldurulur ve **hiçbir sahnede değişmez**:

| Alan | Örnek | Neden sabit |
|---|---|---|
| **Etnik köken / coğrafya** | **"Türk, Akdeniz hatları, buğday teni"** | **Belirtilmezse model varsayılanına düşer.** Sahada hedef kitle Türk geliştiricilerdi ama çıktı belirgin Doğu Asyalı bir karakter oldu — prompt'ta coğrafya hiç yazmamıştı. Ten tonu tarif etmek yetmiyor; **coğrafyayı açıkça yaz** |
| Yaş aralığı | 30–34 | "Genç kadın" her sahnede farklı yaş üretir |
| Saç | Omuz hizası, koyu kahve, düz, ortadan ayrık | Modelin en çok kaydırdığı özellik |
| Yüz | Oval, açık ten, çilsiz, hafif belirgin elmacık | Referans görselle desteklenir |
| Vücut | Orta boy, ince yapılı | |
| Kıyafet | Bej keten gömlek, kolları kıvrık, koyu pantolon | Sahne değişse de kıyafet değişmez |
| Aksesuar | İnce gümüş kolye — başka takı yok | "Başka yok" demek önemli; model boşluğu doldurur |
| Ortam | Açık ofis, geniş pencere, ahşap masa, iki monitör | Mekan tutarlılığı da karakterin parçası |

**Negatif tanım kadar önemli:** "gözlük yok", "şapka yok", "dövme yok". Belirtilmeyen her şeyi
model rastgele üretir ve sahneden sahneye değiştirir.

## Kullanıcının kısa tarifinden türetme

Kullanıcı "kadın, 30'larında, ofiste çalışıyor, yorgun başlıyor mutlu bitiyor" dedi. Sen:

1. **Verdiklerini aynen al** — cinsiyet, yaş, ortam. Değiştirme.
2. **Belirtmediklerini `product.md`'den türet** — hedef kitle kimse karakter ona benzemeli.
   Kurumsal SaaS ise sade ve bakımlı; geliştirici aracı ise gündelik.
3. **Kalanları makul ve nötr doldur.** Marka tonuna uy, dikkat dağıtacak ayrıntı ekleme.
4. **Türettiklerini planda göster** ki kullanıcı itiraz edebilsin. Sessizce karar verme.

## Neyin değişmesi gerekir

Sabit olmayan tek şey **duygu ve duruş**. Hikâye yorgun başlayıp mutlu bitiyorsa yüz ifadesi,
omuz duruşu ve tempo değişir — kişi değişmez.

Işık ve kadraj da sahneye göre değişir, ama onlar `fal-visual`'ın işi. Sen sadece sahne başına
**duygu durumunu** yaz: "bunalmış", "temkinli umut", "rahatlamış".

## Ürün-ekran anlatımında

Karakter yerine **arayüz** sabitlenir:

| Alan | Örnek |
|---|---|
| Tema | Koyu tema, #0B0B0F arkaplan |
| Vurgu rengi | Turkuaz — `product.md`'deki görsel kimlikten |
| Tipografi | Sans-serif, orta ağırlık |
| Yerleşim | Sol kenar çubuğu, üstte arama, ortada liste |
| Dil | Türkçe arayüz metinleri |
| İçerik | Aynı örnek görevler — sahneler arası isim değişmez |

Son madde kritik: sahne 2'de "Tasarımı bitir" yazan görev, sahne 5'te de "Tasarımı bitir"
yazmalı. Değişirse izleyici farklı bir üründe olduğunu hisseder.

## Zincire ne teslim edersin

`fal-dop`'a giden karakter bible'ı, tek blokta ve değişmez bir metin olarak yaz. Sonraki
agent'lar bunu **birebir aktarır** — özetlemez, yeniden yazmaz. Her yeniden yazım, tutarlılıktan
biraz daha götürür.
