import "./App.css";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { ContentPage } from "./pages/ContentPage";
import { SubscriptionPage } from "./pages/SubscriptionPage";
import { FeedPage } from "./pages/FeedPage";

const ProtectedRoute = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};
const PublicRoute = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/feed" element={<FeedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
