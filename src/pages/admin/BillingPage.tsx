import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import {
    Search,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    CreditCard,
    Smartphone,
    Banknote,
    Loader2,
    CheckCircle2,
    Receipt
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    stock_quantity: number;
    sku: string;
}

interface CartItem extends Product {
    cartQuantity: number;
}

const BillingPage: React.FC = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
    const [billSuccess, setBillSuccess] = useState(false);
    const [lastBillId, setLastBillId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, [user]);

    const fetchProducts = async () => {
        if (!user?.organization?.id) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('id, name, price, stock_quantity, sku')
                .eq('shop_id', user.organization.id)
                .gt('stock_quantity', 0) // Only show in-stock items
                .order('name');

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.cartQuantity >= product.stock_quantity) return prev; // Limit to stock
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, cartQuantity: item.cartQuantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, cartQuantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.cartQuantity + delta;
                if (newQty < 1) return item;
                if (newQty > item.stock_quantity) return item;
                return { ...item, cartQuantity: newQty };
            }
            return item;
        }));
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
    };

    const handleCheckout = async () => {
        if (cart.length === 0 || !user?.organization?.id) return;
        setProcessing(true);

        try {
            const totalAmount = calculateTotal();

            // 1. Create Bill
            const { data: billData, error: billError } = await supabase
                .from('bills')
                .insert({
                    shop_id: user.organization.id,
                    cashier_id: user.id,
                    total_amount: totalAmount,
                    payment_method: paymentMethod,
                    status: 'completed'
                })
                .select()
                .single();

            if (billError) throw billError;

            // 2. Create Bill Items and Update Stock
            const billItems = cart.map(item => ({
                bill_id: billData.id,
                product_id: item.id,
                quantity: item.cartQuantity,
                price_at_sale: item.price
            }));

            const { error: itemsError } = await supabase
                .from('bill_items')
                .insert(billItems);

            if (itemsError) throw itemsError;

            // 3. Decrement Stock (One by one for now, or use RPC for atomicity in future)
            // 3. Decrement Stock using RPC
            for (const item of cart) {
                const { error: stockError } = await supabase.rpc('decrement_stock', {
                    row_id: item.id,
                    quantity: item.cartQuantity
                });

                if (stockError) {
                    console.error('Stock update failed for', item.name, stockError);
                    // Ideally we should rollback the bill here or mark it as 'failed'
                    // For now, we'll log it. In a real app, this would be a single transaction on the DB side.
                }
            }

            setLastBillId(billData.id);
            setBillSuccess(true);
            setCart([]);
            fetchProducts(); // Refresh stock

        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (billSuccess) {
        return (
            <div className="flex items-center justify-center h-full min-h-[500px]">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-md w-full">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Transaction completed successfully.</p>
                    {lastBillId && (
                        <p className="text-sm text-gray-400 mb-6 font-mono bg-gray-100 dark:bg-gray-900 py-1 px-3 rounded-full inline-block">
                            Bill ID: {lastBillId.slice(0, 8)}...
                        </p>
                    )}
                    <div className="space-y-3">
                        <button
                            onClick={() => { setBillSuccess(false); setLastBillId(null); }}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            New Sale
                        </button>
                        <button
                            className="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            <Receipt className="h-4 w-4" />
                            <span>Print Receipt</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] gap-6 p-6">
            {/* Left: Product Grid */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Billing</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Scan barcode or search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="text-left bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
                                >
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">{product.name}</h3>
                                    <p className="text-xs text-gray-500 mb-2">SKU: {product.sku || '-'}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${product.price}</span>
                                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                                            Qty: {product.stock_quantity}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Cart Summary */}
            <div className="w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-gray-500" />
                    <h2 className="font-bold text-gray-900 dark:text-white">Current Bill</h2>
                    <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium px-2 py-0.5 rounded-full ml-auto">
                        {cart.reduce((a, b) => a + b.cartQuantity, 0)} items
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-60">
                            <ShoppingCart className="h-12 w-12" />
                            <p>Cart is empty</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className="flex-1 min-w-0 pr-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h4>
                                    <p className="text-sm text-gray-500">${item.price} x {item.cartQuantity}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                    >
                                        <Minus className="h-4 w-4 text-gray-500" />
                                    </button>
                                    <span className="w-4 text-center text-sm font-medium dark:text-white">{item.cartQuantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                    >
                                        <Plus className="h-4 w-4 text-gray-500" />
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors ml-1"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span>Subtotal</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                            <span>Total</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setPaymentMethod('cash')}
                                className={`p-2 flex flex-col items-center justify-center rounded-lg border text-xs font-medium transition-all ${paymentMethod === 'cash'
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <Banknote className="h-4 w-4 mb-1" />
                                Cash
                            </button>
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`p-2 flex flex-col items-center justify-center rounded-lg border text-xs font-medium transition-all ${paymentMethod === 'card'
                                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <CreditCard className="h-4 w-4 mb-1" />
                                Card
                            </button>
                            <button
                                onClick={() => setPaymentMethod('upi')}
                                className={`p-2 flex flex-col items-center justify-center rounded-lg border text-xs font-medium transition-all ${paymentMethod === 'upi'
                                    ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300'
                                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <Smartphone className="h-4 w-4 mb-1" />
                                UPI
                            </button>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || processing}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center space-x-2"
                        >
                            {processing ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Checkout</span>
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-sm">${calculateTotal().toFixed(2)}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
