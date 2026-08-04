# fal workflow JSON şeması

**Kaynaklar:**
- <https://github.com/fal-ai-community/skills/blob/main/skills/fal-workflow/references/WORKFLOWS.md>
- <https://fal.ai/docs/documentation/model-apis/workflows>

**Doğrulama tarihi:** 2026-08-05

fal bu şemayı resmî bir JSON Schema olarak yayımlamıyor. Aşağıdaki tanım, fal'ın kendi topluluk
deposundaki gerçek üretim workflow'larından çıkarılmıştır. Şema değişirse önce burayı güncelle,
sonra `scripts/validate-workflow.mjs` ile `tests/fixtures/` dosyalarını.

---

## Üst seviye

```json
{
  "name": "live-in-scene",
  "title": "live-in-scene",
  "contents": {
    "name": "workflow",
    "schema": { "input": { "...": "..." } },
    "nodes": { "...": "..." }
  }
}
```

| Anahtar | Zorunlu | Açıklama |
|---|---|---|
| `name` | evet | Workflow'un makine adı |
| `title` | evet | Görünen ad |
| `contents` | evet | Asıl tanım |
| `contents.name` | evet | Sabit: `"workflow"` |
| `contents.schema.input` | evet | Workflow'un dışarıdan aldığı parametreler |
| `contents.nodes` | evet | Düğüm haritası: `{ "<düğüm-id>": { ... } }` |

**Dikkat:** Düğümler üst seviyede değil, `contents.nodes` altındadır.

---

## `input` sanal bir düğümdür

`input` diye bir düğüm `nodes` içinde **yoktur**. Workflow'un girdileri `contents.schema.input`
altında tanımlanır ve düğümler ona `depends: ["input"]` diyerek bağlanır, `$input.<alan>` ile okur.

```json
"schema": {
  "input": {
    "film_name": { "name": "film_name", "label": "Film Name", "type": "string" }
  }
}
```

Bir düğüm `$input.film_name` yazdığında, `film_name` bu haritada tanımlı olmalıdır.

### Kampanya workflow'unun girdileri

Prompt'ların tamamı `fal-promptsmith` tarafından derleme anında gömülür, dolayısıyla "girdi yok"
demek isteyebilirsin — **ama olmaz**: doğrulayıcı `MISSING_INPUT_SCHEMA` verir ve fal Workflow
Builder girdisiz bir workflow'u anlamlı biçimde gösteremez.

Her kampanya workflow'u **en az** şu girdiyi tanımlar:

```json
"schema": {
  "input": {
    "seed": {
      "name": "seed",
      "label": "Seed (tekrar üretilebilirlik)",
      "type": "number",
      "default": 731914
    }
  }
}
```

Seed'i girdi yapmak iki işe yarar: kullanıcı fal panelinde tek bir alanı değiştirerek tüm
kampanyayı yeniden üretebilir, ve `revise` aynı seed'i geçirerek değişmeyen sahneleri
değişmeden tutabilir.

**Gerçek ürün görseli kullanılıyorsa** (aşağıya bakın) her görsel için birer `string` girdi
daha eklenir:

```json
"product_screenshot_url": {
  "name": "product_screenshot_url",
  "label": "Ürün ekran görüntüsü URL'i",
  "type": "string"
}
```

## Gerçek ürün görselleri — dürüst durum

Plugin **dosya yüklemez**. `upload_file` aracı bilinçli olarak agent'ların araç listesinde
yoktur (para harcayan araçlarla aynı kategoride tutuluyor ve plugin kullanıcının dosyalarını
dışarı göndermez).

Bunun sonucu şudur ve **kullanıcıya açıkça söylenir**:

> Ürün-ekran sahnelerindeki arayüz **üretilmiş bir temsildir**, senin gerçek ekran görüntün
> değildir. Marka rengin, tema karakterin ve yerleşimin `product.md`'den alınır; ama ekrandaki
> metinler modelin ürettiği örneklerdir.

