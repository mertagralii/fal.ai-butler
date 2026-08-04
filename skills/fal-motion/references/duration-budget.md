# Klip süre bütçesi

## Sınırı şemadan oku

Video modelleri klip başına sınırlı süre üretir. Bu sınır modelden modele ve sürümden sürüme
değişir — **ezberden yazma, modelin şemasından oku**. Şemada genelde `duration` alanı ve kabul
ettiği değerler (sabit seçenekler ya da aralık) bulunur.

`fal-compiler` modeli seçtikten sonra şemasını cache'e yazar; sen oradan okursun
(`skills/fal-butler/references/cache-discipline.md`).

Kontrol edilecek alanlar:

- `duration` — kabul edilen değerler; çoğu model ayrık seçenekler sunar, keyfi saniye değil
- `fps` — çıktı kare hızı
- `resolution` / `aspect_ratio` — dikey format destekleniyor mu
- `image_url` / `end_image_url` — first/last frame desteği var mı
- `seed` — determinizm mümkün mü

## Sahne süresi sınırı aşıyorsa

**1. Ayrık değerlere yuvarla.** Model 5 ve 10 saniye kabul ediyorsa 8 saniyelik sahne olamaz.
Yakın olana yuvarla ve **toplam süreyi yeniden dengele** — bir sahnede kazandığın saniyeyi
başka sahneden düş, toplam hedef bozulmasın.

**2. Sahneyi böl ve zincirle.** 16 saniyelik bir sahne, sınır 8 ise iki klibe bölünür. İkinci
klip, birincinin son karesinden başlar — `keyframe-chaining.md`'deki zincirin aynısı, sahne içinde.
İzleyici tek sahne olarak görür.

Bölerken hareketi de böl: ilk klipte eylemin başı, ikincide devamı. Aynı hareket tarifini iki
klibe vermek, ikinci klipte hareketin baştan başlamasına yol açar.

**3. Bölünemiyorsa bildir.** Sahne bölünemeyecek kadar tek parçaysa (kesintisiz bir jest) ve model
yetmiyorsa, `fal-director`'a bildir: ya sahne kısalır ya başka model aranır. Sessizce kısaltma.

## Toplam süre denetimi

Sahne süreleri toplamı, kullanıcının verdiği toplam süreyi tutmalı. Sapma varsa:

- **Fazlaysa** ara sahnelerden kırp. Hook ve CTA'ya dokunma.
- **Eksikse** dönüş/kanıt sahnelerine ekle — onlar zaten uzun olmalı.
- **Yuvarlamalar biriktiyse** en uzun sahneden düzelt; birden fazla sahneye dağıtma, kurgu
  ritmi bozulur.

Denetimi `fal-edit` de yapar, ama sorunu burada çözmek daha ucuz: video üretildikten sonra
süre düzeltmek yeniden üretim demektir.

## fps ve çözünürlük

- **fps:** 24 sinematik, 30 sosyal medyada standart. Model destekliyorsa 30 seç; desteklemiyorsa
  çıktısını olduğu gibi al, `ffmpeg` montajda eşitler.
- **Çözünürlük:** dikey için 1080×1920 hedefle. Maliyet sorun olursa 720×1280 —
  `skills/fal-butler/references/cost-model.md`'deki ilk ucuzlatma önerisi budur.
- **En-boy oranı:** modelin desteklediği oranlar arasında 9:16 yoksa en yakınını üretip
  `fal-edit`'in kırpmasına bırak, ama bunu reçeteye not düş — kırpma kadrajı daraltır ve
  `fal-dop`'un kompozisyonu bundan etkilenir.

## Ses varsa

Seslendirme süresi sahne süresini belirleyebilir. `fal-audio` uyuşmazlık bildirirse önce metin
kısalır; sahne uzatmak toplam süreyi bozar. Bkz. `skills/fal-sound/references/sync.md`.
