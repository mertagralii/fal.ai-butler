# Ses–görüntü senkronu

## Konuşma süresi hesabı

Bir cümlenin kaç saniye süreceğini üretmeden önce kestirmek zorundasın — üretip ölçmek para
harcamak demek ve bu plugin para harcamıyor.

**Türkçe için:** dakikada 140–160 kelime, yani saniyede **~2,5 kelime**. Türkçe sondan eklemeli
olduğu için kelimeler İngilizceden uzun; kelime sayısı yerine **hece** saymak daha güvenilir:
saniyede ~5 hece.

**İngilizce için:** dakikada 150–170 kelime, saniyede ~2,7 kelime.

Hesaba **nefes payı ekle**: cümle sonlarında 0,3–0,5 sn, sahne başında ve sonunda 0,3 sn sessizlik.
Sahneyi tepeden tırnağa konuşmayla doldurmak sıkışık ve nefessiz duyulur.

```
tahmini süre = (hece sayısı / 5) + (cümle sayısı × 0.4) + 0.6
```

Bu bir tahmindir; TTS modeli ve seçilen ses hızı sonucu ±%15 kaydırabilir. Sınıra dayanan
sahnelerde pay bırak.

## Uyuşmazlık bildirimi

Bir sahnenin metni sahne süresine sığmıyorsa **rapor et**, sessizce kırpma:

```
SÜRE UYUŞMAZLIĞI
Sahne 4: süre 6.0 sn · metin tahmini 6.8 sn · fazla 0.8 sn
Metin: "Artık her şey tek ekranda, toplantıya gerek kalmadan ekibin ne yaptığını görüyorsun."
  → 29 hece · (29/5) + (1×0.4) + 0.6 = 6.8 sn
Öneri: ~24 heceye indir → 5.8 sn, 0.2 sn pay kalır.
Örnek: "Artık her şey tek ekranda, toplantıya gerek kalmadan görüyorsun." (24 hece)
```

**Hesabı örnekle birlikte göster.** Hece sayısını ve formülü yazmak, hem kendi aritmetiğini
denetlemeni sağlar hem `fal-animator`'ın kararı değerlendirmesini kolaylaştırır.

**Aşırı kısaltma da hatadır.** Sahneyi 6 sn'de tutup metni 14 heceye indirmek 3,8 sn konuşma +
2,2 sn sessizlik demektir — `skills/fal-edit/references/rhythm.md` iki saniyeden uzun sessizliği
yasaklıyor. Hedef, sahne süresinin **%85–95'ini** doldurmaktır.

**Çözüm sırası:**

1. **Metni kısalt** — birinci tercih. Toplam süre hedefi kullanıcıdan geliyor, ona dokunma.
2. **Sahneyi uzat** — ancak toplam süreden başka bir sahne kısalabiliyorsa. `fal-animator`'a bir kez
   geri dön.
3. **Cümleyi komşu sahneye taşı** — konuşma sahne sınırını aşabilir; görüntü değişirken ses
   devam edebilir. Kurgusal olarak da güçlüdür.

**İkinci tur yok.** İkinci uyuşmazlıkta kullanıcıya bildirilir; zincir kilitlenmez.

## TTS reçetesi

Katalogdan bir TTS modeli seç (`skills/fal-workflow-json/references/model-selection.md`) ve şunları
belirle:

| Alan | Nasıl karar verirsin |
|---|---|
| **Dil** | `brief.md`'den. TR seçildiyse Türkçe destekleyen model şart — şemadan doğrula |
| **Ses karakteri** | Marka tonundan: sıcak/samimi, kurumsal/net, genç/enerjik |
| **Cinsiyet** | Karakterin kendisi konuşuyorsa karaktere uy; dış ses ise marka tonuna |
| **Hız** | Varsayılan. Sığdırmak için hızlandırma — aceleci duyulur ve güven kaybettirir |
| **Duraklamalar** | Cümle sonlarında noktalama ile ver; model çoğunlukla saygı gösterir |

**Türkçe uyarısı:** her TTS modeli Türkçeyi iyi okumaz. Özel isimler, İngilizce ürün adları ve
kısaltmalar bozulabilir. Ürün adı İngilizceyse ve model Türkçe okuyorsa, adı okunuşuyla yazmayı
değerlendir ve bunu reçeteye not düş.

## Miksaj planı

`fal-editor`'a teslim edeceğin ses kanalı yapısı:

| Kanal | Seviye | Not |
|---|---|---|
| Seslendirme | 0 dB (referans) | Her zaman en önde |
| Müzik | −18 ila −22 dB, konuşma altında | Konuşma yokken −12 dB'e çıkabilir |
| Ses efekti | −15 dB | Varsa; reklamda genelde gereksiz |

**Ducking:** konuşma başladığında müzik otomatik kısılır. Reçetede açıkça belirt — `fal-editor`
bunu `ffmpeg` montaj düğümünde uygular.

## Altyazı için teslim

Altyazıyı `fal-edit` üretir ama kaynağı sensin. Metni **zamanlanabilir parçalar** hâlinde ver:

```
Sahne 1 (0.0–6.0): "Gün başlamadan yorulmak…" [~2.4 sn, 0.5'te başlar]
Sahne 2 (6.0–16.0): "Bildirimler bitmiyor." [~1.8 sn] / "Liste uzuyor." [~1.5 sn]
```

Parçalar cümle ya da anlamlı öbek sınırında bölünür — kelime ortasından değil.
