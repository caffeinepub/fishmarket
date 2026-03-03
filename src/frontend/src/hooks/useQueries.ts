import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { OrderStatus } from "../backend";
import { useActor } from "./useActor";

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProduct(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["product", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCategories() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOrder(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["order", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getOrder(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAdminStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCustomers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

// Mutations
export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerName,
      customerPhone,
      deliveryAddress,
      items,
    }: {
      customerName: string;
      customerPhone: string;
      deliveryAddress: string;
      items: Array<{
        productId: bigint;
        productName: string;
        quantity: bigint;
        priceAtPurchaseInCents: bigint;
      }>;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.placeOrder(
        customerName,
        customerPhone,
        deliveryAddress,
        items,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      description: string;
      priceInCents: bigint;
      weightGrams: bigint;
      unit: string;
      stockQty: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addProduct(
        data.name,
        data.category,
        data.description,
        data.priceInCents,
        data.weightGrams,
        data.unit,
        data.stockQty,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      category: string;
      description: string;
      priceInCents: bigint;
      weightGrams: bigint;
      unit: string;
      stockQty: bigint;
      available: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(
        data.id,
        data.name,
        data.category,
        data.description,
        data.priceInCents,
        data.weightGrams,
        data.unit,
        data.stockQty,
        data.available,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateMyProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      address: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateMyProfile(data.name, data.phone, data.address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}
