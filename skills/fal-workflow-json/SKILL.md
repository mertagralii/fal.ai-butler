---
name: fal-workflow-json
description: fal.ai workflow JSON şemasını, düğüm tiplerini ve referans sözdizimini bilir. workflow.json derlerken, doğrularken veya revize ederken kullan.
---

# fal workflow JSON

fal'ın workflow tanım biçimi. `contents.nodes` altındaki düğümler, `run`/`display` tipleri,
`app` alanı ve `$düğüm-id.alan` referans sözdizimi.

## Referanslar

- **`references/schema.md`** — şemanın tam tanımı, doğrulanan kural listesi, bilinen import belirsizliği
- **`references/model-selection.md`** — modaliteye göre model arama ve şema kontrolü *(henüz yazılmadı)*

## Değişmez kural

Üretilen her `workflow.json`, kullanıcıya verilmeden önce doğrulayıcıdan geçer:

```
node ${CLAUDE_PLUGIN_ROOT}/scripts/validate-workflow.mjs <dosya> --catalog <cache/models.json>
```

Çıkış kodu 0 değilse dosya kullanıcıya verilmez — hatalar düzeltilip tekrar doğrulanır.
Hatalı JSON'u teslim etmek, hatayı fal'ın import ekranında öğrenmek demektir.
