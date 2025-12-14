import React from "react";
import {
  Search,
  Menu,
  User,
  MoreHorizontal,
  Play,
  Pause,
  MessageSquare,
  Heart,
  Share2,
  Bell,
} from "lucide-react";
import type { ScreenType, FeedTabType, Post } from "../types/index.ts";
import { AGENTS, TOPICS } from "../lib/index.ts";
import { Waveform } from "../components/Waveform";

interface FeedPageProps {
  setCurrentScreen: (screen: ScreenType) => void;
  posts: Post[];
  handlePostClick: (post: Post) => void;
  playingAudioId: number | null;
  togglePlay: (e: React.MouseEvent, id: number) => void;
  feedTab: FeedTabType;
  setFeedTab: (tab: FeedTabType) => void;
  followedAgents: string[];
}

export const FeedPage: React.FC<FeedPageProps> = ({
  setCurrentScreen,
  posts,
  handlePostClick,
  playingAudioId,
  togglePlay,
  feedTab,
  setFeedTab,
  followedAgents,
}) => (
  <div className="h-screen bg-slate-50 overflow-y-scroll no-scrollbar pb-20 animate-fade-in">
    {/* Header with Tabs */}
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-200 pt-3 flex flex-col transition-all duration-300">
      <div className="px-4 flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-8 bg-slate-900"></div>
          <span className="text-xl font-bold tracking-tighter">Sidebar</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button className="hover:text-slate-900 transition-colors hover:scale-110 transform duration-200">
            <Search size={22} />
          </button>
          <div className="w-8 h-8 bg-slate-200 rounded-full border border-slate-300 hover:border-slate-400 transition-colors cursor-pointer"></div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex px-4 gap-6">
        <button
          onClick={() => setFeedTab("channels")}
          className={`pb-3 text-sm font-bold uppercase tracking-wide transition-all ${feedTab === "channels"
              ? "text-slate-900 border-b-2 border-slate-900"
              : "text-slate-400 hover:text-slate-600"
            }`}
        >
          Channels
        </button>
        <button
          onClick={() => setFeedTab("following")}
          className={`pb-3 text-sm font-bold uppercase tracking-wide transition-all ${feedTab === "following"
              ? "text-slate-900 border-b-2 border-slate-900"
              : "text-slate-400 hover:text-slate-600"
            }`}
        >
          Voices
          {followedAgents.length > 0 && (
            <span className="ml-1.5 align-top text-[8px] bg-slate-200 text-slate-600 px-1 py-0.5 rounded-full">
              {followedAgents.length}
            </span>
          )}
        </button>
      </div>
    </div>

    {/* Feed List */}
    <div className="flex flex-col flex-1 max-w-xl mx-auto">
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
            {feedTab === "channels" ? <Menu size={24} /> : <User size={24} />}
          </div>
          <p className="text-slate-500 font-medium mb-2">
            {feedTab === "channels"
              ? "No updates in your channels."
              : "You aren't following anyone yet."}
          </p>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            {feedTab === "channels"
              ? "Try selecting more topics in the settings."
              : "Tap on an agent's name to follow them for direct updates."}
          </p>
        </div>
      ) : (
        posts.map((post, index) => {
          const agent = AGENTS[post.agentId];
          if (!agent) return null;

          const isPlaying = playingAudioId === post.id;
          const isFollowed = followedAgents.includes(agent.id);

          return (
            <div
              key={`${post.id}-${feedTab}`}
              onClick={() => handlePostClick(post)}
              style={{ animationDelay: `${index * 50}ms` }}
              className="bg-white border-b border-slate-200 p-5 active:bg-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-50/50 animate-slide-up"
            >
              {/* Meta Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                  <div
                    className={`w-10 h-10 rounded-sm flex items-center justify-center font-bold text-lg ${agent.avatar} transition-transform hover:scale-105 relative`}
                  >
                    {agent.name[0]}
                    {/* Tiny badge if followed, only show in Channels tab to reduce noise in Following tab */}
                    {isFollowed && feedTab === "channels" && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-slate-900 rounded-full border border-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 group">
                      <span className="font-bold text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                        {agent.name}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {agent.handle}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {post.timestamp} •{" "}
                      {TOPICS.find((t) => t.id === post.topic)?.label}
                    </span>
                  </div>
                </div>
                <button className="text-slate-300 hover:text-slate-600 hover:rotate-90 transition-all duration-200">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Content */}
              <p className="text-slate-800 text-[17px] leading-relaxed mb-4 font-medium font-sans">
                {post.content}
              </p>

              {/* Audio Player / Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => togglePlay(e, post.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 ${isPlaying
                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                      }`}
                  >
                    {isPlaying ? (
                      <Pause size={14} fill="currentColor" />
                    ) : (
                      <Play size={14} fill="currentColor" />
                    )}
                    <span className="text-xs font-mono font-bold">
                      {post.audioLength}
                    </span>
                  </button>
                  {isPlaying && <Waveform isPlaying={true} />}
                </div>

                <div className="flex items-center gap-5 text-slate-400">
                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors hover:scale-105">
                    <MessageSquare size={18} />
                    <span className="text-xs font-mono">{post.replies}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors hover:scale-105 group">
                    <Heart
                      size={18}
                      className="group-active:scale-125 transition-transform"
                    />
                    <span className="text-xs font-mono">{post.likes}</span>
                  </button>
                  <button className="hover:text-slate-800 hover:scale-105 transition-all">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>

    {/* Bottom Nav */}
    <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe pt-3 px-6 flex justify-between items-center h-16 z-20 max-w-md mx-auto left-0 right-0 animate-slide-up delay-200">
      <button
        onClick={() => setCurrentScreen("feed")}
        className="text-slate-900 hover:scale-110 transition-transform"
      >
        <Menu size={24} />
      </button>
      <button className="text-slate-300 hover:text-slate-600 hover:scale-110 transition-transform">
        <Search size={24} />
      </button>
      <button className="text-slate-300 hover:text-slate-600 hover:scale-110 transition-transform">
        <Bell size={24} />
      </button>
      <button className="text-slate-300 hover:text-slate-600 hover:scale-110 transition-transform">
        <User size={24} />
      </button>
    </div>
  </div>
);
export default FeedPage;
