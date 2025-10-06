import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getSubtotal, 
    getTotalPrice, 
    applyCoupon,
    couponCode,
    discount,
    shipping
  } = useCart();
  const { darkMode } = useTheme();
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      setCouponMessage('Coupon applied successfully!');
      setCouponInput('');
    } else {
      setCouponMessage('Invalid coupon code. Try SAVE10, WELCOME20, or STUDENT15.');
    }
    setTimeout(() => setCouponMessage(''), 3000);
  };

  const subtotal = getSubtotal();
  const discountAmount = subtotal * discount;
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
            Your Cart
          </h1>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 text-center transition-colors duration-300`}>
            <div className="mb-6">
              <svg 
                className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-300`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" 
                />
              </svg>
            </div>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
              Add some products to get started!
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
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
          Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
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
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors duration-300`}>
                    {items.map((item) => (
                      <tr key={item.productId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-16 w-16 rounded-lg object-cover"
                              src={`/products/${item.imgName}`}
                              alt={item.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-product.jpg';
                              }}
                            />
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                                {item.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} transition-colors duration-300`}>
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className={`w-8 h-8 flex items-center justify-center rounded border ${
                                darkMode 
                                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              } transition-colors duration-300`}
                            >
                              -
                            </button>
                            <span className={`w-12 text-center ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className={`w-8 h-8 flex items-center justify-center rounded border ${
                                darkMode 
                                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              } transition-colors duration-300`}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 hover:text-red-500 transition-colors duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 transition-colors duration-300`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-900'} mb-4 transition-colors duration-300`}>
                Order Summary
              </h2>
              
              {/* Coupon Section */}
              <div className="mb-6">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    className={`flex-1 px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-light' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-primary hover:bg-accent text-white rounded-md transition-colors duration-300"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-sm mt-2 ${couponMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {couponMessage}
                  </p>
                )}
                {couponCode && (
                  <p className="text-sm text-green-600 mt-2">
                    Coupon "{couponCode}" applied ({(discount * 100).toFixed(0)}% off)
                  </p>
                )}
              </div>

              {/* Order totals */}
              <div className="space-y-3">
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <hr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`} />
                <div className={`flex justify-between text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={clearCart}
                  className={`w-full px-4 py-2 border rounded-md transition-colors duration-300 ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Clear Cart
                </button>
                <button className="w-full bg-primary hover:bg-accent text-white px-4 py-2 rounded-md transition-colors duration-300">
                  Proceed to Checkout
                </button>
              </div>

              <div className="mt-4">
                <Link
                  to="/products"
                  className={`block text-center ${darkMode ? 'text-gray-300 hover:text-primary' : 'text-gray-600 hover:text-primary'} transition-colors duration-300`}
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}