import CareersImage from "../../assets/images/who-we-are/Careers.png";
import CirclePlayIcon from "../../assets/images/who-we-are/CirclePlay.svg";
import BackgroundMiddleLight from "../../assets/images/who-we-are/background/WhoWeAreExcludeMiddle.png";
import BackgroundTopLight from "../../assets/images/who-we-are/background/WhoWeAreExcludeTop.png";
import BackgroundTop2Light from "../../assets/images/who-we-are/background/WhoWeAreExcludeTop2.png";
import BackgroundTopDark from "../../assets/images/who-we-are/background/WhoWeAreExcludeTopBlack.png";
import BackgroundTop2Dark from "../../assets/images/who-we-are/background/WhoWeAreExcludeTopBlack2.png";
import BackgroundMiddleDark from "../../assets/images/who-we-are/background/WhoWeAreExcludeTopMiddle.png";
import HistoryCurve from "../../assets/images/who-we-are/HistoryCurve.png";
import HistoryCurveLight from "../../assets/images/who-we-are/HistoryCurveLight.png";
import OurExpertPerson from "../../assets/images/who-we-are/OurExpertPerson.png";
import WindTurbines from "../../assets/images/who-we-are/WindTurbines.png";
import CubeIcon from "../../assets/images/who-we-are/stats/CubeIcon.png";
import DealHandshake from "../../assets/images/who-we-are/stats/DealHandshake.png";
import EmployeesIcon from "../../assets/images/who-we-are/stats/EmployeesIcon.png";
import FactoryIcon from "../../assets/images/who-we-are/stats/FactoryIcon.png";

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

export const stats = [EmployeesIcon, FactoryIcon, DealHandshake, CubeIcon];

export const experts = Array.from({length: 6}, (_, index) => ({
  id: index,
  name: "Golam reza Jamshidi",
  role: "CEO of Nouri Petrochemical Company",
}));
