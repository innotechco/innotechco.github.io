import energyHero from "../../../../assets/images/industries/energy-and-materials/energyandmaterials.png";
import energyInsightLeft from "../../../../assets/images/industries/energy-and-materials/energyandmaterials1.png";
import energyInsightTop from "../../../../assets/images/industries/energy-and-materials/energyandmaterials2.jpg";
import energyInsightBottom from "../../../../assets/images/industries/energy-and-materials/energyandmaterials3.jpg";
import {ecosystemImages, expertImages} from "../../../../assets/images/shared";

const {brightidea: BrightIdea, idc: IDC} = ecosystemImages;
const {itonics: itonicsImage} = expertImages;

export const hero = {
  image: energyHero,
  breadcrumbLabel: "Energy And Materials",
  title: "Energy and Materials",
  description:
    "Drive upstream digital transformation. We optimize oil, gas, and petrochemical operations via systemic Innovation Management, predictive Technology Analytics, and actionable Market Analytics to scale energy infrastructure and navigate volatile global asset transitions.",
};

export const accelerationParagraphs = [
  "Complex oil fields and downstream petrochemical facilities face severe infrastructure bottlenecks. Overcoming these operational roadblocks demands unified Innovation Management linking deep engineering research directly to value chain transformation.",
  "Maximize extraction margins. Consulting for enterprise energy corporations with over $4B in combined revenue, our specialized consulting network deploys advanced data architectures to optimize downstream refining assets, streamline supply logistics, and secure market leadership.",
];

export const capabilities = [
  {
    title: "Innovation Management (Optimization)",
    description:
      "Aligning with ISO 56002 protocols, we deploy leading solutions like ITONICS and Brightidea to streamline innovation management processes, track emerging  trends, and accelerate ideation.",
  },
  {
    title: "Technology Analytics (Intelligent Foresight)",
    description:
      "Our rigorous methodology maps complex drilling patents, benchmarks refinery technology, and delivers verified technical scouting across USA, EU, and GCC territories to accelerate executive commercial positioning.",
  },
  {
    title: "Market Research (Landscape Dynamics)",
    description:
      "We analyze massive real datasets, evaluate regional infrastructure hubs, and design bankable feasibility studies to maximize asset profitability for downstream operators.",
  },
  {
    title: "Transformation Architectures (Radar)",
    description:
      "We engineer your entire digital journey from upstream maturity assessments to pipeline roadmap design and cloud system implementation building highly transparent, secure industrial enterprise architectures.",
  },
  {
    title: "AI Automation (Landscape Dynamics) ",
    description:
      "The INFINITY platform automates critical drilling documentation, structures complex geology research, and accelerates technical asset synthesis to drive rapid, data-backed operational decisions.",
  },
];

export const liveInsights = {
  title: "LIVE ENERGY INSIGHTS",
  alt: "Live energy insights",
  cards: [
    {
      id: "energy-featured",
      image: energyInsightLeft,
      title: "Hydrogen Generation from Natural Gas",
      date: "November 15, 2025",
      readTime: "2 minutes read",
      description:
        "The Hydrogen Generation from Natural Gas Patent Landscape Report provides an in-depth patent landscape analysis, covering 3,006 patents from 2010 to 2026, collected across major global jurisdictions.",
    },
    {
      id: "energy-top",
      image: energyInsightTop,
      title: "Polypropylene (PP)",
      date: "November 15, 2025",
      readTime: "2 minutes read",
      description:
        "This market analysis delves into commercial trends in polypropylene, examining global sales volume, market valuations, and growth forecasts.",
    },
    {
      id: "energy-bottom",
      image: energyInsightBottom,
      title: "Peak Shaving by Gas Reservation",
      date: "November 15, 2025",
      readTime: "2 minutes read",
      description:
        "Key industry players such as Daewoo Shipbuilding & Marine and Samsung Heavy Industries (South Korea), ExxonMobil (U.S.), and Chinese companies like CNOOC are pivotal in advancing the field.",
    },
  ],
};

export const ecosystemCards = [
  {
    id: "itonics",
    image: itonicsImage,
    title: "How AI Agents Augment  Innovation Ecosystem",
    subtitle: "A Siemens and ITONICS joint study",
  },
  {
    id: "brightidea",
    image: BrightIdea,
    title: "GE Harnesses Open Innovation",
    subtitle: "A Brightidea success story",
  },
  {
    id: "idc",
    image: IDC,
    title: "Equipment Supply and After-Sales Support",
    subtitle: "Discover how IDC supports its clients",
  },
];
