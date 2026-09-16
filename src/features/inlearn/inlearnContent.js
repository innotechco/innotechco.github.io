/* Reads the copy for the language in use and hands back one object per page.

   import.meta.glob with eager: true is what makes this work on static hosting:
   Vite resolves every locale at build time, so the three translations ship as
   part of the bundle and no request has to succeed for the page to have words.

   localizedModule falls back to English when a translation is missing, so a
   half-translated locale shows English sentences rather than blank space. */

import {localizedModule} from "../../shared/i18n/locale.js";
import {inlearnConfig} from "./inlearn.config.js";

export function getInlearnFirstPage() {
  const modules = import.meta.glob("../../content/{en,ar,tr}/pages/inlearn/*.json", {
    eager: true,
    import: "default",
  });
  const page = localizedModule(modules, "../../content/en/pages/inlearn/first-page.json");

  return {
    ...page,
    decorations: inlearnConfig.firstPage.decorations,
    decorationsOnPhone: inlearnConfig.firstPage.decorationsOnPhone,
  };
}
