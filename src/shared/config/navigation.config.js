import {routes} from "../../app/routes.js";

export const navigationConfig = {
  serviceRoutes: {
    inception: routes.inception,
    insight: routes.insight,
    infinity: routes.infinity,
  },
  industryRoutes: {
    automotive: routes.automotive,
    energyAndMaterials: routes.energyAndMaterials,
    health: routes.health,
    highTech: routes.highTech,
    metalsAndMining: routes.metalsAndMining,
  },
};
