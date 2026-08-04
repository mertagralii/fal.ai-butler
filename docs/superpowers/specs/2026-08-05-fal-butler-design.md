# fal-butler — Tasarım Dokümanı

**Tarih:** 2026-08-05
**Durum:** Onaylandı, implementasyon planı bekliyor

---

## 1. Amaç

Projesini bitirmiş bir yazılımcının, video prodüksiyonu bilmeden, kendi ürününe özel bir reklam videosu kampanyası kurmasını sağlayan Claude Code plugin'i.

Yazılımcı iki cümlelik bir tarif yazar ("kadın, 30'larında, ofiste, yorgun başlıyor mutlu bitiyor"); plugin karşılığında fal.ai'a import edilmeye hazır, sahneleri birbirine görsel olarak zincirlenmiş, seslendirmeli, müzikli, altyazılı ve platforma göre kesilmiş bir `workflow.json` üretir.

**Temel ilke:** Plugin hiçbir model çalıştırmaz, hiç para harcamaz. Üretim kararı ve maliyet kontrolü tamamen kullanıcıda, fal panelinde kalır.

---

## 2. Doğrulanmış kısıtlar

Tasarım aşağıdaki araştırma bulgularına dayanıyor. Bunlar varsayım değil, doğrulanmış gerçeklerdir:

