import {localizedModule} from "../../i18n/locale.js";
import {navigationConfig} from "../../config/navigation.config.js";

/* navigation.json is the only content this module loads eagerly: the navbar
   renders its menus on first paint. Everything the search panel needs lives in
   searchIndex.js and is fetched on demand - keep it that way, or the whole
   content tree lands back in the entry chunk. */
const navigationModules = import.meta.glob("../../../content/{en,ar,tr}/navigation.json", {eager: true, import: "default"});

export const navigationContent = localizedModule(navigationModules, "../../../content/en/navigation.json");

export const languageOptions = [
  {code: "en", label: "EN", name: "English"},
  {code: "tr", label: "TR", name: "Türkçe"},
  {code: "ar", label: "AR", name: "العربية"},
];

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
