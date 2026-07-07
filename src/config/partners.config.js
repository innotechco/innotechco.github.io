import archeryIcon from "../assets/images/partners/shared/cards/archery.svg";
import excludeDark from "../assets/images/partners/shared/backgrounds/PartnerStatsExclude.png";
import excludeLight from "../assets/images/partners/shared/backgrounds/PartnerStatsExcludeBlack.png";
import heroImage from "../assets/images/partners/shared/backgrounds/PartnerIntroImage.webp";
import circleIcon from "../assets/images/partners/shared/circles/circles.webp";
import globeIcon from "../assets/images/partners/shared/cards/globe.svg";
import puzzleIcon from "../assets/images/partners/shared/cards/puzzle.svg";
import {allentiaAssets} from "../pages/what-we-do/services/partners/allentia/data";
import {brightideaAssets} from "../pages/what-we-do/services/partners/brightidea/data";
import {gartnerAssets} from "../pages/what-we-do/services/partners/gartner/data";
import {idcAssets} from "../pages/what-we-do/services/partners/idc/data";
import {itonicsAssets} from "../pages/what-we-do/services/partners/itonics/data";
import {leanAssets} from "../pages/what-we-do/services/partners/lean/data";
import {lensorgAssets} from "../pages/what-we-do/services/partners/lensorg/data";
import {marketResearchAssets} from "../pages/what-we-do/services/partners/market-research/data";
import {randMAssets} from "../pages/what-we-do/services/partners/r-and-m/data";
import {sharjahAssets} from "../pages/what-we-do/services/partners/sharjah/data";
import {startinAssets} from "../pages/what-we-do/services/partners/startin/data";
import {statistaAssets} from "../pages/what-we-do/services/partners/statista/data";
import {trexAssets} from "../pages/what-we-do/services/partners/trex/data";

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
