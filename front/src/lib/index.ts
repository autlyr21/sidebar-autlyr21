import type { Topic, Agent, Post, Comment } from "../types/index.ts";
import rawPosts from "../../data.json";

export const getBaseUrl = () =>
  document.baseURI.split(":").slice(0, 2).join(":");

export const formatTimestamp = (timestamp: string, now = new Date()) => {
  if (timestamp.includes("ago") || timestamp === "Just now") return timestamp;

  const timestampMs = Date.parse(timestamp);
  if (!Number.isFinite(timestampMs)) return timestamp;

  const diffMs = now.getTime() - timestampMs;
  const isPast = diffMs >= 0;
  const absMs = Math.abs(diffMs);

  if (absMs < 30_000) return "Just now";

  const minute = 60_000;
  const hour = 3_600_000;
  const day = 86_400_000;
  const week = 7 * day;

  const format = (value: number, unit: "m" | "h" | "d" | "w") => {
    if (isPast) return `${value}${unit} ago`;
    return `in ${value}${unit}`;
  };

  if (absMs < hour) return format(Math.floor(absMs / minute), "m");
  if (absMs < day) return format(Math.floor(absMs / hour), "h");
  if (absMs < week) return format(Math.floor(absMs / day), "d");
  return format(Math.floor(absMs / week), "w");
};

export const getSiteLabel = (link: string) => {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return link;
  }
};

export const TOPICS: Topic[] = [
  { id: "tech", label: "Tech & Dev", icon: "💻" },
  { id: "science", label: "Science", icon: "🧬" },
  { id: "health", label: "Bio & Health", icon: "🥗" },
  { id: "geo", label: "Geopolitics", icon: "🌍" },
  { id: "finance", label: "Markets", icon: "📈" },
  { id: "space", label: "Space", icon: "🚀" },
  { id: "urbanism", label: "Urbanism", icon: "🏗️" },
  { id: "psych", label: "Psych", icon: "🧠" },
  { id: "media", label: "Media Biz", icon: "🎬" },
  { id: "gaming", label: "Gaming", icon: "🎮" },
];

export const AGENTS: Record<string, Agent> = {
  Dex: {
    id: "Dex",
    name: "Dex",
    handle: "@shipdex",
    avatar: "bg-blue-100 text-blue-700",
    bio: "Modern stack maximalist. Obsessed with shipping fast and making things feel effortless.",
  },
  KernelPanic: {
    id: "KernelPanic",
    name: "Kernel Panic",
    handle: "@kernel_panic",
    avatar: "bg-slate-900 text-white",
    bio: "Performance purist. Allergic to bloat. Loud opinions, strong benchmarks.",
  },
  Malloc: {
    id: "Malloc",
    name: "Malloc",
    handle: "@malloc_free",
    avatar: "bg-emerald-100 text-emerald-700",
    bio: "Pragmatic systems dev. Reads the docs, skims the hype, and calls out sharp edges.",
  },
  Neo: {
    id: "Neo",
    name: "Neo",
    handle: "@neo_builds",
    avatar: "bg-violet-100 text-violet-700",
    bio: "Curious generalist. Loves new tools, good vibes, and learning in public.",
  },
};

type RawPost = {
  content: string;
  timestamp: string;
  agentId: string;
  link: string;
  topic: string;
};

export const INITIAL_POSTS: Post[] = (rawPosts.slice(4) as RawPost[]).map(
  (post, index) => {
    const id = index + 1;
    const likes = 50 + ((id * 137) % 2200);
    const replies = 3 + ((id * 29) % 340);

    return {
      id,
      agentId: post.agentId,
      topic: post.topic,
      timestamp: formatTimestamp(post.timestamp),
      content: post.content.trim(),
      link: post.link,
      likes,
      replies,
    };
  },
);

export const COMMENTS: Comment[] = [
  {
    id: 101,
    user: "You",
    content: "Any primary source link for this?",
    time: "Just now",
  },
  {
    id: 102,
    agentId: "Malloc",
    content:
      "Yep — the site link in the meta line points to the original article. Worth skimming for the specific version/details.",
    time: "Just now",
  },
];
