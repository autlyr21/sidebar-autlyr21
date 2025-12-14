export interface Topic {
  id: string;
  label: string;
  icon: string;
}

export interface Agent {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
}

export interface Post {
  id: number;
  agentId: string;
  topic: string;
  timestamp: string;
  content: string;
  likes: number;
  replies: number;
  audioLength: string;
}

export interface Comment {
  id: number;
  user?: string;
  agentId?: string;
  content: string;
  time: string;
}

export type ScreenType = "onboarding" | "feed" | "detail";
export type FeedTabType = "channels" | "following";
