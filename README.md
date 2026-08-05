# fal-butler

**Projeni bitirdin, reklam vermen gerekiyor — ama elinde video yok ve video prodüksiyonu bilmiyorsun.**

`fal-butler`, projeni okuyup ürününü anlayan bir Claude Code plugin'i. Kısa bir röportajla kampanyayı öğrenir; sonra senarist, görüntü yönetmeni, hareket yönetmeni, ses tasarımcısı, kurgucu ve prompt mühendisinden oluşan bir ekip senin iki cümlelik tarifini profesyonel bir reklam kurgusuna çevirir.

Sen şunu yazarsın:

> *"Kadın, 30'larında, ofiste çalışıyor, yorgun başlıyor mutlu bitiyor."*

Karşılığında **fal.ai'a import edilmeye hazır bir `workflow.json`** alırsın: altı sahne, birbirine görsel olarak zincirlenmiş, karakteri baştan sona aynı, seslendirmeli, müzikli, altyazılı ve platforma göre kesilmiş.

## Bu plugin hiç para harcamaz

Plugin **hiçbir modeli çalıştırmaz** — bu bir söz değil, mekanizma: agent'ların araç listesinde yalnızca beş okuma aracı var (`search_models`, `get_model_schema`, `get_pricing`, `recommend_model`, `search_docs`). `run_model`, `submit_job` ve `upload_file` listede yok, dolayısıyla çağrılamaz. Depodaki denetçi joker MCP iznini test hatası sayar, yani bu garanti kazara gevşetilemez.

Üretimi sen fal panelinden, **gerçek fiyatı gördükten sonra** başlatırsın.

---

## Kurulum

**1. fal API anahtarı al**

<https://fal.ai/dashboard/keys> adresinden anahtar oluştur ve `FAL_KEY` olarak tanımla.

```powershell
# Windows — kalıcı olarak kullanıcı ortamına yazar
[Environment]::SetEnvironmentVariable('FAL_KEY', 'senin-anahtarin', 'User')
```

```bash
# macOS / Linux — kalıcılık için kabuk profiline ekle
export FAL_KEY="senin-anahtarin"
```

> Windows'ta `$env:FAL_KEY = "..."` yalnızca o pencerede yaşar ve **çalışmakta olan Claude Code onu görmez.** Yukarıdaki komutu kullan ve Claude Code'u yeniden başlat.

**2. Plugin'i kur**

```
/plugin marketplace add mertagralii/fal.ai-butler
/plugin install fal-butler
```

**3. Başla**

```
/fal-butler:setup
```

---

## Komutlar

| Komut | Ne yapar |
|---|---|
| `/fal-butler:setup` | `FAL_KEY` ve MCP bağlantısını doğrular, model kataloğunu önbelleğe alır, projeni tarayıp `product.md` ürün profilini çıkarır. Bir kez çalıştırılır. |
| `/fal-butler:campaign` | Röportajı yürütür, kurguyu planlar, **onayını ister**, sonra `workflow.json` üretir |
| `/fal-butler:revise` | Var olan bir `workflow.json`'u ucuzlatır veya kurgusunu değiştirir |

`/fal-butler:campaign --quick` sekiz soru yerine dördünü sorar; kalanını ürün profilinden türetir ve türettiklerini planda listeler.

---

## Nasıl çalışıyor

### Röportaj

Sorular tek tek gelir, her birinin ürün profilinden türetilmiş varsayılanı vardır: amaç, platform ve süre, anlatım biçimi, karakter, ton, dil, kapsam (seslendirme / müzik / altyazı — **her biri ayrı ayrı kapatılabilir**), CTA.

### Dokuz adımlık zincir

```
0. fal-compiler ─── modelleri seçer, şemaları ve fiyatları çeker
1. fal-director ─── hook, sahne beat'leri, süre dağılımı, seslendirme metni, karakter bible
2. fal-dop ──────── plan ölçeği, lens, ışık kurulumu, palet, kompozisyon
3. fal-animator ─── hareket dili + zincirleme grafiği
4. fal-audio ────── TTS, müzik, miksaj + konuşma süresi denetimi
5. fal-animator ─── süre düzeltmesi (yalnızca gerekirse, tek tur)
6. fal-editor ───── kesim ritmi, geçişler, altyazı yerleşimi, montaj yapısı
7. fal-promptsmith ─ hepsini hedef modelin konuştuğu dile çevirir
8. fal-compiler ─── workflow.json'u derler ve doğrulayıcıdan geçirir
```

Model seçiminin **başta** olması gerekiyor: `fal-animator` klip süre sınırını, `fal-promptsmith` prompt lehçesini modelin şemasından okuyor.

Kullanıcı sinematografi bilmez — `fal-dop` "ofiste" tarifini *"geniş pencereden yumuşak yan ışık, sabah, 35 mm his, hafif dolly-in"* diye açar. Sen bunu düz Türkçe olarak görürsün, ham prompt olarak değil.

### Karakter neden aynı kalıyor

```
karakter-sayfası ──┬──────────────────────────────────→ anahtar-kare-2 ← son-kare-1
                   │                                          ▲
                   ├──→ anahtar-kare-1 → video-1 → son-kare-1 ┘
                   │
                   └──────────────────────────────────→ anahtar-kare-3 ← son-kare-2
```

Önce 3–5 açılı bir karakter sayfası üretilir. Her sahnenin başlangıç karesi ondan image-edit ile türer; sahne videoya çevrilir; **son karesi bir sonraki sahnenin referansına eklenir.**

