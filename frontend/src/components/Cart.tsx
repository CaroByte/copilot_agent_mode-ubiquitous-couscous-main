import { useState } from 'react';
import { useCart, CartItem } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getSubtotal, getDiscount, getShipping, getGrandTotal } = useCart();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    // TODO: Implement coupon functionality
    alert('Coupon functionality coming soon!');
  };

  const handleUpdateCart = () => {
    alert('Cart updated successfully!');
  };

  const handleProceedToCheckout = () => {
    alert('Checkout functionality coming soon!');
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Your cart is empty</h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>Add some products to get started!</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8`}>Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Table */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>S. No.</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>Product Image</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>Product Name</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>Unit Price</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>Quantity</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>Total</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>Remove</th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {items.map((item: CartItem, index: number) => {
                      const unitPrice = item.discount 
                        ? item.price * (1 - item.discount)
                        : item.price;
                      const total = unitPrice * item.quantity;

                      return (
                        <tr key={item.productId}>
                          <td className={`px-4 py-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>{index + 1}</td>
                          <td className="px-4 py-4">
                            <img 
                              src={`/${item.imgName}`} 
                              alt={item.name}
                              className="w-16 h-16 object-contain"
                            />
                          </td>
                          <td className={`px-4 py-4 ${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>{item.name}</td>
                          <td className={`px-4 py-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>${unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-4">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                              className={`w-20 px-3 py-2 ${darkMode ? 'bg-gray-700 text-light border-gray-600' : 'bg-white text-gray-800 border-gray-300'} rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
                            />
                          </td>
                          <td className={`px-4 py-4 ${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>${total.toFixed(2)}</td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-primary hover:text-accent transition-colors"
                              aria-label={`Remove ${item.name}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Coupon and Update Cart */}
              <div className={`px-4 py-4 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t flex flex-col sm:flex-row justify-between items-center gap-4`}>
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-light border-gray-600 placeholder-gray-400' : 'bg-white text-gray-800 border-gray-300 placeholder-gray-500'} rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none flex-1 sm:w-64`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                  >
                    Apply Coupon
                  </button>
                </div>
                <button
                  onClick={handleUpdateCart}
                  className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
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
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>${getSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Discount(5%)</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>-${getDiscount().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shipping</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>${getShipping().toFixed(2)}</span>
                </div>
                
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Grand Total</span>
                    <span className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>${getGrandTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors text-lg"
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
