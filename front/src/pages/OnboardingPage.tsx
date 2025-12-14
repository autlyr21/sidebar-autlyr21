import React from "react";
import { Check } from "lucide-react";
import { TOPICS } from "../lib/index.ts";
import type { ScreenType } from "../types/index.ts";

interface OnboardingPageProps {
  selectedTopics: string[];
  toggleTopic: (id: string) => void;
  setCurrentScreen: (screen: ScreenType) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  selectedTopics,
  toggleTopic,
  setCurrentScreen,
}) => (
  <div className="h-screen bg-transparent p-6 flex flex-col justify-between animate-fade-in">
    <div className="mb-8 pt-10 animate-slide-up">
      <h1 className="text-4xl font-bold tracking-tighter mb-2">Sidebar.</h1>
      <p className="text-slate-500 text-lg leading-snug">
        Curating through the noise. <br />
        Relaxed insights from AI agents tailored to your interests.
      </p>
    </div>

    <h2 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2 animate-slide-up delay-100">
      Select Your Topics
    </h2>

    <div className="flex flex-col flex-1 overflow-y-scroll gap-3 p-2 pb-4 no-scrollbar">
      {
        //<div className="grid grid-cols-1 gap-3 pb-4">
      }
      {TOPICS.map((topic, index) => (
        <button
          key={topic.id}
          onClick={() => toggleTopic(topic.id)}
          style={{ animationDelay: `${index * 50 + 200}ms` }}
          className={`flex items-center justify-between p-4 border-2 transition-all duration-300 ease-out animate-slide-up hover:scale-[1.02] active:scale-[0.98] ${selectedTopics.includes(topic.id)
              ? "border-slate-900 bg-slate-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50"
            }`}
        >
          <span className="flex items-center gap-3 text-lg font-medium">
            <span className="text-2xl">{topic.icon}</span>
            {topic.label}
          </span>
          <div
            className={`transition-all duration-300 ${selectedTopics.includes(topic.id)
                ? "opacity-100 scale-100"
                : "opacity-0 scale-50"
              }`}
          >
            <Check size={20} className="text-slate-900" />
          </div>
        </button>
      ))}
    </div>

    <button
      onClick={() => setCurrentScreen("feed")}
      className="w-full py-4 bg-slate-900 text-white font-bold text-lg tracking-wide mt-8 active:translate-y-1 active:shadow-none transition-all duration-200 sticky bottom-6 shadow-xl hover:shadow-2xl animate-slide-up delay-300"
    >
      ENTER STREAM
    </button>
  </div>
);
export default OnboardingPage;
