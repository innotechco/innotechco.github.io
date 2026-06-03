import energyInsightLeft from "../../../assets/images/industries/energy-and-materials/energyandmaterials1.png";
import energyInsightTop from "../../../assets/images/industries/energy-and-materials/energyandmaterials2.jpg";
import energyInsightBottom from "../../../assets/images/industries/energy-and-materials/energyandmaterials3.jpg";
import healthInsightLeft from "../../../assets/images/industries/health/health1.png";
import healthInsightTop from "../../../assets/images/industries/health/health2.png";
import healthInsightBottom from "../../../assets/images/industries/health/health3.png";
import techInsightLeft from "../../../assets/images/industries/high-tech/hightech1.png";
import techInsightTop from "../../../assets/images/industries/high-tech/hightech2.png";
import techInsightBottom from "../../../assets/images/industries/high-tech/hightech3.png";
import metalsInsightLeft from "../../../assets/images/industries/metals-and-mining/metalsandmining1.png";
import metalsInsightTop from "../../../assets/images/industries/metals-and-mining/metalsandmining2.png";
import metalsInsightBottom from "../../../assets/images/industries/metals-and-mining/metalsandmining3.png";

const HowWeThinkImage = "/assets/shared/how-we-think.jpg";

const inceptionCard = {
  title: "InnotechCo launches INCEPTION",
  date: "November 15, 2025",
  readTime: "2 minutes read",
  description:
    "InnotechCo introduced INCEPTION, a modular innovation management system that helps R&D and strategy.",
};

export const liveInsights = {
  automotive: {
    title: "LIVE MOBILITY INSIGHTS",
    alt: "Live mobility insights",
    cards: [
      {
        id: "automotive-featured",
        image: HowWeThinkImage,
        title: "Engine Technologies For Improving Fuel Efficiency",
        date: "June 4, 2026",
        readTime: "2 minutes read",
        description:
          "Toyota Motor Co has the largest number of highly-cited patents, a sign of the high value of this company's patent portfolio.",
      },
      {id: "automotive-top", image: HowWeThinkImage, ...inceptionCard},
      {id: "automotive-bottom", image: HowWeThinkImage, ...inceptionCard},
    ],
  },
  energy: {
    title: "LIVE ENERGY INSIGHTS",
    alt: "Live energy insights",
    cards: [
      {
        id: "energy-featured",
        image: energyInsightLeft,
        title: "Global Energy Materials Outlook",
        date: "June 4, 2026",
        readTime: "2 minutes read",
        description:
          "A technology and market view on energy materials, infrastructure demand, and regional industrial opportunities.",
      },
      {id: "energy-top", image: energyInsightTop, ...inceptionCard},
      {id: "energy-bottom", image: energyInsightBottom, ...inceptionCard},
    ],
  },
  health: {
    title: "LIVE HEALTH INSIGHTS",
    alt: "Live health insights",
    cards: [
      {
        id: "health-featured",
        image: healthInsightLeft,
        title: "AI and Biotechnology Invention Trends",
        date: "June 4, 2026",
        readTime: "2 minutes read",
        description:
          "Inventions combining AI and biotechnology continue to grow faster than many other technology sectors.",
      },
      {
        id: "health-top",
        image: healthInsightTop,
        title: "Mental Health Diagnostics Using Audio Data",
        date: "November 15, 2025",
        readTime: "2 minutes read",
        description:
          "Audio-driven analysis can help clinical teams identify signals from patient interactions.",
      },
      {id: "health-bottom", image: healthInsightBottom, ...inceptionCard},
    ],
  },
  highTech: {
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
          "A practical look at AI systems, model orchestration, and enterprise technology intelligence.",
      },
      {id: "tech-top", image: techInsightTop, ...inceptionCard},
      {id: "tech-bottom", image: techInsightBottom, ...inceptionCard},
    ],
  },
  metals: {
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
          "Industrial operators are scaling carbon technology across global operations and mining value chains.",
      },
      {id: "metals-top", image: metalsInsightTop, ...inceptionCard},
      {id: "metals-bottom", image: metalsInsightBottom, ...inceptionCard},
    ],
  },
};
