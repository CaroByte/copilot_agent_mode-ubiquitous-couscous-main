import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartIcon() {
  const { getTotalItems } = useCart();
  const { darkMode } = useTheme();
  const itemCount = getTotalItems();

  return (
    <Link 
      to="/cart" 
      className={`relative flex items-center justify-center p-2 rounded-md transition-colors ${
        darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'
      }`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      {/* Shopping Cart Icon */}
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" 
        />
      </svg>
      
      {/* Badge with item count */}
      <span 
        className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem] transition-colors"
        aria-label={`${itemCount} items in cart`}
      >
        {itemCount}
      </span>
    </Link>
  );
}