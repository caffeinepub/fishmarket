import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Fish,
  LayoutDashboard,
  Menu,
  Package,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
];

interface AdminLayoutProps {
  children: ReactNode;
  currentPath: string;
}

export function AdminLayout({ children, currentPath }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: isAdmin, isLoading } = useIsAdmin();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-ocean-mid border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.error_state"
      >
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Fish className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            You need admin privileges to access this area.
          </p>
          <Button
            onClick={() => navigate({ to: "/" })}
            className="bg-ocean-mid hover:bg-ocean-deep text-white"
            data-ocid="admin.back_button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return currentPath === to;
    return currentPath.startsWith(to);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
          "lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
              <Fish className="h-5 w-5 text-sidebar-primary" />
            </div>
            <span className="font-display font-bold text-sidebar-foreground">
              Fish<span className="text-coral">Market</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40 px-3 mb-2">
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                onClick={() => setSidebarOpen(false)}
                data-ocid="admin.nav.link"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to Store */}
        <div className="p-3 border-t border-sidebar-border">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
            data-ocid="admin.store_link"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={-1}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border h-14 flex items-center px-4 gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            data-ocid="admin.menu_button"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-display font-semibold text-foreground">
            Admin Panel
          </span>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
