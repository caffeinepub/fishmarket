import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useMyOrders } from "@/hooks/useQueries";
import { formatDate, formatPrice } from "@/utils/format";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Package, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

export function MyOrdersPage() {
  const { data: orders, isLoading } = useMyOrders();
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="min-h-screen container py-16 flex items-center justify-center">
        <div className="text-center max-w-sm" data-ocid="orders.empty_state">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">
            Track Your Orders
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Sign in to view your order history and track deliveries.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="bg-ocean-mid hover:bg-ocean-deep text-white"
            data-ocid="orders.login_button"
          >
            {isLoggingIn ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              My Orders
            </h1>
            <p className="text-muted-foreground mt-1">
              {orders?.length ?? 0} orders total
            </p>
          </div>
          <Button
            onClick={() => navigate({ to: "/" })}
            className="bg-ocean-mid hover:bg-ocean-deep text-white"
            data-ocid="orders.shop_button"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Shop More
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4" data-ocid="orders.loading_state">
            {(["s1", "s2", "s3"] as const).map((k) => (
              <div key={k} className="bg-card rounded-2xl p-6 shadow-ocean">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="orders.empty_state"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No orders yet
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              You haven't placed any orders. Browse our fresh selection!
            </p>
            <Button
              onClick={() => navigate({ to: "/" })}
              className="bg-ocean-mid hover:bg-ocean-deep text-white"
              data-ocid="orders.shop_button"
            >
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4" data-ocid="orders.list">
            {orders.map((order, index) => (
              <motion.div
                key={order.id.toString()}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                data-ocid={`orders.item.${index + 1}`}
              >
                <Link
                  to="/order/$id"
                  params={{ id: order.id.toString() }}
                  className="block bg-card rounded-2xl p-6 shadow-ocean hover:shadow-ocean-lg transition-all duration-300 group"
                  data-ocid={`orders.link.${index + 1}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-display font-semibold text-foreground">
                          Order #{order.id.toString()}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                        {" · "}
                        {order.items
                          .slice(0, 2)
                          .map((i) => i.productName)
                          .join(", ")}
                        {order.items.length > 2
                          ? ` +${order.items.length - 2} more`
                          : ""}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-display font-bold text-lg text-ocean-deep">
                        {formatPrice(order.totalAmountInCents)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-ocean-mid group-hover:gap-2 transition-all">
                        View Details
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