Karakter sayfası her sahneye bağlı kalır — yalnızca önceki sahneye zincirlemek sapmayı biriktirir ve altıncı sahnede başka biri çıkar. Seed kampanya başına sabitlenir ve `brief.md`'ye yazılır, böylece revizyonlar deterministik olur.

### Onay kapısı

Adım 7'den sonra, **hiçbir dosya yazılmadan** karşına düz Türkçe bir plan gelir:

> **Sahne 2 — Büyütme (0:06–0:14)**
> Ayşe ekrana bakıyor, bildirimler yığılıyor. Yakın plan, sabah ışığı, soğuk ton.
> Ses: *"Bildirimler bitmiyor."*
> Model: `<endpoint>` · 8 sn · ~$X

Altı sahne, kullanılacak modeller, **toplam tahmini maliyet** ve uyarılar. Onaylamazsan hiçbir şey yazılmaz.

### Doğrulama

Üretilen `workflow.json` bağımsız bir script'ten geçer: düğüm referansları çözülüyor mu, döngü var mı, `contents.schema.input` tanımlı mı, düğüm `id`'leri anahtarlarıyla uyuşuyor mu, kullanılan endpoint'ler katalogda gerçekten duruyor mu.

Geçmeyen dosya sana verilmez. Hatalı JSON'u teslim etmek, hatayı fal'ın import ekranında öğrenmek demek.

### Revizyon

fal'da fiyatı gördün, pahalı geldi:

```
/fal-butler:revise maliyeti yarıya indir
```

Önce paranın nereye gittiğini gösterir, sonra somut seçenekler sunar — her birinin ne kadar düşürdüğü ve **neyi feda ettiğiyle** birlikte. İki şeyi asla önermez: karakter sayfasını kaldırmak ve zincirlemeyi kaldırmak. Onlar ucuzlatma değil, kampanyayı çöpe atmak.

Kurgu revizyonu da aynı komuttan: *"üçüncü sahne daha aydınlık"* tek düğüm değiştirir. Her değişiklikten önce eski JSON `revisions/` altına zaman damgasıyla kopyalanır.

---

## Neden model adı göremezsin

Bu depoda **hiçbir fal model adı sabit yazılı değildir.** Katalog, şemalar ve fiyatlar çalışma anında fal MCP'den çekilip yerel önbelleğe yazılır (7 gün TTL). fal yeni bir video modeli çıkardığında ya da bir endpoint kaldırdığında plugin'i güncellemen gerekmez.

Tek istisna `ffmpeg-api` ailesidir — o bir üretim modeli değil, montaj altyapısı. Şeması ve fiyatı yine canlı okunur.

---

## Bilinen sınır: import adımı

fal, workflow JSON'unun panele **nasıl import edileceğini dokümante etmiyor**; Platform API'leri workflow için yalnızca okuma (list + get) veriyor, oluşturma endpoint'i yok.

Üretilen dosya fal'ın workflow biçimindedir ve doğrulayıcıdan geçer — ama import adımı gerçek bir kampanyayla henüz denenmedi. Tutmazsa bu bir plugin hatası değildir; `storyboard.md`'yi kullanarak Workflow Builder'da elle kurabilirsin. Plugin bunu teslim mesajında da açıkça söyler.

---

## Getirdiği MCP sunucuları

| Sunucu | Ne için | Nasıl |
|---|---|---|
| **fal** | Model arama, şema okuma, fiyat, doküman | `https://mcp.fal.ai/mcp` — HTTP. Kimlik `Authorization: Key ${FAL_KEY}` başlığıyla istek başına gönderilir, saklanmaz |
| **context7** | Kütüphane/SDK dokümanını güncel çekmek | `npx -y @upstash/context7-mcp` |
| **playwright** | fal doküman sayfalarını tarayıcıyla okumak | `npx @playwright/mcp@latest` |

`context7` ve `playwright` ilk açılışta `npx` ile indirilir. Aynı sunucuları başka bir plugin de getiriyorsa ayrı ad alanlarında çalışırlar — çakışmaz, ama iki süreç açılır.

---

## Ürettiği dosyalar

Hepsi senin repo'nda, `.fal-butler/` altında — git'te izlenebilir:

```
.fal-butler/
  product.md                      # ürün profili — bir kez üretilir
  cache/                          # model şemaları ve fiyatlar (7 gün TTL)
  campaigns/2026-08-05-lansman/
    brief.md                      # röportaj cevapların + seed + sabit karakter bloğu
    storyboard.md                 # sahne sahne kurgu, düz Türkçe
    workflow.json                 # fal.ai'a import edeceğin dosya
    cost.md                       # maliyet dökümü ve ucuzlatma seçenekleri
    revisions/                    # her revizyonun öncesi
```

**`.gitignore`'una şunu ekle:**

```
.fal-butler/cache/
```

Önbellek yeniden üretilebilir; repo'da yer kaplamasın.

---

## Geliştirme

Bağımlılık yok. Node.js ≥ 20 yeterli.

```bash
npm test                          # 69 birim testi — ağ çağrısı yapmaz, para harcamaz
node scripts/validate-plugin.mjs  # plugin yapısal bütünlüğü
```

`validate-plugin.mjs` şunları denetler: manifest alanları, skill adı ↔ dizin adı, agent adı ↔ dosya adı, anılan `references/*.md` dosyalarının varlığı, `model` değerinin geçerliliği, boş agent gövdesi ve **joker MCP izni**.

Tasarım dokümanı: [`docs/superpowers/specs/`](docs/superpowers/specs/) — uygulama sırasında bilerek sapılan noktalar §16'da gerekçeleriyle listeli.

## Lisans

MIT — bkz. [LICENSE](LICENSE).
