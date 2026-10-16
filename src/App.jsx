
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import { useAuth } from "./hooks/useAuth";

function AppContent() {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-[#090909] text-white">
      <Navbar
        user={user}
        authLoading={loading}
        openAuth={() => setAuthOpen(true)}
      />

      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                user={user}
                openAuth={() => setAuthOpen(true)}
                openCollection={() => navigate("/collection")}
              />
            }
          />

          <Route
            path="/collection"
            element={
              loading ? (
                <div
                  className="px-5 py-20 text-center text-neutral-400"
                  role="status"
                >
                  Loading your collection...
                </div>
              ) : user ? (
                <Collection
                  user={user}
                  goHome={() => navigate("/")}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </div>

      <Footer />

      {authOpen && (
        <AuthModal onClose={() => setAuthOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
