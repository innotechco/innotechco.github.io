import logo from "../../../../shared/assets/brand/partners/itonics/logo.svg";
import heroImage from "../../../../shared/assets/partners/backgrounds/partner-intro-image.webp";

import InsightGrowthAudience from "../../../../shared/assets/partners/cards/insight-growth-audience.svg";
import SettingsWindow from "../../../../shared/assets/partners/cards/settings-window.svg";
import puzzle from "../../../../shared/assets/partners/cards/puzzle.svg";
import DashboardMonitor from "../../../../shared/assets/partners/cards/dashboard-monitor.svg";
import ProcessesWorkflow from "../../../../shared/assets/partners/cards/processes-workflow.svg";

export const itonicsAssets = {
  logo,
  heroImage,
  logoClassName: "max-h-[212px] max-w-[406px]",
  lightLogoClassName: "brightness-0",
  cardIcons: {
    insight: InsightGrowthAudience,
    sites: SettingsWindow,
    roadmap: puzzle,
    reports: DashboardMonitor,
    processes: ProcessesWorkflow,
  }
};