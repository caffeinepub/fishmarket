import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { usePlaceOrder } from "@/hooks/useQueries";
import { formatPrice } from "@/utils/format";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function CheckoutPage() {
  const { items, totalCents, clearCart } = useCart();
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const placeOrderMutation = usePlaceOrder();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<bigint | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[+\d\s-]{7,}$/.test(form.phone.trim()))
      errs.phone = "Enter a valid phone number";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    if (form.address.trim().length < 10)
      errs.address = "Please enter a complete address";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!identity) {
      toast.error("Please sign in to place an order");
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: BigInt(item.quantity),
        priceAtPurchaseInCents: item.priceInCents,
      }));

      const id = await placeOrderMutation.mutateAsync({
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        deliveryAddress: form.address.trim(),
        items: orderItems,
      });

      setOrderId(id);
      setOrderPlaced(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
      console.error(err);
    }
  };

  if (orderPlaced && orderId !== null) {
    return (
      <div
        className="min-h-screen container py-16 flex items-center justify-center"
        data-ocid="checkout.success_state"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Order Placed! 🎉
          </h2>
          <p className="text-muted-foreground mb-2">
            Your order #{orderId.toString()} has been placed successfully.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            We'll confirm your order and get it delivered fresh to your door.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => navigate({ to: "/my-orders" })}
              className="bg-ocean-mid hover:bg-ocean-deep text-white"
              data-ocid="checkout.orders_button"
            >
              Track My Order
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/" })}
              data-ocid="checkout.shop_button"
            >
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen container py-16 flex items-center justify-center">
        <div className="text-center" data-ocid="checkout.empty_state">
          <h2 className="font-display text-2xl font-bold mb-3">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some seafood before checking out!
          </p>
          <Button
            onClick={() => navigate({ to: "/" })}
            className="bg-ocean-mid hover:bg-ocean-deep text-white"
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          data-ocid="checkout.back_button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-card rounded-2xl p-6 shadow-ocean">
              <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ocean-mid" />
                Delivery Details
              </h2>

              {!identity && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-800 mb-3">
                    Please sign in to place an order and track your delivery.
                  </p>
                  <Button
                    size="sm"
                    onClick={login}
                    disabled={isLoggingIn}
                    className="bg-ocean-mid hover:bg-ocean-deep text-white"
                    data-ocid="checkout.login_button"
                  >
                    {isLoggingIn && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign In to Order
                  </Button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, name: e.target.value }));
                      if (errors.name) setErrors((e) => ({ ...e, name: "" }));
                    }}
                    className={errors.name ? "border-destructive" : ""}
                    autoComplete="name"
                    data-ocid="checkout.name_input"
                  />
                  {errors.name && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="checkout.name_error"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 555 000 0000"
                    value={form.phone}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, phone: e.target.value }));
                      if (errors.phone) setErrors((e) => ({ ...e, phone: "" }));
                    }}
                    className={errors.phone ? "border-destructive" : ""}
                    autoComplete="tel"
                    data-ocid="checkout.phone_input"
                  />
                  {errors.phone && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="checkout.phone_error"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="address"
                    className="flex items-center gap-1.5"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    Delivery Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Ocean Drive, Miami, FL 33101"
                    value={form.address}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, address: e.target.value }));
                      if (errors.address)
                        setErrors((e) => ({ ...e, address: "" }));
                    }}
                    className={errors.address ? "border-destructive" : ""}
                    autoComplete="street-address"
                    data-ocid="checkout.address_input"
                  />
                  {errors.address && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="checkout.address_error"
                    >
                      {errors.address}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-ocean-mid hover:bg-ocean-deep text-white font-semibold text-base mt-2"
                  disabled={placeOrderMutation.isPending || !identity}
                  data-ocid="checkout.submit_button"
                >
                  {placeOrderMutation.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  {placeOrderMutation.isPending
                    ? "Placing Order..."
                    : "Place Order"}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-card rounded-2xl p-6 shadow-ocean">
              <h2 className="font-display text-xl font-semibold mb-6">
                Order Summary
              </h2>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.productId.toString()}
                    className="flex justify-between items-start"
                    data-ocid={`checkout.item.${index + 1}`}
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-medium text-sm text-foreground">
                        {item.productName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatPrice(item.priceInCents)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-sm shrink-0">
                      {formatPrice(Number(item.priceInCents) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalCents)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-display font-bold text-2xl text-ocean-deep">
                  {formatPrice(totalCents)}
                </span>
              </div>

              <div className="mt-6 p-3 bg-secondary rounded-xl">
                <p className="text-xs text-muted-foreground">
                  🐟 Your fresh seafood will be delivered within 24 hours of
                  order confirmation. Temperature-controlled delivery
                  guaranteed.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
