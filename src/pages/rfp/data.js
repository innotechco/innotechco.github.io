import {localizedModule} from "../../i18n/locale";

const rfpModules = import.meta.glob("../../content/{en,ar,tr}/rfp.json", {
  eager: true,
  import: "default",
});

export function getRfpContent() {
  return localizedModule(rfpModules, "../../content/en/rfp.json");
}
