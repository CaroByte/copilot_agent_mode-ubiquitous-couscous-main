import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api/config';

export default function Cart() {
  const { items, subtotal, discount, shipping, total, updateQuantity, removeFromCart } = useCart();
  const { darkMode } = useTheme();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto py-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8`}>Shopping Cart</h1>
          <div className={`${darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'} rounded-lg p-8 text-center`}>
            <p className="text-xl mb-4">Your cart is empty</p>
            <a 
              href="/products" 
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg inline-block transition-colors"
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
      <div className="max-w-7xl mx-auto py-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8`}>Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Table */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-500'} uppercase tracking-wider`}>
                        S. No.
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-500'} uppercase tracking-wider`}>
                        Product
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-500'} uppercase tracking-wider`}>
                        Unit Price
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-500'} uppercase tracking-wider`}>
                        Quantity
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-500'} uppercase tracking-wider`}>
                        Total
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-500'} uppercase tracking-wider`}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {items.map((item, index) => {
                      const unitPrice = item.discount ? item.price * (1 - item.discount) : item.price;
                      const itemTotal = unitPrice * item.quantity;
                      
                      return (
                        <tr key={item.productId} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                            {index + 1}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                className="h-16 w-16 rounded-lg object-cover mr-4" 
                                src={`${api.baseURL}/products/image/${item.imgName}`}
                                alt={item.name}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.png';
                                }}
                              />
                              <div>
                                <div className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                                  {item.name}
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                  SKU: {item.sku}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                            {item.discount ? (
                              <div>
                                <span className="text-gray-500 line-through text-xs mr-2">
                                  ${item.price.toFixed(2)}
                                </span>
                                <span className="text-primary font-semibold">
                                  ${unitPrice.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-primary font-semibold">
                                ${unitPrice.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded ${darkMode ? 'bg-gray-700 text-light hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                className={`w-16 text-center rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-light' : 'bg-white border-gray-300 text-gray-900'} py-1`}
                                aria-label={`Quantity of ${item.name}`}
                              />
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded ${darkMode ? 'bg-gray-700 text-light hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                            ${itemTotal.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-900'} mb-4`}>
                Order Summary
              </h3>
              
              <div className="space-y-3">
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Discount (5%):</span>
                  <span className="text-green-600">-${discount.toFixed(2)}</span>
                </div>
                
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                
                <hr className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                
                <div className={`flex justify-between text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                  <span>Grand Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-primary hover:bg-accent text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Proceed To Checkout
              </button>
              
              <a 
                href="/products" 
                className={`block text-center mt-4 ${darkMode ? 'text-gray-300 hover:text-light' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}