"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, Landmark, Smartphone, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: number;
    name: string;
    brand: string;
    price: number;
    image_url: string;
    delivery_days: number;
  };
}

export default function CheckoutPage() {
  const { status } = useSession();
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Address State
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [bank, setBank] = useState("");

  // Delivery Scheduling State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const [deliveryDate, setDeliveryDate] = useState(minDate);
  const [deliverySlot, setDeliverySlot] = useState("10:00-14:00");

  const timeSlots = [
    { value: "08:00-12:00", label: "🌅 Morning  (8 AM – 12 PM)" },
    { value: "10:00-14:00", label: "☀️ Late Morning  (10 AM – 2 PM)" },
    { value: "12:00-16:00", label: "🌤 Afternoon  (12 PM – 4 PM)" },
    { value: "14:00-18:00", label: "🌇 Evening  (2 PM – 6 PM)" },
    { value: "18:00-22:00", label: "🌙 Night  (6 PM – 10 PM)" },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/checkout");
      return;
    }
    if (status === "authenticated") {
      fetchCart();
    }
  }, [status, router]);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (!data.cartItems || data.cartItems.length === 0) {
        router.push("/cart"); // Redirect back to cart if empty
        return;
      }
      const validItems = data.cartItems.filter((item: CartItem) => item.products != null);
      if (validItems.length === 0) {
        router.push("/cart");
        return;
      }
      setItems(validItems);
    } catch (err) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    const newErrors: Record<string, string> = {};
    if (!address.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!address.phone.trim()) newErrors.phone = "Phone number is required";
    if (!address.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!address.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all required fields");
      return;
    }
    setErrors({});

    if (paymentMethod === "upi" && !upiId) {
      toast.error("Please enter a valid UPI ID");
      return;
    }

    if (paymentMethod === "card" && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      toast.error("Please enter card details");
      return;
    }

    if (paymentMethod === "netbanking" && !bank) {
      toast.error("Please select a bank");
      return;
    }

    try {
      setSubmitting(true);
      toast.loading("Placing your order...", { id: "checkout" });

      const payload = {
        deliveryAddress: address,
        paymentMethod: {
          type: paymentMethod,
          upiId: paymentMethod === 'upi' ? upiId : undefined
        },
        items: items,
        subtotal,
        discount,
        deliveryFee,
        totalAmount: grandTotal,
        preferredDate: deliveryDate,
        preferredSlot: deliverySlot
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Order placed successfully!", { id: "checkout" });
      router.push(`/order/${data.orderId}`);
      
    } catch (err) {
      toast.error((err as Error).message, { id: "checkout" });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 pt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="h-6 w-32 skeleton mb-6" />
          <div className="h-10 w-48 skeleton mb-8" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
              <div className="bg-white rounded-2xl p-6 h-96 skeleton" />
              <div className="bg-white rounded-2xl p-6 h-64 skeleton" />
            </div>
            <div className="w-full lg:w-96 p-6 bg-white rounded-2xl h-[500px] skeleton" />
          </div>
        </div>
      </div>
    );
  }

  // Calculate Summary
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.products.price * item.quantity), 0);
  const discount = totalItemsCount >= 3 ? Math.floor(subtotal * 0.08) : 0;
  const deliveryFee = (subtotal - discount) < 499 ? 49 : 0;
  const grandTotal = subtotal - discount + deliveryFee;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 pt-20">
      <div className="container mx-auto max-w-6xl">
        <Link href="/cart" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-navy mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Cart
        </Link>
        
        <h1 className="font-sora text-3xl font-bold text-navy mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column - Forms */}
          <div className="flex-1 w-full space-y-8">
            
            {/* Delivery Form */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="font-sora text-xl font-bold text-navy mb-5">Delivery Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name*</label>
                  <input type="text" value={address.fullName} onChange={e => { setAddress({...address, fullName: e.target.value}); if(errors.fullName) setErrors({...errors, fullName: ""}); }} className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/20 transition-all ${errors.fullName ? "border-red-500" : "border-slate-200 focus:border-orange"}`} placeholder="John Doe" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number*</label>
                  <input type="tel" value={address.phone} onChange={e => { setAddress({...address, phone: e.target.value}); if(errors.phone) setErrors({...errors, phone: ""}); }} className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/20 transition-all ${errors.phone ? "border-red-500" : "border-slate-200 focus:border-orange"}`} placeholder="+91 9876543210" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pincode*</label>
                  <input type="text" value={address.pincode} onChange={e => { setAddress({...address, pincode: e.target.value}); if(errors.pincode) setErrors({...errors, pincode: ""}); }} className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/20 transition-all ${errors.pincode ? "border-red-500" : "border-slate-200 focus:border-orange"}`} placeholder="110001" />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1*</label>
                  <input type="text" value={address.addressLine1} onChange={e => { setAddress({...address, addressLine1: e.target.value}); if(errors.addressLine1) setErrors({...errors, addressLine1: ""}); }} className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/20 transition-all ${errors.addressLine1 ? "border-red-500" : "border-slate-200 focus:border-orange"}`} placeholder="House/Flat No., Building Name" />
                  {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2</label>
                  <input type="text" value={address.addressLine2} onChange={e => setAddress({...address, addressLine2: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all" placeholder="Street, Area, Landmark" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City*</label>
                  <input type="text" value={address.city} onChange={e => { setAddress({...address, city: e.target.value}); if(errors.city) setErrors({...errors, city: ""}); }} className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/20 transition-all ${errors.city ? "border-red-500" : "border-slate-200 focus:border-orange"}`} placeholder="New Delhi" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State*</label>
                  <input type="text" value={address.state} onChange={e => { setAddress({...address, state: e.target.value}); if(errors.state) setErrors({...errors, state: ""}); }} className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/20 transition-all ${errors.state ? "border-red-500" : "border-slate-200 focus:border-orange"}`} placeholder="Delhi" />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>

                {/* Preferred Delivery Date & Time */}
                <div className="md:col-span-2 mt-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="text-base">📅</span> Preferred Delivery Date &amp; Time
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Calendar Input */}
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Select Date</label>
                      <input
                        type="date"
                        value={deliveryDate}
                        min={minDate}
                        max={maxDate}
                        onChange={e => setDeliveryDate(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all cursor-pointer"
                      />
                    </div>

                    {/* Time Slot */}
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Select Time Slot</label>
                      <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                        {timeSlots.map(slot => (
                          <label
                            key={slot.value}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                              deliverySlot === slot.value
                                ? "border-orange bg-orange/5 font-medium text-navy"
                                : "border-slate-100 hover:border-slate-200 text-slate-600"
                            }`}
                          >
                            <input
                              type="radio"
                              name="timeSlot"
                              value={slot.value}
                              checked={deliverySlot === slot.value}
                              onChange={() => setDeliverySlot(slot.value)}
                              className="hidden"
                            />
                            {slot.label}
                            {deliverySlot === slot.value && <span className="ml-auto text-orange">✓</span>}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preview badge */}
                  <div className="mt-3 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    <span>🚚</span> Estimated delivery:{" "}
                    <span className="font-bold">
                      {new Date(deliveryDate).toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
                    </span>
                    &nbsp;between&nbsp;
                    <span className="font-bold">{deliverySlot.replace("-", " – ")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="font-sora text-xl font-bold text-navy mb-5">Payment Method</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                
                {/* COD Card */}
                <label className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-orange bg-orange/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <Banknote className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-orange' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-navy">Cash on Delivery</div>
                    <div className="text-xs text-slate-500">Pay when order arrives</div>
                  </div>
                  {paymentMethod === 'cod' && <CheckCircle2 className="w-5 h-5 text-orange absolute top-4 right-4" />}
                </label>

                {/* UPI Card */}
                <label className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-orange bg-orange/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <Smartphone className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-orange' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-navy">UPI</div>
                    <div className="text-xs text-slate-500">GPay, PhonePe, Paytm</div>
                  </div>
                  {paymentMethod === 'upi' && <CheckCircle2 className="w-5 h-5 text-orange absolute top-4 right-4" />}
                </label>

                {/* Card Card */}
                <label className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-orange bg-orange/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-orange' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-navy">Credit/Debit Card</div>
                    <div className="text-xs text-slate-500">Visa, Mastercard, RuPay</div>
                  </div>
                  {paymentMethod === 'card' && <CheckCircle2 className="w-5 h-5 text-orange absolute top-4 right-4" />}
                </label>

                {/* Net Banking Card */}
                <label className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-orange bg-orange/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} className="hidden" />
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <Landmark className={`w-5 h-5 ${paymentMethod === 'netbanking' ? 'text-orange' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-navy">Net Banking</div>
                    <div className="text-xs text-slate-500">All Indian banks</div>
                  </div>
                  {paymentMethod === 'netbanking' && <CheckCircle2 className="w-5 h-5 text-orange absolute top-4 right-4" />}
                </label>
              </div>

              {/* Conditional Payment UI */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Enter UPI ID*</label>
                  <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="username@upi" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange" />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Card Number*</label>
                      <input type="text" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} placeholder="0000 0000 0000 0000" maxLength={19} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Expiry (MM/YY)*</label>
                        <input type="text" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} placeholder="MM/YY" maxLength={5} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">CVV*</label>
                        <input type="password" value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})} placeholder="***" maxLength={3} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Bank*</label>
                  <select value={bank} onChange={e => setBank(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange bg-white">
                    <option value="">Choose a bank...</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="w-full lg:w-96 shrink-0 sticky top-24">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
              <h2 className="font-sora text-lg font-bold text-navy mb-5 pb-4 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                       {item.products.image_url && (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-navy truncate">{item.products.name}</div>
                      <div className="text-slate-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-navy text-right shrink-0">
                      ₹{(item.products.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-5 text-sm border-t border-slate-100 pt-5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-semibold text-navy">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (8% off bulk)</span>
                    <span className="font-semibold">-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="font-semibold text-green-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-navy">₹{deliveryFee}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-navy">Total</span>
                  <span className="font-sora font-extrabold text-orange">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-orange hover:bg-orange/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
            
            <p className="text-center text-xs text-slate-400">
              By placing your order, you agree to our Terms of Use and Privacy Policy.
            </p>
          </div>
          
        </form>
      </div>
    </div>
  );
}
