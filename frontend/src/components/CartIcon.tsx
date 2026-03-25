import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartIcon() {
  const { getTotalItems } = useCart();
  const { darkMode } = useTheme();
  const totalItems = getTotalItems();

  return (
    <Link
      to="/cart"
      className={`relative p-2 rounded-lg transition-colors ${
        darkMode ? 'text-light hover:text-primary hover:bg-gray-700' : 'text-gray-700 hover:text-primary hover:bg-gray-100'
      }`}
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      {/* Cart SVG Icon */}
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5h11M7 13v5a1 1 0 001 1h8a1 1 0 001-1v-5M9 19h.01M20 19h.01"
        />
      </svg>
      
      {/* Badge with item count */}
      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          aria-label={`${totalItems} items in cart`}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}