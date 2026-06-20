import inceptionIcon from "../assets/icons/Inception-Icon 1.svg";
import infinityIcon from "../assets/icons/Subtract.svg";
import insightIcon from "../assets/icons/Subtract2.svg";
import {partnerImages} from "../assets/images/shared";

export const serviceConfig = {
  inception: {
    partners: {
      itonics: {image: partnerImages.itonics},
      brightidea: {
        image: partnerImages.brightidea,
        imageClassName: "max-h-6 max-w-[150px]",
      },
    },
    showcase: {
      icon: inceptionIcon,
      iconClassName: "translate-x-7 -translate-y-2",
    },
  },
  infinity: {
    partners: {
      trex: {
        image: partnerImages.trex,
        imageClassName: "max-h-15 max-w-[120px]",
      },
      lean: {
        image: partnerImages.lean,
        imageClassName: "max-h-12 max-w-[120px]",
      },
      idc: {
        image: partnerImages.idc,
        imageClassName: "max-h-18 ma-w-[130px] pb-1",
      },
      allentia: {
        image: partnerImages.allentia,
        imageClassName: "max-h-12 max-w-[120px]",
      },
      startin: {
        image: partnerImages.startin,
        imageClassName: "max-h-12 max-w-[120px]",
      },
    },
    showcase: {
      icon: infinityIcon,
      iconClassName: "translate-x-7 -translate-y-2",
    },
  },
  insight: {
    partners: {
      sharjah: {
        image: partnerImages.sharjah,
        imageClassName: "max-h-11 max-w-[137px]",
      },
      itonics: {image: partnerImages.itonics},
      statista: {
        image: partnerImages.statistaOnLight,
        darkImage: partnerImages.statistaOnLight,
        imageClassName: "max-h-10 max-w-[137px]",
      },
      gartner: {image: partnerImages.gartner},
      lensorg: {image: partnerImages.lensorg},
    },
    showcase: {
      icon: insightIcon,
      iconClassName: "translate-x-7 -translate-y-2",
    },
  },
};