| Bulgu | Kaynak | Tasarıma etkisi |
|---|---|---|
| fal'ın resmi MCP sunucusu var (`mcp.fal.ai/mcp`); model arama, şema okuma, inference, upload, doküman gezme sağlıyor. Ücretsiz, API key header'da gider, saklanmaz. | [fal blog](https://blog.fal.ai/connect-your-ai-to-1-000-models-with-the-fal-mcp-server/), [docs](https://fal.ai/docs/documentation/setting-up/mcp) | Kendi API wrapper'ımızı yazmıyoruz. Bağlantı MCP üzerinden. |
| fal Workflows modelleri zincirleyip tek endpoint yapıyor. JSON tanımı: `input` düğümü, model düğümleri, `output` düğümü; `depends` ile sıra, `$node-id.field` ile veri akışı. | [Workflow docs](https://fal.ai/docs/documentation/model-apis/workflows), [WORKFLOWS.md](https://github.com/fal-ai-community/skills/blob/main/skills/fal-workflow/references/WORKFLOWS.md) | Çıktımız bu şemaya uyan JSON. |
| **Workflow'ları programatik olarak oluşturma API'si yok.** Platform API'leri workflow için sadece okuma (list + get) veriyor. Oluşturma yalnızca görsel Workflow Builder'dan. | [Platform APIs](https://docs.fal.ai/reference/platform-apis/for-workflows) | Plugin workflow'u fal'da *kuramaz*; JSON üretir, kullanıcı import eder. |
| `ffmpeg-api/compose`, `merge-videos`, `merge-audio-video`, `merge-audios` endpoint'leri mevcut; $0.0002/saniye. | [compose](https://fal.ai/models/fal-ai/ffmpeg-api/compose/api), [merge-videos](https://fal.ai/models/fal-ai/ffmpeg-api/merge-videos/api) | Son montaj workflow'un içinde kalabiliyor; lokal montaj adımına gerek yok. |
| Karakter tutarlılığında 2026'nın yerleşik yöntemi: hero referans görseli + first/last frame kontrolü. Metinle "aynı karakter" demek yetmiyor. | [Kittl](https://www.kittl.com/blogs/ai-video-character-consistency-workflow/), [Magic Hour](https://magichour.ai/blog/how-to-keep-characters-consistent-in-ai-video) | Tutarlılık stratejimizin temeli (§8). |
| `fal-ai-community/skills` repo'sunda commercial/marketing/storytelling/UGC skill'leri var; ancak Claude Code plugin'i değiller, agent/command/MCP config içermiyorlar, `genmedia` CLI'ına bağlılar ve **proje farkındalığı yok**. | [repo](https://github.com/fal-ai-community/skills) | Bağımlılık kurmuyoruz. Bilgiyi çalışma anında canlı çekiyoruz (§4). Farkımız proje farkındalığı. |

**Açık belirsizlik:** `ffmpeg-api/compose`'un video üzerine metin/altyazı gömme desteği doğrulanmadı. Derleme anında şemadan kontrol edilecek; desteklemiyorsa altyazı ayrı `.srt` dosyası olarak üretilir ve kullanıcıya açıkça bildirilir.

---

## 3. Mimari

Beş katman, her biri tek işten sorumlu. Katmanlar **dosya üzerinden** konuşur — bu sayede her adım tek başına çalıştırılabilir, gözden geçirilebilir ve git'te izlenebilir.

| Katman | Görevi | Girdi → Çıktı |
|---|---|---|
| **Bilgi** | fal kataloğu, şemaları ve dokümanı; TTL'li cache | ihtiyaç → güncel şema |
| **Profil** | Projeyi tarayıp ürünü anlar | repo → `product.md` |
| **Yönetmen** | Reklam kurgusunu yazar | brief + profil → `storyboard.md` |
| **Derleyici** | Kurguyu fal JSON'una çevirir | storyboard + şema → `workflow.json` |
| **Muhasebe** | Fiyatı çıkarır, ucuzlatır | workflow → `cost.md` + öneriler |

Storyboard beğenilmezse yalnızca o adım tekrarlanır; profil yeniden çıkarılmaz.

**Katman ↔ agent eşlemesi:** Katmanlar kavramsal sorumluluk alanlarıdır, agent'lar (§7) bu alanların içindeki üretim aşamalarıdır. Yönetmen katmanı `fal-director`, `fal-dop`, `fal-motion`, `fal-audio` ve `fal-editor`'ü; derleyici katmanı `fal-promptsmith` ve `fal-compiler`'ı barındırır. Bilgi katmanının ayrı agent'ı yoktur — MCP + cache disiplini olarak tüm agent'lar tarafından paylaşılır. Profil ve muhasebe katmanları komut seviyesinde çalışır (`setup`, `revise`).

---

## 4. Bağlantı ve güncel kalma

**Bağlantı:** Plugin, fal'ın resmi MCP sunucusunu `.mcp.json` ile tanımlar. Kimlik `FAL_KEY` ortam değişkeninden gelir.

**Güncel kalma:** Model kataloğu, şemalar ve doküman **hard-code edilmez**. Plugin bir modele veya şemaya ihtiyaç duyduğunda fal MCP'nin arama/şema/doküman araçlarını sorgular, sonucu `.fal-butler/cache/` altına tarihiyle yazar. Cache tazeyse (varsayılan TTL: 7 gün) tekrar çekmez.

Bu, plugin'in fal değiştikçe kendini güncellemesini sağlar: yeni bir video modeli çıktığında ya da bir endpoint kaldırıldığında plugin kodunu değiştirmeye gerek kalmaz.

---

## 5. Komut yüzeyi

Üç komut. Fazlası kullanıcıyı yorar.

### `/fal-butler:setup`
Tek seferlik kurulum, zincirleme çalışır:
1. `FAL_KEY` var mı kontrol eder; yoksa nereden alınacağını söyler
2. fal MCP bağlantısını doğrular
3. Model kataloğunu cache'e doldurur
4. **Ardından otomatik olarak** projeyi tarar: README, `package.json`, landing page metinleri, i18n dosyaları, ekran görüntüleri
5. `product.md` üretir; çıkaramadığı alanları (marka tonu, hedef kitle, farklılaşma) sorar
6. "Her şey hazır, artık kampanya kurabiliriz" der

Cache elle tazelenmek istenirse `setup` tekrar çalıştırılır. Ayrı `refresh` komutu yok.

### `/fal-butler:campaign`
Röportajı yürütür, planı sunar, onay alır, JSON üretir. Detay §6 ve §7.

### `/fal-butler:revise`
Var olan bir `workflow.json` üzerinde hem **maliyet** hem **kurgu** revizyonu yapar. İkisi ayrı komut değildir çünkü ikisi de aynı işi yapar: mevcut JSON'u okuyup değiştirmek.

**Zorunluluk:** Var olan bir `workflow.json` olmadan çalışmaz. Yoksa hata verip `campaign`'e yönlendirir; birden fazla kampanya varsa hangisi olduğunu sorar.

Her revizyonda JSON'un önceki hali `revisions/` altına zaman damgasıyla saklanır.

---

## 6. Röportaj

Sorular **tek tek** gelir; her birinin `product.md`'den türetilmiş akıllı varsayılanı vardır ve "sen karar ver" denip geçilebilir.

1. **Amaç** — lansman / yeni özellik / indirim / marka bilinirliği
2. **Platform + süre** — plugin süreye göre sahne sayısı önerir (60 sn ≈ 6 sahne)
3. **Anlatım biçimi** — karakterli hikaye / ürün-ekran odaklı / soyut-motion
4. **Karakter** *(yalnızca karakterli seçildiyse)* — cinsiyet, yaş aralığı, görünüm, kıyafet-stil, ortam
5. **Ton** — enerjik / sakin / esprili / kurumsal
6. **Dil** — TR / EN / ikisi
7. **Kapsam** — seslendirme? müzik? altyazı? **Her biri ayrı ayrı, kampanya başına kapatılabilir.**
8. **CTA** — izleyici ne yapsın

Cevaplar `brief.md`'ye yazılır. İkinci çalıştırmada sorular sıfırdan gelmez; önceki cevaplar varsayılan olarak dolu gelir.

`--quick` bayrağı yalnızca amaç, platform, süre ve CTA'yı sorar; kalanı profilden türetir.

---

## 7. Yaratıcı ekip

Uzmanlıklar **skill** olarak, boru hattı aşamaları **agent** olarak ayrılmıştır. Sebep: fotoğrafçı ile ışıkçı aynı görselin iki parçasını üretir; ayrı agent yapmak tek sahne için iki tur ve aralarında çelişki demektir.

### Akış

```
director → dop → motion → audio → editor → promptsmith → compiler
                    ↑___________|
              (süre için tek geri besleme turu)
```

### 1. `fal-director` — senarist
Hikaye yapısı: ilk 3 saniyenin hook'u, sahne beat'leri, sahne başına kaba süre dağılımı, seslendirme metni, karakter bible.

60 saniyeyi eşit altıya bölmez — açılış kısa ve sert, ürün sahnesi uzun olur.

*Skill'ler:* reklam dramaturjisi · karakter bible

### 2. `fal-dop` — fotoğrafçı + ışıkçı + kameraman
Her sahnenin **durağan** anahtar karesi için reçete: plan ölçeği, lens karakteri, kamera hareketi niyeti, ışık kurulumu (key/fill/rim, günün saati), renk paleti, kompozisyon.

Kullanıcı "ofiste" der; DOP "geniş pencereden yumuşak yan ışık, sabah, 35 mm, hafif dolly-in" diye açar.

*Skill'ler:* sinematografi · ışık · kompozisyon

### 3. `fal-motion` — hareket yönetmeni
Anahtar kareyi videoya çeviren katman:
- **Yöntem seçimi:** image-to-video / first-frame+last-frame / text-to-video
- **Hareket dili:** karakterin ve kameranın hareketinin video modeline tarifi — durağan prompt dilinden ayrı bir gramer
- **Süre gerçekçiliği:** video modelleri genelde klip başına 5–10 sn üretir. Daha uzun sahne istenirse böler ve zincirler, mümkün değilse söyler
- **Zincirleme:** sahne N'in son karesini çıkarıp N+1'in referansına bağlar (§8)
- **Parametreler:** fps, çözünürlük, hareket şiddeti, seed sabitleme

*Skill'ler:* video hareket prompt'lama · keyframe zincirleme · klip süre bütçesi · seed ve determinizm

### 4. `fal-audio` — ses tasarımcısı
Seslendirme (TTS modeli, dil, ses tonu seçimi), müzik üretimi ve sahne tonuyla uyumu, ses miksaj planı (müziğin konuşma altında kısılması dahil).

Seslendirme metnini okuyup süresini hesaplar; "bu cümle 7 saniye sürer ama sahne 4 saniye" durumunda `fal-motion`'a geri bildirim gönderir.

*Skill'ler:* ses–görüntü senkronu · müzik ve ton

### 5. `fal-editor` — kurgucu
6 klip + seslendirme + müzik + altyazıyı tek videoya çevirir:
- **Kesim ve geçişler:** nerede sert kesim, nerede dissolve, nerede match cut. Sorun sahnelerinden ürün sahnesine geçiş sert, sonda rahatlama yumuşak
- **Zaman çizelgesi:** klipleri sıraya dizip ses ve müzikle hizalar, ducking uygular
- **Altyazı yerleşimi:** Instagram'da alt %20'yi arayüz kapatır; altyazı güvenli bölgeye konur, okunma hızına göre bölünür
- **Platform kesimleri:** aynı master'dan 9:16 / 1:1 / 16:9; kırparken karakter kadrajdan düşmez
- **Teknik:** `ffmpeg-api/compose` düğümünün track yapısını kurar — video kanalı, ses kanalları, keyframe'ler. `workflow.json`'un son ve en karmaşık düğümü
- **Son kontrol:** toplam süre hedefi tutuyor mu, sessiz boşluk var mı, son karede CTA duruyor mu

**Yönetmen ile sınır:** yönetmen *ne anlatıldığına* karar verir; kurgucu *nasıl birleştiğine*. Görev çakışması yoktur.

*Skill'ler:* kurgu ritmi ve geçişler · altyazı kuralları · montaj ve platform kesimi

### 6. `fal-promptsmith` — prompt mühendisi
Yukarıdaki tüm reçeteleri **hedef modelin konuştuğu dile** çevirir. Bu dili ezberden bilmez: `fal-compiler` modeli seçtikten sonra o modelin şemasını ve resmi örnek prompt'larını MCP'den okur, sonra o biçimde yazar — doğal dil paragraf, yapılandırılmış JSON veya etiket listesi + negatif prompt.

Ayrı agent olmasının gerekçesi: model şemaları context açısından ağırdır. Üç ayrı agent'ın context'ine ayrı ayrı çekmek yerine tek yerde toplanır — hem ucuz hem tutarlı.

*Skill'ler:* prompt lehçeleri · negatif prompt ve parametre ayarı

### 7. `fal-compiler` — derleyici
Model seçimi (katalog araması + şema doğrulama), `workflow.json` derleme, doğrulayıcıdan geçirme.

*Skill'ler:* fal workflow JSON şeması · model seçimi

### Kabul edilen takas
Yedi agent'lık zincir, tek agent'a göre yavaştır ve daha çok token yakar. Karşılığında kullanıcı sinematografi bilmeden sinematografi kalitesinde prompt alır. Takas bilinçlidir.

---

## 8. Tutarlılık stratejisi

Altı sahne boyunca karakterin yüzü, saçı, kıyafeti ve mekanın aynı kalması **karakter sayfası + zincirleme keyframe** yöntemiyle sağlanır:

1. Bir kez **karakter sayfası** üretilir: aynı kişi/ürün, 3–5 farklı açı (ön, 3/4, profil, yakın)
2. Her sahnenin başlangıç karesi bu referanstan **image-edit** ile türetilir
3. Başlangıç karesi **image-to-video** ile sahneye dönüşür
4. Sahne N'in **son karesi**, sahne N+1'in referans setine eklenir — görsel zincir kopmaz
5. Seed değerleri sabitlenir

Bu, workflow JSON'unda düğüm sayısını artırır; karşılığı tutarlılıktır.

---

## 9. Dosya düzeni

### Kullanıcının repo'sunda
```
.fal-butler/
  product.md                      # ürün profili (setup üretir, git'te durur)
  cache/                          # TTL'li model şemaları + doküman (.gitignore)
  campaigns/2026-08-05-lansman/
    brief.md                      # röportaj cevapları
    storyboard.md                 # sahne sahne kurgu, düz Türkçe
    workflow.json                 # fal'a import edilecek dosya
    cost.md                       # maliyet dökümü
    revisions/                    # her revizyonun öncesi, zaman damgalı
```

### Plugin'in kendi repo'sunda
```
.claude-plugin/plugin.json         # manifest
.mcp.json                          # fal MCP sunucu tanımı
commands/setup.md
commands/campaign.md
commands/revise.md
agents/fal-director.md
agents/fal-dop.md
agents/fal-motion.md
agents/fal-audio.md
agents/fal-editor.md
agents/fal-promptsmith.md
agents/fal-compiler.md
skills/<her-skill>/SKILL.md
scripts/validate-workflow.mjs      # bağımsız JSON doğrulayıcı
```

---

## 10. Derleme ve doğrulama

`workflow.json` **model tarafından üretilir** (her kampanya farklıdır, esneklik gerekir), ancak **bağımsız bir doğrulayıcı script** kontrol eder:

- Bütün `depends` referansları var olan düğümlere çözülüyor mu
- `$node-id.field` ifadeleri geçerli mi
- Döngü var mı
- `input` ve `output` düğümleri yerinde mi
- Kullanılan model endpoint'leri katalogda gerçekten duruyor mu
- Her düğümün girdisi o modelin şemasına uyuyor mu

Doğrulamadan geçmeyen JSON kullanıcıya verilmez; düzeltilir. Gerekçe: hatalı JSON'u kullanıcıya vermek, hatayı fal'ın import ekranında öğrenmek demektir — o döngüyü ucuza, burada kapatıyoruz.

---

## 11. Onay noktası ve maliyet

`campaign`, JSON yazmadan **önce** planı sunar ve onay bekler. Plan **düz Türkçe**dir, ham prompt içermez:

> **Sahne 2 (0:06–0:14)** — Ayşe ekrana bakıyor, yakın plan. Bildirimler yığılıyor. Yorgun ifade. Sabah ışığı, soğuk ton.
> *Model: [seçilen] · 8 sn · tahmini $X*

Plan altı sahneyi, kullanılacak modelleri ve **toplam tahmini maliyeti** içerir. Onaya kadar hiçbir dosya yazılmaz.

Kullanıcı fal'da gerçek fiyatı gördükten sonra `revise` ile döner. Plugin maliyeti kırar: "maliyetin %60'ı video üretiminde; çözünürlüğü 1080p→720p çekersek %35 düşer" veya "şu modelin muadili %50 ucuz, kalite farkı şurada." Karar kullanıcınındır.

---

## 12. Hata yönetimi

| Durum | Davranış |
|---|---|
| `FAL_KEY` yok | `setup`'a yönlendir, nereden alınacağını söyle |
| fal MCP erişilemiyor, cache var | Uyararak devam et, cache tarihini bildir |
| fal MCP erişilemiyor, cache yok | **Dur.** Yanlış model adıyla JSON üretip kullanıcıyı fal'da hata ekranına göndermektense durmak iyidir |
| Storyboard'daki model kaldırılmış/deprecated | `fal-compiler` katalogdan muadilini bulur, kurguyu bozmadan değiştirir, kullanıcıya bildirir |
| `compose` altyazı gömmeyi desteklemiyor | Altyazıyı ayrı `.srt` üret ve **açıkça söyle** — sessizce atlama |
| Doğrulayıcı JSON'u reddetti | Kullanıcıya verme, düzelt, tekrar doğrula |
| `revise` çağrıldı ama `workflow.json` yok | Hata ver, `campaign`'e yönlendir |
| Birden fazla kampanya var | Hangisi olduğunu sor |

---

## 13. Test stratejisi

Testler **gerçek fal çağrısı yapmaz ve para harcamaz**; MCP yanıtları sabitlenmiş örneklerle taklit edilir.

Kritik üç alan:
1. **Doğrulayıcı** — üretilen JSON referansları çözüyor, döngü içermiyor, giriş/çıkış düğümü yerinde. Hem geçerli hem kasıtlı bozuk fixture'larla
2. **Cache TTL** — taze cache tekrar çekmiyor, bayat cache yenileniyor, çevrimdışıyken bayat cache uyarıyla kullanılıyor
3. **`revise`** — JSON'u bozmadan değiştiriyor, önceki hali `revisions/` altına doğru saklanıyor

---

## 14. Kapsam dışı (YAGNI)

- Plugin'in model çalıştırması / para harcaması
- fal Workflow Builder'a otomatik import (API desteklemiyor)
- Lokal video montajı (fal `ffmpeg-api` yeterli)
- Sosyal medya platformlarına otomatik yayın
- A/B varyant üretimi
- `fal-ai-community/skills` bağımlılığı
- Video dışı reklam formatları (statik görsel, banner)

---

## 15. Açık riskler

| Risk | Etki | Azaltma |
|---|---|---|
| `compose` metin gömmeyi desteklemiyor olabilir | Altyazı gömülemez | Derleme anında şemadan kontrol; `.srt` yedeği |
| fal workflow JSON şeması belgelenmemiş biçimde değişebilir | Üretilen JSON import edilemez | Doğrulayıcı katalogla eşleştirir; şema canlı çekilir |
| Yedi agent'lık zincir yavaş ve pahalı | Kullanıcı sabırsızlanır | `--quick` bayrağı; ilerleme bildirimi |
| Video model süre limitleri modelden modele değişir | Sahne süresi tutmaz | `fal-motion` şemadan limiti okur, bölme/uyarma yapar |
| Karakter tutarlılığı zincirleme rağmen bozulabilir | Reklam kullanılamaz | Seed sabitleme + çok açılı referans seti; `revise` ile sahne bazlı yeniden üretim |
