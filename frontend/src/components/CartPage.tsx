import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getSubtotal, getTotal } = useCart();
  const { darkMode } = useTheme();
  const [couponCode, setCouponCode] = useState('');

  const shipping: number = 0; // Free shipping for now
  const discount: number = 0; // No discount applied for now

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <svg
              className={`mx-auto h-16 w-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.5M6 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
              Add some products to get started!
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            Shopping Cart
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
                {/* Table Header */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="grid grid-cols-6 gap-4 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider">
                    <div className="col-span-2">Product</div>
                    <div className="text-center">Price</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-center">Total</div>
                    <div className="text-center">Action</div>
                  </div>
                </div>
                
                {/* Cart Items */}
                <div className="divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}">
                  {items.map((item) => {
                    const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
                    const itemTotal = itemPrice * item.quantity;
                    
                    return (
                      <div key={item.productId} className="px-6 py-4">
                        <div className="grid grid-cols-6 gap-4 items-center">
                          {/* Product Info */}
                          <div className="col-span-2 flex items-center space-x-4">
                            <div className={`w-16 h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-2 flex-shrink-0`}>
                              <img
                                src={`/${item.imgName}`}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <h3 className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                                {item.name}
                              </h3>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                SKU: {item.sku}
                              </p>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="text-center">
                            {item.discount ? (
                              <div>
                                <span className="text-gray-500 line-through text-sm block">
                                  ${item.price.toFixed(2)}
                                </span>
                                <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                                  ${itemPrice.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                                ${itemPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          
                          {/* Quantity */}
                          <div className="text-center">
                            <div className={`inline-flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                className={`p-2 ${darkMode ? 'text-light hover:text-primary' : 'text-gray-600 hover:text-primary'} transition-colors`}
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                -
                              </button>
                              <span className={`px-3 py-2 min-w-[3rem] text-center ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                className={`p-2 ${darkMode ? 'text-light hover:text-primary' : 'text-gray-600 hover:text-primary'} transition-colors`}
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {/* Total */}
                          <div className="text-center">
                            <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                              ${itemTotal.toFixed(2)}
                            </span>
                          </div>
                          
                          {/* Remove Action */}
                          <div className="text-center">
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-500 hover:text-red-700 transition-colors p-2"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Cart Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link
                  to="/products"
                  className={`px-6 py-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} rounded-lg font-medium transition-colors text-center`}
                >
                  Continue Shopping
                </Link>
                <button
                  className={`px-6 py-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} rounded-lg font-medium transition-colors`}
                >
                  Update Cart
                </button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>
                  Order Summary
                </h2>
                
                {/* Coupon Code */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className={`flex-1 px-3 py-2 ${darkMode ? 'bg-gray-700 text-light border-gray-600' : 'bg-white text-gray-800 border-gray-300'} rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors`}
                    />
                    <button className="px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg font-medium transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span>Subtotal</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <hr className={`${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />
                  <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <button className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}