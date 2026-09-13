# INLEARN Academy — نقشه‌ی پیاده‌سازی ماژول جدید

> ⚠️ **این سند یک طرح است، نه توصیف وضعیت فعلی. ماژول on hold است.**
>
> چیزی که واقعاً در `src/features/inlearn/` وجود دارد:
> `InlearnAcademy.jsx` + کامپوننت‌های `InlearnNavbar` / `InlearnHero` /
> `InlearnFooter` / `AuthSidebar` / `InnotechLogo` + `data/inlearnContent.js`
> + `services/authService.js`. در `src/app/routes.js` فقط `routes.inlearnAcademy`
> (`/inlearn`) ثبت شده است.
>
> یعنی `pages/`، `dashboard/`، `Basket.jsx`، `services/basket.js`،
> `services/payment.js` و هشت مسیر دیگرِ بخش ۶ هنوز ساخته نشده‌اند. تا وقتی این
> بنر اینجاست، بخش‌های ۵ تا ۷ را به‌عنوان برنامه بخوان، نه به‌عنوان نقشه‌ی کد.

منبع طراحی: فایل فیگمای جدید `iRlWLRFBCOwa4eqALV3kgO` (Untitled → Page 1)
وضعیت: تأیید نیازمندی‌ها انجام شد — کدنویسی شروع شد و سپس متوقف شد

---

## ۱. چیزی که قرار است ساخته شود

یک زیرمحصول کامل به نام **INLEARN Academy (by Innotech)** شامل کاتالوگ دوره، صفحه‌ی دوره،
سبد خرید، احراز هویت و پنل کاربری. این ماژول **هدر و فوتر مخصوص خودش** را دارد و از
هدر/فوتر سایت اصلی استفاده نمی‌کند.

از این به بعد، کلیک روی آیتم **INLEARN Academy** در نوبار سایت اصلی باید همین صفحات
جدید را باز کند (جایگزین صفحه‌ی فعلی `src/features/inlearn-academy/`).

---

## ۲. تصمیمات قطعی‌شده

| موضوع | تصمیم |
|---|---|
| تم | فعلاً **فقط لایت**. تم دارک بعداً می‌آید (طراح هنوز نزده). کد باید طوری نوشته شود که افزودن دارک بعداً فقط تعویض توکن باشد، نه بازنویسی. |
| هدر/فوتر | مخصوص INLEARN — جدا از `src/shared/components/layout/` |
| نقطه‌ی ورود | آیتم نوبار سایت اصلی به این ماژول لینک می‌شود |
| بک‌اند | **ندارد.** فعلاً همه چیز mock (محتوای استاتیک + localStorage). محتوا عمدتاً از WordPress می‌آید. |
| API آینده | احراز هویت / کاربران / پروفایل احتمالاً بعداً API می‌شود → باید پشت یک لایه‌ی سرویس ایزوله باشد |
| درگاه پرداخت | داریم، ولی مشخصاتش بعداً داده می‌شود → دکمه‌ی پرداخت فعلاً به یک نقطه‌ی اتصال خالی وصل می‌شود |

---

## ۳. صفحات (از فیگما)

| # | صفحه | node-id | وضعیت بررسی |
|---|---|---|---|
| 1 | Register (split-screen) | `2:1998` | ✅ دیده شد |
| 2 | Log in (split-screen) | `2:3289` | ✅ دیده شد |
| 3 | INLEARN Home | `2:2060` | ✅ دیده شد |
| 4 | All Courses | `2:2454` | ✅ دیده شد |
| 5 | Course Detail | `2:2702` | ✅ دیده شد |
| 6 | Shopping Basket | `2:2929` | ✅ دیده شد |
| 7 | Dashboard › Bill | `2:814` | ✅ دیده شد |
| 8 | Dashboard › Courses | `2:958` | ✅ دیده شد |
| 9 | Dashboard › Saved | `2:1462` | ✅ دیده شد |
| 10 | ؟ (۱۵۴۲×۱۳۲۳) | `2:1718` | ⏳ دیده نشده |
| 11 | ؟ (۱۵۴۲×۱۳۲۳) | `2:1833` | ⏳ دیده نشده |
| 12 | ؟ (۱۵۴۲×۱۳۲۳) | `2:3093` | ⏳ دیده نشده |
| — | بلاک جدا (۹۹۵×۶۶۳) | `2:3257` | ⏳ دیده نشده |

سه فریم باقی‌مانده احتمالاً Dashboard › Home / Profile و یک حالت دیگر هستند —
به‌محض ریست شدن سقف Figma MCP بررسی می‌شوند.

---

## ۴. سیستم طراحی استخراج‌شده

> این‌ها تخمین از روی تصویر است. بعد از ریست MCP با `get_design_context` و
> `get_variable_defs` مقادیر **دقیق** جایگزین می‌شود.

