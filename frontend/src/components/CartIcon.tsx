import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartIcon() {
  const { getItemCount } = useCart();
  const { darkMode } = useTheme();
  const itemCount = getItemCount();

  return (
    <Link 
      to="/cart" 
      className={`relative p-2 rounded-md transition-colors ${
        darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'
      }`}
      aria-label={`Cart with ${itemCount} items`}
    >
      <svg 
        className="h-6 w-6" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        aria-hidden="true"
      >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6.5-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2-2v4.01"></path>
      </svg>
      {itemCount > 0 && (
        <span 
          className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          aria-label={`${itemCount} items in cart`}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}