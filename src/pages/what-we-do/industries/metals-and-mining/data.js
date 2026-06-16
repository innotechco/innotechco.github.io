import metalsHero from "../../../../assets/images/industries/metals-and-mining/metalsandmining.webp";
import metalsInsightLeft from "../../../../assets/images/industries/metals-and-mining/metalsandmining1.webp";
import metalsInsightTop from "../../../../assets/images/industries/metals-and-mining/metalsandmining2.webp";
import metalsInsightBottom from "../../../../assets/images/industries/metals-and-mining/metalsandmining3.webp";
import {ecosystemImages, expertImages} from "../../../../assets/images/shared";

const {brightidea: BrightIdea, idc: IDC} = ecosystemImages;
const {itonics: itonicsImage} = expertImages;

export const hero = {
  image: metalsHero,
  breadcrumbLabel: "Metals and Mining",
  title: "Metals and Mining",
  description:
    "Drive intelligent mining transformation across steel, alumina, minerals, and extraction ecosystems through AI-enabled industrial analytics, technology roadmapping, operational modernization, and predictive infrastructure intelligence.",
};

export const accelerationParagraphs = [
  "Mining operators and metals enterprises face rising extraction complexity, fragmented operational systems, and volatile industrial transitions. Advancing mining modernization requires integrated innovation management, digital mining intelligence, and scalable transformation architectures across distributed industrial assets.",
  "Maximize industrial resilience through enterprise mining consulting for steel producers, mineral operators, alumina systems, and industrial holdings. Our specialized consulting frameworks deploy technology analytics, operational intelligence, and AI-enabled transformation systems to accelerate sustainable metals modernization.",
];

export const capabilities = [
  {
    title: "Innovation Systems (Governance)",
    description:
      "The energy transition is one of the world’s greatest collective challenges. BCG develops solutions with clients by integrating financial, technological, economical, and societal considerations to ensure a just energy transition.",
  },
  {
    title: "Mining Analytics (Forecasting)",
    description:
      "Our technology analytics engines monitor industrial patents, extraction technologies, metallurgy innovation, and mineral infrastructure signals to strengthen mining foresight and strategic operational positioning.",
  },
  {
    title: "Digital Operations (Automation)",
    description:
      "We engineer AI-enabled mining infrastructures integrating operational dashboards, industrial automation, predictive maintenance systems, and connected extraction intelligence across distributed mining environments.",
  },
  {
    title: "Technology Roadmaps (Planning)",
    description:
      "We develop mining transformation roadmaps aligning industrial modernization priorities, digital infrastructure investments, and technology transition pathways across metals and mineral ecosystems.",
  },
  {
    title: "Industrial Intelligence (Enhancement)",
    description:
      "The INFINITY platform automates mining documentation workflows, operational monitoring, industrial intelligence mapping, and extraction analytics to accelerate enterprise-level industrial decision environments.",
  },
];

export const liveInsights = {
  title: "LIVE METALS INSIGHTS",
  alt: "Live metals insights",
  cards: [
    {
      id: "metals-featured",
      image: metalsInsightLeft,
      title: "Smart Carbon Technology",
      date: "June 4, 2026",
      readTime: "2 minutes read",
      description:
        "The future of Smart Carbon looks promising, especially as global pressure to decarbonize intensifies. ArcelorMittal plans to scale this technology across its global operations, targeting reductions of up to 30% in CO2 emissions by 2030.",
    },
    {
      id: "metals-top",
      image: metalsInsightTop,
      title: "Digital Transformation in Steel Industry",
      date: "June 4, 2026",
      readTime: "2 minutes read",
      description:
        "The number of inventions in DT have increased eleven times over the last 20 years, which is much higher than the general growth any other key topic.",
    },
    {
      id: "metals-bottom",
      image: metalsInsightBottom,
      title: "Green Steel Transition",
      date: "November 15, 2025",
      readTime: "2 minutes read",
      description:
        "Steel operators are accelerating decarbonization initiatives through hydrogen-integrated production systems, industrial intelligence frameworks, and predictive metallurgy optimization infrastructures.",
    },
  ],
};

export const ecosystemCards = [
  {
    id: "idc",
    image: IDC,
    title: "Manufacturing Aluminum Composite Panels",
    subtitle: "IDC Metal Industries",
  },
  {
    id: "itonics",
    image: itonicsImage,
    title: "Minerals and mining",
    imageClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
    subtitle: "The complete list of all 160+ trends",
  },
  {
    id: "brightidea",
    image: BrightIdea,
    title: "The case of John Deere",
    subtitle: "Innovation Cloud in heavy equipment",
  },
];
