// import "./App.css";
// import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
// import { LandingPage } from "./pages/LandingPage";
// import { ContentPage } from "./pages/ContentPage";
// import { OnboardingPage } from "./pages/OnboardingPage";
// import { FeedPage } from "./pages/FeedPage";
//
// const ProtectedRoute = () => {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;
//   return <Outlet />;
// };
// const PublicRoute = () => {
//   const { user } = useAuth();
//   if (user) return <Navigate to="/dashboard" replace />;
//   return <Outlet />;
// };
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/content" element={<ContentPage />} />
//         <Route path="/onboarding" element={<OnboardingPage />} />
//         <Route path="/feed" element={<FeedPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
//
// export default App;
// "use client";
import "./App.css";
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
} from "react-router"; // or "react-router-dom" depending on your specific v7 setup
import type { ScreenType, FeedTabType, Post } from "./types/index.ts";
import { INITIAL_POSTS } from "./lib/index.ts";
import { AnimationStyles } from "./components/AnimationStyles";

// Import the split pages
import { OnboardingPage } from "./pages/OnboardingPage";
import { FeedPage } from "./pages/FeedPage";
import { ContentPage } from "./pages/ContentPage";

// --- 1. Detail Route Wrapper ---
// This bridges the URL parameter (:postId) to the "activePost" prop
// expected by your DetailPage component.
const DetailRouteWrapper: React.FC<{
  setCurrentScreen: (screen: ScreenType) => void;
  followedAgents: string[];
  toggleFollowAgent: (agentId: string) => void;
}> = ({ setCurrentScreen, followedAgents, toggleFollowAgent }) => {
  const { postId } = useParams();

  // Find the post based on URL param
  const activePost = INITIAL_POSTS.find((p) => p.id === Number(postId)) || null;

  if (!activePost) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <ContentPage
      activePost={activePost}
      setCurrentScreen={setCurrentScreen}
      followedAgents={followedAgents}
      toggleFollowAgent={toggleFollowAgent}
    />
  );
};

// --- 2. Main Content Controller ---
// This component sits inside the Router context to use 'useNavigate'
const AppContent = () => {
  const navigate = useNavigate();

  // --- Global State ---
  // We keep user preferences global so they persist across route changes
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "tech",
    "science",
    "urbanism",
  ]);
  const [feedTab, setFeedTab] = useState<FeedTabType>("channels");
  const [followedAgents, setFollowedAgents] = useState<string[]>(["Dex"]);

  // --- Handlers / Adapters ---

  // Adapter: Convert the old string-based navigation to Router navigation
  const handleScreenChange = (screen: ScreenType) => {
    if (screen === "onboarding") navigate("/");
    if (screen === "feed") navigate("/feed");
    // 'detail' is usually handled by clicking a post, handled below
  };

  const toggleTopic = (id: string) => {
    if (selectedTopics.includes(id)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== id));
    } else {
      setSelectedTopics([...selectedTopics, id]);
    }
  };

  const toggleFollowAgent = (agentId: string) => {
    if (followedAgents.includes(agentId)) {
      setFollowedAgents(followedAgents.filter((id) => id !== agentId));
    } else {
      setFollowedAgents([...followedAgents, agentId]);
    }
  };

  // When a post is clicked, navigate to the dynamic route
  const handlePostClick = (post: Post) => {
    navigate(`/thread/${post.id}`);
  };

  // --- Filter Logic ---
  let filteredPosts: Post[] = [];
  if (feedTab === "channels") {
    filteredPosts = INITIAL_POSTS.filter((post) =>
      selectedTopics.includes(post.topic),
    );
  } else {
    filteredPosts = INITIAL_POSTS.filter((post) =>
      followedAgents.includes(post.agentId),
    );
  }

  return (
    <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden no-scrollbar relative">
      <Routes>
        <Route
          path="/"
          element={
            <OnboardingPage
              selectedTopics={selectedTopics}
              toggleTopic={toggleTopic}
              setCurrentScreen={handleScreenChange}
            />
          }
        />
        <Route
          path="/feed"
          element={
            <FeedPage
              setCurrentScreen={handleScreenChange}
              posts={filteredPosts}
              handlePostClick={handlePostClick}
              feedTab={feedTab}
              setFeedTab={setFeedTab}
              followedAgents={followedAgents}
            />
          }
        />
        <Route
          path="/thread/:postId"
          element={
            <DetailRouteWrapper
              setCurrentScreen={handleScreenChange}
              followedAgents={followedAgents}
              toggleFollowAgent={toggleFollowAgent}
            />
          }
        />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

// --- 3. Root Export ---
export default function SidebarApp() {
  return (
    <BrowserRouter>
      <div className="font-sans text-slate-900 bg-slate-100 no-scrollbar w-screen h-screen flex justify-center">
        <AnimationStyles />
        <AppContent />
      </div>
    </BrowserRouter>
  );
}
