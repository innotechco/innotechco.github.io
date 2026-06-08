import {partnerImages} from "../../../../assets/images/shared";
import inceptionIcon from "../../../../assets/icons/Inception-Icon 1.svg";

export const partners = [
  {name: "ITONICS", image: partnerImages.itonics},
  {name: "Brightidea", image: partnerImages.brightidea},
];

export const showcase = {
  title: "INCEPTION SHOWROOM",
  icon: inceptionIcon,
  iconClassName: "translate-x-7 -translate-y-2",
  cards: [
    {id: "inception-maturity", buttonLabel: "Free Diagnosis", title: "Innovation Maturity Snapshot", subtitle: "Run Assessment"},
    {id: "inception-pipeline", buttonLabel: "See Flow", title: "Idea Pipeline Simulation", subtitle: "Ideation Best Practice"},
    {id: "inception-dashboard", buttonLabel: "Access Trial", title: "Dashboard Preview", subtitle: "Organize Innovation Inputs"},
  ],
};

export const road = {
  title: "Inception Road",
  items: [
    {title: "Module 1", subtitle: "Maturity Assessment"},
    {title: "Module 2", subtitle: "Process Design"},
    {title: "Module 3", subtitle: "Innovation OS Enablement"},
    {title: "Module 4", subtitle: "Tech Monitoring"},
    {title: "Module 5", subtitle: "Innovation Management System"},
  ],
};

export const stats = [
  {value: 100, prefix: "+", label: "Innovation Projects Delivered"},
  {value: 95, prefix: "%", label: "Client\nProcess\nAdoption"},
  {value: 2, prefix: "+", label: "Software Solutions"},
  {value: 75, prefix: "+", label: "Active\nPortfolios\nManaged"},
];

export const capabilities = [
  {
    title: "Automotive & Mobility",
    description:
      "We support mobility organizations with structured idea management, technology monitoring, product innovation processes, and portfolio governance. INCEPTION helps connect market signals, engineering ideas, supplier opportunities, and transformation priorities into one managed innovation flow.",
  },
  {
    title: "Energy & Materials",
    description:
      "We design innovation management systems for oil, gas, energy, petrochemical, and materials companies. INCEPTION structures idea intake, technology roadmaps, process ownership, portfolio prioritization, and measurable innovation KPIs across complex industrial environments.",
  },
  {
    title: "Healthcare & Life Sciences",
    description:
      "We assist healthcare, biotech, vaccine, and diagnostics organizations with R&D prioritization, commercialization workflows, innovation governance, and evidence-based project evaluation. INCEPTION helps scientific teams move from scattered opportunities to structured innovation portfolios.",
  },
  {
    title: "High Tech & AI",
    description:
      "We help technology, telecom, AI, and digital infrastructure organizations organize innovation around weak signals, emerging technologies, business model options, and product development priorities. INCEPTION turns rapid change into governed strategic execution.",
  },
  {
    title: "Metals & Mining",
    description:
      "We enhance steel, mining, alumina, and mineral companies with technology needs identification, innovation process design, technology roadmapping, carbon foresight, and portfolio governance. INCEPTION helps industrial teams prioritize what to build, adopt, or scale.",
  },
];

export const actions = [
  {
    title: "Governance",
    subtitle: "Decision System",
    paragraphs: [
      "INCEPTION builds the governance layer behind innovation. We define who owns each decision, how ideas move between committees, which criteria shape prioritization, and how strategic alignment, feasibility, novelty, risk, and value are translated into repeatable decision rules.",
      "The purpose is to remove informal judgment from critical innovation decisions. Instead of scattered reviews, unclear ownership, and subjective approvals, organizations receive a structured decision system that connects leadership priorities with operational execution.",
      "Through stage-gates, RACI logic, KPI ownership, escalation rules, portfolio criteria, and decision documentation, INCEPTION helps teams govern innovation with clarity, speed, and accountability across functions.",
    ],
  },
  {
    title: "Pipeline",
    subtitle: "Idea-to-Project Flow",
    paragraphs: [
      "INCEPTION turns disconnected ideas into a managed innovation pipeline. We design how internal and external ideas are captured, enriched, evaluated, prioritized, converted into projects, monitored during implementation, and reviewed after results are delivered.",
      "The focus is to stop ideas from being lost, duplicated, or evaluated inconsistently. Each idea gets a clear path: intake, screening, scoring, expert review, project formation, implementation tracking, impact calculation, and learning feedback.",
      "Through process flows, BPMN models, forms, templates, stage-gates, evaluation logic, and portfolio handoffs, INCEPTION creates a closed-loop system from idea generation to measurable innovation outcomes.",
    ],
  },
  {
    title: "Visibility",
    subtitle: "Innovation Dashboard",
    paragraphs: [
      "INCEPTION makes innovation visible to management. We define dashboard views for idea funnels, portfolio flow, project status, cycle time, resource allocation, partner contribution, KPI performance, and value realization across business units.",
      "The goal is to make innovation manageable at a glance. Leadership can see what is moving, what is delayed, which ideas are creating value, where bottlenecks exist, and which portfolios need attention.",
      "Through KPI catalogs, formulas, owners, scorecards, data fields, alerts, and executive views, INCEPTION transforms innovation from scattered activity into a measurable management system.",
    ],
  },
];
