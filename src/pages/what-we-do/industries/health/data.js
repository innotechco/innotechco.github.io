import healthHero from "../../../../assets/images/industries/health/health.webp";
import healthInsightLeft from "../../../../assets/images/industries/health/health1.webp";
import healthInsightTop from "../../../../assets/images/industries/health/health2.webp";
import healthInsightBottom from "../../../../assets/images/industries/health/health3.webp";
import {expertImages} from "../../../../assets/images/shared";

const {
  itonics: itonicsImage,
  statista: statistaImage,
  statistaLight: statistaLightImage,
  trex: trexImage,
} = expertImages;

export const hero = {
  image: healthHero,
  breadcrumbLabel: "Health",
  title: "Health",
  description:
    "Reinvent Healthcare Through Digital Intelligence. At Innotech, we help healthcare providers, life sciences firms, biotechnology companies, and medical innovation hubs navigate this transformation with strategic clarity and measurable impact.",
};

export const accelerationParagraphs = [
  "Healthcare providers and life sciences enterprises face fragmented clinical infrastructures, rising diagnostics complexity, and escalating operational inefficiencies. Advancing digital healthcare systems requires integrated Healthcare Innovation frameworks, AI healthcare orchestration, and enterprise-grade clinical intelligence architectures.",
  "Our integrated healthcare solutions combine innovation management, medical technology analytics, AI automation, and digital transformation frameworks to support sustainable growth across healthcare ecosystems, precision medicine initiatives, diagnostics operations, and advanced clinical infrastructures.",
];

export const capabilities = [
  {
    title: "Clinical Intelligence (Optimization)",
    description:
      "We deploy AI healthcare systems to unify distributed clinical operations, strengthen diagnostics acceleration, optimize care coordination, and modernize healthcare infrastructure across enterprise hospital ecosystems.",
  },
  {
    title: "Diagnostics Analytics (Forecasting)",
    description:
      "Our healthcare analytics frameworks process biomedical datasets, diagnostics pipelines, and clinical intelligence models to enhance predictive diagnostics, operational visibility, and precision medicine deployment.",
  },
  {
    title: "Biomedical Strategy (Research)",
    description:
      "We evaluate biotechnology ecosystems, translational medicine trends, and biomedical innovation infrastructures to support strategic healthcare transformation and accelerate high-impact clinical commercialization pathways.",
  },
  {
    title: "MedTech Systems (Infrastructure)",
    description:
      "We engineer digital healthcare architectures integrating connected MedTech environments, cloud-enabled care systems, interoperable platforms, and scalable healthcare operations modernization frameworks.",
  },
  {
    title: "AI Automation (Enhancement)",
    description:
      "The INFINITY platform automates clinical documentation workflows, biomedical intelligence mapping, diagnostics research synthesis, and healthcare operations reporting to accelerate AI-enabled healthcare decision environments.",
  },
];

export const liveInsights = {
  title: "LIVE HEALTH INSIGHTS",
  alt: "Live health insights",
  cards: [
    {
      id: "health-featured",
      image: healthInsightLeft,
      title: "AI-Driven Drug Discovery",
      date: "June 4, 2026",
      readTime: "2 minutes read",
      description:
        "Inventions combining AI and biotechnology have grown significantly in recent years. Specifically, the number of inventions in this field has increased twelvefold over the past 20 years, far outpacing the general growth rate across all other technology sectors.",
    },
    {
      id: "health-top",
      image: healthInsightTop,
      compactTight: true,
      title: "Mental Health Diagnostics Using Audio Data",
      date: "November 15, 2025",
      readTime: "2 minutes read",
      description:
        "AI-Powered Audio Analysis utilizes artificial intelligence to analyze vocal patterns, speech cadence, and tone from patient interactions to identify potential mental health conditions.",
    },
    {
      id: "health-bottom",
      image: healthInsightBottom,
      title: "Probiotics",
      date: "June 4, 2026",
      readTime: "2 minutes read",
      description:
        "China leads globally in patent registrations, demonstrating a remarkable volume of patents registered each year in the Probiotics sector.",
    },
  ],
};

export const ecosystemCards = [
  {
    id: "statista",
    image: statistaImage,
    imageLight: statistaLightImage,
    imageClassName: "scale-[1] translate-y-[20px]",
    imageLightClassName: "scale-[1] translate-y-[2px]",
    title: "Cord Blood Technology",
    subtitle: "Copyrighted collaborative data ",
  },
  {
    id: "itonics",
    image: itonicsImage,
    title: "Report: Pharma R&D in 2026",
    imageClassName: "scale-[1] -translate-y-[10px] translate-x-[0px] ",
    subtitle: "Practical actions to modernize your Pharma R&D operation",
  },
  {
    id: "trex",
    image: trexImage,
    title: "Bottling and Packaging",
    subtitle: "Regional best practices",
  },
];
