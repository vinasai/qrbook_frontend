import React, { useState } from "react";
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
import type { User } from "./types/user";
import { AuthProvider } from "./components/AuthContext";
import MyQRs from "./pages/MyQRs";
import HomePage from "./pages/HomePage";
import { Sidebar } from "./components/sidebar";
import PaymentInfo from "./pages/payment-info";
import AddAdmin from "./pages/add-admin";
import ManageAdmins from "./pages/manage-admins";

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Router>
            <ConditionalNavbar />
            <div className="flex">
              <ConditionalSidebar />
              <main className="p-4 flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/creator-form" element={<CreatorForm setUser={setUser} />} />
                  <Route path="/business-card/:id" element={<BusinessCard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/myqrs" element={<MyQRs />} />
                  <Route path="/payment-info" element={<PaymentInfo />} />
                  <Route path="/add-admin" element={<AddAdmin />} />
                  <Route path="/manage-admins" element={<ManageAdmins />} />
                </Routes>
              </main>
            </div>
          </Router>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

function ConditionalNavbar() {
  const location = useLocation();
  return location.pathname.startsWith("/business-card") ||
    location.pathname.startsWith("/payment-info") ||
    location.pathname.startsWith("/add-admin") ||
    location.pathname.startsWith("/manage-admins")
    ? null
    : <Navbar />;
}

function ConditionalSidebar() {
  const location = useLocation();
  return location.pathname.startsWith("/business-card") ||
    location.pathname === "/" ||
    location.pathname.startsWith("/creator-form") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/myqrs")
    ? null
    : <Sidebar />;
}

export default App;