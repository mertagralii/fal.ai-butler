# Prompt lehçeleri

## Lehçeyi nasıl tespit edersin

Model adına bakarak değil, **şemaya ve örneklere** bakarak:

1. **Şemadaki alan adları.** Tek bir `prompt: string` alanı mı var, yoksa `subject`, `style`,
   `camera`, `lighting` gibi ayrı alanlar mı? İkincisi yapılandırılmış girdi ister.
2. **Alan açıklamaları.** Şemadaki `description` metinleri genelde biçimi söyler ("a detailed
   natural language description", "comma-separated tags").
3. **Resmi örnek prompt'lar.** fal'ın model sayfasındaki örnek en güvenilir kaynaktır. Onun
   uzunluğunu, cümle yapısını ve detay seviyesini taklit et.
4. **Ek alanların varlığı.** `negative_prompt`, `seed`, `guidance_scale`, `num_inference_steps`
   varsa modelin ailesi hakkında bilgi verir ve prompt uzunluğu beklentisini belirler.

Örnek yoksa **doğal dil paragraf** varsayılanına düş — en yaygın ve en bağışlayıcı biçim.

## Üç ana biçim

### 1. Doğal dil paragraf

En yaygın. Akıcı, betimleyici cümleler.

```
A woman in her early thirties with shoulder-length dark brown straight hair parted in the
middle, wearing a beige linen shirt with rolled sleeves, sitting at a wooden desk in an open
office. Soft cold morning light from a large window falls from the side. Medium close-up,
35mm look, shallow depth of field, background softly blurred. Muted blue-grey palette.
```

**Kurallar:** önemli olanı başa koy (modeller baştaki tokenlara daha çok ağırlık verir),
tek paragraf hâlinde yaz, çelişkili sıfat yığma.

### 2. Yapılandırılmış / JSON

Şemada ayrı alanlar varsa. Her bilgiyi kendi alanına koy, hepsini `prompt`'a doldurma.

```json
{
  "subject": "woman, early thirties, shoulder-length dark brown straight hair, beige linen shirt",
  "scene": "open office, wooden desk, large window",
  "lighting": "soft cold morning light from the side",
  "camera": "medium close-up, 35mm, shallow depth of field",
  "style": "cinematic, muted blue-grey palette"
}
```

### 3. Etiket listesi

Virgülle ayrılmış terimler, ağırlık sözdizimi olabilir.

```
woman, early 30s, shoulder-length dark brown hair, beige linen shirt, open office,
window light, medium close-up, 35mm, shallow dof, muted blue-grey, cinematic
```

**Kural:** en önemli etiket başta. Uzun cümle kurma — bu lehçede cümle gürültüdür.

## Dil seçimi

**Prompt'ları İngilizce yaz.** Görüntü ve video modelleri ağırlıklı İngilizce veriyle eğitilmiştir;
Türkçe prompt belirgin şekilde daha kötü sonuç verir.

**İstisna:** TTS ve altyazı metinleri. Onlar kullanıcının seçtiği dilde kalır — seslendirme
Türkçeyse metin Türkçedir. TTS modelinin o dili desteklediğini şemadan doğrula.

Kullanıcıya gösterilen her şey (`storyboard.md`, plan, raporlar) Türkçedir. İngilizce olan
yalnızca `workflow.json` içindeki üretim prompt'larıdır.

## Sahneler arası tutarlılık

Aynı karakteri tarif eden **aynı kelimeleri** kullan. "dark brown hair" yazdıysan sonraki sahnede
"brunette" yazma — model bunları farklı yorumlar.

Pratik yöntem: karakter bible'ından **sabit bir prompt bloğu** üret, her sahnenin prompt'una
değişmeden yapıştır, sahneye özgü kısmı (duygu, aksiyon, ışık) onun etrafına yaz.

```
[SABİT KARAKTER BLOĞU]  +  [sahneye özgü ışık/kadraj]  +  [sahneye özgü duygu/aksiyon]
```

## Uzunluk

- **Doğal dil:** 40–80 kelime. Daha kısası detaysız, daha uzunu modelin dikkatini dağıtır.
- **Etiket listesi:** 15–25 etiket.
- **Yapılandırılmış:** alan başına 1–2 cümle.

Modelin resmi örneği bundan belirgin şekilde farklıysa **örneği taklit et** — o modelin
kalibrasyonu odur.

## Video prompt'ları farklıdır

Video düğümlerinde prompt bir *değişimi* tarif eder, durumu değil. Bkz.
`skills/fal-motion/references/motion-prompting.md`. Oradaki hareket cümlelerini olduğu gibi
İngilizceye çevir; durağan betimlemeyi video prompt'una kopyalama.
