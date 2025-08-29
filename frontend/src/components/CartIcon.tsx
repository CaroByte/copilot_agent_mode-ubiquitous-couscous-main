import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartIcon() {
  const { totalItems } = useCart();
  const { darkMode } = useTheme();

  return (
    <Link 
      to="/cart" 
      className={`relative p-2 rounded-md transition-colors ${
        darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'
      }`}
      aria-label={`Cart with ${totalItems} items`}
    >
      {/* Shopping Cart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2 2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
        />
      </svg>
      
      {/* Item Count Badge */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}