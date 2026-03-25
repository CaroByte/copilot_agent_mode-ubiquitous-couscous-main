import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

interface CartItemComponentProps {
  item: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    imgName: string;
    sku: string;
    discount?: number;
  };
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  darkMode: boolean;
}

function CartItemComponent({ item, onUpdateQuantity, onRemove, darkMode }: CartItemComponentProps) {
  const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
  const totalPrice = itemPrice * item.quantity;

  return (
    <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b transition-colors`}>
      <td className="py-4 px-6">
        <div className="flex items-center space-x-4">
          <img 
            src={`/products/${item.imgName}`} 
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/products/placeholder.png';
            }}
          />
          <div>
            <h3 className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors`}>
              {item.name}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`}>
              SKU: {item.sku}
            </p>
            {item.discount && (
              <p className="text-sm text-green-600">
                {Math.round(item.discount * 100)}% off
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center space-x-2">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`}>
            ${item.price.toFixed(2)}
          </span>
          {item.discount && (
            <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors`}>
              ${itemPrice.toFixed(2)}
            </span>
          )}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            className={`w-8 h-8 flex items-center justify-center rounded ${darkMode ? 'bg-gray-700 text-light hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            -
          </button>
          <span className={`w-12 text-center ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors`}>
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded ${darkMode ? 'bg-gray-700 text-light hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
            aria-label={`Increase quantity of ${item.name}`}
          >
            +
          </button>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors`}>
          ${totalPrice.toFixed(2)}
        </span>
      </td>
      <td className="py-4 px-6">
        <button
          onClick={() => onRemove(item.productId)}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
}

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotalItems, 
    getTotalPrice, 
    getSubtotal,
    applyCoupon,
    removeCoupon,
    couponCode,
    couponDiscount
  } = useCart();
  const { darkMode } = useTheme();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const success = applyCoupon(couponInput.trim());
    if (success) {
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponError('');
  };

  const subtotal = getSubtotal();
  const totalPrice = getTotalPrice();
  const couponSavings = subtotal * couponDiscount;

  if (items.length === 0) {
    return (
      <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <svg className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-10 0h10" />
            </svg>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors`}>
              Your Cart is Empty
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 transition-colors`}>
              Looks like you haven't added any products to your cart yet.
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
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors`}>
            Shopping Cart ({getTotalItems()} items)
          </h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden transition-colors`}>
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors`}>
                      Product
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors`}>
                      Price
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors`}>
                      Quantity
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors`}>
                      Total
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors`}>
                      Remove
                    </th>
                  </tr>
                </thead>
                <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors`}>
                  {items.map((item) => (
                    <CartItemComponent
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                      darkMode={darkMode}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 transition-colors`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors`}>
                Order Summary
              </h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors`}>
                  Coupon Code
                </label>
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 bg-green-100 border border-green-300 rounded-lg">
                    <span className="text-green-800 font-medium">{couponCode}</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className={`flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-light placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                        } transition-colors`}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-primary hover:bg-accent text-white rounded-r-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-sm">{couponError}</p>
                    )}
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`}>
                      Try: SAVE10, SAVE20, WELCOME, CAT20
                    </p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>
                    Subtotal:
                  </span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors`}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                {couponCode && couponSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({couponCode}):</span>
                    <span>-${couponSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'} pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors`}>
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors mb-4">
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className={`block text-center ${darkMode ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'} transition-colors`}
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