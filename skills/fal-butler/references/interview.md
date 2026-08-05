# Röportaj

Kampanyanın kalitesi buradan çıkar. Sahada gördük: "kadın, 30'larında, ofiste" gibi iki cümlelik
bir tarif, modelin boşlukları kendi varsayımlarıyla doldurmasına yol açıyor — etnik köken kaydı,
ortam sapması, kıyafet değişimi hep bu yüzden.

## Genel kurallar

- **Sorular tek tek gelir.** Hepsini bir listede sunma; kullanıcı yorulur ve savruk cevaplar verir.
- **Her sorunun akıllı varsayılanı vardır** — `product.md`'den türetilir. Kullanıcı "sen karar
  ver" diyebilir.
- **Serbest metin isteyen sorularda önce ne yazılacağını göster, sonra örnek ver.** Kullanıcı
  video prodüksiyonu bilmiyor; boş bir kutu ona hiçbir şey sormaz.
- **Cevapları yorumlayıp genişletme.** Kullanıcının kendi sözlerini `brief.md`'ye birebir yaz;
  türettiklerini ayrı bölümde göster.
- **Aşama sonlarında özetle.** Uzun röportajda kullanıcı ne dediğini unutur.
- `--quick` verilmişse yalnızca **Aşama 1** ve **CTA** sorulur; kalanı profilden türetilir ve
  türetilenler planda listelenir.

---

## Aşama 1 — Kampanya çerçevesi (hızlı, çoktan seçmeli)

**1. Amaç** — lansman / yeni özellik / indirim / marka bilinirliği

