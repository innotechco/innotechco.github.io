import highTechHero from "../../../../assets/images/industries/high-tech/hightech.webp";
import techInsightLeft from "../../../../assets/images/industries/high-tech/hightech1.webp";
import techInsightTop from "../../../../assets/images/industries/high-tech/hightech2.webp";
import techInsightBottom from "../../../../assets/images/industries/high-tech/hightech3.webp";
import {ecosystemImages, expertImages} from "../../../../assets/images/shared";

const {brightidea: BrightIdea, idc: IDC} = ecosystemImages;
const {itonics: itonicsImage} = expertImages;

export const hero = {
  image: highTechHero,
  breadcrumbLabel: "High Tech",
  title: "High Tech",
  description:
    "Accelerate intelligent digital transformation across AI ecosystems, software infrastructures, cloud platforms, automation systems, and advanced computing environments through predictive technology analytics and scalable innovation architectures.",
};

export const accelerationParagraphs = [
  "High tech enterprises and AI-native organizations face accelerating infrastructure complexity, fragmented innovation systems, and continuous platform disruption. Advancing enterprise modernization requires intelligent digital architectures, AI-enabled operations, and scalable technology governance across distributed ecosystems.",
  "Maximize technology resilience through enterprise consulting for AI firms, cloud platforms, software ecosystems, semiconductor operators, and intelligent infrastructure providers. Our specialized frameworks deploy predictive technology analytics, digital transformation systems, and innovation intelligence to accelerate scalable high-tech modernization.",
];

export const capabilities = [
  {
    title: "AI Systems (Automation)",
    description:
      "We engineer AI-enabled operational ecosystems integrating intelligent agents, enterprise automation, predictive analytics, and scalable orchestration architectures across distributed digital infrastructures.",
  },
  {
    title: "Cloud Architectures (Infrastructure)",
    description:
      "We design enterprise cloud infrastructures integrating interoperable software systems, connected digital environments, scalable data orchestration, and intelligent operational modernization frameworks.",
  },
  {
    title: "Technology Analytics (Forecasting)",
    description:
      "Our intelligence frameworks analyze patents, emerging technologies, AI ecosystems, and software innovation signals to strengthen strategic foresight and accelerate executive technology positioning.",
  },
  {
    title: "Innovation Platforms (Governance)",
    description:
      "We deploy end-to-end innovation management systems integrating ITONICS, Brightidea, and AI-enabled governance architectures to strengthen technology execution and organizational transformation.",
  },
  {
    title: "Digital Intelligence (Optimization)",
    description:
      "The Innogene platform automates technology monitoring, innovation analytics, AI research synthesis, and digital operations mapping to accelerate enterprise-level strategic intelligence environments.",
  },
];

export const liveInsights = {
  title: "LIVE TECH INSIGHTS",
  alt: "Live tech insights",
  cards: [
    {
      id: "tech-featured",
      image: techInsightLeft,
      title: "Large Language Model Technology",
      date: "June 4, 2026",
      readTime: "2 minutes read",
      description:
        "The amount of patent registration of companies in the last 5 years can indicate the possible business strategies of these companies in the coming years. Google Inc is the leader in patent registration in this Sector.",
    },
    {
      id: "tech-top",
      image: techInsightTop,
      imageClassName: "object-left",
      title: "IBM Visual Insights",
      date: "November 15, 2025",
      readTime: "2 minutes read",
      description:
        "IBM aims to enhance the capabilities of Visual Insights by incorporating more sophisticated AI algorithms and expanding its applications across more industries.",
    },
    {
      id: "tech-bottom",
      image: techInsightBottom,
      title: "Dynamic Spectrum Access System",
      date: "November 15, 2025",
      readTime: "2 minutes read",
      description:
        "Building on the success of initial feasibility tests, Sony and Mitsui plan to further refine the DSA system by incorporating machine learning techniques to enhance predictive interference management.",
    },
  ],
};

export const ecosystemCards = [
  {
    id: "idc",
    image: IDC,
    title: "AI Enabled Engineering",
    subtitle: "Deliverables, review and standards assurance & compliance",
  },
  {
    id: "itonics",
    image: itonicsImage,
    title: "The Workshop Wizard ",
    imageClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
    subtitle: "Plan your workshops with AI assistant",
  },
  {
    id: "brightidea",
    image: BrightIdea,
    title: "Cisco case report",
    subtitle: "How Cisco Is Achieving Millions In Innovation Outcomes",
  },
];
