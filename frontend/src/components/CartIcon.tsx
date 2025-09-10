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
      className="relative p-2 rounded-full hover:bg-gray-100 hover:bg-opacity-10 transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      {/* Shopping Cart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 ${darkMode ? 'text-light' : 'text-gray-700'} transition-colors`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.5M6 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
        />
      </svg>
      
      {/* Badge with item count */}
      <span
        className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]"
        aria-hidden="true"
      >
        {itemCount > 99 ? '99+' : itemCount}
      </span>
    </Link>
  );
}