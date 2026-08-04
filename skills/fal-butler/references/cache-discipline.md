# Cache disiplini — güncel kalma

Plugin'in fal değiştikçe kendini güncellemesinin yolu bu. Model adları, şemalar ve fiyatlar
**hiçbir yerde sabit yazılmaz**; ihtiyaç anında çekilir, tarihiyle saklanır.

## Nerede durur

```
.fal-butler/cache/
  models.json                          # katalog — anahtar: "models"
  fal-ai__<vendor>__<model>.json       # tek model şeması — anahtar: endpoint id'sinin kendisi
  docs__workflows.json                 # doküman parçası — anahtar: "docs/workflows"
```

Anahtardaki eğik çizgiler `lib/cache.mjs` tarafından `__` yapılır. Bir anahtarın dosya adını
merak ediyorsan `cacheKeyToFile()` fonksiyonuna bak; elle tahmin etme.

## Nasıl kullanılır

Modül **`file://` URL'i ile** içe aktarılır. Windows'ta ham mutlak yol (`C:\...`) Node tarafından
reddedilir (`ERR_UNSUPPORTED_ESM_URL_SCHEME`), ki bu plugin'in birincil platformu:

```js
import { pathToFileURL } from 'node:url'
const cacheUrl = pathToFileURL(process.env.CLAUDE_PLUGIN_ROOT + '/lib/cache.mjs').href
const { readCache, writeCache } = await import(cacheUrl)

const key = '<endpoint-id>'                        // ör. katalogdan gelen id
const cached = readCache('.fal-butler/cache', key) // varsayılan TTL: 7 gün
if (!cached.hit || cached.stale) {
  // fal MCP'den şemayı ve fiyatı çek, sonra:
  writeCache('.fal-butler/cache', key, schema)
}
```

Dosyanın **yazıldığı biçim `{ fetchedAt, data }` zarfıdır.** `readCache` zarfı kendisi açar;
`validate-workflow.mjs --catalog` da açar. Dosyayı elle okuyorsan `.data` altına bakmayı unutma.

`readCache` bayat veriyi **silmez** — `stale: true` ile birlikte yine döndürür. Bu kasıtlı:
fal erişilemediğinde bayat veriyle uyararak devam etmek, hiç veri olmamasından iyidir.

## TTL

Varsayılan **7 gün**. Katalog için makul: fal'a haftada birkaç model ekleniyor, ama var olan
endpoint'lerin şemaları nadiren değişiyor.

Kısaltman gereken tek durum: kullanıcı "yeni çıkan şu modeli kullan" diyorsa. O zaman o anahtar
için cache'i atla, doğrudan çek.

## Ne zaman çekilir

| Ne | Ne zaman | Anahtar | fal MCP aracı |
|---|---|---|---|
| Katalog | `setup`'ta bir kez; sonra bayatlayınca | `models` | `search_models` |
| Model şeması | `fal-compiler` bir modeli seçtiğinde | endpoint id'sinin kendisi | `get_model_schema` |
| **Fiyat** | Model seçilirken — **katalogda gelmez** | şemayla aynı kayda ekle | `get_pricing` |
| Örnek prompt'lar | `fal-promptsmith` o modele yazarken | `prompts/<endpoint-id>` | `get_model_schema` |
| Doküman parçası | Şema belirsizse | `docs/<konu>` | `search_docs` |

`search_models` sonucu fiyat taşımaz — `get_pricing` ayrıca çağrılır ve sonuç kataloğa
eklenerek yazılır. Aksi halde onay kapısındaki maliyet tablosu boş çıkar.

**Toptan indirme yapma.** Bin küsur modelin şemasını çekmek hem yavaş hem gereksiz; kampanyada
altı-yedi model kullanılıyor.

## Hata tablosu

| Durum | Davranış |
|---|---|
| `FAL_KEY` yok | Dur. `setup`'a yönlendir, anahtarın nereden alınacağını ve Windows'ta kalıcı yazma komutunu söyle |
| fal MCP erişilemiyor, cache **taze** | Sessizce cache'ten devam et |
| fal MCP erişilemiyor, cache **bayat** | Devam et ama **söyle**: "fal'a ulaşamadım, N gün önceki katalogla çalışıyorum; model kaldırılmış olabilir" |
| fal MCP erişilemiyor, cache **yok** | **Dur.** Uydurma model adıyla JSON üretip kullanıcıyı fal'ın hata ekranına göndermektense durmak iyidir |
| Model katalogda yok / deprecated | `fal-compiler` aynı modalitede muadil arar, kurguyu bozmadan değiştirir ve **kullanıcıya bildirir** |
| Şema çekildi ama beklenen alan yok | Modelin gerçek şemasına uy, varsayımını değiştir. Şema kazanır, ezberin değil |
| Cache dosyası bozuk | `readCache` zaten `hit: false` döndürür — yeniden çek |
