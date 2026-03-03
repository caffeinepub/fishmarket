export function formatPrice(cents: bigint | number): string {
  const amount = typeof cents === "bigint" ? Number(cents) : cents;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}

export function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

export function formatWeight(grams: bigint): string {
  const g = Number(grams);
  if (g >= 1000) {
    return `${(g / 1000).toFixed(2)} kg`;
  }
  return `${g} g`;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    outForDelivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status] ?? status;
}

export function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    pending: "status-pending",
    confirmed: "status-confirmed",
    outForDelivery: "status-outForDelivery",
    delivered: "status-delivered",
    cancelled: "status-cancelled",
  };
  return classes[status] ?? "";
}