**2. Platform ve süre** — Instagram Reels · TikTok · YouTube Shorts · YouTube (yatay)
Süre seçildikten sonra sahne sayısı öner ama **dayatma** (Aşama 3'te konuşulacak).

**3. Anlatım biçimi** — bu seçim röportajın kalanını belirler:

| Seçim | Sonraki aşama |
|---|---|
| **Karakterli hikâye** | Aşama 2A — karakter |
| **Ürün-ekran odaklı** | Aşama 2B — arayüz |
| **Soyut / motion** | Aşama 2C — görsel dil |

---

## Aşama 2A — Karakter *(karakterli hikâye seçildiyse)*

Bu, röportajın **en önemli** adımı. Karakter sayfası buradan üretilecek ve tüm kampanya ona
zincirlenecek.

### Soruyu şöyle sor

> ## Karakterinizi anlatın
>
> Reklamda görünecek kişiyi tarif edin. Ne kadar çok ayrıntı verirseniz, karakter sahneler
> boyunca o kadar tutarlı kalır. **Belirtmediğiniz her şeyi model kendi kafasına göre üretir ve
> her sahnede değiştirir.**
>
> **Şunları yazmanız işimize yarar:**
>
> | | |
> |---|---|
> | **Cinsiyet ve yaş** | "kadın, 30'lu yaşların başı" |
> | **Nereli / etnik köken** | **Bunu mutlaka yazın.** Yazılmazsa model varsayılanına düşer — hedef kitleniz Türkiye ise karakter Türk görünmeyebilir |
> | **Yüz ve saç** | saç rengi, uzunluğu, biçimi; yüz hatları; gözlük var mı |
> | **Kıyafet** | renk, kesim, desen — "sade" demek de bir bilgidir |
> | **Aksesuar** | takı, saat, çanta. **Yoksa "başka takı yok" yazın** |
> | **Karakteri ne yapıyor** | mesleği, o gün ne yaşıyor |
> | **Olmasını istemedikleriniz** | "gözlük olmasın", "takım elbise olmasın" |
>
> **Örnek — bu kadar ayrıntı ideal:**
>
> > Türk, 30'lu yaşların başında bir kadın. Akdeniz hatları, buğday teni. Omuz hizasında koyu
> > kahve düz saç, ortadan ayrık. Gözlük yok. Sade bej keten gömlek, kolları kıvrık, koyu
> > pantolon. İnce gümüş kolye dışında takı yok. Yazılımcı; açık ofiste çalışıyor, işe yorgun
> > ve bunalmış başlıyor, sonunda rahatlıyor. Dövme, şapka ve takım elbise istemiyorum.
>
> Bu kadarını yazmak istemezseniz kısa yazın, eksikleri ben sorarım.

### Sonra eksikleri tamamla

Kullanıcının cevabında **eksik kalan alanları tek tek sor** — hepsini birden değil, yalnızca
boş olanları. Özellikle şu üçünü asla boş bırakma, çünkü sahada ikisi de sorun çıkardı:

1. **Etnik köken / coğrafya** — yazılmadıysa mutlaka sor
2. **Aksesuar yokluğu** — "başka takı yok" gibi negatif tanım
3. **Kıyafet deseni** — "düz mü desenli mi"

### Karakter kaç kişi

Tek karakter varsayılandır. Kullanıcı ikinci bir kişi isterse **uyar:** her ek karakter tutarlılık
riskini ve maliyeti artırır; ayrıca iki kişinin etkileşimi (el teması gibi) anatomi bozukluğunun
en sık kaynağıdır (`skills/fal-prompt/references/photorealism.md`).

---

## Aşama 2B — Arayüz *(ürün-ekran odaklı seçildiyse)*

> ## Ürün ekranınızı anlatın
>
> **En iyisi: gerçek ekran görüntüsü.** Elinizde varsa ve erişilebilir bir bağlantıya
> koyabilirseniz (GitHub raw, kendi siteniz, fal'ın yükleme alanı) bana URL'ini verin —
> modele referans olarak veririm, uydurma arayüz ve bozuk yazı riski büyük ölçüde düşer.
>
> Yoksa tarif edin:
>
> | | |
> |---|---|
> | **Tema** | koyu / açık, arkaplan rengi |
> | **Vurgu rengi** | marka renginiz |
> | **Yerleşim** | kenar çubuğu solda mı, üstte arama var mı, ortada ne var |
> | **Ekranda ne görünüyor** | liste mi, grafik mi, form mu |
> | **Örnek içerik** | ekrandaki metinler — **sahneler boyunca aynı kalmalı** |

**Uyarı — kullanıcıya söyle:** gerçek ekran görüntüsü verilmezse arayüz **üretilmiş bir
temsildir**, sizin gerçek ürününüz değildir. Ekrandaki metinler modelin ürettiği örneklerdir.

---

## Aşama 2C — Görsel dil *(soyut/motion seçildiyse)*

Renk paleti, hareket karakteri (yumuşak/keskin), soyutlama düzeyi, referans verebileceği bir
görsel stil. Karakter ve mekan soruları atlanır; Aşama 3'te yalnızca sahne sayısı sorulur.

---

## Aşama 3 — Mekan ve sahne yapısı

### 1. Sahne sayısı

> 30 saniye için **4–6 sahne** öneriyorum. Sahne, hikâyenin bir adımı demek — kaç adımda
> anlatmak istersiniz?

**Kullanıcıya "klip" deme, "sahne" de.** Sahne sayısı anlatının ritmini belirler; kaç video
üretileceğini değil. Üretim tarafında birden fazla sahne tek bir klipte birleşebilir ve geçişi
kamera hareketi taşır — bu, videoyu hem akıcı hem sağlam yapar
(`skills/fal-motion/references/duration-budget.md`).

Sahne sayısı arttıkça sahne başına saniye düşer; 4 saniyenin altına inen sahne anlatamaz. Bunu
gerekçe olarak söyle ama karar kullanıcının.

### 2. Mekan tek mi, değişiyor mu — **bunu mutlaka sor**

> Sahnelerin hepsi aynı yerde mi geçsin, yoksa mekan değişsin mi?
>
> - **Tek mekan** — daha tutarlı, daha ucuz, daha inandırıcı. Sahneler arası sapma riski düşük.
> - **Mekan değişiyor** — daha zengin anlatım, ama her mekan ayrı tarif ister ve tutarlılık riski
>   artar.

**Tek mekan varsayılan olsun.** Sahada mekan sabit tutulmaya çalışıldığı hâlde kaydı; bilerek
değiştirmek daha da zor.

### 3. Mekanı anlatın

> ## Mekanı anlatın
>
> Karakterde olduğu gibi: yazmadığınız her şeyi model uydurur ve sahneden sahneye değiştirir.
>
> | | |
> |---|---|
> | **Nerede** | ev ofisi, açık ofis, kafe, sokak |
> | **Arka plan** | duvar rengi/dokusu, pencere var mı, ne görünüyor |
> | **Masa üstü** | kaç ekran, hangi nesneler |
> | **Işık** | gündüz mü, pencere ışığı mı, lamba mı |
> | **Olmasını istemedikleriniz** | "ikinci monitör olmasın", "bitki olmasın" |
>
> **Örnek:**
>
> > Sade bir ev ofisi. Açık gri düz duvar, solda geniş bir pencere — dışarısı görünmüyor, sadece
> > ışık geliyor. Ahşap masa, **tek** laptop, yanında beyaz bir kupa. Başka ekran yok, duvarda
> > poster yok, masada dağınıklık yok. Sabah ışığı.

Son cümledeki negatif tanımlara dikkat çek — sahada **ikinci monitör kendiliğinden belirdi** ve
kalıcı oldu.

### 4. Sahne sahne ne olsun *(opsiyonel)*

> Sahnelerde ne olacağını siz mi söylemek istersiniz, yoksa ben mi kurgulayayım?

Kullanıcı kurguyu bana bırakırsa `fal-director` serbesttir. Kendisi söylemek isterse sahne sahne
al ve **birebir** `brief.md`'ye yaz — yorumlama.

---

## Aşama 4 — Ton, dil, kapsam

**1. Ton** — enerjik / sakin / esprili / kurumsal / sıcak-cesaretlendirici

**2. Dil** — TR / EN / ikisi

**3. Kapsam** — üçü **ayrı ayrı** sorulur ve her birinin **üç** cevabı vardır:

Her soruda seçenekler: **Üretilsin** · **Sonra kendim eklerim** · **Hiç olmasın**

Ortadaki seçenek önemli — kullanıcı kendi müziğini/sesini kendi düzenleyicisinde eklemek
isteyebilir. O zaman düğüm üretilmez ama montaj ona **yer bırakacak** şekilde kurulur.

> **Müzik olsun mu?**
> - **Üretilsin** — sahne tonuna uygun bir müzik üretirim, montaja gömerim
> - **Sonra kendim eklerim** — müzik düğümü üretmem; videoyu müziksiz teslim ederim, sen
>   kendi düzenleyicinde eklersin. Seslendirme varsa onu ayrı ses dosyası olarak da veririm
> - **Hiç olmasın** — sessiz kalsın

> **Seslendirme olsun mu?**
> - **Üretilsin** — metni yazar, seslendirmeyi üretir, montaja gömerim
> - **Sonra kendim seslendiririm** — metni yazarım, zamanlamasıyla birlikte veririm; sesi sen
>   üretir/kaydedersin. Sahne süreleri metne göre ayarlanır
> - **Hiç olmasın** — sadece görüntü ve müzik

> **Altyazı olsun mu?**
> - **Üretilsin** — `.srt` dosyası olarak veririm. **Videoya gömemiyorum** — fal'ın montaj
>   aracında metin desteği yok; yükleme ekranında altyazı dosyası olarak ekleyebilirsin
> - **Hiç olmasın**

Altyazıda "sonra kendim eklerim" seçeneği **yok**, çünkü zaten gömemiyoruz — `.srt` üretmek
her hâlükârda faydalı ve bedava. Bu kısıtı soruyu sorarken açıkça söyle
(`skills/fal-edit/references/compose-schema.md`).

### Kapsam kararları montajı değiştirir

`fal-editor`'a hangi kararın verildiğini **açıkça** ilet:

| Karar | Montaj |
|---|---|
| Müzik üretilsin | Müzik track'i, `loudnorm` ile kısılmış |
| Müzik sonra eklenecek | Müzik track'i **yok**; final video müziksiz teslim edilir |
| Seslendirme sonra eklenecek | Ses track'i yok; **metin ve zamanlama ayrı dosyada** verilir |
| Üçü de yok | `compose` tek video track'iyle çalışır |

**4. Seslendirme metni kime ait** *(seslendirme üretilecekse ya da sonra eklenecekse)*

> Seslendirme metnini ben mi yazayım, yoksa sizde hazır bir metin var mı?

Kullanıcının metni varsa **birebir kullan** ve yalnızca süreye sığmıyorsa kısaltma öner.

---

## Aşama 5 — CTA ve yasaklar

**1. CTA** — izleyici ne yapsın. Kullanıcının verdiği ifadeyi **birebir** kullan, cilalama.

**2. Reklamda olmasını istemedikleriniz**

> Reklamda kesinlikle olmasını istemediğiniz bir şey var mı? Örneğin: gerçek olmayan
> istatistikler, iş/başarı garantisi vaadi, rakip isimleri, "yakında" olan özelliklerin
> yayındaymış gibi gösterilmesi.

`product.md`'de zaten yazılıysa **teyit et**, sıfırdan sorma.

---

## Aşama 6 — Kalite ve bütçe

> Video kalitesi ile maliyet arasında bir seçim var. Hangisi sizin için önemli?
>
> - **Bütçe öncelikli** — saniye başına ucuz model, standart çözünürlük
> - **Kalite öncelikli** — üst sınıf model, en yüksek çözünürlük/bitrate. Kat kat pahalı olabilir
> - **Bana bir tahmin ver, sonra karar vereyim** *(varsayılan)*

Üçüncü seçenek varsayılandır: `fal-compiler` iki seçeneği de fiyatlandırır ve **onay kapısında
ikisini yan yana** gösterir. Karar orada verilir.

---

## Röportaj sonu — özet ve teyit

Bitirmeden önce toparla ve **düzeltme şansı ver**:

> Özetliyorum:
> — 30 sn, Instagram Reels, dikey, Türkçe
> — 4 sahne, hepsi aynı ev ofisinde
> — Karakter: Türk, 30'lu yaşların başı kadın, … *(kısa özet)*
> — Seslendirme var, müzik var, altyazı var
> — CTA: "Ücretsiz dene"
> — Kalite: tahmin gördükten sonra karar
>
> Düzeltmek istediğin bir şey var mı?

Sonra ekip zinciri başlar.
