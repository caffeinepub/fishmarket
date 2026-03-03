import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/utils/format";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalCents } =
    useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate({ to: "/checkout" });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] flex flex-col p-0"
        data-ocid="cart.sheet"
      >
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-xl flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-ocean-mid" />
              Your Cart
              {items.length > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCart}
              data-ocid="cart.close_button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 px-6"
            data-ocid="cart.empty_state"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground mb-1">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground">
                Add some fresh seafood to get started!
              </p>
            </div>
            <Button
              onClick={closeCart}
              variant="outline"
              data-ocid="cart.secondary_button"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.productId.toString()}
                    className="flex gap-3 items-start"
                    data-ocid={`cart.item.${index + 1}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {item.productName}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {formatPrice(item.priceInCents)} each
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          data-ocid={`cart.secondary_button.${index + 1}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          data-ocid={`cart.primary_button.${index + 1}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-semibold text-sm">
                        {formatPrice(Number(item.priceInCents) * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.productId)}
                        data-ocid={`cart.delete_button.${index + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="px-6 py-4 border-t border-border space-y-4">
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold text-xl">
                  {formatPrice(totalCents)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery fees calculated at checkout
              </p>
              <Button
                className="w-full bg-ocean-mid hover:bg-ocean-deep text-white font-semibold"
                onClick={handleCheckout}
                data-ocid="cart.submit_button"
              >
                Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
