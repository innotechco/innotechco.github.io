import automotiveHero from "../../../assets/images/industries/automotive/automotive.png";
import energyHero from "../../../assets/images/industries/energy-and-materials/energyandmaterials.png";
import healthHero from "../../../assets/images/industries/health/health.png";
import highTechHero from "../../../assets/images/industries/high-tech/hightech.png";
import metalsHero from "../../../assets/images/industries/metals-and-mining/metalsandmining.png";

import {
  automotiveCapabilities,
  energyCapabilities,
  healthCapabilities,
  highTechCapabilities,
  metalsCapabilities,
} from "./capabilities";
import {
  automotiveEcosystemCards,
  energyEcosystemCards,
  healthEcosystemCards,
  highTechEcosystemCards,
  metalsEcosystemCards,
} from "./ecosystemCards";
import {liveInsights} from "./liveInsights";

export const industryConfig = {
  automotive: {
    hero: {
      image: automotiveHero,
      breadcrumbLabel: "Automotive",
      title: "Automotive",
      description:
        "Accelerate intelligent mobility transformation across automotive manufacturing, connected vehicle ecosystems, smart mobility infrastructures, and AI-enabled engineering systems through predictive technology analytics and scalable digital architectures.",
    },
    acceleration: [
      "Automotive manufacturers and mobility ecosystems face accelerating platform disruption, fragmented operational infrastructures, and rising intelligent systems complexity. Advancing automotive modernization requires connected mobility architectures, AI-enabled operations, and scalable digital engineering ecosystems.",
      "Maximize mobility resilience through enterprise consulting for OEMs, smart mobility operators, automotive suppliers, and intelligent transportation ecosystems. Our specialized frameworks deploy predictive automotive analytics, digital mobility infrastructures, and AI-enabled transformation systems to accelerate scalable operational modernization.",
    ],
    capabilities: automotiveCapabilities,
    insights: liveInsights.automotive,
    ecosystemCards: automotiveEcosystemCards,
  },
  energy: {
    hero: {
      image: energyHero,
      breadcrumbLabel: "Energy And Materials",
      title: "Energy and Materials",
      description:
        "Drive upstream digital transformation. We optimize oil, gas, and petrochemical operations via systemic Innovation Management, predictive Technology Analytics, and actionable Market Analytics to scale energy infrastructure and navigate volatile global asset transitions.",
    },
    acceleration: [
      "Complex oil fields and downstream petrochemical facilities face severe infrastructure bottlenecks. Overcoming these operational roadblocks demands unified Innovation Management linking deep engineering research directly to value chain transformation.",
      "Maximize extraction margins. Consulting for enterprise energy corporations with over $4B in combined revenue, our specialized consulting network deploys advanced data architectures to optimize downstream refining assets, streamline supply logistics, and secure market leadership.",
    ],
    capabilities: energyCapabilities,
    insights: liveInsights.energy,
    ecosystemCards: energyEcosystemCards,
  },
  health: {
    hero: {
      image: healthHero,
      breadcrumbLabel: "Health",
      title: "Health",
      description:
        "Reinvent Healthcare Through Digital Intelligence. At Innotech, we help healthcare providers, life sciences firms, biotechnology companies, and medical innovation hubs navigate this transformation with strategic clarity and measurable impact.",
    },
    acceleration: [
      "Healthcare providers and life sciences enterprises face fragmented clinical infrastructures, rising diagnostics complexity, and escalating operational inefficiencies. Advancing digital healthcare systems requires integrated Healthcare Innovation frameworks, AI healthcare orchestration, and enterprise-grade clinical intelligence architectures.",
      "Our integrated healthcare solutions combine innovation management, medical technology analytics, AI automation, and digital transformation frameworks to support sustainable growth across healthcare ecosystems, precision medicine initiatives, diagnostics operations, and advanced clinical infrastructures.",
    ],
    capabilities: healthCapabilities,
    insights: liveInsights.health,
    ecosystemCards: healthEcosystemCards,
  },
  highTech: {
    hero: {
      image: highTechHero,
      breadcrumbLabel: "High Tech",
      title: "High Tech",
      description:
        "Accelerate intelligent digital transformation across AI ecosystems, software infrastructures, cloud platforms, automation systems, and advanced computing environments through predictive technology analytics and scalable innovation architectures.",
    },
    acceleration: [
      "High tech enterprises and AI-native organizations face accelerating infrastructure complexity, fragmented innovation systems, and continuous platform disruption. Advancing enterprise modernization requires intelligent digital architectures, AI-enabled operations, and scalable technology governance across distributed ecosystems.",
      "Maximize technology resilience through enterprise consulting for AI firms, cloud platforms, software ecosystems, semiconductor operators, and intelligent infrastructure providers. Our specialized frameworks deploy predictive technology analytics, digital transformation systems, and innovation intelligence to accelerate scalable high-tech modernization.",
    ],
    capabilities: highTechCapabilities,
    insights: liveInsights.highTech,
    ecosystemCards: highTechEcosystemCards,
  },
  metals: {
    hero: {
      image: metalsHero,
      breadcrumbLabel: "Metals and Mining",
      title: "Metals and Mining",
      description:
        "Drive intelligent mining transformation across steel, alumina, minerals, and extraction ecosystems through AI-enabled industrial analytics, technology roadmapping, operational modernization, and predictive infrastructure intelligence.",
    },
    acceleration: [
      "Mining operators and metals enterprises face rising extraction complexity, fragmented operational systems, and volatile industrial transitions. Advancing mining modernization requires integrated innovation management, digital mining intelligence, and scalable transformation architectures across distributed industrial assets.",
      "Maximize industrial resilience through enterprise mining consulting for steel producers, mineral operators, alumina systems, and industrial holdings. Our specialized consulting frameworks deploy technology analytics, operational intelligence, and AI-enabled transformation systems to accelerate sustainable metals modernization.",
    ],
    capabilities: metalsCapabilities,
    insights: liveInsights.metals,
    ecosystemCards: metalsEcosystemCards,
  },
};
