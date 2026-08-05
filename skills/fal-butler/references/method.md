# Yöntem — üç komutun uçtan uca akışı

## `/fal-butler:setup`

Tek seferlik kurulum. Sırayla, durmadan:

1. **`FAL_KEY` var mı?** Yoksa dur ve söyle: anahtar <https://fal.ai/dashboard/keys> adresinden
   alınır; Windows'ta `[Environment]::SetEnvironmentVariable('FAL_KEY','...','User')` ile kalıcı
   yazılır ve **Claude Code yeniden başlatılır** (çalışan süreç yeni ortam değişkenini görmez).
2. **fal MCP ayakta mı?** Ucuz bir okuma çağrısıyla dene (ör. model araması). Başarısızsa
   `references/cache-discipline.md`'deki hata tablosuna bak.
3. **Katalogu cache'e doldur.** Anahtar: `models`. Bkz. `references/cache-discipline.md`.
4. **Projeyi tara.** Aşağıdaki "Proje tarama" bölümü.
5. **`product.md` üret.** Çıkaramadığın alanları AskUserQuestion ile sor — hepsini birden değil,
   eksik olanları.
6. **`.gitignore` hatırlatması:** kullanıcının repo'suna `.fal-butler/cache/` satırını eklemesini
   söyle (varsa tekrar etme).
7. **"Her şey hazır, artık kampanya kurabiliriz."**

### Proje tarama

Sırayla bak, bulduğunla yetin — hepsi olmak zorunda değil:

| Kaynak | Ne çıkarırsın |
|---|---|
| `README.md` | Ürünün ne olduğu, ana iddia, özellikler |
| `package.json` / `pyproject.toml` / `go.mod` | Ad, açıklama, tip (CLI mi, web mi, kütüphane mi) |
| Landing page (`app/page.tsx`, `index.html`, `src/pages/`) | Gerçek pazarlama dili, başlıklar, CTA metni |
| i18n dosyaları (`locales/`, `messages/`) | Hedef diller, ton |
| `public/`, `docs/` içindeki ekran görüntüleri | Arayüzün gerçek görünümü, renk paleti |
| `LICENSE`, fiyatlandırma sayfası | Ticari mi, açık kaynak mı, ücretsiz katman var mı |

**Kodun mimarisini anlatma.** Kullanıcı ürününü biliyor; sen *reklamı çekilecek şeyi* arıyorsun:
kime, hangi sorunu, nasıl çözüyor.

Çıkaramayacağın şeyler — sor: marka tonu, hedef kitlenin demografisi, rakiplerden farkı,
reklamda kullanılmasını istemediği şeyler.

---

## `/fal-butler:campaign`

### 1. Ön koşul
`product.md` yoksa `setup`'a yönlendir ve dur.

### 2. Röportaj
Sorular **tek tek** gelir. Her birinin `product.md`'den türetilmiş bir varsayılanı vardır ve
kullanıcı "sen karar ver" diyebilir. `brief.md` varsa önceki cevaplar varsayılan olarak dolu gelir.

1. **Amaç** — lansman / yeni özellik / indirim / marka bilinirliği
2. **Platform + süre** — süreye göre sahne sayısı öner: kabaca 10 saniyeye bir sahne
3. **Anlatım biçimi** — karakterli hikaye / ürün-ekran odaklı / soyut-motion
4. **Karakter** *(yalnızca karakterli seçildiyse)* — cinsiyet, yaş aralığı, görünüm, kıyafet, ortam
5. **Ton** — enerjik / sakin / esprili / kurumsal
6. **Dil** — TR / EN / ikisi
7. **Kapsam** — seslendirme? müzik? altyazı? **Her biri ayrı ayrı sorulur ve kapatılabilir.**
8. **CTA** — izleyici ne yapsın

`--quick` bayrağı: yalnızca 1, 2 ve 8'i sor; kalanını `product.md`'den türet ve türettiklerini
planda açıkça listele ki kullanıcı itiraz edebilsin.

### 3. Ekip zinciri

```
compiler(aşama 1) → director → dop → animator → audio → [animator] → editor → promptsmith → compiler(aşama 2)
        ↑ model seçimi                              ↑ tek geri dönüş        ↑ dosyayı yazan tek adım
```

Model seçimi **başta** yapılır: `fal-animator` süre sınırlarını, `fal-promptsmith` prompt
lehçesini şemadan okuyor.

Her agent'a **yalnızca ihtiyacı olanı** ver; tüm sohbeti aktarma. `audio`, süre uyuşmazlığı
bildirirse `animator`'a **bir kez** geri dön, sonra devam et. Aşama 2, aşama 1'in endpoint
listesini `.fal-butler/cache/` üzerinden yeniden okur — alt agent çağrıları durumsuzdur.

**Paralel çalışabilenler** (sahada denendi, sonucu bozmadan süreyi kısalttı):

