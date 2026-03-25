import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getSubtotal, 
    getTotalDiscount
  } = useCart();
  const { darkMode } = useTheme();
  const [couponCode, setCouponCode] = useState('');
  const [shippingCost] = useState(15.00); // Fixed shipping cost for demo

  const handleQuantityChange = (productId: number, change: number) => {
    const item = items.find(item => item.productId === productId);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + change);
      updateQuantity(productId, newQuantity);
    }
  };

  const applyCoupon = () => {
    // Demo coupon functionality - could be extended
    if (couponCode.toLowerCase() === 'save10') {
      alert('Coupon applied! 10% discount');
    } else {
      alert('Invalid coupon code');
    }
  };

  const subtotal = getSubtotal();
  const discount = getTotalDiscount();
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center">
            <div className="mb-8">
              <svg
                className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.35 2.65M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m0 0H7"
                />
              </svg>
            </div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
              Your Cart is Empty
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-accent text-white font-medium rounded-lg transition-colors"
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
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            Shopping Cart
          </h1>
          <Link
            to="/products"
            className={`text-primary hover:text-accent font-medium`}
          >
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  Cart Items ({items.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <div key={item.productId} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image Placeholder */}
                      <div className={`w-20 h-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg flex items-center justify-center`}>
                        <svg className={`w-8 h-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-light' : 'text-gray-800'} truncate`}>
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {item.discount ? (
                            <>
                              <span className="text-gray-500 line-through text-sm">
                                ${item.price.toFixed(2)}
                              </span>
                              <span className="text-primary font-medium">
                                ${(item.price * (1 - item.discount)).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-primary font-medium">
                              ${item.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                          <button
                            onClick={() => handleQuantityChange(item.productId, -1)}
                            className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </button>
                          <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center font-medium`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, 1)}
                            className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-[80px]">
                        <div className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${((item.discount ? item.price * (1 - item.discount) : item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Actions */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={clearCart}
                className={`px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors`}
              >
                Clear Cart
              </button>
              <button
                className={`px-6 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} rounded-lg transition-colors`}
              >
                Update Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 transition-colors duration-300`}>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>
                Order Summary
              </h2>
              
              {/* Coupon Code */}
              <div className="mb-6">
                <label className={`block text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} mb-2`}>
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-light placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-primary hover:bg-accent text-white rounded-md transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Shipping:</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <hr className={`${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />
                <div className={`flex justify-between text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors mb-4">
                Proceed to Checkout
              </button>
              
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                Secure checkout powered by OctoCAT
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}