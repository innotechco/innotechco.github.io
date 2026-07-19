import {getActiveLocale} from "./locale";

const messages = {
  en: {
    loading: "Loading", readMore: "Read more", menu: "Menu", whoWeAre: "Who we are", whatWeDo: "What we do",
    whatWeThink: "What we think", academy: "INLEARN Academy", store: "INSIGHT Store",
    services: "Services", industries: "Industries", searchPlaceholder: "search services, industries, partners, articles, and pages",
    clearSearch: "Clear search", search: "Search", noResults: "No results found for:", openSearch: "Open search", openMenu: "Open menu", closeMenu: "Close menu",
    lightMode: "Switch to light mode", darkMode: "Switch to dark mode", contactUs: "contact us",
    previousCard: "Previous card", nextCard: "Next card", goToCard: "Go to card", close: "Close",
    closeModal: "Close modal", tableOfContents: "Table of contents", breadcrumb: "Breadcrumb",
    gdpr: "GDPR", cookies: "Cookie Policy", privacy: "Privacy Policy", terms: "Terms of Use",
    email: "Email INNOTECH", linkedin: "Open INNOTECH on LinkedIn", whatsapp: "Open WhatsApp chat", tableOfContentsHeading: "Table of Contents", relatedNews: "Related News", loadingArticle: "Loading article...", articleNotFound: "Article not found", articleUnavailable: "The requested article is not available yet.", searchLabel: "Search", noInsights: "No insights match your search.", loadingPartner: "Loading partner...", partnerNotFound: "Partner not found", capabilities: "OUR CAPABILITIES", reportStore: "Report Store", goToStore: "Go to store", viewProject: "View Project",
  },
  ar: {
    loading: "جارٍ التحميل", readMore: "اقرأ المزيد", menu: "القائمة", whoWeAre: "من نحن", whatWeDo: "ماذا نقدم",
    whatWeThink: "رؤيتنا", academy: "أكاديمية INLEARN", store: "متجر INSIGHT",
    services: "الخدمات", industries: "القطاعات", searchPlaceholder: "ابحث في الخدمات والقطاعات والشركاء والمقالات والصفحات",
    clearSearch: "مسح البحث", search: "بحث", noResults: "لم يتم العثور على نتائج لـ:", openSearch: "فتح البحث", openMenu: "فتح القائمة", closeMenu: "إغلاق القائمة",
    lightMode: "التبديل إلى الوضع الفاتح", darkMode: "التبديل إلى الوضع الداكن", contactUs: "تواصل معنا",
    previousCard: "البطاقة السابقة", nextCard: "البطاقة التالية", goToCard: "الانتقال إلى البطاقة", close: "إغلاق",
    closeModal: "إغلاق النافذة", tableOfContents: "جدول المحتويات", breadcrumb: "مسار التنقل",
    gdpr: "اللائحة العامة لحماية البيانات", cookies: "سياسة ملفات الارتباط", privacy: "سياسة الخصوصية", terms: "شروط الاستخدام",
    email: "مراسلة INNOTECH", linkedin: "فتح صفحة INNOTECH على لينكدإن", whatsapp: "فتح محادثة واتساب", tableOfContentsHeading: "جدول المحتويات", relatedNews: "أخبار ذات صلة", loadingArticle: "جارٍ تحميل المقال...", articleNotFound: "المقال غير موجود", articleUnavailable: "المقال المطلوب غير متاح بعد.", searchLabel: "بحث", noInsights: "لا توجد رؤى تطابق بحثك.", loadingPartner: "جارٍ تحميل صفحة الشريك...", partnerNotFound: "الشريك غير موجود", capabilities: "قدراتنا", reportStore: "متجر التقارير", goToStore: "الانتقال إلى المتجر", viewProject: "عرض المشروع",
  },
  tr: {
    loading: "Yükleniyor", readMore: "Devamını oku", menu: "Menü", whoWeAre: "Biz kimiz", whatWeDo: "Ne yapıyoruz",
    whatWeThink: "Ne düşünüyoruz", academy: "INLEARN Akademi", store: "INSIGHT Mağazası",
    services: "Hizmetler", industries: "Sektörler", searchPlaceholder: "hizmetlerde, sektörlerde, iş ortaklarında, makalelerde ve sayfalarda ara",
    clearSearch: "Aramayı temizle", search: "Ara", noResults: "Şunun için sonuç bulunamadı:", openSearch: "Aramayı aç", openMenu: "Menüyü aç", closeMenu: "Menüyü kapat",
    lightMode: "Açık moda geç", darkMode: "Koyu moda geç", contactUs: "bize ulaşın",
    previousCard: "Önceki kart", nextCard: "Sonraki kart", goToCard: "Karta git", close: "Kapat",
    closeModal: "Pencereyi kapat", tableOfContents: "İçindekiler", breadcrumb: "İçerik yolu",
    gdpr: "GDPR", cookies: "Çerez Politikası", privacy: "Gizlilik Politikası", terms: "Kullanım Koşulları",
    email: "INNOTECH'e e-posta gönder", linkedin: "INNOTECH LinkedIn sayfasını aç", whatsapp: "WhatsApp sohbetini aç", tableOfContentsHeading: "İçindekiler", relatedNews: "İlgili Haberler", loadingArticle: "Makale yükleniyor...", articleNotFound: "Makale bulunamadı", articleUnavailable: "İstenen makale henüz mevcut değil.", searchLabel: "Ara", noInsights: "Aramanızla eşleşen içgörü yok.", loadingPartner: "İş ortağı sayfası yükleniyor...", partnerNotFound: "İş ortağı bulunamadı", capabilities: "YETKİNLİKLERİMİZ", reportStore: "Rapor Mağazası", goToStore: "Mağazaya git", viewProject: "Projeyi Görüntüle",
  },
};

export function t(key) {
  return messages[getActiveLocale()]?.[key] ?? messages.en[key] ?? key;
}
