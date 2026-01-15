import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getSubtotal, getDiscount, getShipping, getCartTotal } = useCart();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    // TODO: Implement coupon functionality
    alert('Coupon functionality coming soon!');
  };

  const handleUpdateCart = () => {
    // Cart is already updated in real-time, this is just for user feedback
    alert('Cart updated successfully!');
  };

  const handleProceedToCheckout = () => {
    // TODO: Implement checkout functionality
    alert('Proceeding to checkout...');
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <svg
              className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
              Add some products to get started!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items Table */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>S. No.</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Product Image</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Product Name</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Unit Price</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Quantity</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Total</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {items.map((item, index) => {
                      const itemPrice = item.discount 
                        ? item.price * (1 - item.discount)
                        : item.price;
                      const itemTotal = itemPrice * item.quantity;
                      
                      return (
                        <tr key={item.productId} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                          <td className={`px-4 py-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>{index + 1}</td>
                          <td className="px-4 py-4">
                            <div className={`w-20 h-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                              <img 
                                src={`/${item.imgName}`} 
                                alt={item.name}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                          </td>
                          <td className={`px-4 py-4 ${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>{item.name}</td>
                          <td className={`px-4 py-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                            ${itemPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-4">
                            <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 w-fit`}>
                              <button 
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                -
                              </button>
                              <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center`}>
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className={`px-4 py-4 ${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>
                            ${itemTotal.toFixed(2)}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-primary hover:text-accent transition-colors"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Coupon Code Section */}
              <div className={`px-6 py-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`flex-1 px-4 py-2 ${darkMode ? 'bg-gray-800 text-light border-gray-700' : 'bg-white text-gray-800 border-gray-300'} rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                  >
                    Apply Coupon
                  </button>
                </div>
              </div>

              {/* Update Cart Button */}
              <div className={`px-6 py-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <button
                  onClick={handleUpdateCart}
                  className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Update Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>
                    ${getSubtotal().toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Discount(5%)</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>
                    -${getDiscount().toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shipping</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>
                    ${getShipping().toFixed(2)}
                  </span>
                </div>
                
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'} pt-4 mt-4`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Grand Total</span>
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors mt-6"
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
