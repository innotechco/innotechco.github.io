import CareersImage from "../shared/assets/images/careers.webp";
import {circlePlay as CirclePlayIcon} from "../features/who-we-are/who-we-are.assets.js";
import {decorationsMiddleLight as BackgroundMiddleLight} from "../features/who-we-are/who-we-are.assets.js";
import {decorationsTopLight as BackgroundTopLight} from "../features/who-we-are/who-we-are.assets.js";
import {decorationsTopSecondaryLight as BackgroundTop2Light} from "../features/who-we-are/who-we-are.assets.js";
import {decorationsTopDark as BackgroundTopDark} from "../features/who-we-are/who-we-are.assets.js";
import {decorationsTopSecondaryDark as BackgroundTop2Dark} from "../features/who-we-are/who-we-are.assets.js";
import {decorationsMiddleDark as BackgroundMiddleDark} from "../features/who-we-are/who-we-are.assets.js";
import {historyCurve as HistoryCurve} from "../features/who-we-are/who-we-are.assets.js";
import {historyCurveLight as HistoryCurveLight} from "../features/who-we-are/who-we-are.assets.js";
import InceptionIcon from "../shared/assets/brand/services/inception.svg";
import {innotechisin as WindTurbines} from "../features/who-we-are/who-we-are.assets.js";
import {iconsCubeIcon as CubeIcon} from "../features/who-we-are/who-we-are.assets.js";
import {iconsDealHandshake as DealHandshake} from "../features/who-we-are/who-we-are.assets.js";
import {iconsEmployeesIcon as EmployeesIcon} from "../features/who-we-are/who-we-are.assets.js";
import {iconsFactoryIcon as FactoryIcon} from "../features/who-we-are/who-we-are.assets.js";

export const whoWeAreConfig = {
  images: {
    backgroundMiddleDark: BackgroundMiddleLight,
    backgroundMiddleLight: BackgroundMiddleDark,
    backgroundTopDark: BackgroundTopLight,
    backgroundTopLight: BackgroundTopDark,
    backgroundTop2Dark: BackgroundTop2Light,
    backgroundTop2Light: BackgroundTop2Dark,
    careers: CareersImage,
    circlePlay: CirclePlayIcon,
    historyDark: HistoryCurve,
    historyLight: HistoryCurveLight,
    expert: InceptionIcon,
    intro: WindTurbines,
  },
  stats: {
    "experts-primary": {icon: EmployeesIcon},
    "experts-secondary": {icon: FactoryIcon},
    partners: {icon: DealHandshake},
    program: {icon: CubeIcon},
  },
};
