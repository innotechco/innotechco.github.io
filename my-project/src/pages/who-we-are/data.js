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
import InceptionIcon from "../../assets/icons/Inception-Icon 1.svg";
import WindTurbines from "../../assets/images/who-we-are/Innotechisin.png";
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
  expert: InceptionIcon,
  intro: WindTurbines,
};

export const stats = [
  {
    id: "experts-primary",
    icon: EmployeesIcon,
    label: "Expert",
    value: +32,
  },
  {
    id: "experts-secondary",
    icon: FactoryIcon,
    label: "Industries",
    value: 8,
  },
  {
    id: "partners",
    icon: DealHandshake,
    label: "partners",
    value: +35,
  },
  {
    id: "program",
    icon: CubeIcon,
    label: "Projects Delivered",
    value: +100,
  },
];

export const experts = [
  {
    id: "petrochemical-innovation-system",
    name: "Petrochemical Innovation System",
    role: "2023 | 40+ Complexes",
  },
  {
    id: "national-gas-roadmap",
    name: "National Gas Roadmap",
    role: "2020 | Three Horizons",
  },
  {
    id: "petrochemical-digital-roadmap",
    name: "Petrochemical Digital Roadmap",
    role: "2022 | RDI Integration",
  },
  {
    id: "steel-technology-roadmap",
    name: "Steel Technology Roadmap",
    role: "2021 | Industrial Modernization",
  },
  {
    id: "biotech-priority-matrix",
    name: "Biotech Priority Matrix",
    role: "2023 | MCDM and AHP",
  },
  {
    id: "telecom-process-mapping",
    name: "Telecom Process Mapping",
    role: "2024 | eTOM Alignment",
  },
];
