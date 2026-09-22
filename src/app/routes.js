export const routes = {
  home: "/",
  inlearnAcademy: "/inlearn",
  inlearnCourses: "/inlearn/courses",
  inlearnCourse: "/inlearn/courses/:slug",
  inlearnBasket: "/inlearn/basket",
  inlearnCheckout: "/inlearn/checkout",
  /* Everything behind signing in. "dashboard" rather than "profile" because
     Profile is one of the five sections inside it, and a path that names one
     of its own children is a path that has to be explained every time. */
  inlearnDashboard: "/inlearn/dashboard",
  inlearnDashboardBill: "/inlearn/dashboard/bill",
  inlearnDashboardCourses: "/inlearn/dashboard/courses",
  inlearnDashboardSave: "/inlearn/dashboard/save",
  inlearnDashboardProfile: "/inlearn/dashboard/profile",
  archives: "/archives",
  whatWeThink: "/what-we-think",
  whoWeAre: "/who-we-are",
  rfp: "/request-for-proposal",
  article: "/articles/:slug",
  articles: "/articles",
  partner: "/what-we-do/partners/:slug",
  partners: "/what-we-do/partners",
  inception: "/what-we-do/inception",
  insight: "/what-we-do/insight",
  infinity: "/what-we-do/infinity",
  automotive: "/automotive",
  energyAndMaterials: "/energy-and-materials",
  health: "/health",
  highTech: "/high-tech",
  metalsAndMining: "/metals-and-mining",
};

export const serviceRoutes = [
  routes.inception,
  routes.insight,
  routes.infinity,
];

export const industryRoutes = [
  routes.automotive,
  routes.energyAndMaterials,
  routes.health,
  routes.highTech,
  routes.metalsAndMining,
];
