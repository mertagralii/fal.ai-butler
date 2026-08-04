---
name: fal-workflow-json
description: fal.ai workflow JSON şemasını, düğüm tiplerini ve referans sözdizimini bilir. workflow.json derlerken, doğrularken veya revize ederken kullan. Use for fal.ai workflow JSON, workflow.json node schema, contents.nodes, run/display nodes, $node-id references.
---

# fal workflow JSON

fal'ın workflow tanım biçimi. `contents.nodes` altındaki düğümler, `run`/`display` tipleri,
`app` alanı ve `$düğüm-id.alan` referans sözdizimi.

## Referanslar

- **`references/schema.md`** — şemanın tam tanımı, doğrulanan kural listesi, bilinen import belirsizliği
- **`references/model-selection.md`** — modaliteye göre model arama, şemadan eleme, tutarlılık kuralı

## Değişmez kural

Üretilen her `workflow.json`, kullanıcıya verilmeden önce doğrulayıcıdan geçer:

```
node ${CLAUDE_PLUGIN_ROOT}/scripts/validate-workflow.mjs \
  .fal-butler/campaigns/<kampanya>/workflow.json \
  --catalog .fal-butler/cache/models.json
```

Katalog dosyası `lib/cache.mjs` tarafından `models` anahtarıyla yazılır; bu yüzden yolu
`.fal-butler/cache/models.json` olur. Katalog henüz yoksa `--catalog` bayrağını at —
endpoint kontrolü atlanır, yapı ve referans kontrolü yine çalışır.

Çıkış kodu 0 değilse dosya kullanıcıya verilmez — hatalar düzeltilip tekrar doğrulanır.
Hatalı JSON'u teslim etmek, hatayı fal'ın import ekranında öğrenmek demektir.
