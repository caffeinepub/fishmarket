import { StatusBadge } from "@/components/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/useQueries";
import { formatDate, formatPrice } from "@/utils/format";
import { Loader2, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../../backend";

const ALL_STATUSES = [
  OrderStatus.pending,
  OrderStatus.confirmed,
  OrderStatus.outForDelivery,
  OrderStatus.delivered,
  OrderStatus.cancelled,
];

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  outForDelivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function AdminOrdersPage() {
  const { data: orders, isLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  const filteredOrders = orders
    ? filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus)
    : [];

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  const handleStatusChange = async (orderId: bigint, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateStatus.mutateAsync({
        id: orderId,
        status: newStatus as OrderStatus,
      });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusCounts: Record<string, number> = {};
  if (orders) {
    for (const s of ALL_STATUSES) {
      statusCounts[s] = orders.filter((o) => o.status === s).length;
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Orders
        </h1>
        <p className="text-muted-foreground mt-1">
          {orders?.length ?? 0} total orders
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filterStatus} onValueChange={setFilterStatus}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all" data-ocid="admin.orders.filter_all.tab">
            All ({orders?.length ?? 0})
          </TabsTrigger>
          {ALL_STATUSES.map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              data-ocid="admin.orders.filter.tab"
            >
              {STATUS_LABELS[status]} ({statusCounts[status] ?? 0})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="bg-card rounded-2xl shadow-ocean overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3" data-ocid="admin.orders.loading_state">
            {(["s1", "s2", "s3", "s4", "s5", "s6"] as const).map((k) => (
              <Skeleton key={k} className="h-16 w-full" />
            ))}
          </div>
        ) : sortedOrders.length === 0 ? (
          <div
            className="p-16 text-center"
            data-ocid="admin.orders.empty_state"
          >
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-semibold text-foreground mb-2">
              No orders found
            </p>
            <p className="text-sm text-muted-foreground">
              {filterStatus === "all"
                ? "No orders have been placed yet."
                : `No ${STATUS_LABELS[filterStatus]?.toLowerCase()} orders.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Update Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order, index) => (
                  <motion.tr
                    key={order.id.toString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                    data-ocid={`admin.orders.row.${index + 1}`}
                  >
                    <TableCell className="font-mono text-sm font-semibold">
                      #{order.id.toString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerPhone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {formatPrice(order.totalAmountInCents)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        {updatingId === order.id ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Updating...
                          </div>
                        ) : (
                          <Select
                            value={order.status}
                            onValueChange={(v) =>
                              handleStatusChange(order.id, v)
                            }
                          >
                            <SelectTrigger
                              className="w-44 h-8 text-xs"
                              data-ocid={`admin.orders.status_select.${index + 1}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                              data-ocid={`admin.orders.status_dropdown.${index + 1}`}
                            >
                              {ALL_STATUSES.map((status) => (
                                <SelectItem
                                  key={status}
                                  value={status}
                                  className="text-xs"
                                >
                                  {STATUS_LABELS[status]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
