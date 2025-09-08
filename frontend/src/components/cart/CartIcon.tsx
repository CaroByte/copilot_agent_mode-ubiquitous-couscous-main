import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function CartIcon() {
  const { getTotalItems } = useCart();
  const { darkMode } = useTheme();
  const itemCount = getTotalItems();

  return (
    <Link 
      to="/cart" 
      className={`relative flex items-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
    >
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
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.2 5M7 13l-1.2 5m0 0h8.4m0 0l1.2-5m-1.2 5v-2m0 2h2m-2 0v2" 
        />
      </svg>
      {itemCount > 0 && (
        <span 
          className={`absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]`}
        >
          {itemCount}
        </span>
      )}
    </Link>
  );
}