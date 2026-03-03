import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomers } from "@/hooks/useQueries";
import { User, Users } from "lucide-react";
import { motion } from "motion/react";

export function AdminCustomersPage() {
  const { data: customers, isLoading } = useCustomers();

  const sortedCustomers = customers
    ? [...customers].sort((a, b) => Number(b.orderCount) - Number(a.orderCount))
    : [];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Customers
        </h1>
        <p className="text-muted-foreground mt-1">
          {customers?.length ?? 0} registered customers
        </p>
      </div>

      <div className="bg-card rounded-2xl shadow-ocean overflow-hidden">
        {isLoading ? (
          <div
            className="p-6 space-y-3"
            data-ocid="admin.customers.loading_state"
          >
            {(["s1", "s2", "s3", "s4", "s5"] as const).map((k) => (
              <Skeleton key={k} className="h-14 w-full" />
            ))}
          </div>
        ) : !customers || customers.length === 0 ? (
          <div
            className="p-16 text-center"
            data-ocid="admin.customers.empty_state"
          >
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-semibold text-foreground mb-2">
              No customers yet
            </p>
            <p className="text-sm text-muted-foreground">
              Customers will appear here once they place orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Principal ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.principal.toString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                    data-ocid={`admin.customers.row.${index + 1}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {customer.name || "Anonymous Customer"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {customer.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          Number(customer.orderCount) >= 5
                            ? "bg-green-100 text-green-700 border-0"
                            : Number(customer.orderCount) >= 2
                              ? "bg-blue-100 text-blue-700 border-0"
                              : "bg-secondary text-secondary-foreground border-0"
                        }
                      >
                        {Number(customer.orderCount)} order
                        {Number(customer.orderCount) !== 1 ? "s" : ""}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                        {customer.principal.toString().slice(0, 20)}...
                      </code>
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
