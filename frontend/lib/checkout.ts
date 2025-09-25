// lib/checkout.ts
export interface ShippingAddress {
  address: string;
  area: string;
  confirmAddress: string;
  city: string;
  mobileNumber: string;
  alternateNumber?: string;
}

export interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface SubscriptionPlan {
  id?: string;
  name: string;
  price: number;
  billingCycle: string;
  features: string[];
}

export interface OrderSummary {
  subscriptionPlan: SubscriptionPlan;
  selectedProducts: SelectedProduct[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface PaymentMethod {
  id: string;
  type: "UPI" | "COD";
  name: string;
  icon: string;
  description: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "UPI",
    type: "UPI",
    name: "UPI Payment",
    icon: "📱",
    description: "Google Pay, PhonePe, Paytm",
  },
  {
    id: "COD",
    type: "COD",
    name: "Cash on Delivery",
    icon: "💰",
    description: "Pay when you receive your order",
  },
];

export interface OrderPayload {
  orderSummary: OrderSummary;
  shippingAddress: ShippingAddress;
  paymentMethod: string; // "COD" or "UPI"
  UPIScreenshot?: File; // only for UPI
  UPIUTR?: string; // only for UPI
  orderId?: string;
  timestamp?: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

/**
 * Create a new order (COD or UPI)
 */
export async function createOrder(orderPayload: OrderPayload) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) throw new Error("User not authenticated.");
  if (!user.userId && !user._id) throw new Error("User data missing.");

  // Required field validation based on schema
  if (
    !orderPayload.shippingAddress.address ||
    !orderPayload.shippingAddress.confirmAddress ||
    !orderPayload.shippingAddress.city ||
    !orderPayload.shippingAddress.mobileNumber
  ) {
    throw new Error(
      "Address, confirm address, city, and mobile number are required."
    );
  }

  // Map frontend payment method to backend expected values
  const backendPaymentMethod =
    orderPayload.paymentMethod === "UPI" ? "Online" : "Cash On Delivery";

  // Map user data with new localStorage format support
  const userId = user.userId || user._id;
  const name = user.username || user.name;
  const email = user.useremail || user.email;

  console.log("User data mapping:", { userId, name, email, rawUser: user });

  const backendPayload = {
    userId,
    name,
    email,
    plan: orderPayload.orderSummary.subscriptionPlan.name,
    planDetails: {
      price: orderPayload.orderSummary.subscriptionPlan.price,
      billingCycle: orderPayload.orderSummary.subscriptionPlan.billingCycle,
      features: orderPayload.orderSummary.subscriptionPlan.features,
    },
    address: orderPayload.shippingAddress.address,
    confirmAddress: orderPayload.shippingAddress.confirmAddress,
    city: orderPayload.shippingAddress.city,
    mobileNumber: orderPayload.shippingAddress.mobileNumber,
    alternetNumber: orderPayload.shippingAddress.alternateNumber || null,
    paymentMethod: backendPaymentMethod, // Mapped value
    timestamp: orderPayload.timestamp || Date.now(),
  };

  console.log("Creating order with payload:", backendPayload);
  console.log("Frontend payment method:", orderPayload.paymentMethod);
  console.log("Backend payment method:", backendPaymentMethod);

  // 1️⃣ Create Order
  const response = await fetch(`${API_BASE_URL}/orders/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(backendPayload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Order creation failed:", errorData);
    throw new Error(
      `Failed to create order: ${errorData.message || response.statusText}`
    );
  }

  const orderResult = await response.json();
  const orderId =
    orderResult.order?._id ||
    orderResult.orderId ||
    orderResult._id ||
    orderResult.data?._id;

  if (!orderId) {
    console.error("Order ID not found in response:", orderResult);
    throw new Error("Order ID not returned from backend.");
  }

  console.log("Order created successfully, ID:", orderId);

  // 2️⃣ If UPI (Online), upload proof
  if (
    orderPayload.paymentMethod === "UPI" &&
    orderPayload.UPIScreenshot &&
    orderPayload.UPIUTR
  ) {
    console.log("Uploading UPI payment proof...");
    await uploadPaymentProof(
      orderPayload.UPIScreenshot,
      orderPayload.UPIUTR,
      orderId
    );
  }

  return orderResult;
}

/**
 * Upload UPI payment proof and update order status to pending_verification
 */
export async function uploadPaymentProof(
  file: File,
  utrNumber: string,
  orderId: string
) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    throw new Error("User not authenticated.");
  }

  const userId = user.userId || user._id; // Support new format first

  if (!userId) {
    throw new Error("User data missing.");
  }

  const formData = new FormData();
  formData.append("orderId", orderId);
  formData.append("paymentScreenshot", file);
  formData.append("utrNumber", utrNumber);
  formData.append("userId", userId);

  // Debug: Log FormData contents
  console.log("FormData entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/payments/upload-payment-proof`,
      {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      }
    );

    console.log("Upload response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed with response:", errorText);
      throw new Error(
        `Failed to upload payment proof: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();
    console.log("Upload successful:", result);
    return result;
  } catch (error) {
    console.error("Error uploading payment proof:", error);
    throw error;
  }
}
