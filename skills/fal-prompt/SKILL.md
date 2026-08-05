---
name: fal-prompt
description: Reçeteleri hedef modelin konuştuğu dile çevirme — model şemasından ve resmi örneklerinden prompt lehçesi çıkarma, negatif prompt ve parametre ayarı. fal-promptsmith agent'ı bunu okur. Use for writing prompts for a specific fal model, prompt format detection, negative prompts, seed and parameter tuning.
---

# fal-prompt — prompt mühendisliği

Ekibin ürettiği reçeteler insan diliyle yazılmıştır. Senin işin bunları **hedef modelin
konuştuğu dile** çevirmek — ve o dili ezberden bilmemek.

## Temel ilke: lehçeyi keşfet, ezberleme

Model adı ve prompt biçimi hard-code edilmez. `fal-compiler` modeli seçtikten sonra sen o modelin
**şemasını** ve **resmi örnek prompt'larını** cache'ten/MCP'den okursun, biçimi oradan çıkarırsın.
Model değişince prompt biçimi de kendiliğinden değişir.

## Referanslar

- **`references/dialects.md`** — şemadan lehçe çıkarma yöntemi ve üç ana biçim
- **`references/negative-prompts.md`** — negatif prompt, seed, parametre ayarı

## Girdin ve çıktın

**Girdi:** tüm reçeteler (`fal-director`, `fal-dop`, `fal-animator`, `fal-audio`, `fal-editor`)
+ seçilen modellerin şemaları

**Çıktı:** düğüm başına nihai `input` nesnesi — prompt metni, negatif prompt, parametreler.
`fal-compiler` bunu doğrudan `workflow.json`'a yerleştirir.

## Neden ayrı bir agent'sın

Model şemaları context açısından ağırdır. Üç ayrı agent'ın context'ine ayrı ayrı çekmek yerine
hepsi sende toplanır — hem ucuz hem tutarlı. Bu yüzden **tüm** düğümlerin prompt'unu sen yazarsın,
başka agent prompt yazmaz.

## `negative_prompt` ve `strength` yaygın DEĞİLDİR

Sahada seçilen beş modelin **hiçbirinde** `negative_prompt` alanı yoktu; image-edit modelinde
`strength` de yoktu. Yeni nesil modeller (Seedream v4, Kling O1 gibi) bu alanları sunmuyor.

Şemada yoksa `references/negative-prompts.md`'deki rehberliği **uygulamaya çalışma** ve
"düşük `strength` tut" talimatını zorlama. O durumda karakter tutarlılığı tamamen iki
mekanizmaya kalır:

1. Sabit karakter bloğunun her prompt'ta **birebir** tekrarı
2. Referans zinciri (karakter sayfası + bir önceki kare)

İkisini de daha titiz uygula ve **raporda açıkça belirt**: "negatif prompt desteklenmiyor,
tutarlılık sabit blok + zincirle kuruldu."

## Değişmez kural

Karakter bible'ını **birebir** kopyala. Yeniden ifade etme, özetleme, eş anlamlı kullanma.
Her yeniden yazım tutarlılıktan götürür — bkz.
`skills/fal-motion/references/keyframe-chaining.md`.
