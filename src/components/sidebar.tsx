import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, UserPlus, Users, LogOut, QrCode, LayoutDashboard } from "lucide-react";
import { useAuth } from "./AuthContext"; // Adjust the path as needed
import type React from "react"; // Added import for React

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={cn(
        "pb-12 w-1/6 min-h-screen bg-[#1f1f1f] border-r border-white/10 transition-all duration-300 animate-fade-in",
        className,
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="h-8 w-8 text-white" />
            <h2 className="text-2xl font-sans tracking-tight text-white">QRBook</h2>
          </div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-white/60" />
            <h3 className="text-sm font-sans text-white/60">Admin Dashboard</h3>
          </div>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-white/60">Management</h2>
            <nav className="space-y-2">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start hover:bg-white/5 text-white font-sans tracking-wide"
              >
                <Link to="/payment-info" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Info
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start hover:bg-white/5 text-white font-sans tracking-wide"
              >
                <Link to="/add-admin" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add an Admin
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start hover:bg-white/5 text-white font-sans tracking-wide"
              >
                <Link to="/manage-admins" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Manage Admins
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>
      <div className="px-3 mt-auto fixed bottom-4 w-64">
        <Button
          className="w-full bg-[#fb9797] hover:bg-[#fb9797]/90 text-white font-sans tracking-wide"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}