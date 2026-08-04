# Cache disiplini — güncel kalma

Plugin'in fal değiştikçe kendini güncellemesinin yolu bu. Model adları, şemalar ve fiyatlar
**hiçbir yerde sabit yazılmaz**; ihtiyaç anında çekilir, tarihiyle saklanır.

## Nerede durur

```
.fal-butler/cache/
  models.json                          # katalog — anahtar: "models"
  fal-ai__flux__dev.json               # tek model şeması — anahtar: "fal-ai/flux/dev"
  docs__workflows.json                 # doküman parçası — anahtar: "docs/workflows"
```

Anahtardaki eğik çizgiler `lib/cache.mjs` tarafından `__` yapılır. Bir anahtarın dosya adını
merak ediyorsan `cacheKeyToFile()` fonksiyonuna bak; elle tahmin etme.

## Nasıl kullanılır

```js
import { readCache, writeCache } from '${CLAUDE_PLUGIN_ROOT}/lib/cache.mjs'

const cached = readCache('.fal-butler/cache', 'fal-ai/flux/dev')   // varsayılan TTL: 7 gün
if (!cached.hit || cached.stale) {
  // fal MCP'den şemayı çek, sonra:
  writeCache('.fal-butler/cache', 'fal-ai/flux/dev', schema)
}
```

`readCache` bayat veriyi **silmez** — `stale: true` ile birlikte yine döndürür. Bu kasıtlı:
fal erişilemediğinde bayat veriyle uyararak devam etmek, hiç veri olmamasından iyidir.

## TTL

Varsayılan **7 gün**. Katalog için makul: fal'a haftada birkaç model ekleniyor, ama var olan
endpoint'lerin şemaları nadiren değişiyor.

Kısaltman gereken tek durum: kullanıcı "yeni çıkan şu modeli kullan" diyorsa. O zaman o anahtar
için cache'i atla, doğrudan çek.

## Ne zaman çekilir

| Ne | Ne zaman | Anahtar |
|---|---|---|
| Katalog | `setup`'ta bir kez; sonra bayatlayınca | `models` |
| Model şeması | `fal-compiler` bir modeli seçtiğinde | endpoint id'sinin kendisi |
| Örnek prompt'lar | `fal-promptsmith` o modele yazarken | `prompts/<endpoint-id>` |
| Doküman parçası | Şema belirsizse | `docs/<konu>` |

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
