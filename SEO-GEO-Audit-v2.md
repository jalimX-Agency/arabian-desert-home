# SEO & GEO Audit — www.arabiandeserthome.ma
**تاريخ التحليل:** 12 يونيو 2026  
**النسخة:** v2 — تحليل الموقع الحي بعد التعديلات

---

## النتيجة الإجمالية

| المعيار | الحالة | النقاط |
|---|---|---|
| robots.txt & AI bots | ✅ ممتاز | 10/10 |
| Meta Tags (العنوان، الوصف، الكلمات) | ✅ ممتاز | 9/10 |
| Open Graph & Twitter Cards | ✅ ممتاز | 9/10 |
| Canonical URLs | ⚠️ جيد (مشكلة صغيرة) | 7/10 |
| Schema / Structured Data | ⚠️ جيد مع ثغرات | 7/10 |
| GEO (AI Search Engines) | ✅ جيد جداً | 8/10 |
| تناسق المحتوى مع الـ Meta | ⚠️ مشكلة واحدة | 6/10 |

---

## ✅ ما يعمل بشكل صحيح الآن

### robots.txt — مثالي ✅
```
User-Agent: ClaudeBot     → Allow ✅
User-Agent: GPTBot        → Allow ✅
User-Agent: ChatGPT-User  → Allow ✅
User-Agent: PerplexityBot → Allow ✅
User-Agent: anthropic-ai  → Allow ✅
User-Agent: Googlebot     → Allow ✅
User-Agent: Bingbot       → Allow ✅
Sitemap: https://www.arabiandeserthome.ma/sitemap.xml ✅
```
بعد إيقاف Cloudflare Managed robots.txt، كل بوتات الـ AI مسموح لها الآن.

### Meta Tags — كاملة على كل الصفحات ✅
- `<title>` فريد ومحتوي على الكلمات المفتاحية في كل صفحة
- `<meta description>` بطول مناسب (150-160 حرف)
- `<meta keywords>` ثنائي اللغة (فرنسي + إنجليزي)
- `meta robots: index, follow` ✅
- `meta googlebot: max-image-preview:large` ✅

### Open Graph & Twitter Cards ✅
- صورة OG بأبعاد 1344×768 ✅
- `og:locale: fr_FR` مع `alternate: en_US` ✅
- Twitter card: `summary_large_image` ✅
- كل الصفحات الفرعية لها OG و Twitter خاص بها ✅

### Canonical URLs — الصفحات الفرعية ✅
```
/les-tentes  → canonical: https://www.arabiandeserthome.ma/les-tentes ✅
/day-pass    → canonical: https://www.arabiandeserthome.ma/day-pass ✅
```

---

## ⚠️ مشاكل مكتشفة

### 1. Homepage Canonical — لا يزال بدون www
**الأولوية: متوسطة**

الصفحة الرئيسية لا تزال تظهر:
```
canonical: https://arabiandeserthome.ma  ← بدون www ❌
og:url:    https://arabiandeserthome.ma  ← بدون www ❌
```
بينما الصفحات الأخرى صحيحة. السبب على الأرجح **Cloudflare CDN cache** لم يتحدث بعد.

**الحل:** انتظر 24-48 ساعة حتى تنتهي الـ cache، أو من Cloudflare Dashboard → Caching → Purge Everything.

---

### 2. تعارض الأسعار بين المحتوى والـ Meta
**الأولوية: عالية — يؤثر على الـ GEO**

في صفحة `/day-pass`:
- الـ `meta description` يقول: **"à partir de 350 MAD"**
- المحتوى الفعلي يظهر: **"35 EUR / 50 EUR / 75 EUR"**

هذا التعارض يربك محركات البحث والـ AI — عند الاقتباس، يقتبس السعر الخاطئ.

**الحل:** عدّل `meta description` في `src/app/day-pass/page.tsx` ليعكس الأسعار الحقيقية بالـ EUR.

---

### 3. Schema Image URL مكسورة في LodgingBusiness
**الأولوية: متوسطة**

الـ schema يشير إلى:
```
"image": "https://www.arabiandeserthome.ma/images/hero.png"
```
لكن الصور على R2 CDN:
```
https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png
```
إذا كان `/images/hero.png` غير موجود، Google Rich Results Test ستفشل.

---

### 4. لا يوجد AggregateRating
**الأولوية: متوسطة**

لا يوجد تقييم نجوم في الـ schema. هذا يمنع ظهور النجوم في نتائج Google ويقلل الـ CTR.

---

### 5. لا يوجد Event Schema في /les-evenements
**الأولوية: منخفضة**

صفحة الأحداث (مواعيد، زفاف، سيمينار) تفتقر لـ `@type: Event` schema.

---

## تقرير GEO — محركات البحث AI

| المعيار | الحالة |
|---|---|
| ClaudeBot مسموح | ✅ |
| GPTBot مسموح | ✅ |
| PerplexityBot مسموح | ✅ |
| FAQPage Schema (في الكود) | ✅ +40% visibility |
| LodgingBusiness Schema | ✅ |
| إحصائيات في المحتوى (أسعار، مسافات) | ✅ |
| AggregateRating | ❌ مفقود |
| Brave Search (للـ Claude citations) | ⚠️ غير مؤكد — قدّم Sitemap لـ Brave Webmaster |
| تناسق الأسعار في Meta vs Content | ❌ خطأ في Day Pass |

---

## قائمة الإجراءات بالأولوية

1. **عدّل meta description لصفحة Day Pass** — غيّر "350 MAD" للأسعار الحقيقية بالـ EUR
2. **صحّح URL الصورة** في LodgingBusiness schema (غيّرها لـ R2 CDN URL)
3. **انتظر أو امسح Cloudflare cache** لإصلاح canonical الصفحة الرئيسية
4. **أضف AggregateRating** للـ schema
5. **قدّم Sitemap لـ Brave Search:** https://search.brave.com/webmaster

---

*تحليل مباشر للموقع الحي — www.arabiandeserthome.ma — يونيو 2026*
