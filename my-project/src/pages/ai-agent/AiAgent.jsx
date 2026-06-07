import {useTheme} from "../../context/useTheme";
import {usePointerGlow} from "../../hooks/usePointerGlow";
import AIHumanFace from "../../assets/images/ai-agent/AIHumanFace.png";
import BlackWhatAreAiAgentImage from "../../assets/images/ai-agent/BlackWhatAreAiAgent.png";
import WhatAreAiAgentImage from "../../assets/images/ai-agent/WhatAreAiAgent.png";

const marketingSteps = [
  {
    title: "AI agent gathers data:",
    body: "On a weekly basis, the agent autonomously gathers and joins marketing data via connected data pipelines.",
  },
  {
    title: "AI agent gathers data:",
    body: "On a weekly basis, the agent autonomously gathers and joins marketing data via connected data pipelines.",
  },
  {
    title: "AI agent analyzes performance:",
    body: "The agent performs contextual analysis on the data to understand campaign performance metrics and compare against expectations, receiving business context from an operator when necessary.",
  },
  {
    title: "AI agent updates platforms:",
    body: "When given human approval, the agent updates media buying platforms with the recommendations.",
  },
];

const workSteps = [
  {
    title: "Observe:",
    body: "AI agents constantly collect and process information from their environment including user interactions, key performance metrics, or sensor data. They can retain memory across conversations, which provides ongoing context across multi-step plans and operations.",
  },
  {
    title: "Plan:",
    body: "Using language models, AI agents autonomously evaluate and prioritize actions based on their understanding of the problem to be addressed, goals to be accomplished, context, and memory.",
  },
  {
    title: "Act:",
    body: "AI agents leverage interfaces with enterprise systems, tools, and data sources to perform tasks. Tasks are governed by the plan delivered by a large language model or small language model. To execute tasks, the AI agent may access enterprise services (such as HR systems, order management systems, or CRMs), delegate actions to other AI agents, or ask the user for clarification. These intelligent software agents have the ability to detect errors, fix them, and learn through multi-step plans and internal checks.",
  },
];

function Bullet() {
  return (
    <div className="flex size-6 shrink-0 items-center justify-center">
      <div className="relative size-3.5">
        <div className="absolute left-[2.5px] top-[2.5px] size-2 rounded-full bg-[#37B478]" />
      </div>
    </div>
  );
}

function StepItem({title, body, textColor}) {
  return (
    <div className="flex flex-1 items-start gap-2">
      <Bullet />
      <div className="flex flex-1 flex-col items-start gap-2">
        <h3 className={`font-['Gotham'] text-2xl font-bold ${textColor}`}>{title}</h3>
        <p className={`font-['Gotham'] text-2xl leading-[1.25] ${textColor}`}>
          {body}
        </p>
      </div>
    </div>
  );
}

function HoverFrame({children, className = ""}) {
  const {position, handlers} = usePointerGlow();

  return (
    <div
      className={`relative ${className}`}
      {...handlers}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[50px] transition-opacity duration-300"
        style={{
          opacity: position.active ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(55, 180, 120, 0.7), transparent 75%)`,
          filter: "blur(20px)",
        }}
      />
      <div className="relative z-10 size-full overflow-hidden rounded-[50px]">
        {children}
      </div>
    </div>
  );
}

function AiAgent() {
  const {isDarkMode} = useTheme();
  const pageBackground = isDarkMode ? "bg-[#050505]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const whatAreAiAgentImage = isDarkMode
    ? WhatAreAiAgentImage
    : BlackWhatAreAiAgentImage;

  return (
    <main
      className={`w-full overflow-hidden px-28 pb-16 pt-36 transition-colors duration-500 ease-in-out ${pageBackground}`}
    >
      <div className="flex w-full flex-col items-start justify-center gap-8">
        <section className="flex w-full flex-col items-start gap-2">
          <h1 className={`font-['Gotham'] text-5xl font-normal ${textColor}`}>
            AI Agent
          </h1>
          <p className={`w-full font-['Gotham'] text-2xl ${textColor}`}>
            We leverage the advances in disruptive technologies to enhance
            business.
          </p>
        </section>

        <section className="relative flex h-96 w-full flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[50px] bg-white">
          <img
            src={AIHumanFace}
            alt=""
            aria-hidden
            className="absolute inset-0 size-full object-cover object-center"
          />
        </section>

        <p className={`w-full font-['Gotham'] text-2xl leading-[1.25] ${textColor}`}>
          Imagine a teammate that works tirelessly, learns continuously, and
          adapts to your needs. That&rsquo;s the promise of AI agents. With the
          ability to observe, plan, and act autonomously, AI agents open a new
          chapter of end-to-end transformation across industries&mdash;streamlining
          processes, driving data insights, and augmenting human potential like
          never before.
        </p>

        <section className="flex w-full flex-col items-start gap-4">
          <h2 className={`w-full font-['Gotham'] text-5xl ${textColor}`}>
            What Are AI Agents?
          </h2>
          <p className={`w-full font-['Gotham'] text-2xl leading-[1.25] ${textColor}`}>
            Put simply, AI agents are artificial intelligence that use tools to
            accomplish goals. AI agents have the ability to remember across
            tasks and changing states; they can use one or more AI models to
            complete tasks; and they can decide when to access internal or
            external systems on a user&rsquo;s behalf. This enables AI agents to
            make decisions and take actions autonomously with minimal human
            oversight.
            <br />
            For example, a consumer goods company wanted to optimize its global
            marketing campaigns using an AI agent to transform processes. A
            project that once required six analysts per week now required a
            single employee working with an agent, delivering results in under
            an hour. Here&rsquo;s how it works:
          </p>
        </section>

        <section className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full items-start gap-8">
            {marketingSteps.slice(0, 2).map((step, index) => (
              <StepItem
                key={`${step.title}-${index}`}
                title={step.title}
                body={step.body}
                textColor={textColor}
              />
            ))}
          </div>
          <div className="flex w-full items-start gap-8">
            {marketingSteps.slice(2).map((step) => (
              <StepItem
                key={step.title}
                title={step.title}
                body={step.body}
                textColor={textColor}
              />
            ))}
          </div>
        </section>

        <HoverFrame className="w-full">
          <section className="flex w-full flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[50px] bg-white">
          <img
            src={whatAreAiAgentImage}
            alt=""
            aria-hidden
            className="h-[287px] w-full object-cover object-center"
          />
          </section>
        </HoverFrame>

        <section className="flex w-full flex-col items-start gap-4">
          <h2 className={`w-full font-['Gotham'] text-5xl ${textColor}`}>
            How Do AI Agents Work?
          </h2>
          <p className={`w-full font-['Gotham'] text-2xl leading-[1.25] ${textColor}`}>
            AI agents observe their environment, leverage large language models
            for planning, and access connected systems to take action and
            accomplish goals.
          </p>

          {workSteps.map((step) => (
            <StepItem
              key={step.title}
              title={step.title}
              body={step.body}
              textColor={textColor}
            />
          ))}

          <p className={`w-full font-['Gotham'] text-2xl leading-[1.25] ${textColor}`}>
            This observe-plan-act cycle is self-reinforcing because AI agent
            tools continuously analyze how the world has changed based on past
            interactions and learn how to be more efficient and effective over
            time.
          </p>
        </section>
      </div>
    </main>
  );
}

export default AiAgent;
