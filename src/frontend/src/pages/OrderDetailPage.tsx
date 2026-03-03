import { StatusBadge } from "@/components/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { formatDate, formatPrice, formatWeight } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { OrderStatus } from "../backend";

const STATUS_STEPS = [
  { status: OrderStatus.pending, label: "Order Placed", icon: Package },
  { status: OrderStatus.confirmed, label: "Confirmed", icon: CheckCircle },
  {
    status: OrderStatus.outForDelivery,
    label: "Out for Delivery",
    icon: Truck,
  },
  { status: OrderStatus.delivered, label: "Delivered", icon: CheckCircle },
];

const STATUS_ORDER = [
  OrderStatus.pending,
  OrderStatus.confirmed,
  OrderStatus.outForDelivery,
  OrderStatus.delivered,
];

export function OrderDetailPage({ id }: { id: bigint }) {
  const { data: order, isLoading, error } = useOrder(id);

  if (isLoading) {
    return (
      <div className="container py-8" data-ocid="order.loading_state">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-8 w-56 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-60 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div
        className="container py-16 flex items-center justify-center"
        data-ocid="order.error_state"
      >
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">
            Order Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            We couldn't find this order. It may have been removed or you may not
            have access.
          </p>
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-2 text-ocean-mid hover:text-ocean-deep"
            data-ocid="order.back_button"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === OrderStatus.cancelled;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Back */}
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          data-ocid="order.back_button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Order #{order.id.toString()}
            </h1>
            <p className="text-muted-foreground mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <StatusBadge status={order.status} className="text-sm px-4 py-1.5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            {!isCancelled && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 shadow-ocean"
              >
                <h2 className="font-display text-lg font-semibold mb-6">
                  Order Status
                </h2>
                <div className="relative">
                  {/* Track line */}
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
                  <div
                    className="absolute top-5 left-5 h-0.5 bg-ocean-mid transition-all duration-700"
                    style={{
                      width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                    }}
                  />

                  <div className="flex justify-between relative">
                    {STATUS_STEPS.map((step, i) => {
                      const Icon = step.icon;
                      const isCompleted = i <= currentStatusIndex;
                      const isCurrent = i === currentStatusIndex;
                      return (
                        <div
                          key={step.status}
                          className="flex flex-col items-center gap-2 flex-1"
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300",
                              isCompleted
                                ? "bg-ocean-mid text-white"
                                : "bg-muted text-muted-foreground",
                              isCurrent && "ring-4 ring-ocean-mid/20",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span
                            className={cn(
                              "text-xs text-center font-medium max-w-[70px]",
                              isCompleted
                                ? "text-ocean-mid"
                                : "text-muted-foreground",
                            )}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {isCancelled && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">
                  This order has been cancelled.
                </p>
              </div>
            )}

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-ocean"
            >
              <h2 className="font-display text-lg font-semibold mb-4">
                Items Ordered
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    data-ocid={`order.item.${index + 1}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {item.productName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.priceAtPurchaseInCents)} ×{" "}
                        {Number(item.quantity)}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {formatPrice(
                        Number(item.priceAtPurchaseInCents) *
                          Number(item.quantity),
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display font-bold text-xl text-ocean-deep">
                  {formatPrice(order.totalAmountInCents)}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-2xl p-6 shadow-ocean h-fit"
          >
            <h2 className="font-display text-lg font-semibold mb-4">
              Delivery Info
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-4 w-4 text-ocean-mid" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Customer
                  </p>
                  <p className="font-medium text-foreground">
                    {order.customerName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="h-4 w-4 text-ocean-mid" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                  <p className="font-medium text-foreground">
                    {order.customerPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-ocean-mid" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Address
                  </p>
                  <p className="font-medium text-foreground">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="h-4 w-4 text-ocean-mid" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Order Time
                  </p>
                  <p className="font-medium text-foreground text-sm">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
