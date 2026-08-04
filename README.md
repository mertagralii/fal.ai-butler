# fal-butler

Projeni bitirdin, reklam vermen gerekiyor — ama elinde video yok ve video prodüksiyonu bilmiyorsun.

`fal-butler` bu boşluğu kapatan bir Claude Code plugin'i. Projeni okuyup ürününü anlar, kısa bir röportajla kampanyayı öğrenir, ve arka planda çalışan bir ekiple — senarist, görüntü yönetmeni, hareket yönetmeni, ses tasarımcısı, kurgucu — senin iki cümlelik tarifini profesyonel bir reklam kurgusuna çevirir. Sahneler birbirine görsel olarak zincirlenir, böylece karakterin altı sahne boyunca aynı kalır.

Çıktı: **fal.ai'a import edilmeye hazır bir `workflow.json`**.

## Bu plugin hiç para harcamaz

Plugin **hiçbir modeli çalıştırmaz**. Yaptığı tek şey kampanya tarifini üretmek. Üretimi sen fal panelinden, gerçek fiyatı gördükten sonra başlatırsın. Pahalı geldiyse `/fal-butler:revise` ile geri gelip ucuzlatırsın.

## Kurulum

**1. fal API anahtarı al**

<https://fal.ai/dashboard/keys> adresinden bir anahtar oluştur ve `FAL_KEY` ortam değişkeni olarak tanımla:

```bash
# macOS / Linux
export FAL_KEY="senin-anahtarin"
```

```powershell
# Windows — kalıcı olarak kullanıcı ortamına yazar
[Environment]::SetEnvironmentVariable('FAL_KEY', 'senin-anahtarin', 'User')
```

Windows'ta `$env:FAL_KEY = "..."` yalnızca o pencerede yaşar ve **çalışmakta olan Claude Code onu görmez** — yukarıdaki komutu kullan ve Claude Code'u yeniden başlat. macOS/Linux'ta kalıcılık için kabuk profiline (`~/.zshrc`, `~/.bashrc`) ekle.

**2. Plugin'i kur**

```
/plugin marketplace add mertagralii/fal.ai-butler
/plugin install fal-butler
```

## Getirdiği MCP sunucuları

Plugin üç MCP sunucusu tanımlar; hiçbiri elle kurulum gerektirmez:

| Sunucu | Ne için | Nasıl çalışır |
|---|---|---|
| **fal** | Model arama, şema okuma, doküman gezme | `https://mcp.fal.ai/mcp` — HTTP. Kimlik `Authorization: Bearer ${FAL_KEY}` başlığıyla istek başına gönderilir, saklanmaz |
| **context7** | Kütüphane/SDK dokümanını güncel çekmek | `npx -y @upstash/context7-mcp` |
| **playwright** | fal doküman sayfalarını tarayıcıyla okumak | `npx @playwright/mcp@latest` |

`context7` ve `playwright` ilk açılışta `npx` ile indirilir. Aynı sunucuları başka bir plugin de getiriyorsa (örneğin `seo-butler`) her ikisi ayrı ad alanında çalışır — çakışmaz, ama iki süreç açılır.

## Komutlar

| Komut | Ne yapar |
|---|---|
| `/fal-butler:setup` | `FAL_KEY` ve MCP bağlantısını doğrular, model kataloğunu önbelleğe alır, projeni tarayıp `product.md` ürün profilini çıkarır |
| `/fal-butler:campaign` | Röportajı yürütür, kurguyu planlar, **onayını ister**, sonra `workflow.json` üretir |
| `/fal-butler:revise` | Var olan bir `workflow.json`'u ucuzlatır veya kurgusunu değiştirir |

`/fal-butler:campaign --quick` sekiz soru yerine yalnızca dördünü sorar; kalanını ürün profilinden türetir.

## Arka planda çalışan ekip

Senin iki cümlelik tarifin, yedi uzmandan geçerek profesyonel prompt'lara dönüşür:

| Agent | Ne yapar |
|---|---|
| **fal-director** | Hikâye: hook, sahne beat'leri, süre dağılımı, seslendirme metni, karakter bible |
| **fal-dop** | Görüntü yönetmenliği: plan ölçeği, lens, ışık kurulumu, palet, kompozisyon |
| **fal-animator** | Hareket: image-to-video, klip süre sınırları ve **sahneler arası zincirleme** |
| **fal-audio** | Ses: seslendirme, müzik, miksaj — ve konuşma süresi denetimi |
| **fal-editor** | Kurgu: kesim ritmi, geçişler, altyazı yerleşimi, platform kesimleri |
| **fal-promptsmith** | Her reçeteyi hedef modelin konuştuğu dile çevirir |
| **fal-compiler** | Model seçer, `workflow.json`'u derler ve doğrulayıcıdan geçirir |

Karakterin altı sahne boyunca aynı kalması bir tesadüf değil: önce bir karakter sayfası üretilir, her sahnenin başlangıç karesi ondan türetilir, ve **her sahnenin son karesi bir sonrakinin referansına eklenir**. Zincir kopmaz.

## Neden model adı göremezsin

Bu depoda hiçbir fal model adı sabit yazılı değildir. Katalog, şemalar ve fiyatlar çalışma anında fal MCP'den çekilip yerel önbelleğe yazılır (7 gün TTL). fal yeni bir video modeli çıkardığında ya da bir endpoint kaldırdığında plugin'i güncellemen gerekmez.

Tek istisna `ffmpeg-api` ailesidir — o bir üretim modeli değil, montaj altyapısı. Şeması ve fiyatı yine canlı okunur.

## Ürettiği dosyalar

Hepsi senin repo'nda, `.fal-butler/` altında:

```
.fal-butler/
  product.md                      # ürün profili — bir kez üretilir, git'te durur
  cache/                          # model şemaları (7 gün TTL)
  campaigns/2026-08-05-lansman/
    brief.md                      # röportaj cevapların
    storyboard.md                 # sahne sahne kurgu, düz Türkçe
    workflow.json                 # fal.ai'a import edeceğin dosya
    cost.md                       # tahmini maliyet dökümü
    revisions/                    # her revizyonun öncesi
```

**`.gitignore`'una şunu ekle:**

```
.fal-butler/cache/
```

Önbellek yeniden üretilebilir; repo'da yer kaplamasın.

## Geliştirme

Bağımlılık yok. Node.js ≥ 20 yeterli.

```bash
npm test                          # birim testleri (ağ çağrısı yapmaz)
node scripts/validate-plugin.mjs  # plugin yapısal bütünlüğü
```

## Lisans

MIT — bkz. [LICENSE](LICENSE).
