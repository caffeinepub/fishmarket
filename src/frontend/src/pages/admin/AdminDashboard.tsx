import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminStats, useAllOrders } from "@/hooks/useQueries";
import { formatDate, formatPrice } from "@/utils/format";
import {
  CheckCircle,
  Clock,
  DollarSign,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  index: number;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  index,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-card rounded-2xl p-6 shadow-ocean"
      data-ocid={`admin.stat.card.${index + 1}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="font-display font-bold text-3xl text-foreground mt-1">
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
}

export function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: orders, isLoading: ordersLoading } = useAllOrders();

  const recentOrders = orders
    ? [...orders]
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
        .slice(0, 8)
    : [];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of your seafood marketplace
        </p>
      </div>

      {/* Stats Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {(["s1", "s2", "s3", "s4"] as const).map((k) => (
            <div key={k} className="bg-card rounded-2xl p-6 shadow-ocean">
              <Skeleton className="h-4 w-28 mb-3" />
              <Skeleton className="h-9 w-20" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Orders"
            value={Number(stats.totalOrders).toLocaleString()}
            icon={ShoppingBag}
            color="text-ocean-mid"
            bgColor="bg-blue-100"
            index={0}
          />
          <StatCard
            title="Total Revenue"
            value={formatPrice(stats.totalRevenue)}
            icon={DollarSign}
            color="text-green-600"
            bgColor="bg-green-100"
            index={1}
          />
          <StatCard
            title="Pending Orders"
            value={Number(stats.pendingCount).toLocaleString()}
            icon={Clock}
            color="text-amber-600"
            bgColor="bg-amber-100"
            index={2}
          />
          <StatCard
            title="Delivered"
            value={Number(stats.deliveredCount).toLocaleString()}
            icon={CheckCircle}
            color="text-emerald-600"
            bgColor="bg-emerald-100"
            index={3}
          />
        </div>
      ) : null}

      {/* Recent Orders Table */}
      <div className="bg-card rounded-2xl shadow-ocean overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-ocean-mid" />
            Recent Orders
          </h2>
        </div>

        {ordersLoading ? (
          <div className="p-6 space-y-3" data-ocid="admin.orders.loading_state">
            {(["s1", "s2", "s3", "s4", "s5"] as const).map((k) => (
              <Skeleton key={k} className="h-12 w-full" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div
            className="p-12 text-center text-muted-foreground"
            data-ocid="admin.orders.empty_state"
          >
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order, index) => (
                  <TableRow
                    key={order.id.toString()}
                    data-ocid={`admin.order.row.${index + 1}`}
                  >
                    <TableCell className="font-mono text-sm">
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
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(order.totalAmountInCents)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
