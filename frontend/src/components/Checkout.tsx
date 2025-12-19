import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { api } from '../api/config';

export default function Checkout() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create order - using timestamp with random component to reduce collision risk
      const orderData = {
        orderId: Date.now() + Math.floor(Math.random() * 1000),
        branchId: 1, // TODO: Should be retrieved from user context/settings
        orderDate: new Date().toISOString(),
        name: 'Customer Order',
        description: `Order with ${items.length} product(s)`,
        status: 'pending'
      };

      await axios.post(`${api.baseURL}${api.endpoints.orders}`, orderData);

      // Clear the cart and navigate
      clearCart();
      navigate('/products', { state: { orderSuccess: true } });
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <div className={`${darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'} rounded-lg p-8 text-center transition-colors duration-300`}>
            <p className="text-xl mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}>
          Shopping Cart
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          {items.map(item => {
            const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
            const itemTotal = itemPrice * item.quantity;

            return (
              <div
                key={item.productId}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 flex items-center gap-4 shadow-md transition-colors duration-300`}
              >
                <img
                  src={`/${item.imgName}`}
                  alt={item.name}
                  className="w-20 h-20 object-contain"
                />
                
                <div className="flex-grow">
                  <h3 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {item.discount ? (
                      <>
                        <span className="text-gray-500 line-through text-sm">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-primary font-semibold">
                          ${itemPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-primary font-semibold">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 transition-colors duration-300`}>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    -
                  </button>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center transition-colors duration-300`}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <div className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    ${itemTotal.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-md transition-colors duration-300`}>
          <div className="flex justify-between items-center mb-4">
            <span className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
              Total:
            </span>
            <span className="text-2xl font-bold text-primary">
              ${getTotalPrice().toFixed(2)}
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/products')}
              className={`flex-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} text-gray-800 dark:text-light px-6 py-3 rounded-lg transition-colors`}
            >
              Continue Shopping
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className={`flex-1 ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-accent'
              } text-white px-6 py-3 rounded-lg transition-colors`}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
