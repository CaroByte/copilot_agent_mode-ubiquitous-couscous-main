import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getSubtotal, applyCoupon, couponDiscount, couponCode } = useCart();
  const { darkMode } = useTheme();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = getSubtotal();
  const discount = subtotal * couponDiscount;
  const total = subtotal - discount;

  const handleCouponApply = () => {
    setCouponError('');
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    const success = applyCoupon(couponInput.trim());
    if (success) {
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, Math.max(0, newQuantity));
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto py-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center transition-colors duration-300`}>
            <svg 
              className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6.5-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2-2v4.01"></path>
            </svg>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2 transition-colors duration-300`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
              Add some products to your cart to get started
            </p>
            <Link 
              to="/products" 
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors duration-300"
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
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
              darkMode 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Table */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition-colors duration-300`}>
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
                    {items.map((item) => {
                      const itemPrice = item.product.discount 
                        ? item.product.price * (1 - item.product.discount)
                        : item.product.price;
                      const itemTotal = itemPrice * item.quantity;

                      return (
                        <tr key={item.product.productId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                src={`/${item.product.imgName}`} 
                                alt={item.product.name}
                                className="h-16 w-16 rounded-lg object-cover mr-4"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.png';
                                }}
                              />
                              <div>
                                <div className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                                  {item.product.name}
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                                  SKU: {item.product.sku}
                                </div>
                                {item.product.discount && (
                                  <div className="text-sm text-green-600">
                                    {(item.product.discount * 100).toFixed(0)}% off
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                            {item.product.discount ? (
                              <div>
                                <span className="line-through text-gray-400">${item.product.price.toFixed(2)}</span>
                                <span className="ml-2">${itemPrice.toFixed(2)}</span>
                              </div>
                            ) : (
                              `$${item.product.price.toFixed(2)}`
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.product.productId, item.quantity - 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-300 ${
                                  darkMode 
                                    ? 'bg-gray-700 hover:bg-gray-600 text-light' 
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                                aria-label={`Decrease quantity of ${item.product.name}`}
                              >
                                -
                              </button>
                              <span className={`px-3 py-1 text-center min-w-[3rem] ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.product.productId, item.quantity + 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-300 ${
                                  darkMode 
                                    ? 'bg-gray-700 hover:bg-gray-600 text-light' 
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                                aria-label={`Increase quantity of ${item.product.name}`}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
                            ${itemTotal.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => removeFromCart(item.product.productId)}
                              className="text-red-600 hover:text-red-800 transition-colors duration-300"
                              aria-label={`Remove ${item.product.name} from cart`}
                            >
                              <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors duration-300`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-900'} mb-6 transition-colors duration-300`}>
                Order Summary
              </h3>
              
              {/* Coupon Section */}
              <div className="mb-6">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                  Coupon Code
                </label>
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                    <span className="text-green-800 font-medium">{couponCode} Applied</span>
                    <button
                      onClick={() => {
                        applyCoupon('');
                        setCouponInput('');
                      }}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter coupon code"
                      className={`flex-1 px-3 py-2 rounded-lg border transition-colors duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-light placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      onKeyPress={(e) => e.key === 'Enter' && handleCouponApply()}
                    />
                    <button
                      onClick={handleCouponApply}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors duration-300"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-red-500 text-sm mt-1">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({(couponDiscount * 100).toFixed(0)}%):</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className={`flex justify-between text-lg font-semibold pt-3 border-t ${darkMode ? 'border-gray-700 text-light' : 'border-gray-200 text-gray-900'} transition-colors duration-300`}>
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors duration-300 font-medium">
                  Proceed to Checkout
                </button>
                <Link 
                  to="/products" 
                  className={`w-full px-6 py-3 rounded-lg transition-colors duration-300 font-medium text-center block ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-light' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
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