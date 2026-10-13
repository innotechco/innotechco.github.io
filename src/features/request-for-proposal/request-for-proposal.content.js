import {localizedModule} from "../../shared/i18n/locale.js";

const rfpModules = import.meta.glob("../../content/en/rfp.json", {
  eager: true,
  import: "default",
});

export function getRfpContent() {
  return localizedModule(rfpModules, "../../content/en/rfp.json");
}
