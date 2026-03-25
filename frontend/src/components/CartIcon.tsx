import { Link } from 'react-router-dom';
import { useCart } from '../context/cart/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartIcon() {
  const { getItemCount } = useCart();
  const { darkMode } = useTheme();
  const itemCount = getItemCount();

  return (
    <Link
      to="/cart"
      className="relative p-2 rounded-full focus:outline-none transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
