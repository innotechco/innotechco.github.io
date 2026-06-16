import automotiveHero from "../../../../assets/images/industries/automotive/automotive.webp";
import bottomRightInsightImage from "../../../../assets/images/industries/automotive/BottomRight.webp";
import leftInsightImage from "../../../../assets/images/industries/automotive/left.webp";
import topRightInsightImage from "../../../../assets/images/industries/automotive/TopRight.webp";
import {expertImages} from "../../../../assets/images/shared";

const {
  itonics: itonicsImage,
  statista: statistaImage,
  statistaLight: statistaLightImage,
  trex: trexImage,
} = expertImages;

export const hero = {
  image: automotiveHero,
  breadcrumbLabel: "Automotive",
  title: "Automotive",
  description:
    "Accelerate intelligent mobility transformation across automotive manufacturing, connected vehicle ecosystems, smart mobility infrastructures, and AI-enabled engineering systems through predictive technology analytics and scalable digital architectures.",
};

export const accelerationParagraphs = [
  "Automotive manufacturers and mobility ecosystems face accelerating platform disruption, fragmented operational infrastructures, and rising intelligent systems complexity. Advancing automotive modernization requires connected mobility architectures, AI-enabled operations, and scalable digital engineering ecosystems.",
  "Maximize mobility resilience through enterprise consulting for OEMs, smart mobility operators, automotive suppliers, and intelligent transportation ecosystems. Our specialized frameworks deploy predictive automotive analytics, digital mobility infrastructures, and AI-enabled transformation systems to accelerate scalable operational modernization.",
];

export const capabilities = [
  {
    title: "Mobility Systems (Connection)",
    description:
      "We engineer connected mobility ecosystems integrating intelligent transportation systems, predictive automotive analytics, operational orchestration, and AI-enabled engineering infrastructures across distributed vehicle environments.",
  },
  {
    title: "Vehicle Analytics (Forecasting)",
    description:
      "Our technology intelligence frameworks analyze mobility patents, automotive innovation systems, connected vehicle technologies, and transportation infrastructure signals to strengthen strategic automotive foresight.",
  },
  {
    title: "Smart Platforms (Infrastructure)",
    description:
      "The energy transition is one of the world’s greatest collective challenges. BCG develops solutions with clients by integrating financial, technological, economical, and societal considerations to ensure a just energy transition.",
  },
  {
    title: "Innovation Governance (Transformation)",
    description:
      "We deploy end-to-end innovation management systems integrating automotive modernization frameworks, digital governance architectures, and AI-enabled mobility transformation ecosystems.",
  },
  {
    title: "Engineering Intelligence (Automation)",
    description:
      "The INFINITY platform automates mobility documentation workflows, automotive technology monitoring, engineering intelligence mapping, and connected systems analytics to accelerate enterprise automotive modernization.",
  },
];

export const liveInsights = {
  title: "LIVE MOBILITY INSIGHTS",
  alt: "Live mobility insights",
  cards: [
    {
      id: "automotive-featured",
      image: leftInsightImage,
      title: "Engine Technologies For Improving Fuel Efficiency",
      date: "June 4, 2026",
      readTime: "2 minutes read",
      description:
        "Toyota Motor Co has the largest number of highly-cited patents, which is a sign of the high value of this company's patents. The main themes of the patents represent the thematic focus of patents on areas such as injection , fuel , gas , exhust , engine , pressure.",
    },
    {
      id: "automotive-top",
      image: topRightInsightImage,
      title: "Ford Intelligent Mobility Ecosystem",
      date: "June 4, 2026",
      readTime: "2 minutes read",
      description:
        "The Ford Intelligent Mobility Ecosystem's primary innovation lies in its integrated approach to urban mobility.",
    },
    {
      id: "automotive-bottom",
      image: bottomRightInsightImage,
      title: "Hyundai Hydrogen Mobility Review",
      date: "November 15, 2025",
      readTime: "2 minutes read",
      description:
        "Hyundai integrates vehicle technology, infrastructure, and energy partnerships to drive hydrogen mobility",
    },
  ],
};

export const ecosystemCards = [
  {
    id: "trex",
    image: trexImage,
    title: "Achieve 60% reduction in energy use ",
    subtitle: "trex Smart Station",
  },
  {
    id: "itonics",
    image: itonicsImage,
    title: "Automotive industry trends 2026",
    imageClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
    subtitle: "ITONICS Automotive Industry Trends",
  },
  {
    id: "statista",
    image: statistaImage,
    imageLight: statistaLightImage,
    imageClassName: "scale-[1] translate-y-[17px]",
    imageLightClassName: "scale-[1] translate-y-[2px]",
    title: "Global Transportation ",
    subtitle: "Copyrighted collaborative data ",
  },
];
