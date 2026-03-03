import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Fish,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { totalItems, openCart } = useCart();
  const { login, clear, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = !!identity;

  const navLinks = [
    { to: "/", label: "Shop" },
    { to: "/my-orders", label: "My Orders" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-bold text-xl"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg bg-ocean-mid flex items-center justify-center">
            <Fish className="h-5 w-5 text-white" />
          </div>
          <span className="text-ocean-deep">
            Fish<span className="text-coral">Market</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground font-semibold" }}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium text-ocean-mid hover:text-ocean-deep transition-colors"
              data-ocid="nav.link"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
            data-ocid="nav.cart_button"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-coral text-white border-0"
                data-ocid="nav.cart_badge"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </Badge>
            )}
          </Button>

          {/* Auth */}
          {isInitializing ? (
            <Button variant="ghost" size="sm" disabled>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </Button>
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-ocid="nav.user_button">
                  <div className="w-7 h-7 rounded-full bg-ocean-mid flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48"
                data-ocid="nav.dropdown_menu"
              >
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/my-orders" })}
                  data-ocid="nav.orders_link"
                >
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/admin" })}
                    data-ocid="nav.admin_link"
                  >
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={clear}
                  className="text-destructive focus:text-destructive"
                  data-ocid="nav.logout_button"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              className="bg-ocean-mid hover:bg-ocean-deep text-white font-semibold"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="nav.login_button"
            >
              {isLoggingIn ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-ocid="nav.mobile_menu_toggle"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden border-t border-border overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="container py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              data-ocid="nav.mobile_link"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="py-2 text-sm font-medium text-ocean-mid hover:text-ocean-deep"
              onClick={() => setMobileMenuOpen(false)}
              data-ocid="nav.mobile_admin_link"
            >
              Admin Panel
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
