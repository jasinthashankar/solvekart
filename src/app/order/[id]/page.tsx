"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Download, Package, ShoppingBag, Truck } from "lucide-react";

export default function OrderConfirmationPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/order/" + orderId);
      return;
    }
    if (status === "authenticated" && orderId) {
      fetchOrder();
    }
  }, [status, router, orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/order?id=${orderId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data.order);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <svg className="animate-spin h-8 w-8 text-orange" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl shadow-sm text-center max-w-sm">
          <p className="font-semibold mb-2">Order Not Found</p>
          <p className="text-sm">{error || "We couldn't find the details for this order."}</p>
          <Link href="/home" className="mt-4 px-4 py-2 inline-block bg-red-100 font-medium rounded-lg">Return Home</Link>
        </div>
      </div>
    );
  }

  const { products, delivery_address, payment_method, total_amount, estimated_delivery, created_at } = order;
  const displayId = delivery_address?.display_id || order.id.split("-")[0].toUpperCase();
  const orderDate = new Date(created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const deliveryDate = new Date(estimated_delivery).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 pt-24 print:bg-white print:pt-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Success Header */}
        <div className="bg-white rounded-3xl p-8 md:p-12 text-center border border-slate-100 shadow-sm mb-8 relative overflow-hidden print:border-none print:shadow-none">
          {/* Confetti / Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange to-yellow-400 print:hidden" />
          
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 relative animate-in zoom-in duration-500">
            <CheckCircle2 className="w-12 h-12 text-green-500 relative z-10" />
            <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-ping opacity-20 duration-1000" />
          </div>
          
          <h1 className="font-sora text-3xl md:text-4xl font-extrabold text-navy mb-4">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Thank you for shopping at SolveKart. Your order has been confirmed and will be shipped shortly.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 py-3 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" /> Download Invoice
            </button>
            <Link
              href="/home"
              className="inline-flex items-center gap-2 bg-orange hover:bg-orange/90 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Continue Shopping <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Progress Tracker */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm print:hidden">
              <h3 className="font-sora text-lg font-bold text-navy mb-8">Order Status</h3>
              <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 -z-10 rounded-full">
                  <div className="h-full bg-orange w-1/4 rounded-full" />
                </div>
                
                {/* Steps */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange text-white flex items-center justify-center shadow-md">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-navy">Confirmed</span>
                </div>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Processing</span>
                </div>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Shipped</span>
                </div>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Delivered</span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm print:border-none print:shadow-none print:px-0">
              <h3 className="font-sora text-lg font-bold text-navy mb-6 pb-4 border-b border-slate-100">
                Items in this order
              </h3>
              
              <div className="space-y-6">
                {(products as any[]).map((product, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                      {product.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="font-semibold text-navy truncate">{product.name}</div>
                      <div className="text-sm text-slate-500">Qty: {product.quantity}</div>
                    </div>
                    <div className="font-bold text-navy shrink-0 flex items-center">
                      ₹{((product.price || 0) * product.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            
            {/* Order Summary & Meta */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm print:border print:border-slate-200">
              <h3 className="font-sora text-lg font-bold text-navy mb-6 pb-4 border-b border-slate-100">
                Order Details
              </h3>
              
              <div className="space-y-4 text-sm text-slate-600 mb-6">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span className="font-bold text-navy">{displayId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Date</span>
                  <span className="font-medium text-navy">{orderDate}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span>Est. Delivery</span>
                  <span className="font-medium text-green-600 text-right">{deliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment</span>
                  <span className="font-medium text-navy capitalize">{payment_method}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-navy">Total Paid</span>
                  <span className="font-sora font-extrabold text-orange">
                    ₹{total_amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h4 className="font-semibold text-navy mb-2 text-sm">Delivery Address</h4>
                <div className="text-sm text-slate-500 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                  <span className="font-medium text-slate-700 block mb-1">{delivery_address?.fullName}</span>
                  {delivery_address?.addressLine1}<br/>
                  {delivery_address?.addressLine2 && <>{delivery_address.addressLine2}<br/></>}
                  {delivery_address?.city}, {delivery_address?.state} {delivery_address?.pincode}<br/>
                  <span className="mt-2 block">Phone: {delivery_address?.phone}</span>
                </div>
              </div>
              
            </div>

          </div>
        </div>

      </div>
      
      {/* Print only footer */}
      <div className="hidden print:block text-center mt-12 text-sm text-slate-500 pb-10">
        <p>Thank you for shopping with SolveKart!</p>
        <p>solvekart.com - Contact: support@solvekart.com</p>
      </div>
    </div>
  );
}
