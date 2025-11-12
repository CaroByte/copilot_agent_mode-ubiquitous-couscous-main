import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/cart/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function Cart() {
  const { items, subtotal, discount, shipping, total, coupon, updateQuantity, removeFromCart, applyCoupon } = useCart();
  const { darkMode } = useTheme();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const handleRemoveItem = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your cart?`)) {
      removeFromCart(id);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <svg 
              className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Your cart is empty</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>Add some products to get started!</p>
            <Link 
              to="/products" 
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Browse Products
            </Link>
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
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>Product</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>Price</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>Quantity</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>Total</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img 
                              src={`/${item.image}`} 
                              alt={item.name}
                              className={`h-16 w-16 object-contain rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-4`}
                            />
                            <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>{item.name}</span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1 w-fit`}>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center`}>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className={`px-6 py-4 font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors`}
                            aria-label={`Remove ${item.name}`}
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

              {/* Mobile Card View */}
              <div className="md:hidden p-4 space-y-4">
                {items.map(item => (
                  <div key={item.id} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <div className="flex items-start space-x-4 mb-3">
                      <img 
                        src={`/${item.image}`} 
                        alt={item.name}
                        className={`h-20 w-20 object-contain rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}
                      />
                      <div className="flex-grow">
                        <h3 className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} mb-1`}>{item.name}</h3>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>${item.price.toFixed(2)} each</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className={`${darkMode ? 'text-red-400' : 'text-red-600'}`}
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-lg p-1`}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary`}
                        >
                          -
                        </button>
                        <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center`}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary`}
                        >
                          +
                        </button>
                      </div>
                      <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className={`flex-grow px-4 py-2 ${darkMode ? 'bg-gray-700 text-light border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                    disabled={!!coupon}
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={!couponInput.trim() || !!coupon}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      couponInput.trim() && !coupon
                        ? 'bg-primary hover:bg-accent text-white'
                        : `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                    }`}
                  >
                    {coupon ? 'Applied' : 'Apply Coupon'}
                  </button>
                </div>
                {coupon && (
                  <p className="text-primary text-sm mt-2">✓ Coupon "{coupon}" applied! 5% discount activated.</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 sticky top-24`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal</span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Discount (5%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shipping</span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>${shipping.toFixed(2)}</span>
                </div>
                
                <div className={`pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between">
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Total</span>
                    <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors mb-3"
              >
                Proceed to Checkout
              </button>
              
              <Link 
                to="/products" 
                className={`block text-center ${darkMode ? 'text-gray-400 hover:text-light' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
