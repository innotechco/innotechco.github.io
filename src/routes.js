export const routes = {
  home: "/",
  inlearnAcademy: "/inlearn-academy",
  archives: "/archives",
  whatWeThink: "/what-we-think",
  whoWeAre: "/who-we-are",
  article: "/articles/:slug",
  articles: "/articles",
  featuredArticle: "/articles/product-portfolio-management",
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