**Gerçek görsel kullanmak isteyen kullanıcı için yol:** görselini kendisi erişilebilir bir URL'e
koyar (fal panelindeki yükleme alanı, kendi CDN'i, GitHub raw), ve bu URL workflow'un
`product_screenshot_url` girdisine yazılır. `fal-dop` ve `fal-animator` o sahneyi
text-to-image yerine **image-edit** düğümü olarak kurar. Bunu kullanıcı istediğinde öner,
kendiliğinden varsayma.

---

## Düğüm tipleri

### `run` — model çalıştıran düğüm

```json
"node-scene-planner": {
  "type": "run",
  "id": "node-scene-planner",
  "app": "openrouter/router",
  "depends": ["input"],
  "input": { "prompt": "$input.film_name" }
}
```

| Alan | Açıklama |
|---|---|
| `type` | `"run"` |
| `id` | Düğümün kendi id'si — **haritadaki anahtarla aynı olmalı** |
| `app` | Model endpoint id'si. **`endpoint` değil, `app`.** |
| `depends` | Bağımlı olunan düğüm id'leri dizisi (`"input"` de geçerli) |
| `input` | Modele gidecek parametreler |

### `display` — çıktı düğümü

```json
"output": {
  "type": "display",
  "id": "output",
  "depends": ["node-merge-videos"],
  "fields": { "final_video": "$node-merge-videos.video" }
}
```

Çıkış düğümü `input` değil **`fields`** kullanır. Bir workflow'da en az bir `display` düğümü olmalıdır.

---

## Referans sözdizimi

`$<düğüm-id>.<alan>.<yol>` biçiminde, dolar işaretiyle başlar.

```
$input.film_name
$node-merge-videos.video
$fal_ai/bytedance/seedream/v4/edit_2.images.0.url
```

### Düğüm id'leri eğik çizgi içerebilir

Gerçek workflow'larda `fal_ai/bytedance/seedream/v4/edit_2` gibi id'ler kullanılıyor. Bu yüzden
referansı **regex ile ayrıştırma** — `$` sonrasındaki gövdeyi bilinen düğüm id'leri kümesine karşı
**en uzun önek** eşlemesiyle çöz. `resolveRef()` bunu yapar.

Neden regex çalışmaz — düğüm id'leri **nokta da** içerebilir. `$fal_ai/seedream/v4.1.images.0.url`
ifadesinde id `fal_ai/seedream/v4.1`, alan yolu `images.0.url`. Naif bir regex bunu ya en baştaki
noktadan (`/^\$([^.]+)\./` → `fal_ai/seedream/v4`, yanlış) ya da en sondan (`/^\$(.+)\.([^.]+)$/`
→ `fal_ai/seedream/v4.1.images.0`, yanlış) böler. Doğru cevabı yalnızca **bilinen id kümesine
karşı en uzun önek** verir; `resolveRef()` bunu yapar.

### Referans, `depends` ile tutarlı olmalı

Bir düğüm `$X.foo` okuyorsa, `X` o düğümün `depends` listesinde de bulunmalıdır. Aksi halde fal
çalışma sırasını kuramaz.

---

## Doğrulanan kurallar

`scripts/validate-workflow.mjs` şunları denetler:

| Kod | Anlamı |
|---|---|
| `NOT_OBJECT` | Workflow bir JSON nesnesi değil |
| `MISSING_CONTENTS` | `contents` yok veya nesne değil |
| `MISSING_NODES` | `contents.nodes` yok |
| `MISSING_INPUT_SCHEMA` | `contents.schema.input` yok |
| `MISSING_OUTPUT_NODE` | `type: "display"` olan düğüm yok |
| `NODE_ID_MISMATCH` | Düğümün `id` alanı haritadaki anahtarla uyuşmuyor |
| `UNKNOWN_DEPENDENCY` | `depends` var olmayan bir düğüme işaret ediyor |
| `UNRESOLVED_REFERENCE` | `$...` ifadesi hiçbir düğüme veya `input`'a çözülmüyor |
| `UNKNOWN_INPUT_FIELD` | `$input.x` ama `x`, `schema.input` içinde tanımlı değil |
| `REFERENCE_NOT_DECLARED` | Referans edilen düğüm `depends` listesinde yok |
| `CYCLE` | Düğüm bağımlılıklarında döngü var |
| `UNKNOWN_ENDPOINT` | `app` değeri model kataloğunda yok |

---

## Bilinen belirsizlik: import yolu

fal'ın dokümanında bu JSON'un Workflow Builder'a **nasıl import edileceği** belgelenmemiş.
Platform API'leri workflow için yalnızca okuma (list + get) veriyor; oluşturma endpoint'i yok.

Kullanıcıya JSON teslim ederken bunu dürüstçe söyle: dosya fal'ın workflow biçimindedir, ancak
import adımı fal arayüzünden manuel yapılır ve arayüz değişmiş olabilir. Import başarısız olursa
bu bir plugin hatası değildir — ama kullanıcıya alternatif olarak düğümleri Workflow Builder'da
elle kurabileceği sahne listesini (`storyboard.md`) sun.
