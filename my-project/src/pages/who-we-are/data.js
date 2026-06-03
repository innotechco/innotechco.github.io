import CareersImage from "../../assets/images/who-we-are/Careers.png";
import CirclePlayIcon from "../../assets/images/who-we-are/CirclePlay.svg";
import BackgroundMiddleLight from "../../assets/images/excludes/who-we-are/WhoWeAreExcludeMiddle.png";
import BackgroundTopLight from "../../assets/images/excludes/who-we-are/WhoWeAreExcludeTop.png";
import BackgroundTop2Light from "../../assets/images/excludes/who-we-are/WhoWeAreExcludeTop2.png";
import BackgroundTopDark from "../../assets/images/excludes/who-we-are/WhoWeAreExcludeTopBlack.png";
import BackgroundTop2Dark from "../../assets/images/excludes/who-we-are/WhoWeAreExcludeTopBlack2.png";
import BackgroundMiddleDark from "../../assets/images/excludes/who-we-are/WhoWeAreExcludeTopMiddle.png";
import HistoryCurve from "../../assets/images/who-we-are/HistoryCurve.png";
import HistoryCurveLight from "../../assets/images/who-we-are/HistoryCurveLight.png";
import OurExpertPerson from "../../assets/images/who-we-are/OurExpertPerson.png";
import WindTurbines from "../../assets/images/who-we-are/WindTurbines.png";
import CubeIcon from "../../assets/images/who-we-are/stats/CubeIcon.svg";
import DealHandshake from "../../assets/images/who-we-are/stats/DealHandshake.svg";
import EmployeesIcon from "../../assets/images/who-we-are/stats/EmployeesIcon.svg";
import FactoryIcon from "../../assets/images/who-we-are/stats/FactoryIcon.svg";

export const whoWeAreImages = {
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
  expert: OurExpertPerson,
  intro: WindTurbines,
};

export const stats = [
  {
    id: "experts-primary",
    icon: EmployeesIcon,
    label: "Expert",
    value: 35,
  },
  {
    id: "experts-secondary",
    icon: FactoryIcon,
    label: "Expert",
    value: 20,
  },
  {
    id: "partners",
    icon: DealHandshake,
    label: "partners",
    value: 32,
  },
  {
    id: "program",
    icon: CubeIcon,
    label: "Program",
    value: 20,
  },
];

export const experts = Array.from({length: 6}, (_, index) => ({
  id: index,
  name: "Golam reza Jamshidi",
  role: "CEO of Nouri Petrochemical Company",
}));
