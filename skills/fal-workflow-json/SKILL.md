---
name: fal-workflow-json
description: fal.ai workflow JSON şeması, düğüm tipleri ve referans sözdizimi; ayrıca modaliteye göre model seçimi. workflow.json derlerken, doğrularken veya revize ederken kullan. Use for fal.ai workflow JSON, workflow.json node schema, contents.nodes, run/display nodes, $node-id references, model selection.
---

# fal workflow JSON

fal'ın workflow tanım biçimi ve model seçimi. `contents.nodes` altındaki düğümler,
`run`/`display` tipleri, `app` alanı ve `$düğüm-id.alan` referans sözdizimi.

## Referanslar

- **`references/schema.md`** — şemanın tam tanımı, kampanya girdileri, doğrulanan kural listesi,
  bilinen import belirsizliği
- **`references/model-selection.md`** — modaliteye göre model arama, şemadan eleme, tutarlılık kuralı

## Kullanılan fal MCP araçları

| Araç | Ne için |
|---|---|
| `search_models` | Modaliteye göre aday model bulmak |
| `get_model_schema` | Adayın girdi alanlarını ve kısıtlarını okumak |
| `get_pricing` | **Fiyat — katalogda yok, ayrı araçla alınır** |
| `recommend_model` | Belirsizlikte aday daraltmak |
| `search_docs` | Şema belirsizse fal dokümanına bakmak |

`run_model`, `submit_job` ve `upload_file` **kullanılmaz** — plugin hiç para harcamaz. Bu
agent'ların araç listesinde zaten yoklar.

## Değişmez kural

Üretilen her `workflow.json`, kullanıcıya verilmeden önce doğrulayıcıdan geçer:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/validate-workflow.mjs" ".fal-butler/campaigns/<slug>/workflow.json" --catalog ".fal-butler/cache/models.json"
```

Katalog dosyası `lib/cache.mjs` tarafından `models` anahtarıyla yazılır ve `{ fetchedAt, data }`
zarfı taşır; doğrulayıcı zarfı kendisi açar. Katalog henüz yoksa `--catalog` bayrağını at —
endpoint kontrolü atlanır, yapı ve referans kontrolü yine çalışır.

Çıkış kodu 0 değilse dosya kullanıcıya verilmez — hatalar düzeltilip tekrar doğrulanır.
Hatalı JSON'u teslim etmek, hatayı fal'ın import ekranında öğrenmek demektir.
