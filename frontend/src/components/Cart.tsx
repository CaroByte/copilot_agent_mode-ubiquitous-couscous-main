import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, subtotal, discount, shipping, total, couponCode, updateQuantity, removeItem, clearCart, applyCoupon } = useCart();
  const { darkMode } = useTheme();
  const [newCouponCode, setNewCouponCode] = useState('');

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleApplyCoupon = () => {
    applyCoupon(newCouponCode);
    setNewCouponCode('');
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto py-12">
          <div className="text-center">
            <div className={`mb-8 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              <svg 
                className="mx-auto h-32 w-32 mb-4 opacity-50" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" 
                />
              </svg>
              <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-xl mb-8">Add some cat-tech products to get started!</p>
            </div>
            <Link 
              to="/products" 
              className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 px-4 py-2 rounded-lg border border-red-500 hover:border-red-700 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition-colors duration-300`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-300`}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>
                        Product
                      </th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>
                        Price
                      </th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>
                        Quantity
                      </th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>
                        Total
                      </th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors duration-300`}>
                    {items.map((item) => (
                      <tr key={item.productId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-20 w-20">
                              <img 
                                className="h-20 w-20 rounded-lg object-cover" 
                                src={item.imgName ? `/api/images/products/${item.imgName}` : '/placeholder-product.png'} 
                                alt={item.name}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder-product.png';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className={`text-lg font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                                {item.name}
                              </div>
                              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                SKU: {item.sku} | Unit: {item.unit}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-lg font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-gray-700 text-light hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded transition-colors duration-300`}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className={`min-w-[3rem] text-center font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'bg-gray-700 text-light hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded transition-colors duration-300`}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          {formatPrice(item.price * item.quantity)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors duration-300`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}>
                Order Summary
              </h3>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className={`block text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className={`flex-1 px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-light' : 'border-gray-300 bg-white text-gray-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponCode && (
                  <p className="text-green-500 text-sm mt-2">
                    Coupon "{couponCode}" applied!
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-600'} transition-colors duration-300`}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-600'} transition-colors duration-300`}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {shipping === 0 && subtotal > 100 && (
                  <p className="text-green-500 text-sm">
                    🎉 Free shipping on orders over $100!
                  </p>
                )}
                <hr className={`${darkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`} />
                <div className={`flex justify-between text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-primary hover:bg-accent text-white py-3 px-4 rounded-lg text-lg font-medium transition-colors">
                  Proceed to Checkout
                </button>
                <Link 
                  to="/products" 
                  className={`w-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} py-3 px-4 rounded-lg text-center block transition-colors duration-300`}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}