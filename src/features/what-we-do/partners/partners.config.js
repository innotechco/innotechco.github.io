import archeryIcon from "../../../shared/assets/partners/cards/archery.svg";
import excludeDark from "../../../shared/assets/partners/backgrounds/partner-stats-exclude.png";
import excludeLight from "../../../shared/assets/partners/backgrounds/partner-stats-exclude-black.png";
import heroImage from "../../../shared/assets/partners/backgrounds/partner-intro-image.webp";
import circleIcon from "../../../shared/assets/partners/circles/circles.webp";
import globeIcon from "../../../shared/assets/partners/cards/globe.svg";
import puzzleIcon from "../../../shared/assets/partners/cards/puzzle.svg";
import {allentiaAssets} from "./allentia/allentia.content.js";
import {brightideaAssets} from "./brightidea/brightidea.content.js";
import {gartnerAssets} from "./gartner/gartner.content.js";
import {idcAssets} from "./idc/idc.content.js";
import {itonicsAssets} from "./itonics/itonics.content.js";
import {leanAssets} from "./lean/lean.content.js";
import {lensorgAssets} from "./lensorg/lensorg.content.js";
import {marketResearchAssets} from "./market-research/market-research.content.js";
import {randMAssets} from "./r-and-m/r-and-m.content.js";
import {sharjahAssets} from "./sharjah/sharjah.content.js";
import {startinAssets} from "./startin/startin.content.js";
import {statistaAssets} from "./statista/statista.content.js";
import {trexAssets} from "./trex/trex.content.js";

const sharedAssets = {
  cardIcons: {archery: archeryIcon, globe: globeIcon, puzzle: puzzleIcon},
  circleIcon,
  excludeDark,
  excludeLight,
  heroImage,
};

const withSharedAssets = (assets) => ({...sharedAssets, ...assets});

export const partnerConfig = {
  allentia: {assets: withSharedAssets(allentiaAssets)},
  brightidea: {assets: withSharedAssets(brightideaAssets)},
  gartner: {assets: withSharedAssets(gartnerAssets)},
  idc: {assets: withSharedAssets(idcAssets)},
  itonics: {assets: withSharedAssets(itonicsAssets)},
  lean: {assets: withSharedAssets(leanAssets)},
  lensorg: {assets: withSharedAssets(lensorgAssets)},
  "market-research": {assets: withSharedAssets(marketResearchAssets)},
  "r-and-m": {assets: withSharedAssets(randMAssets)},
  sharjah: {assets: withSharedAssets(sharjahAssets)},
  startin: {assets: withSharedAssets(startinAssets)},
  statista: {assets: withSharedAssets(statistaAssets)},
  trex: {assets: withSharedAssets(trexAssets)},
};
