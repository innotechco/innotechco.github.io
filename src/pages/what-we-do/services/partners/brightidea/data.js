import logo from "../../../../../shared/assets/brand/partners/brightidea/logo.svg";
import {hero as heroImage} from "../../../../../features/what-we-do/partners/brightidea/brightidea.assets.js";
import Idea from "../../../../../shared/assets/partners/cards/idea.svg";
import ProgramIcon from "../../../../../shared/assets/partners/cards/program-icon.svg";
import Rocket from "../../../../../shared/assets/partners/cards/rocket.svg";
import Transformation from "../../../../../shared/assets/partners/cards/transformation.svg";
import archery from "../../../../../shared/assets/partners/cards/transformation.svg";
import ecosystem from "../../../../../shared/assets/partners/cards/ecosystem.svg";

export const brightideaAssets = {
  darkLogoClassName: "brightness-0 invert",
  lightLogoClassName: "brightness-0",
  logo,
  heroImage,
  cardIcons: {
    Idea: Idea,
    Program: ProgramIcon,
    Hackathon: Rocket,
    Transformation: Transformation,
    Labs: archery,
    Ecosystem: ecosystem
  },
};