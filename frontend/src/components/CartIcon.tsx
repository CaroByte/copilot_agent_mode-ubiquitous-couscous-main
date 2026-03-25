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
      className={`relative flex items-center p-2 rounded-md transition-colors duration-300 ${
        darkMode 
          ? 'text-light hover:text-primary hover:bg-gray-700' 
          : 'text-gray-700 hover:text-primary hover:bg-gray-100'
      }`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      {/* Shopping Cart Icon */}
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.35 2.65M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m0 0H7" 
        />
      </svg>
      
      {/* Item Count Badge */}
      {itemCount > 0 && (
        <span 
          className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]"
          aria-label={`${itemCount} items in cart`}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}