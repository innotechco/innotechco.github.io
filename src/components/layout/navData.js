import navigationContent from "../../content/en/navigation.json";
import {navigationConfig} from "../../config/navigation.config";
import {routes} from "../../routes";

const searchRoutes = {
  "Who we are": routes.whoWeAre,
  "What we do": routes.inception,
  "What we think": routes.whatWeThink,
  "INLEARN Academy": routes.inlearnAcademy,
  "INSIGHT Store": routes.insight,
  "Innovation and Technology Management": routes.inception,
  "Digital Transformation Report": routes.infinity,
  "Market Analytics Report": routes.insight,
};

export const searchItems = navigationContent.searchItems.map((item) => ({
  ...item,
  to: searchRoutes[item.title] ?? routes.home,
}));
export const languageOptions = navigationContent.languageOptions;
export const serviceMenuItems = navigationContent.serviceMenuItems.map((item) => ({
  ...item,
  to: navigationConfig.serviceRoutes[item.id],
}));
export const industryMenuItems = navigationContent.industryMenuItems.map(
  (item) => ({
    ...item,
    to: navigationConfig.industryRoutes[item.id],
  }),
);
