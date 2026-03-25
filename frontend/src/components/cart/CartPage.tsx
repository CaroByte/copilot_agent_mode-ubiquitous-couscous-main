import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

export default function CartPage() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getSubtotal, 
    getDiscountAmount, 
    getShipping, 
    getTotal,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon
  } = useCart();
  const { darkMode } = useTheme();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="mb-8">
              <svg className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 8M7 13l5.5-4m0 0l5.5 4" />
              </svg>
            </div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Your Cart is Empty</h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
              Looks like you haven't added any AI-powered cat products yet.
            </p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-accent text-white font-medium rounded-lg transition-colors duration-300"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>Shopping Cart</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'} transition-colors`}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => {
                  const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
                  const originalPrice = item.price;
                  
                  return (
                    <div key={item.productId} className="px-6 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={`/product-images/${item.imgName}`}
                            alt={item.name}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-medium ${darkMode ? 'text-light' : 'text-gray-800'} mb-1`}>
                            {item.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {item.discount ? (
                              <>
                                <span className="text-gray-500 line-through text-sm">${originalPrice.toFixed(2)}</span>
                                <span className="text-primary font-bold">${itemPrice.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="text-primary font-bold">${itemPrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                            >
                              <span aria-hidden="true">-</span>
                            </button>
                            <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                            >
                              <span aria-hidden="true">+</span>
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.productId)}
                            className={`p-2 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'} transition-colors`}
                            aria-label={`Remove ${item.name}`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                            ${(itemPrice * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 transition-colors duration-300`}>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>Order Summary</h2>
              
              {/* Coupon Code */}
              <div className="mb-6">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Coupon Code
                </label>
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <span className="text-green-800 dark:text-green-200 font-medium">{couponCode}</span>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className={`flex-1 px-3 py-2 border rounded-lg ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-light placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponInput.trim()}
                        className="px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-sm">{couponError}</p>
                    )}
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Try: SAVE10, SAVE20, WELCOME, OCTOCAT
                    </p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subtotal</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>${getSubtotal().toFixed(2)}</span>
                </div>
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({couponDiscount}%)</span>
                    <span>-${getDiscountAmount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Shipping</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    {getShipping() === 0 ? 'Free' : `$${getShipping().toFixed(2)}`}
                  </span>
                </div>
                
                {getShipping() === 0 && (
                  <div className="text-xs text-green-600 dark:text-green-400">
                    Free shipping on orders over $100
                  </div>
                )}
                
                <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} pt-3`}>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>Total</span>
                    <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className="w-full bg-primary hover:bg-accent text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                onClick={() => alert('Checkout functionality would be implemented here')}
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-4 text-center">
                <a
                  href="/products"
                  className={`text-sm ${darkMode ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'} transition-colors`}
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}