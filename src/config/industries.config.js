import automotiveHero from "../assets/images/industries/automotive/automotive.webp";
import automotiveInsightBottom from "../assets/images/industries/automotive/BottomRight.webp";
import automotiveInsightLeft from "../assets/images/industries/automotive/left.webp";
import automotiveInsightTop from "../assets/images/industries/automotive/TopRight.webp";
import energyHero from "../assets/images/industries/energy-and-materials/energyandmaterials.webp";
import energyInsightBottom from "../assets/images/industries/energy-and-materials/energyandmaterials3.webp";
import energyInsightLeft from "../assets/images/industries/energy-and-materials/energyandmaterials1.webp";
import energyInsightTop from "../assets/images/industries/energy-and-materials/energyandmaterials2.webp";
import healthHero from "../assets/images/industries/health/health.webp";
import healthInsightBottom from "../assets/images/industries/health/health3.webp";
import healthInsightLeft from "../assets/images/industries/health/health1.webp";
import healthInsightTop from "../assets/images/industries/health/health2.webp";
import highTechHero from "../assets/images/industries/high-tech/hightech.webp";
import highTechInsightBottom from "../assets/images/industries/high-tech/hightech3.webp";
import highTechInsightLeft from "../assets/images/industries/high-tech/hightech1.webp";
import highTechInsightTop from "../assets/images/industries/high-tech/hightech2.webp";
import metalsHero from "../assets/images/industries/metals-and-mining/metalsandmining.webp";
import metalsInsightBottom from "../assets/images/industries/metals-and-mining/metalsandmining3.webp";
import metalsInsightLeft from "../assets/images/industries/metals-and-mining/metalsandmining1.webp";
import metalsInsightTop from "../assets/images/industries/metals-and-mining/metalsandmining2.webp";
import {ecosystemImages, expertImages} from "../assets/images/shared";

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
