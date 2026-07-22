import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";

import Login from "./pages/Login";
import SignupDonor from "./pages/SignupDonor";
import SignupBank from "./pages/SignupBank";
import DonorDashboard from "./pages/DonorDashboard";
import BankDashboard from "./pages/BankDashboard";
import NotFound from "./pages/NotFound";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div>
      <Toaster
        toastOptions={{ /* ...your existing styles... */ }}
        gutter={8}
        containerStyle={{ top: 20 }}
        toastOptions={{
          style: {
            background: "#1A1815",
            color: "#FBF8F4",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            borderRadius: "8px",
          },
          success: {
            iconTheme: { primary: "#2F6844", secondary: "#FBF8F4" },
          },
          error: {
            iconTheme: { primary: "#C41E3A", secondary: "#FBF8F4" },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup/donor" element={!authUser ? <SignupDonor /> : <Navigate to="/" />} />
        <Route path="/signup/bank" element={!authUser ? <SignupBank /> : <Navigate to="/" />} />
        <Route
          path="/"
          element={
            !authUser ? (
              <Navigate to="/login" />
            ) : authUser.role === "bank" ? (
              <BankDashboard />
            ) : (
              <DonorDashboard />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;