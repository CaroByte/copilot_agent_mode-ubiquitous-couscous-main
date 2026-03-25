import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const { darkMode } = useTheme();

  const subtotal = getTotalPrice();
  const shippingCost = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  const handleQuantityChange = (productId: number, change: number) => {
    const item = items.find(item => item.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity + change);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 text-center transition-colors duration-300`}>
            <svg 
              className={`mx-auto h-16 w-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.2 5M7 13l-1.2 5m0 0h8.4m0 0l1.2-5m-1.2 5v-2m0 2h2m-2 0v2" 
              />
            </svg>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Add some amazing cat tech products to get started!
            </p>
            <Link 
              to="/products" 
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
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
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Product
                      </th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Quantity
                      </th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Price
                      </th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Total
                      </th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors duration-300`}>
                    {items.map((item) => {
                      const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
                      const itemTotal = itemPrice * item.quantity;
                      
                      return (
                        <tr key={item.productId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                className="h-16 w-16 rounded-lg object-cover bg-gray-200" 
                                src={`/products/${item.imgName}`} 
                                alt={item.name}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/products/placeholder.png';
                                }}
                              />
                              <div className="ml-4">
                                <div className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                                  {item.name}
                                </div>
                                {item.discount && (
                                  <div className="text-sm text-green-600">
                                    {Math.round(item.discount * 100)}% off
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.productId, -1)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors`}
                              >
                                -
                              </button>
                              <span className={`w-8 text-center ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.productId, 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors`}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {item.discount && (
                              <span className={`line-through mr-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                ${item.price.toFixed(2)}
                              </span>
                            )}
                            ${itemPrice.toFixed(2)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                            ${itemTotal.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => removeItem(item.productId)}
                              className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'} transition-colors`}
                            >
                              Remove
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
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 transition-colors duration-300`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                Order Summary
              </h2>
              
              <div className="space-y-3">
                <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <hr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                
                <div className={`flex justify-between text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-primary hover:bg-accent text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  Proceed to Checkout
                </button>
                
                <button 
                  onClick={clearCart}
                  className={`w-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} py-2 px-4 rounded-lg font-medium transition-colors`}
                >
                  Clear Cart
                </button>
                
                <Link 
                  to="/products"
                  className={`block w-full text-center ${darkMode ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'} py-2 font-medium transition-colors`}
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