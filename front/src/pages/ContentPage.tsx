import React, { useEffect } from "react";
import { ArrowLeft, UserCheck, Plus, Headphones } from "lucide-react";
import type { Post, ScreenType } from "../types/index.ts";
import { AGENTS, COMMENTS, getBaseUrl } from "../lib/index.ts";

interface ContentPageProps {
  activePost: Post | null;
  setCurrentScreen: (screen: ScreenType) => void;
  followedAgents: string[];
  toggleFollowAgent: (agentId: string) => void;
}

export const ContentPage: React.FC<ContentPageProps> = ({
  activePost,
  setCurrentScreen,
  followedAgents,
  toggleFollowAgent,
}) => {
  useEffect(() => {
    console.log(getBaseUrl());
  });
  if (!activePost) return null;
  const agent = AGENTS[activePost.agentId];
  const isFollowed = followedAgents.includes(agent.id);

  return (
    <div className="min-h-screen bg-white animate-slide-in-right">
      {/* Nav */}
      <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 p-4 flex items-center gap-4 z-10">
        <button
          onClick={() => setCurrentScreen("feed")}
          className="text-slate-600 hover:text-slate-900 hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="font-bold text-lg animate-fade-in">Thread</span>
      </div>

      <div className="max-w-xl mx-auto p-5">
        {/* Main Post */}
        <div className="mb-8 animate-slide-up">
          {/* Header with Follow Button */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-sm flex items-center justify-center font-bold text-2xl ${agent.avatar} shadow-sm`}
              >
                {agent.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-xl leading-none text-slate-900 mb-1">
                  {agent.name}
                </h3>
                <p className="text-sm text-slate-500 font-mono">
                  {agent.handle}
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleFollowAgent(agent.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 ${isFollowed
                  ? "bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200"
                  : "bg-slate-900 text-white border border-slate-900 hover:bg-slate-800 shadow-md"
                }`}
            >
              {isFollowed ? (
                <>
                  <UserCheck size={14} />
                  Following
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Follow
                </>
              )}
            </button>
          </div>

          <p className="text-xl leading-relaxed text-slate-900 mb-6 font-medium">
            {activePost.content}
          </p>

          <div className="flex gap-3 mb-6 overflow-x-auto py-2 no-scrollbar">
            {/* Context Cards */}
            <div className="min-w-[200px] border border-slate-200 rounded p-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 duration-200">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                Source
              </div>
              <div className="font-bold text-sm text-slate-800 truncate">
                Primary Source: Official Release
              </div>
            </div>
            <div className="min-w-[200px] border border-slate-200 rounded p-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 duration-200">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                Context
              </div>
              <div className="font-bold text-sm text-slate-800 truncate">
                Deep Dive: Background Info
              </div>
            </div>
          </div>

          <div className="border-y border-slate-100 py-3 flex justify-between text-slate-500 font-mono text-sm">
            <span>{activePost.timestamp}</span>
            <span>{activePost.likes} Likes</span>
          </div>
        </div>

        {/* Conversation/Replies */}
        <div className="space-y-6 pb-24">
          {COMMENTS.map((comment, idx) => (
            <div
              key={comment.id}
              style={{ animationDelay: `${idx * 150 + 300}ms` }}
              className={`flex gap-3 animate-slide-up opacity-0 ${comment.user === "You" ? "flex-row-reverse" : ""
                }`}
            >
              {comment.agentId && (
                <div
                  className={`w-8 h-8 rounded-sm flex-shrink-0 flex items-center justify-center font-bold text-sm ${AGENTS[comment.agentId].avatar
                    }`}
                >
                  {AGENTS[comment.agentId].name[0]}
                </div>
              )}
              {comment.user === "You" && (
                <div className="w-8 h-8 rounded-sm bg-slate-800 flex-shrink-0 flex items-center justify-center font-bold text-sm text-white shadow-md">
                  Y
                </div>
              )}

              <div
                className={`flex flex-col ${comment.user === "You" ? "items-end" : "items-start"
                  }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[90%] text-sm leading-relaxed shadow-sm transition-all hover:shadow-md ${comment.user === "You"
                      ? "bg-slate-100 text-slate-800 rounded-tr-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                    }`}
                >
                  {comment.content}
                </div>
                <span className="text-[10px] text-slate-300 mt-1 font-mono px-1">
                  {comment.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-4 pb-safe z-20 animate-slide-up delay-200">
        <div className="flex items-center gap-3 max-w-xl mx-auto">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer">
            <Headphones size={16} />
          </div>
          <input
            type="text"
            placeholder="Ask for clarification..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-slate-900 transition-all focus:ring-2 focus:ring-slate-100"
          />
          <button className="bg-slate-900 text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-slate-800 active:scale-95 transition-all">
            Ask
          </button>
        </div>
      </div>
    </div>
  );
};
export default ContentPage;
