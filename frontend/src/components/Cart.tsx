import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { CartItem } from '../types/cart';

export default function Cart() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getSubtotal,
    getTotal,
    discount,
    setDiscount,
    shipping
  } = useCart();
  const { darkMode } = useTheme();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const applyCoupon = () => {
    setCouponError('');
    // Simple coupon logic - you can extend this
    const validCoupons: Record<string, number> = {
      'SAVE10': 10,
      'DISCOUNT15': 15,
      'WELCOME20': 20,
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      setDiscount(validCoupons[couponCode.toUpperCase()]);
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getItemPrice = (item: CartItem) => {
    return item.product.discount 
      ? item.product.price * (1 - item.product.discount)
      : item.product.price;
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 text-center transition-colors duration-300`}>
            <div className="mb-6">
              <svg 
                className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
                />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
              Your Cart is Empty
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-300`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-300`}>
                        Product
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-300`}>
                        Price
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-300`}>
                        Quantity
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-300`}>
                        Total
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-300`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors duration-300`}>
                    {items.map((item) => (
                      <tr key={item.product.productId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              <img 
                                className="h-16 w-16 rounded-md object-cover" 
                                src={`/products/${item.product.imgName}`}
                                alt={item.product.name}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/products/placeholder.png';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                                {item.product.name}
                              </div>
                              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} transition-colors duration-300`}>
                                SKU: {item.product.sku}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                            {formatPrice(getItemPrice(item))}
                            {item.product.discount && (
                              <div className="text-xs text-red-500 line-through">
                                {formatPrice(item.product.price)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleQuantityChange(item.product.productId, item.quantity - 1)}
                              className={`w-8 h-8 flex items-center justify-center rounded-md border ${
                                darkMode 
                                  ? 'border-gray-600 text-light hover:bg-gray-700' 
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                              } transition-colors duration-300`}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className={`mx-3 ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product.productId, item.quantity + 1)}
                              className={`w-8 h-8 flex items-center justify-center rounded-md border ${
                                darkMode 
                                  ? 'border-gray-600 text-light hover:bg-gray-700' 
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                              } transition-colors duration-300`}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                            {formatPrice(getItemPrice(item) * item.quantity)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeFromCart(item.product.productId)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-300"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cart Actions */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <button
                onClick={clearCart}
                className={`px-4 py-2 rounded-md border ${
                  darkMode 
                    ? 'border-gray-600 text-light hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                } transition-colors duration-300`}
              >
                Clear Cart
              </button>
              <Link
                to="/products"
                className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-md transition-colors duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 transition-colors duration-300`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                Order Summary
              </h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-light' : 'text-gray-700'} transition-colors duration-300`}>
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className={`flex-1 px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-light placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300`}
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-md transition-colors duration-300"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-sm mt-1">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-700'} transition-colors duration-300`}>
                  <span>Subtotal:</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%):</span>
                    <span>-{formatPrice(getSubtotal() * (discount / 100))}</span>
                  </div>
                )}

                <div className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-700'} transition-colors duration-300`}>
                  <span>Shipping:</span>
                  <span>{formatPrice(shipping)}</span>
                </div>

                <hr className={`${darkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`} />

                <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                  <span>Total:</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className="w-full mt-6 bg-primary hover:bg-accent text-white py-3 px-4 rounded-md font-medium transition-colors duration-300"
                disabled
                title="Checkout functionality coming soon"
              >
                Proceed to Checkout (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}