import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useCategories, useProducts } from "@/hooks/useQueries";
import { formatPrice, formatWeight } from "@/utils/format";
import { SAMPLE_PRODUCTS, getProductImage } from "@/utils/sampleData";
import { Search, Shield, ShoppingCart, Star, Truck, Waves } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const isLowStock =
    Number(product.stockQty) < 5 && Number(product.stockQty) > 0;
  const isOutOfStock = !product.available || Number(product.stockQty) === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      productName: product.name,
      priceInCents: product.priceInCents,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-ocean hover:shadow-ocean-lg transition-all duration-300 flex flex-col"
      data-ocid={`product.card.${index + 1}`}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={getProductImage(product.name)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge className="text-xs bg-white/90 text-ocean-deep border-0 backdrop-blur-sm">
            {product.category}
          </Badge>
          {isLowStock && (
            <Badge className="text-xs bg-amber-500/90 text-white border-0">
              Only {Number(product.stockQty)} left
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-base text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{formatWeight(product.weightGrams)}</span>
          <span>per {product.unit}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-xl text-ocean-deep">
            {formatPrice(product.priceInCents)}
          </span>
          <Button
            size="sm"
            className="bg-ocean-mid hover:bg-ocean-deep text-white font-semibold gap-1.5 disabled:opacity-40"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            data-ocid={`product.add_button.${index + 1}`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: backendProducts, isLoading: productsLoading } = useProducts();
  const { data: categories } = useCategories();

  // Use sample products while loading or if none from backend
  const products =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : SAMPLE_PRODUCTS;

  const categoryNames = useMemo(() => {
    const cats = categories?.map((c) => c.name) ?? [];
    if (cats.length === 0) {
      const from = products.map((p) => p.category);
      return [...new Set(from)];
    }
    return cats;
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ocean-deep wave-divider">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/assets/generated/hero-seafood.dim_1600x700.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep/95 via-ocean-deep/80 to-ocean-mid/70" />

        <div className="container relative py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-white/80 text-sm">
              <Waves className="h-4 w-4" />
              Fresh catch, delivered daily
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Ocean-Fresh
              <br />
              <span className="text-coral-light">Seafood</span>
              <br />
              To Your Door
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Premium seafood, sustainably sourced from the world's finest
              waters. From ocean to your table in under 24 hours.
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                type="text"
                placeholder="Search salmon, prawns, oysters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/40 rounded-xl"
                data-ocid="home.search_input"
              />
            </div>
          </motion.div>
        </div>

        {/* Floating stats */}
        <div className="container relative pb-16">
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            {[
              { icon: Star, label: "Premium Quality", value: "4.9★" },
              { icon: Truck, label: "Fast Delivery", value: "24h" },
              { icon: Shield, label: "Freshness Guarantee", value: "100%" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center text-white"
              >
                <div className="font-display font-bold text-lg text-coral-light">
                  {stat.value}
                </div>
                <div className="text-xs text-white/70 mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container py-12">
        {/* Category filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Fresh Today
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredProducts.length} products available
            </p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="All" data-ocid="home.filter_all.tab">
                All
              </TabsTrigger>
              {categoryNames.map((cat) => (
                <TabsTrigger key={cat} value={cat} data-ocid="home.filter.tab">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] as const).map(
              (k) => (
                <ProductSkeleton key={k} />
              ),
            )}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="product.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Try adjusting your search or category filter
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              data-ocid="home.clear_filter.button"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-ocid="product.list"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
