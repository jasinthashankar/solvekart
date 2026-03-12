"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Plus, Pencil, Trash2, X, Check, TrendingUp,
  DollarSign, BarChart3
} from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "users", label: "Users", icon: Users },
];

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered"];
const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  pending: "bg-slate-100 text-slate-600",
};

const EMPTY_PRODUCT = {
  name: "", brand: "", price: "", category: "",
  image_url: "", rating: "", delivery_days: "", description: ""
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Stats
  const [stats, setStats] = useState<any>(null);

  // Products
  const [products, setProducts] = useState<any[]>([]);
  const [productForm, setProductForm] = useState<any>(EMPTY_PRODUCT);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  // Users
  const [users, setUsers] = useState<any[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/api/auth/signin");
    if (status === "authenticated") {
      fetchStats();
    }
  }, [status, router]);

  // Guard: non-admins get redirected
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      // Check via API to avoid exposing env var client-side
      fetch("/api/admin/stats").then(r => {
        if (r.status === 403) router.push("/home");
      });
    }
  }, [status, session, router]);

  const fetchStats = async () => {
    const res = await fetch("/api/admin/stats");
    if (res.status === 403) { router.push("/home"); return; }
    const data = await res.json();
    setStats(data);
  };

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoadingProducts(false);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoadingOrders(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoadingUsers(false);
  }, []);

  useEffect(() => {
    if (activeTab === "products" && products.length === 0) fetchProducts();
    if (activeTab === "orders" && orders.length === 0) fetchOrders();
    if (activeTab === "users" && users.length === 0) fetchUsers();
  }, [activeTab]);

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT);
    setShowProductModal(true);
  };

  const openEditProduct = (p: any) => {
    setEditingProduct(p);
    setProductForm({ ...p, price: String(p.price), rating: String(p.rating), delivery_days: String(p.delivery_days) });
    setShowProductModal(true);
  };

  const saveProduct = async () => {
    setSavingProduct(true);
    const body = {
      ...productForm,
      price: parseInt(productForm.price),
      rating: parseFloat(productForm.rating) || 0,
      delivery_days: parseInt(productForm.delivery_days) || 3,
      id: editingProduct?.id,
    };

    const method = editingProduct ? "PUT" : "POST";
    const res = await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSavingProduct(false);
    if (res.ok) {
      toast.success(editingProduct ? "Product updated!" : "Product added!");
      setShowProductModal(false);
      fetchProducts();
    } else {
      const d = await res.json();
      toast.error(d.error || "Failed to save");
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deleted");
      setProducts((p) => p.filter((x) => x.id !== id));
    } else toast.error("Failed to delete");
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    setUpdatingOrder(null);
    if (res.ok) {
      toast.success("Status updated & user notified!");
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    } else toast.error("Failed to update status");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-orange" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="container mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/home" className="flex items-center gap-1">
              <span className="font-sora text-xl font-bold text-navy">SolveKart</span>
              <div className="h-2 w-2 rounded-full bg-orange mt-1" />
            </Link>
            <span className="text-xs font-bold bg-orange text-white px-2 py-0.5 rounded-full">ADMIN</span>
          </div>
          <Link href="/home" className="text-sm text-slate-500 hover:text-navy font-medium">← Back to Home</Link>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Admin welcome */}
        <div className="mb-6">
          <h1 className="font-sora text-2xl font-bold text-navy">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your SolveKart store</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-100">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    activeTab === tab.id ? "border-orange text-orange" : "border-transparent text-slate-500 hover:text-navy"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">

            {/* ── TAB 1: DASHBOARD ── */}
            {activeTab === "dashboard" && (
              <div>
                <h2 className="font-sora text-lg font-bold text-navy mb-5">Overview</h2>
                {!stats ? (
                  <div className="text-center py-10 text-slate-400">Loading stats…</div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-blue-50 text-blue-600" },
                      { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-purple-50 text-purple-600" },
                      { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-green-50 text-green-600" },
                      { label: "Total Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`, icon: DollarSign, color: "bg-orange/10 text-orange" },
                    ].map((card) => {
                      const Icon = card.icon;
                      return (
                        <div key={card.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="font-sora text-2xl font-bold text-navy">{card.value}</div>
                          <div className="text-xs text-slate-500 font-medium mt-1">{card.label}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                  <button onClick={() => setActiveTab("products")} className="p-5 border border-slate-100 rounded-2xl hover:shadow-md transition-shadow flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">Manage Products</p>
                      <p className="text-xs text-slate-500">Add, edit, or remove products</p>
                    </div>
                  </button>
                  <button onClick={() => setActiveTab("orders")} className="p-5 border border-slate-100 rounded-2xl hover:shadow-md transition-shadow flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">Manage Orders</p>
                      <p className="text-xs text-slate-500">Update order statuses</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 2: PRODUCTS ── */}
            {activeTab === "products" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-sora text-lg font-bold text-navy">Products ({products.length})</h2>
                  <button
                    onClick={openAddProduct}
                    className="flex items-center gap-2 px-4 py-2 bg-orange hover:bg-orange/90 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>

                {loadingProducts ? (
                  <div className="text-center py-10 text-slate-400">Loading products…</div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Product</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Category</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Price</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Rating</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                  {p.image_url && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-navy">{p.name}</p>
                                  <p className="text-xs text-slate-400">{p.brand}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{p.category}</td>
                            <td className="px-4 py-3 font-semibold text-navy">₹{p.price?.toLocaleString("en-IN")}</td>
                            <td className="px-4 py-3 text-slate-600">⭐ {p.rating}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEditProduct(p)}
                                  className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Pencil className="w-4 h-4 text-blue-500" />
                                </button>
                                <button
                                  onClick={() => deleteProduct(p.id)}
                                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: ORDERS ── */}
            {activeTab === "orders" && (
              <div>
                <h2 className="font-sora text-lg font-bold text-navy mb-5">All Orders ({orders.length})</h2>
                {loadingOrders ? (
                  <div className="text-center py-10 text-slate-400">Loading orders…</div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Order ID</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Customer</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Amount</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {orders.map((order) => {
                          const displayId = order.delivery_address?.display_id || order.id?.slice(0, 8).toUpperCase();
                          return (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 font-mono font-medium text-navy text-xs">#{displayId}</td>
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium text-navy">{order.userName || "—"}</p>
                                  <p className="text-xs text-slate-400">{order.userEmail}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </td>
                              <td className="px-4 py-3 font-semibold text-navy">₹{order.total_amount?.toLocaleString("en-IN")}</td>
                              <td className="px-4 py-3">
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                  disabled={updatingOrder === order.id}
                                  className={`text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 capitalize cursor-pointer ${STATUS_STYLES[order.status] || "bg-slate-100 text-slate-600"}`}
                                >
                                  {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                                {updatingOrder === order.id && (
                                  <span className="ml-2 text-xs text-slate-400 animate-pulse">Saving…</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 4: USERS ── */}
            {activeTab === "users" && (
              <div>
                <h2 className="font-sora text-lg font-bold text-navy mb-5">All Users ({users.length})</h2>
                {loadingUsers ? (
                  <div className="text-center py-10 text-slate-400">Loading users…</div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">User</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Joined</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">Orders</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-white font-bold text-sm shrink-0">
                                  {user.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <p className="font-medium text-navy">{user.name || "Unknown"}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{user.email}</td>
                            <td className="px-4 py-3 text-slate-500">
                              {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-navy">{user.orderCount}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PRODUCT MODAL ── */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-sora text-lg font-bold text-navy">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "name", label: "Product Name*", type: "text", placeholder: "e.g. Ergonomic Chair" },
                { key: "brand", label: "Brand", type: "text", placeholder: "e.g. FlexiComfort" },
                { key: "price", label: "Price (₹)*", type: "number", placeholder: "e.g. 4999" },
                { key: "category", label: "Category*", type: "text", placeholder: "e.g. Furniture" },
                { key: "rating", label: "Rating (0-5)", type: "number", placeholder: "e.g. 4.2" },
                { key: "delivery_days", label: "Delivery Days", type: "number", placeholder: "e.g. 3" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={productForm[key]}
                    onChange={(e) => setProductForm({ ...productForm, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  placeholder="Product description…"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowProductModal(false)}
                className="flex-1 h-11 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveProduct}
                disabled={savingProduct || !productForm.name || !productForm.price || !productForm.category}
                className="flex-1 h-11 bg-orange hover:bg-orange/90 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {savingProduct ? "Saving…" : (
                  <><Check className="w-4 h-4" /> {editingProduct ? "Update" : "Add Product"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
