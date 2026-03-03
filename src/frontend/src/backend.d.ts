import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Category {
    id: bigint;
    name: string;
}
export interface AdminStats {
    pendingCount: bigint;
    totalOrders: bigint;
    deliveredCount: bigint;
    totalRevenue: bigint;
}
export interface OrderItem {
    productId: bigint;
    productName: string;
    quantity: bigint;
    priceAtPurchaseInCents: bigint;
}
export interface CustomerInfo {
    principal: Principal;
    name: string;
    orderCount: bigint;
    phone: string;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: OrderStatus;
    deliveryAddress: string;
    customerPhone: string;
    createdAt: bigint;
    totalAmountInCents: bigint;
    customerId: Principal;
    items: Array<OrderItem>;
}
export interface UserProfile {
    principal: Principal;
    name: string;
    address: string;
    phone: string;
}
export interface Product {
    id: bigint;
    stockQty: bigint;
    name: string;
    createdAt: bigint;
    unit: string;
    description: string;
    available: boolean;
    category: string;
    weightGrams: bigint;
    priceInCents: bigint;
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    outForDelivery = "outForDelivery",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, category: string, description: string, priceInCents: bigint, weightGrams: bigint, unit: string, stockQty: bigint): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAdminStats(): Promise<AdminStats>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getCustomers(): Promise<Array<CustomerInfo>>;
    getMyOrders(): Promise<Array<Order>>;
    getMyProfile(): Promise<UserProfile | null>;
    getOrder(id: bigint): Promise<Order>;
    getProduct(id: bigint): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(customerName: string, customerPhone: string, deliveryAddress: string, items: Array<OrderItem>): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMyProfile(name: string, phone: string, address: string): Promise<void>;
    updateOrderStatus(id: bigint, status: OrderStatus): Promise<void>;
    updateProduct(id: bigint, name: string, category: string, description: string, priceInCents: bigint, weightGrams: bigint, unit: string, stockQty: bigint, available: boolean): Promise<void>;
}
