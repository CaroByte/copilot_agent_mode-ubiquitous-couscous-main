import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function OrderSummary() {
  const { getTotalPrice, clearCart } = useCart();
  const { darkMode } = useTheme();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = getTotalPrice();
  const discountAmount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount for valid coupons
  const shippingCost = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  const grandTotal = subtotal - discountAmount + shippingCost;

  const handleApplyCoupon = () => {
    setCouponError('');
    // Simple coupon validation - in real app this would be an API call
    const validCoupons = ['SAVE10', 'WELCOME', 'FIRSTORDER'];
    if (validCoupons.includes(couponCode.toUpperCase())) {
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleProceedToCheckout = () => {
    // In a real app, this would navigate to checkout or process payment
    alert('Proceeding to checkout... (This is a demo)');
  };

  const handleUpdateCart = () => {
    // This could trigger a re-calculation or refresh
    // For now, just show a message
    alert('Cart updated!');
  };

  return (
    <div className={`p-6 rounded-lg border ${
      darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
    } transition-colors duration-300`}>
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
        Order Summary
      </h2>

      {/* Coupon Section */}
      <div className="mb-6">
        <label htmlFor="coupon" className={`block text-sm font-medium mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        } transition-colors duration-300`}>
          Coupon Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className={`flex-1 px-3 py-2 border rounded-lg ${
              darkMode 
                ? 'border-gray-600 bg-gray-700 text-light placeholder-gray-400' 
                : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300`}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Apply
          </button>
        </div>
        {couponError && (
          <p className="text-red-500 text-sm mt-1">{couponError}</p>
        )}
        {appliedCoupon && (
          <div className="flex items-center justify-between mt-2 p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <span className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
              Coupon "{appliedCoupon}" applied!
            </span>
            <button
              onClick={handleRemoveCoupon}
              className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'} transition-colors`}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {appliedCoupon && (
          <div className={`flex justify-between ${darkMode ? 'text-green-400' : 'text-green-600'} transition-colors duration-300`}>
            <span>Discount ({appliedCoupon})</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
          <span>Shipping</span>
          <span>
            {shippingCost === 0 ? (
              <span className={darkMode ? 'text-green-400' : 'text-green-600'}>FREE</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
        
        <hr className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`} />
        
        <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
          <span>Grand Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleProceedToCheckout}
          disabled={subtotal === 0}
          className="w-full py-3 bg-primary text-white rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Proceed to Checkout
        </button>
        
        <button
          onClick={handleUpdateCart}
          className={`w-full py-2 border rounded-lg transition-colors ${
            darkMode 
              ? 'border-gray-600 text-light hover:bg-gray-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Update Cart
        </button>
        
        <button
          onClick={clearCart}
          disabled={subtotal === 0}
          className={`w-full py-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            darkMode 
              ? 'text-red-400 hover:text-red-300' 
              : 'text-red-600 hover:text-red-500'
          }`}
        >
          Clear Cart
        </button>
      </div>

      {subtotal > 0 && subtotal < 100 && (
        <p className={`text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
          Add ${(100 - subtotal).toFixed(2)} more for free shipping!
        </p>
      )}
    </div>
  );
}