| Paralel | Neden mümkün |
|---|---|
| `compiler(aşama 1)` ∥ `director` | Director yalnızca `product.md` + `brief.md` ister, şemaya ihtiyacı yok |
| `animator` ∥ `audio` | İkisi de `dop`'un çıktısından beslenir; `audio` yalnızca süre denetimi için `animator`'ın sonucunu bekler |
| `editor` ∥ `promptsmith` | Promptsmith üretim düğümlerinin prompt'unu yazar, kurgudan bağımsız |

Bağımlılığı olan halkaları paralelleştirme: `dop` `director`'ı, `compiler(2)` hepsini bekler.

**Cache yazımı onay kuralının istisnasıdır:** aşama 1 model şemalarını `.fal-butler/cache/`
altına yazar. "Onaydan önce dosya yazma" kuralı kampanya çıktıları için geçerlidir; cache
yeniden üretilebilir ve `.gitignore`'dadır.

### 4. Onay kapısı — **dosya yazmadan önce**

Kullanıcıya düz Türkçe bir plan sun:

- Sahne sahne ne olduğu (süre aralığıyla)
- Karakterin kim olduğu
- Hangi modellerin kullanılacağı
- **Toplam tahmini maliyet** (`references/cost-model.md`)
- `--quick` kullanıldıysa: profilden türetilen varsayımlar

Sonra onay iste. Beğenmezse ilgili agent'tan itibaren yeniden çalıştır — baştan başlama.

### 4b. Seslendirme metni ayrı bir onay noktasıdır

Metin şu an storyboard'un içinde geçiyor ve **gözden kaçıyor.** Sahada "metin çok klasik olmuş"
şikâyeti tam da bu yüzden üretim sonrası geldi.

Onay kapısında metni **ayrıca** göster ve açıkça sor:

> Seslendirme metni:
> "…"
>
> Bu metin sana klişe geliyor mu? Orta bölüm özellik sıralamasına kaymış olabilir —
> değiştirmemi istersen söyle.

### 5. Yazma
Onaydan sonra sırayla: `brief.md`, `storyboard.md`, `workflow.json`, `cost.md`.
`workflow.json` doğrulayıcıdan geçmeden teslim etme.

### 5b. Üretimi aşamalandırmayı öner

Kullanıcı fal'da tek seferde her şeyi çalıştırırsa, beğenmediği bir karakter ya da ses için
**tüm video bütçesini** harcamış olur. Teslim mesajında şu sırayı öner:

1. **Önce yalnızca karakter sayfası ve TTS örneğini çalıştır** — birkaç kuruş.
   Karakter doğru mu, ses insan gibi mi, telaffuz tutuyor mu?
2. Beğenmezse `/fal-butler:revise` ile düzelt — video düğümlerine hiç para harcanmadan.
3. Onayladıktan sonra video düğümlerini çalıştır — bütçenin %80'i orada.

Video üretimi baskın kalem; karakter ve ses ise ondan iki mertebe ucuz. Sıralamayı tersine
çevirmek en pahalı hatadır.

### 6. Teslim

Dosyanın tam yolunu ver ve fal panelinden **elle import** edileceğini söyle.

**Programatik doğrulama mümkün değildir:** `POST /workflows` ADMIN anahtarı ister, normal
`FAL_KEY` 403 döner. Yani `validate-workflow.mjs` tek savunma hattıdır — geçmeyen dosyayı asla
teslim etme.

Import sonrası kullanıcının panelde kontrol edeceği liste:

- Düğümler ve bağlantılar göründü mü
- `Save & Run` → başlık → `Create` adımı **"Field required"** vermiyor mu
  (veriyorsa `contents.version` / `output` / `schema.output` eksik demektir — bkz. `schema.md`)
- Montaj düğümündeki track'ler dolu mu (boş görünüyorsa keyframe alan adları yanlış)

Bu biçim 2026-08-05'te gerçek bir kampanyayla import edilip kabul edildi; format doğru.

---

## `/fal-butler:revise`

### 1. Ön koşul — sert
`.fal-butler/campaigns/*/workflow.json` yoksa **çalışma**. Hata ver, `campaign`'e yönlendir.
Birden fazla kampanya varsa hangisi olduğunu sor.

### 2. Yedekle
Değişiklikten **önce** mevcut dosyayı `revisions/<YYYY-MM-DDTHH-mm-ss>-workflow.json` olarak
kopyala. Zaman damgasında `:` **kullanma** — Windows'ta geçersiz dosya adıdır.

### 3. İki tür revizyon, tek komut

**Maliyet:** "pahalı" dendiğinde önce nereye gittiğini göster (`cost.md` kalem dökümü), sonra
somut seçenekler sun — her birinin ne kadar düşürdüğü ve neyi feda ettiğiyle birlikte.
Bkz. `references/cost-model.md`.

**Kurgu:** "üçüncü sahne kötü", "karakter daha genç olsun" gibi. İlgili agent'ı yeniden çalıştır,
zincirin kalanını koru. Karakter değişiyorsa karakter sayfası ve **tüm sahneler** yeniden üretilir —
bunu kullanıcıya maliyetiyle birlikte söyle.

### 4. Her değişiklikten sonra
`workflow.json`'u yeniden doğrula, `cost.md`'yi güncelle, neyin değiştiğini özetle.
