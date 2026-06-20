import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const SHIPPING_COST = 10;
const DISCOUNT_RATE = 0.05;

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const { darkMode } = useTheme();

  const subtotal = getTotal();
  const discount = subtotal * DISCOUNT_RATE;
  const grandTotal = subtotal + SHIPPING_COST - discount;

  if (cartItems.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto text-center py-20">
          <svg className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Your cart is empty</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>Looks like you haven&apos;t added any items yet.</p>
          <Link to="/products" className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Shopping Cart</h1>
          <button
            onClick={clearCart}
            className={`mt-2 sm:mt-0 text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
          >
            Clear Cart
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map(item => (
              <div
                key={item.productId}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-center gap-4 transition-colors duration-300`}
              >
                <div className={`w-24 h-24 flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden`}>
                  <img src={`/${item.imgName}`} alt={item.name} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} truncate`}>{item.name}</h3>
                  <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>
                    <span className={`min-w-[2rem] text-center ${darkMode ? 'text-light' : 'text-gray-800'}`}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <span className={`font-bold min-w-[5rem] text-right ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className={`p-2 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 sticky top-24 transition-colors duration-300`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Order Summary</h2>
              <div className="space-y-3">
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Shipping</span>
                  <span>${SHIPPING_COST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span>Discount (5%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <hr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors">
                Proceed to Checkout
              </button>
              <Link
                to="/products"
                className={`block text-center mt-3 text-sm ${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-500 hover:text-primary'} transition-colors`}
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
