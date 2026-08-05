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
  "name": "kampanya-adi",
  "title": "Kampanya Adı",
  "contents": {
    "name": "workflow",
    "version": "1.0.0",
    "schema": {
      "input": {},
      "output": { "final_video": { "name": "final_video", "label": "Reklam videosu", "type": "string" } }
    },
    "output": { "final_video": "$node-compose-master.video_url" },
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
| **`contents.version`** | **evet** | Sürüm dizesi. `"1.0.0"` panelde kabul edildi |
| `contents.schema.input` | evet | Girdi parametreleri. **Girdi istemiyorsan boş nesne `{}`** — alanın kendisi bulunmalı |
| **`contents.schema.output`** | **evet** | Çıkış alanlarının şeması |
| **`contents.output`** | **evet** | API'nin çıkış eşlemesi: `{ "<ad>": "$düğüm.alan" }` |
| `contents.nodes` | evet | Düğüm haritası: `{ "<düğüm-id>": { ... } }` |

**Dikkat:** Düğümler üst seviyede değil, `contents.nodes` altındadır.

### Kalın yazılan üç alan eksikse workflow hiç çalıştırılamaz

Panel `Save & Run → Create` adımında alan adı vermeden **"Field required"** der ve istek
sunucuya hiç gitmez. Hata sayısı eksik alan sayısı kadardır ve düğümlerde hiçbir görsel işaret
olmaz — teşhisi son derece zor. Bunlar sahada bir kampanyada bulundu; kaynak fal'ın
`POST /workflows` referansı.

`scripts/validate-workflow.mjs` üçünü de denetler (`MISSING_CONTENTS_VERSION`,
`MISSING_CONTENTS_OUTPUT`, `MISSING_OUTPUT_SCHEMA`).

### `display.fields` ile `contents.output` aynı şey değildir — ikisi de gerekir

| | Ne yapar |
|---|---|
| `display` düğümünün `fields`'ı | Panelde **Response kartını** çizer |
| `contents.output` | **API'nin çıkış eşlemesi** |

Aynı anahtarları ve aynı referansları taşımalıdırlar; doğrulayıcı tutarsızlığı
`OUTPUT_MISMATCH` ile yakalar.

### Builder'ın "Copy/Export workflow" çıktısını şablon alma

fal Builder'ın kendi serileştirmesi **eksiktir** — yalnızca `name`, `schema`, `nodes` verir;
fal'ın kendi API'sinin zorunlu saydığı `version`, `output` ve `schema.output` yoktur. Onu
şablon alan biri aynı hatayı yeniden üretir. **Kanonik referans API doküman sayfasıdır.**

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

### Kampanya workflow'unun girdileri — varsayılan: **girdi yok**

```json
"schema": { "input": {} }
```

Alanın kendisi bulunmalı ama **boş olmalı.** Sebep sahada öğrenildi:

- `contents.schema.input` içinde tanımlı her girdi, panelde **zorunlu ve boş** bir kutu olarak
  çıkar.
- **`default` değeri panel tarafından kullanılmaz.** Yani "varsayılanı olan opsiyonel girdi"
  diye bir şey yok; kullanıcı her çalıştırmada elle doldurmak zorunda kalır.

Seed'i girdi yapmak mantıklı görünüyordu ama pratikte tam tersi oldu. **Seed'i düğümlere sabit
göm** ve değerini `brief.md`'ye yaz — `revise` oradan okur, kullanıcı da dosyada değiştirip
yeniden import edebilir.

Kullanıcı açıkça "panelden şunu değiştirebileyim" derse o alanı girdi yap; aksi halde yapma.

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

## Import — doğrulandı

**2026-08-05'te gerçek bir kampanyayla test edildi:** üretilen `workflow.json` fal Workflow
Builder'a import edildi ve **hatasız kabul edildi** (25 düğüm). Yani biçim doğru.

Import fal panelinden **elle** yapılır. Programatik oluşturma mümkün değildir:
`POST /workflows` **ADMIN anahtarı** ister; normal `FAL_KEY` ile 403 döner. Platform API'leri
workflow için yalnızca okuma (list + get) verir.

**Bunun sonucu önemli:** workflow'un fal tarafından kabul edilip edilmeyeceğini API'den
doğrulayamazsın. `scripts/validate-workflow.mjs` **tek savunma hattıdır** — bu yüzden yukarıdaki
`contents` alanları ve compose denetimleri ona eklendi.

Kullanıcıya teslim ederken: dosyayı fal panelinden import etmesi gerektiğini söyle. Import
sonrası panelde `Save & Run` denemesi, kalan tek doğrulama adımıdır.
