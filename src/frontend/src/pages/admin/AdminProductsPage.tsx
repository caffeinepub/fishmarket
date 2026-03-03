import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "@/hooks/useQueries";
import { formatPrice, formatWeight } from "@/utils/format";
import {
  Loader2,
  Package,
  Pencil,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../../backend";

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: string;
  weight: string;
  unit: string;
  stock: string;
  available: boolean;
}

const defaultForm: ProductFormData = {
  name: "",
  category: "",
  description: "",
  price: "",
  weight: "",
  unit: "kg",
  stock: "",
  available: true,
};

function ProductFormDialog({
  open,
  onClose,
  editProduct,
}: {
  open: boolean;
  onClose: () => void;
  editProduct: Product | null;
}) {
  const [form, setForm] = useState<ProductFormData>(() => {
    if (editProduct) {
      return {
        name: editProduct.name,
        category: editProduct.category,
        description: editProduct.description,
        price: (Number(editProduct.priceInCents) / 100).toFixed(2),
        weight: Number(editProduct.weightGrams).toString(),
        unit: editProduct.unit,
        stock: Number(editProduct.stockQty).toString(),
        available: editProduct.available,
      };
    }
    return defaultForm;
  });
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const isLoading = addProduct.isPending || updateProduct.isPending;

  const validate = (): boolean => {
    const errs: Partial<ProductFormData> = {};
    if (!form.name.trim()) errs.name = "Name required";
    if (!form.category.trim()) errs.category = "Category required";
    if (!form.description.trim()) errs.description = "Description required";
    if (
      !form.price ||
      Number.isNaN(Number(form.price)) ||
      Number(form.price) <= 0
    )
      errs.price = "Valid price required";
    if (
      !form.weight ||
      Number.isNaN(Number(form.weight)) ||
      Number(form.weight) <= 0
    )
      errs.weight = "Valid weight required";
    if (!form.unit.trim()) errs.unit = "Unit required";
    if (
      !form.stock ||
      Number.isNaN(Number(form.stock)) ||
      Number(form.stock) < 0
    )
      errs.stock = "Valid stock quantity required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const priceInCents = BigInt(Math.round(Number(form.price) * 100));
    const weightGrams = BigInt(Math.round(Number(form.weight)));
    const stockQty = BigInt(Math.round(Number(form.stock)));

    try {
      if (editProduct) {
        await updateProduct.mutateAsync({
          id: editProduct.id,
          name: form.name.trim(),
          category: form.category.trim(),
          description: form.description.trim(),
          priceInCents,
          weightGrams,
          unit: form.unit.trim(),
          stockQty,
          available: form.available,
        });
        toast.success("Product updated successfully");
      } else {
        await addProduct.mutateAsync({
          name: form.name.trim(),
          category: form.category.trim(),
          description: form.description.trim(),
          priceInCents,
          weightGrams,
          unit: form.unit.trim(),
          stockQty,
        });
        toast.success("Product added successfully");
      }
      onClose();
    } catch (err) {
      toast.error("Failed to save product");
      console.error(err);
    }
  };

  const field = (key: keyof ProductFormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="admin.product.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {editProduct
              ? "Update the product details below."
              : "Fill in the product details to add it to your store."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="p-name">Product Name</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => field("name", e.target.value)}
                placeholder="Atlantic Salmon Fillet"
                className={errors.name ? "border-destructive" : ""}
                data-ocid="admin.product.name_input"
              />
              {errors.name && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="admin.product.name_error"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-cat">Category</Label>
              <Input
                id="p-cat"
                value={form.category}
                onChange={(e) => field("category", e.target.value)}
                placeholder="Fish, Shellfish..."
                className={errors.category ? "border-destructive" : ""}
                data-ocid="admin.product.category_input"
              />
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-unit">Unit</Label>
              <Input
                id="p-unit"
                value={form.unit}
                onChange={(e) => field("unit", e.target.value)}
                placeholder="kg, fillet, dozen..."
                className={errors.unit ? "border-destructive" : ""}
                data-ocid="admin.product.unit_input"
              />
              {errors.unit && (
                <p className="text-xs text-destructive">{errors.unit}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-price">Price (USD)</Label>
              <Input
                id="p-price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => field("price", e.target.value)}
                placeholder="18.99"
                className={errors.price ? "border-destructive" : ""}
                data-ocid="admin.product.price_input"
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-weight">Weight (grams)</Label>
              <Input
                id="p-weight"
                type="number"
                min="1"
                value={form.weight}
                onChange={(e) => field("weight", e.target.value)}
                placeholder="500"
                className={errors.weight ? "border-destructive" : ""}
                data-ocid="admin.product.weight_input"
              />
              {errors.weight && (
                <p className="text-xs text-destructive">{errors.weight}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-stock">Stock Quantity</Label>
              <Input
                id="p-stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => field("stock", e.target.value)}
                placeholder="25"
                className={errors.stock ? "border-destructive" : ""}
                data-ocid="admin.product.stock_input"
              />
              {errors.stock && (
                <p className="text-xs text-destructive">{errors.stock}</p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="p-desc">Description</Label>
              <Textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => field("description", e.target.value)}
                placeholder="Premium fresh Atlantic salmon..."
                rows={3}
                className={errors.description ? "border-destructive" : ""}
                data-ocid="admin.product.description_textarea"
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            {editProduct && (
              <div className="col-span-2 flex items-center gap-3">
                <Label>Availability</Label>
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, available: !f.available }))
                  }
                  className="flex items-center gap-2 text-sm"
                  data-ocid="admin.product.available_toggle"
                >
                  {form.available ? (
                    <>
                      <ToggleRight className="h-6 w-6 text-green-500" />
                      <span className="text-green-600 font-medium">
                        Available
                      </span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                      <span className="text-muted-foreground">Unavailable</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin.product.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-ocean-mid hover:bg-ocean-deep text-white"
            data-ocid="admin.product.save_button"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editProduct ? "Save Changes" : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteProduct.mutateAsync(deletingId);
      toast.success("Product deleted");
      setDeletingId(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleToggleAvailability = async (p: Product) => {
    try {
      await updateProduct.mutateAsync({ ...p, available: !p.available });
      toast.success(`Product ${p.available ? "hidden" : "shown"}`);
    } catch {
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Products
          </h1>
          <p className="text-muted-foreground mt-1">
            {products?.length ?? 0} products in store
          </p>
        </div>
        <Button
          className="bg-ocean-mid hover:bg-ocean-deep text-white"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          data-ocid="admin.products.add_button"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-card rounded-2xl shadow-ocean overflow-hidden">
        {isLoading ? (
          <div
            className="p-6 space-y-3"
            data-ocid="admin.products.loading_state"
          >
            {(["s1", "s2", "s3", "s4", "s5", "s6"] as const).map((k) => (
              <Skeleton key={k} className="h-14 w-full" />
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div
            className="p-16 text-center"
            data-ocid="admin.products.empty_state"
          >
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-semibold text-foreground mb-2">
              No products yet
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first product to start selling
            </p>
            <Button
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
              className="bg-ocean-mid hover:bg-ocean-deep text-white"
              data-ocid="admin.products.first_add_button"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Product
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id.toString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                    data-ocid={`admin.products.row.${index + 1}`}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {formatPrice(product.priceInCents)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatWeight(product.weightGrams)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium ${Number(product.stockQty) < 5 ? "text-amber-600" : "text-foreground"}`}
                      >
                        {Number(product.stockQty)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(product)}
                        className="cursor-pointer"
                        data-ocid={`admin.products.toggle.${index + 1}`}
                      >
                        {product.available ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 cursor-pointer">
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="cursor-pointer">
                            Hidden
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(product)}
                          data-ocid={`admin.products.edit_button.${index + 1}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeletingId(product.id)}
                          data-ocid={`admin.products.delete_button.${index + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Form Dialog */}
      {showForm && (
        <ProductFormDialog
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          editProduct={editingProduct}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(o) => !o && setDeletingId(null)}
      >
        <AlertDialogContent data-ocid="admin.products.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the product from your store. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.products.delete_cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              data-ocid="admin.products.delete_confirm_button"
            >
              {deleteProduct.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
