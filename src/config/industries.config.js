import {hero as automotiveHero} from "../features/what-we-do/industries/automotive/automotive.assets.js";
import {insightBottom as automotiveInsightBottom} from "../features/what-we-do/industries/automotive/automotive.assets.js";
import {insightFeatured as automotiveInsightLeft} from "../features/what-we-do/industries/automotive/automotive.assets.js";
import {insightTop as automotiveInsightTop} from "../features/what-we-do/industries/automotive/automotive.assets.js";
import {hero as energyHero} from "../features/what-we-do/industries/energy-and-materials/energy-and-materials.assets.js";
import {insightBottom as energyInsightBottom} from "../features/what-we-do/industries/energy-and-materials/energy-and-materials.assets.js";
import {insightFeatured as energyInsightLeft} from "../features/what-we-do/industries/energy-and-materials/energy-and-materials.assets.js";
import {insightTop as energyInsightTop} from "../features/what-we-do/industries/energy-and-materials/energy-and-materials.assets.js";
import {hero as healthHero} from "../features/what-we-do/industries/health/health.assets.js";
import {insightBottom as healthInsightBottom} from "../features/what-we-do/industries/health/health.assets.js";
import {insightFeatured as healthInsightLeft} from "../features/what-we-do/industries/health/health.assets.js";
import {insightTop as healthInsightTop} from "../features/what-we-do/industries/health/health.assets.js";
import {hero as highTechHero} from "../features/what-we-do/industries/high-tech/high-tech.assets.js";
import {insightBottom as highTechInsightBottom} from "../features/what-we-do/industries/high-tech/high-tech.assets.js";
import {insightFeatured as highTechInsightLeft} from "../features/what-we-do/industries/high-tech/high-tech.assets.js";
import {insightTop as highTechInsightTop} from "../features/what-we-do/industries/high-tech/high-tech.assets.js";
import {hero as metalsHero} from "../features/what-we-do/industries/metals-and-mining/metals-and-mining.assets.js";
import {insightBottom as metalsInsightBottom} from "../features/what-we-do/industries/metals-and-mining/metals-and-mining.assets.js";
import {insightFeatured as metalsInsightLeft} from "../features/what-we-do/industries/metals-and-mining/metals-and-mining.assets.js";
import {insightTop as metalsInsightTop} from "../features/what-we-do/industries/metals-and-mining/metals-and-mining.assets.js";
import {ecosystemImages, expertImages} from "../shared/data/partner-assets.js";

const {brightidea, idc} = ecosystemImages;
const {itonics, itonicsPartner, statista, statistaLight, trex} = expertImages;

export const industryConfig = {
  automotive: {
    hero: {image: automotiveHero},
    liveInsights: {
      cards: {
        "automotive-featured": {image: automotiveInsightLeft},
        "automotive-top": {image: automotiveInsightTop},
        "automotive-bottom": {image: automotiveInsightBottom},
      },
    },
    ecosystemCards: {
      trex: {image: trex},
      itonics: {
        image: itonics,
        imageLight: itonicsPartner,
        imageClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
        imageLightClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
      },
      statista: {
        image: statista,
        imageLight: statistaLight,
        imageClassName: "scale-[1] translate-y-[17px]",
        imageLightClassName: "scale-[1] translate-y-[2px]",
      },
    },
  },
  "energy-and-materials": {
    hero: {image: energyHero},
    liveInsights: {
      cards: {
        "energy-featured": {image: energyInsightLeft},
        "energy-top": {image: energyInsightTop},
        "energy-bottom": {image: energyInsightBottom},
      },
    },
    ecosystemCards: {
      itonics: {
        image: itonics,
        imageLight: itonicsPartner,
        imageClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
        imageLightClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
      },
      brightidea: {image: brightidea},
      idc: {image: idc},
    },
  },
  health: {
    hero: {image: healthHero},
    liveInsights: {
      cards: {
        "health-featured": {image: healthInsightLeft},
        "health-top": {image: healthInsightTop},
        "health-bottom": {image: healthInsightBottom},
      },
    },
    ecosystemCards: {
      statista: {
        image: statista,
        imageLight: statistaLight,
        imageClassName: "scale-[1] translate-y-[20px]",
        imageLightClassName: "scale-[1] translate-y-[2px]",
      },
      itonics: {
        image: itonics,
        imageLight: itonicsPartner,
        imageClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
        imageLightClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
      },
      trex: {image: trex},
    },
  },
  "high-tech": {
    hero: {image: highTechHero},
    liveInsights: {
      cards: {
        "tech-featured": {image: highTechInsightLeft},
        "tech-top": {
          image: highTechInsightTop,
          imageClassName: "object-left",
        },
        "tech-bottom": {image: highTechInsightBottom},
      },
    },
    ecosystemCards: {
      idc: {image: idc},
      itonics: {
        image: itonics,
        imageLight: itonicsPartner,
        imageClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
        imageLightClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
      },
      brightidea: {image: brightidea},
    },
  },
  "metals-and-mining": {
    hero: {image: metalsHero},
    liveInsights: {
      cards: {
        "metals-featured": {image: metalsInsightLeft},
        "metals-top": {image: metalsInsightTop},
        "metals-bottom": {image: metalsInsightBottom},
      },
    },
    ecosystemCards: {
      idc: {image: idc},
      itonics: {
        image: itonics,
        imageLight: itonicsPartner,
        imageClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
        imageLightClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
      },
      brightidea: {image: brightidea},
    },
  },
};
