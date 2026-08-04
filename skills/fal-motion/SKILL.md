---
name: fal-motion
description: Anahtar kareyi videoya çeviren katman — hareket dili, image-to-video ve first/last frame seçimi, klip süre sınırları, sahneler arası keyframe zincirleme, seed sabitleme. fal-motion agent'ı bunu okur. Use for video motion prompting, image-to-video, keyframe chaining, character consistency across shots, clip duration limits.
---

# fal-motion — hareket yönetmenliği

Durağan anahtar kareyi harekete geçiren katman. İki işi var: her sahneyi videoya çevirmek ve
**sahneleri birbirine görsel olarak zincirlemek** — karakterin altı sahne boyunca aynı kalmasını
fiilen sağlayan mekanizma burada kurulur.

## Referanslar

- **`references/motion-prompting.md`** — video modeline hareket tarif etme dili
- **`references/keyframe-chaining.md`** — karakter sayfası, zincir, seed sabitleme
- **`references/duration-budget.md`** — klip süre sınırları, sahne bölme

## Girdin ve çıktın

**Girdi:** görsel reçeteler (`fal-dop`'tan) + sahne süreleri (`fal-director`'dan)
**Çıktı:** sahne başına hareket reçetesi + **zincirleme grafiği** (hangi düğüm hangisini besliyor)
+ süre/fps/çözünürlük/seed parametreleri

Zincirleme grafiği `fal-compiler`'ın `depends` ilişkilerini kuracağı şeydir — düğüm bazında net yaz.

## Süre gerçekliği

Video modelleri klip başına sınırlı süre üretir ve bu sınır modelden modele değişir. **Şemadan
oku, varsayma.** Sahne süresi sınırı aşıyorsa böl ve zincirle; mümkün değilse `fal-director`'a
bildir ve kullanıcıya söylenmesini sağla. Sessizce kısaltma.

## `fal-audio` ile geri besleme

`fal-audio` "bu cümle 7 saniye sürer ama sahne 4 saniye" derse **bir kez** geri gelirsin.
Öncelik metni kısaltmaktır (`fal-audio` yapar); sahneyi uzatmak ikinci tercihtir çünkü toplam
süre hedefi kullanıcıdan gelir. İkinci tur yok — ikinci uyuşmazlıkta kullanıcıya bildirilir.
