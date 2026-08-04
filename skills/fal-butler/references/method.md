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
`director → dop → motion → audio → editor → promptsmith → compiler`

Her agent'a **yalnızca ihtiyacı olanı** ver; tüm sohbeti aktarma. Her agent'ın çıktısı bir sonrakinin
girdisidir. `audio`, süre uyuşmazlığı bildirirse `motion`'a bir kez geri dön, sonra devam et.

### 4. Onay kapısı — **dosya yazmadan önce**

Kullanıcıya düz Türkçe bir plan sun:

- Sahne sahne ne olduğu (süre aralığıyla)
- Karakterin kim olduğu
- Hangi modellerin kullanılacağı
- **Toplam tahmini maliyet** (`references/cost-model.md`)
- `--quick` kullanıldıysa: profilden türetilen varsayımlar

Sonra onay iste. Beğenmezse ilgili agent'tan itibaren yeniden çalıştır — baştan başlama.

### 5. Yazma
Onaydan sonra sırayla: `brief.md`, `storyboard.md`, `workflow.json`, `cost.md`.
`workflow.json` doğrulayıcıdan geçmeden teslim etme.

### 6. Teslim
Dosyanın tam yolunu ver ve fal'a import edileceğini söyle. **Import adımının fal dokümanında
belgelenmediğini** de söyle (bkz. `skills/fal-workflow-json/references/schema.md`); tutmazsa
`storyboard.md`'yi kullanarak Workflow Builder'da elle kurabileceğini belirt.

---

## `/fal-butler:revise`

### 1. Ön koşul — sert
`.fal-butler/campaigns/*/workflow.json` yoksa **çalışma**. Hata ver, `campaign`'e yönlendir.
Birden fazla kampanya varsa hangisi olduğunu sor.

### 2. Yedekle
Değişiklikten **önce** mevcut dosyayı `revisions/<ISO-zaman-damgası>-workflow.json` olarak kopyala.

### 3. İki tür revizyon, tek komut

**Maliyet:** "pahalı" dendiğinde önce nereye gittiğini göster (`cost.md` kalem dökümü), sonra
somut seçenekler sun — her birinin ne kadar düşürdüğü ve neyi feda ettiğiyle birlikte.
Bkz. `references/cost-model.md`.

**Kurgu:** "üçüncü sahne kötü", "karakter daha genç olsun" gibi. İlgili agent'ı yeniden çalıştır,
zincirin kalanını koru. Karakter değişiyorsa karakter sayfası ve **tüm sahneler** yeniden üretilir —
bunu kullanıcıya maliyetiyle birlikte söyle.

### 4. Her değişiklikten sonra
`workflow.json`'u yeniden doğrula, `cost.md`'yi güncelle, neyin değiştiğini özetle.
