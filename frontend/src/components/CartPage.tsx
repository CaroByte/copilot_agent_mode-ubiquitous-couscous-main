import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import CartItemComponent from './CartItem';
import OrderSummary from './OrderSummary';

export default function CartPage() {
  const { items } = useCart();
  const { darkMode } = useTheme();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen pt-20 px-4 ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className={`text-center py-12 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
            <div className="mb-6">
              <svg
                className={`mx-auto w-24 h-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-300`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5h11M7 13v5a1 1 0 001 1h8a1 1 0 001-1v-5M9 19h.01M20 19h.01"
                />
              </svg>
            </div>
            <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
              Your Cart is Empty
            </h1>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 px-4 ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/products"
              className={`flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-primary' : 'text-gray-600 hover:text-primary'} transition-colors duration-300`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
          </div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemComponent key={item.productId} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummary />
            </div>
          </div>
        </div>

        {/* Mobile Order Summary for small screens */}
        <div className="lg:hidden mt-8">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}