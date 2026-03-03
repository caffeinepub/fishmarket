import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let categories = Map.empty<Nat, Category>();
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    priceInCents : Nat;
    weightGrams : Nat;
    unit : Text;
    stockQty : Nat;
    available : Bool;
    createdAt : Int;
  };

  type Category = {
    id : Nat;
    name : Text;
  };

  type Order = {
    id : Nat;
    customerId : Principal;
    customerName : Text;
    customerPhone : Text;
    deliveryAddress : Text;
    items : [OrderItem];
    totalAmountInCents : Nat;
    status : OrderStatus;
    createdAt : Int;
  };

  type OrderItem = {
    productId : Nat;
    productName : Text;
    quantity : Nat;
    priceAtPurchaseInCents : Nat;
  };

  type UserProfile = {
    principal : Principal;
    name : Text;
    phone : Text;
    address : Text;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #outForDelivery;
    #delivered;
    #cancelled;
  };

  type AdminStats = {
    totalOrders : Nat;
    totalRevenue : Nat;
    pendingCount : Nat;
    deliveredCount : Nat;
  };

  type CustomerInfo = {
    principal : Principal;
    name : Text;
    phone : Text;
    orderCount : Nat;
  };

  public shared ({ caller }) func addProduct(name : Text, category : Text, description : Text, priceInCents : Nat, weightGrams : Nat, unit : Text, stockQty : Nat) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let id = products.size() + 1;
    let product : Product = {
      id;
      name;
      category;
      description;
      priceInCents;
      weightGrams;
      unit;
      stockQty;
      available = true;
      createdAt = Time.now();
    };
    products.add(id, product);
    id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, category : Text, description : Text, priceInCents : Nat, weightGrams : Nat, unit : Text, stockQty : Nat, available : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        let updatedProduct : Product = {
          id;
          name;
          category;
          description;
          priceInCents;
          weightGrams;
          unit;
          stockQty;
          available;
          createdAt = existingProduct.createdAt;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.remove(id);
      };
    };
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.available and p.stockQty > 0 });
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getCategories() : async [Category] {
    categories.values().toArray();
  };

  public shared ({ caller }) func placeOrder(customerName : Text, customerPhone : Text, deliveryAddress : Text, items : [OrderItem]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    if (items.size() == 0) { Runtime.trap("Order must have at least one item") };

    var totalAmount = 0;
    for (item in items.values()) {
      var found = false;
      for (product in products.values()) {
        if (product.id == item.productId and product.available and product.stockQty >= item.quantity) {
          switch (products.get(item.productId)) {
            case (null) { Runtime.trap("Product not found") };
            case (?p) {
              let updatedProduct = { p with stockQty = p.stockQty - item.quantity };
              products.add(item.productId, updatedProduct);
            };
          };
          totalAmount += item.priceAtPurchaseInCents * item.quantity;
          found := true;
        };
      };
      if (not found) { Runtime.trap("Invalid item or insufficient stock") };
    };

    let id = orders.size() + 1;
    let order : Order = {
      id;
      customerId = caller;
      customerName;
      customerPhone;
      deliveryAddress;
      items;
      totalAmountInCents = totalAmount;
      status = #pending;
      createdAt = Time.now();
    };
    orders.add(id, order);
    id;
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    orders.values().toArray().filter(func(o) { o.customerId == caller });
  };

  public query ({ caller }) func getOrder(id : Nat) : async Order {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.customerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(id, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getAdminStats() : async AdminStats {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view statistics");
    };
    var totalRevenue = 0;
    var pendingCount = 0;
    var deliveredCount = 0;
    for (order in orders.values()) {
      totalRevenue += order.totalAmountInCents;
      switch (order.status) {
        case (#pending) { pendingCount += 1 };
        case (#delivered) { deliveredCount += 1 };
        case (_) {};
      };
    };
    {
      totalOrders = orders.size();
      totalRevenue;
      pendingCount;
      deliveredCount;
    };
  };

  public query ({ caller }) func getCustomers() : async [CustomerInfo] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view customers");
    };
    let customerMap = Map.empty<Principal, (Text, Text, Nat)>();
    for (order in orders.values()) {
      switch (customerMap.get(order.customerId)) {
        case (null) {
          customerMap.add(order.customerId, (order.customerName, order.customerPhone, 1));
        };
        case (?(name, phone, count)) {
          customerMap.add(order.customerId, (name, phone, count + 1));
        };
      };
    };
    let customers = customerMap.entries().toArray().map(
      func((principal, (name, phone, orderCount))) {
        { principal; name; phone; orderCount };
      }
    );
    customers;
  };

  public shared ({ caller }) func updateMyProfile(name : Text, phone : Text, address : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let profile : UserProfile = {
      principal = caller;
      name;
      phone;
      address;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getMyProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  func seedCategories() {
    let categoryData = [
      (1, "Saltwater Fish"),
      (2, "Freshwater Fish"),
      (3, "Shellfish"),
      (4, "Crabs & Lobsters"),
      (5, "Smoked & Dried"),
      (6, "Exotic Fish"),
    ];
    for ((id, name) in categoryData.values()) {
      categories.add(id, { id; name });
    };
  };

  func seedProducts() {
    let productData = [
      (1, "Atlantic Salmon", "Saltwater Fish", "Fresh wild-caught salmon fillet", 1899, 300, "g", 50),
      (2, "Cod Fillets", "Saltwater Fish", "Premium line-caught cod fillet", 1599, 300, "g", 100),
      (3, "Rainbow Trout", "Freshwater Fish", "Whole cleaned trout", 799, 400, "g", 70),
      (4, "Jumbo Shrimp", "Shellfish", "Raw peeled jumbo shrimp", 2499, 500, "g", 80),
      (5, "Blue Swimmer Crab", "Crabs & Lobsters", "Fresh whole blue swimmer crabs", 3299, 800, "g", 40),
      (6, "Smoked Mackerel", "Smoked & Dried", "Hot-smoked juicy mackerel fillets", 1499, 200, "g", 120),
      (7, "Sardines", "Freshwater Fish", "Fresh wild-caught sardines", 499, 250, "g", 200),
      (8, "Lobster Tails", "Crabs & Lobsters", "Premium wild-caught lobster tails", 4499, 400, "g", 24),
      (9, "Snow Crab Legs", "Crabs & Lobsters", "Premium wild-caught snow crab legs", 3699, 600, "g", 60),
      (10, "Yellowfin Tuna", "Saltwater Fish", "Fresh wild-caught yellowfin tuna steaks", 2499, 300, "g", 30),
      (11, "Swordfish Steaks", "Saltwater Fish", "Fresh wild-caught swordfish steaks", 2199, 300, "g", 36),
      (12, "Red Snapper", "Saltwater Fish", "Whole wild-caught red snapper", 1499, 800, "g", 50),
    ];
    for ((id, name, category, description, price, weight, unit, qty) in productData.values()) {
      products.add(id, {
        id;
        name;
        category;
        description;
        priceInCents = price;
        weightGrams = weight;
        unit;
        stockQty = qty;
        available = true;
        createdAt = Time.now();
      });
    };
  };
};