- پس‌زمینه: سفید / خاکستری خیلی روشن؛ فقط هدر (pill مشکی) و فوتر مشکی
- اکسنت سبز: `#37b478` (همان اکسنت سایت فعلی)
- فونت: `Gotham` (از `src/styles/fonts.css` پروژه)
- رادیوس: کارت ~۱۲–۱۶px، دکمه/چیپ/اینپوت pill (999px)
- گرافیک برند: قوس‌های مشکی ضخیم پس‌زمینه (همان زبان بصری سایت اصلی)

### هدر
pill شناور مشکی. چپ: لوگوی INLEARN. راست: `Login | Register` + آیکن سبد + `En ⌄` + سرچ.
در حالت لاگین، نام کاربر جای `Login | Register` می‌نشیند.

### کامپوننت‌های تکرارشونده
`CourseCard` (overlay بوکمارک/اشتراک، «Read more» در هاور) · `FilterChip` ·
`QuantityStepper` · `StatusBadge` · `DashboardSidebar` · `InlearnFooter` ·
`Carousel` (فلش کناری) · `AuthPanel` (تب Log in / Register)

---

## ۵. ساختار فایل‌ها

```
src/features/inlearn/
├─ InlearnLayout.jsx              هدر pill + فوتر
├─ inlearn.content.js             محتوای استاتیک/mock
├─ inlearn.assets.js
├─ pages/
│  ├─ InlearnHome.jsx
│  ├─ AllCourses.jsx
│  ├─ CourseDetail.jsx
│  ├─ Basket.jsx
│  └─ Auth.jsx                    تب‌های Log in / Register
├─ dashboard/
│  ├─ DashboardLayout.jsx         سایدبار پروفایل
│  ├─ Bill.jsx  Courses.jsx  Saved.jsx  Profile.jsx
├─ components/
│  └─ CourseCard FilterChip QuantityStepper StatusBadge Carousel AuthPanel
└─ services/
   ├─ auth.js                     mock الان، API بعداً — امضا ثابت می‌ماند
   ├─ basket.js                   localStorage
   └─ payment.js                  نقطه‌ی اتصال خالی برای درگاه
```

استایل: `src/styles/inlearn.css` با CSS variable ها زیر `.inlearn` تا افزودن دارک
بعداً فقط یک بلاک `.inlearn.is-dark` باشد.

---

## ۶. مسیرها

```
/inlearn                              Home
/inlearn/courses                      All Courses
/inlearn/courses/:slug                Course Detail
/inlearn/basket                       Shopping Basket
/inlearn/auth                         Log in / Register
/inlearn/dashboard/bill               Bill
/inlearn/dashboard/courses            My Courses
/inlearn/dashboard/saved              Saved
/inlearn/dashboard/profile            Profile
```

`routes.inlearnAcademy` در `src/app/routes.js` به `/inlearn` تغییر می‌کند تا لینک‌های
موجود نوبار (`NavbarMainBar.jsx:94`، `NavbarPanels.jsx:200`، `navData.js`) خودکار
به ماژول جدید بروند.

---

## ۷. ترتیب ساخت

1. `InlearnLayout` — هدر pill + فوتر + توکن‌های استایل
2. `CourseCard` — پرتکرارترین کامپوننت
3. `AllCourses` — گرید + چیپ‌های فیلتر
4. `CourseDetail` — کارت خرید + کروسل مرتبط
5. `Auth` — split-screen لاگین/رجیستر
6. `Basket` — stepper، کد تخفیف، جمع کل
7. `Dashboard` — سایدبار + Bill / Courses / Saved / Profile
8. اتصال نوبار سایت اصلی + حذف صفحه‌ی قدیمی `inlearn-academy`

هر مرحله جدا ساخته و با اسکرین‌شات فیگما مو‌به‌مو مقایسه می‌شود.

---

## ۸. باز / نیازمند ورودی از تو

- [ ] سه فریم دیده‌نشده (`2:1718`, `2:1833`, `2:3093`) و بلاک `2:3257`
- [ ] رنگ/فونت/اسپیسینگ دقیق (بعد از ریست Figma MCP)
- [ ] مشخصات درگاه پرداخت
- [ ] منبع محتوای دوره‌ها در WordPress (post type / فیلدها) — آیا قرارداد
      `docs/wordpress/cms-contract.md` باید گسترش پیدا کند؟
- [ ] در فریم لاگین کلمه‌ی **Store** دیده می‌شود و در نوبار سایت هم آیتم
      **INSIGHT Store** هست. آیا صفحات سبد خرید/فروشگاه مربوط به INSIGHT Store
      است یا همه زیر INLEARN؟
- [ ] چندزبانه بودن این ماژول (سایت فعلی en/ar/tr دارد) — لازم است یا فعلاً فقط EN؟
