import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import CreatorForm from "./pages/CreatorForm";
import BusinessCard from "./pages/BusinessCard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./components/AuthContext";
import MyQRs from "./pages/MyQRs";
import HomePage from "./pages/HomePage";
import { Sidebar } from "./components/sidebar";
import PaymentInfo from "./pages/payment-info";
import AddAdmin from "./pages/add-admin";
import ManageAdmins from "./pages/manage-admins";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { ForgotPasswordForm } from "./components/forgot-password-form";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <ConditionalNavbar />
            <div className="flex">
              <ConditionalSidebar />
              <main className="p-4 flex-1 pt-16">
                {" "}
                {/* Added pt-16 for navbar spacing */}
                <Routes>
                  <Route path="/" element={<HomePage />} />

                  <Route path="/login" element={<Login />} />

                  <Route path="/register" element={<Register />} />

                  <Route
                    path="/creator-form"
                    element={
                      <ProtectedRoute>
                        <CreatorForm />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/:id" element={<BusinessCard />} />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/myqrs"
                    element={
                      <ProtectedRoute>
                        <MyQRs />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/payment-info"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <PaymentInfo />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/add-admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AddAdmin />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/manage-admins"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <ManageAdmins />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordForm />}
                  />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function ConditionalNavbar() {
  const location = useLocation();

  // List of paths where navbar should NOT appear
  const hideNavbarPaths = [
    "/login",
    "/register",
    // Match single segment paths except profile and myqrs
    (path: string) =>
      /^\/[^/]+$/.test(path) && !["/profile", "/myqrs"].includes(path),
  ];

  const shouldHideNavbar = hideNavbarPaths.some((condition) => {
    if (typeof condition === "function") {
      return condition(location.pathname);
    }
    return location.pathname === condition;
  });

  if (shouldHideNavbar) {
    return null;
  }

  return <Navbar className="fixed top-0 w-full z-50 shadow-sm" />;
}

function ConditionalSidebar() {
  const location = useLocation();
  const showSidebarPaths = ["/payment-info", "/add-admin", "/manage-admins"];

  return showSidebarPaths.some((path) => location.pathname.startsWith(path)) ? (
    <Sidebar className="left-0 top-0 h-screen w-64 z-40 shadow-lg" />
  ) : null;
}

export default App;
