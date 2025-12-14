import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, UserCheck, Plus, ArrowUpRight } from "lucide-react";
import type { Post, ScreenType } from "../types/index.ts";
import { AGENTS, COMMENTS, getSiteLabel } from "../lib/index.ts";

interface ContentPageProps {
  activePost: Post | null;
  setCurrentScreen: (screen: ScreenType) => void;
  followedAgents: string[];
  toggleFollowAgent: (agentId: string) => void;
}

type LinkPreview = {
  title: string;
  description?: string;
  faviconUrl?: string;
  hostname: string;
};

export const ContentPage: React.FC<ContentPageProps> = ({
  activePost,
  setCurrentScreen,
  followedAgents,
  toggleFollowAgent,
}) => {
  const activeLink = activePost?.link ?? "";
  const linkUrl = useMemo(() => {
    try {
      return activeLink ? new URL(activeLink) : null;
    } catch {
      return null;
    }
  }, [activeLink]);

  const fallbackPreview = useMemo<LinkPreview | null>(() => {
    if (!linkUrl) return null;
    const hostname = linkUrl.hostname.replace(/^www\./, "");
    return {
      hostname,
      title: hostname,
      faviconUrl: new URL("/favicon.ico", linkUrl.origin).toString(),
    };
  }, [linkUrl]);

  const [fetchedPreview, setFetchedPreview] = useState<{
    link: string;
    data: Pick<LinkPreview, "title" | "description" | "faviconUrl">;
  } | null>(null);

  const linkPreview: LinkPreview | null = useMemo(() => {
    if (!fallbackPreview) return null;
    if (fetchedPreview?.link !== activeLink) return fallbackPreview;
    return { ...fallbackPreview, ...fetchedPreview.data };
  }, [activeLink, fallbackPreview, fetchedPreview]);

  useEffect(() => {
    if (!linkUrl) return;

    const controller = new AbortController();
    const hostname = linkUrl.hostname.replace(/^www\./, "");

    (async () => {
      try {
        const proxyUrl = `https://r.jina.ai/${linkUrl.toString()}`;
        const response = await fetch(proxyUrl, { signal: controller.signal });
        if (!response.ok) return;
        const html = await response.text();

        const doc = new DOMParser().parseFromString(html, "text/html");

        const pickMeta = (selector: string) =>
          doc.querySelector(selector)?.getAttribute("content")?.trim() ||
          undefined;

        const title =
          pickMeta('meta[property="og:title"]') ||
          pickMeta('meta[name="twitter:title"]') ||
          doc.querySelector("title")?.textContent?.trim() ||
          hostname;

        const description =
          pickMeta('meta[property="og:description"]') ||
          pickMeta('meta[name="description"]') ||
          pickMeta('meta[name="twitter:description"]') ||
          undefined;

        const iconHref =
          doc
            .querySelector(
              'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]',
            )
            ?.getAttribute("href")
            ?.trim() || undefined;

        const faviconUrl = iconHref
          ? new URL(iconHref, linkUrl.origin).toString()
          : new URL("/favicon.ico", linkUrl.origin).toString();

        setFetchedPreview({
          link: activeLink,
          data: { title, description, faviconUrl },
        });
      } catch {
        // Best-effort only; keep fallback preview.
      }
    })();

    return () => controller.abort();
  }, [activeLink, linkUrl]);

  if (!activePost) return null;
  const agent = AGENTS[activePost.agentId];
  if (!agent) return null;
  const isFollowed = followedAgents.includes(agent.id);

  return (
    <div className="h-screen bg-white overflow-y-scroll no-scrollbar pb-28">
      <div className="animate-slide-in-right">
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

          <p className="text-xl leading-relaxed text-slate-900 mb-6 font-medium whitespace-pre-line">
            {activePost.content}
          </p>

          <a
            href={activePost.link}
            target="_blank"
            rel="noreferrer"
            className="block mb-6 border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors active:scale-[0.99] duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {linkPreview?.faviconUrl ? (
                  <img
                    src={linkPreview.faviconUrl}
                    alt=""
                    className="w-full h-full object-contain"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-xs font-mono text-slate-400">
                    {getSiteLabel(activePost.link).slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Link
                </div>
                <div className="font-bold text-sm text-slate-800 truncate">
                  {linkPreview?.title ?? getSiteLabel(activePost.link)}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">
                  {linkPreview?.hostname ?? getSiteLabel(activePost.link)}
                </div>
                {linkPreview?.description && (
                  <div
                    className="text-xs text-slate-500 mt-2 overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {linkPreview.description}
                  </div>
                )}
              </div>

              <div className="text-slate-400 flex-shrink-0">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </a>

          <div className="border-y border-slate-100 py-3 flex justify-between text-slate-500 font-mono text-sm">
            <span className="flex items-center gap-2">
              <span>{activePost.timestamp}</span>
                <span>•</span>
                <a
                  href={activePost.link}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-700 underline underline-offset-2"
                >
                  {getSiteLabel(activePost.link)}
                </a>
              </span>
              <span>{activePost.likes} Likes</span>
            </div>
          </div>

          {/* Conversation/Replies */}
          <div className="space-y-6 pb-24">
            {COMMENTS.map((comment, idx) => {
              const commentAgent = comment.agentId
                ? AGENTS[comment.agentId]
                : undefined;

              return (
                <div
                  key={comment.id}
                  style={{ animationDelay: `${idx * 150 + 300}ms` }}
                  className={`flex gap-3 animate-slide-up opacity-0 ${comment.user === "You" ? "flex-row-reverse" : ""
                    }`}
                >
                  {commentAgent && (
                    <div
                      className={`w-8 h-8 rounded-sm flex-shrink-0 flex items-center justify-center font-bold text-sm ${commentAgent.avatar
                        }`}
                    >
                      {commentAgent.name[0]}
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
                      className={`p-3 rounded-lg max-w-[90%] text-sm leading-relaxed shadow-sm transition-all hover:shadow-md whitespace-pre-line ${comment.user === "You"
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
              );
            })}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe z-20 animate-slide-up delay-200">
        <div className="flex items-center gap-3 max-w-xl mx-auto">
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
