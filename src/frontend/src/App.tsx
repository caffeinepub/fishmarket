import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/CartContext";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { HomePage } from "@/pages/HomePage";
import { MyOrdersPage } from "@/pages/MyOrdersPage";
import { OrderDetailPage } from "@/pages/OrderDetailPage";
import { AdminCustomersPage } from "@/pages/admin/AdminCustomersPage";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminOrdersPage } from "@/pages/admin/AdminOrdersPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root layout (customer)
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Customer layout wrapper
function CustomerLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
      </div>
      <Toaster position="top-right" richColors />
    </CartProvider>
  );
}

const customerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "customer-layout",
  component: CustomerLayout,
});

// Customer routes
const indexRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/",
  component: HomePage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const myOrdersRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/my-orders",
  component: MyOrdersPage,
});

const orderDetailRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/order/$id",
  component: function OrderDetailWrapper() {
    const { id } = orderDetailRoute.useParams();
    return <OrderDetailPage id={BigInt(id)} />;
  },
});

// Admin layout wrapper
function AdminWrapper() {
  const currentPath = window.location.pathname;
  return (
    <CartProvider>
      <AdminLayout currentPath={currentPath}>
        <Outlet />
      </AdminLayout>
      <Toaster position="top-right" richColors />
    </CartProvider>
  );
}

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminWrapper,
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/",
  component: AdminDashboard,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/products",
  component: AdminProductsPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/orders",
  component: AdminOrdersPage,
});

const adminCustomersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/customers",
  component: AdminCustomersPage,
});

// Catch-all redirect
const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <Navigate to="/" />,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  customerLayoutRoute.addChildren([
    indexRoute,
    checkoutRoute,
    myOrdersRoute,
    orderDetailRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminProductsRoute,
    adminOrdersRoute,
    adminCustomersRoute,
  ]),
  catchAllRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
