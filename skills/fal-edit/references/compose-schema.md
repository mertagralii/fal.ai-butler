# `ffmpeg-api/compose` şeması

**Kaynak:** `https://fal.ai/models/fal-ai/ffmpeg-api/compose/api` → **"Other types"** bölümü
**Doğrulama tarihi:** 2026-08-05 (sahada kullanıldı)

Bu dosya "model adı ezberleme" kuralının meşru istisnasıdır — `ffmpeg-api` zaten
`skills/fal-butler/SKILL.md`'de altyapı sayılıp isimle anılmasına izin verilen ailedir, şeması da
aynı muameleyi hak ediyor.

## Neden burada sabitlendi

MCP yüzeyinde `tracks` alanı **`array<unknown>`** görünüyor ve `search_docs` sorguları bu şemayı
bulamıyor — hep başka modellerin sayfalarını döndürüyor. Şema, model sayfasının "API" sekmesinin
"Other types" bölümünde duruyor; doküman aramasının indekslemediği bir yer.

Sahada bu yüzden **uydurulmuş** ve dört ayrı hata üretmişti:

| Uydurulan | Gerçek |
|---|---|
| `clips` | `keyframes` |
| `source` | `url` |
| `start_time` | `timestamp` |
| saniye (`0, 6, 11`) | **milisaniye** (`0, 6000, 11000`) |
| `transition_out`, `transition_duration`, `trim_start` | **bu alanlar yok** |

Sonuç: fal tanımadığı `clips` alanını **sessizce attı**; geriye yalnızca `id` ve `type` taşıyan
boş track'ler kaldı. Alan adı doğru olup yalnızca birim yanlış olsaydı 30 saniyelik video
**30 milisaniye** olarak render edilecekti.

## Şema

```
Track     = { id: string, type: 'video' | 'audio' | 'image', keyframes: Keyframe[] }
Keyframe  = { timestamp: float, duration: float, url: string }
```

**`timestamp` ve `duration` MİLİSANİYEDİR.** Başka alan yoktur.

Çıktı **düz**, iç içe değil:

```
video_url: string
thumbnail_url: string
```

Referans: `$node-compose.video_url` — `$node-compose.video.url` **değil**.

## Örnek

```json
{
  "tracks": [
    {
      "id": "video",
      "type": "video",
      "keyframes": [
        { "timestamp": 0,     "duration": 6000, "url": "$node-video-s1.video.url" },
        { "timestamp": 6000,  "duration": 5000, "url": "$node-video-s2.video.url" }
      ]
    },
    {
      "id": "voiceover",
      "type": "audio",
      "keyframes": [{ "timestamp": 500, "duration": 28100, "url": "$node-tts.audio.url" }]
    },
    {
      "id": "music",
      "type": "audio",
      "keyframes": [{ "timestamp": 0, "duration": 30000, "url": "$node-loudnorm.audio.url" }]
    }
  ]
}
```

## Üç sert sınır — kurgu ekibi bunları baştan bilmeli

Keyframe'de bu alanlar **olmadığı için** şunlar yapılamaz:

### 1. Geçiş yok — yalnızca sert kesim

Opacity/geçiş alanı yoktur. **Dissolve, fade ve match cut'ın yumuşak biçimi planlanamaz.**
`rhythm.md`'deki geçiş tablosunu buna göre uygula: geçiş tipi kararı yine anlamlıdır ama
`compose` hepsini sert kesim olarak render eder. Yumuşak geçiş isteniyorsa bu, kullanıcıya
**yapılamaz** diye söylenir.

### 2. Ses seviyesi kontrolü yok — ducking imkânsız

`gain` / `volume` alanı yoktur. Seslendirme ve müzik ayrı `audio` track'lerinde örtüşen zaman
damgalarıyla **aynı anda** çalar. Zaman bazlı ducking uygulanamaz.

**Çözüm:** müziği `loudnorm` gibi bir ön işleme düğümünden geçirip seviyesini baştan düşük
üret (ör. −18 LUFS). "İki farklı seviyede iki dosya üretip segment değiştirme" numarası
risklidir — `trim`/`offset` de olmadığı için müzik her segment başında baştan başlayabilir.

### 3. Altyazı gömülemez

Metin track tipi yoktur. **`.srt` bir yedek değil, tek seçenektir.** `subtitles.md`'deki
"şemadan kontrol et" adımı artık gereksiz — cevap kesin olarak hayır. Kullanıcıya bunu
açıkça söyle.

`type: "image"` track'iyle PNG overlay yapılıp yapılamayacağı **bilinmiyor** — konum ve opacity
alanları dokümante değil. Ekran içi metinler (CTA, sayaç) bu yüzden **anahtar karelerin içinde**
üretilir; bu da render sonrası gözle yazım kontrolü gerektirir.

## Doğrulayıcı ne yakalıyor

`scripts/validate-workflow.mjs` compose düğümlerini özel denetler:

- `COMPOSE_BAD_TRACK` — track veya keyframe'de şemada olmayan alan (`clips`, `source`,
  `start_time`, `transition_out`…)
- `COMPOSE_SUSPECT_MS` — `duration < 1000`. Bir reklam klibi asla 1 saniyeden kısa değildir;
  bu neredeyse kesin saniye yazımıdır ve 1000× kısa video demektir.

## Kural: `array<unknown>` gördüğünde

`search_docs`'a güvenme. Modelin `fal.ai/models/<endpoint>/api` sayfasını aç ve **"Other types"**
bölümünü oku. Bulamıyorsan **uydurma** — `fal-compiler`'a bildir ve kullanıcıya söyle.
