import { useCart, CartItem } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

interface CartItemProps {
  item: CartItem;
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { darkMode } = useTheme();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.productId, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${
      darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
    } transition-colors duration-300`}>
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={`/product-images/${item.image}`}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/product-images/placeholder.png';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow min-w-0">
        <h3 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
          {item.name}
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
          ${item.price.toFixed(2)} each
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border ${
            darkMode 
              ? 'border-gray-600 text-light hover:bg-gray-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          } transition-colors duration-300`}
          aria-label={`Decrease quantity of ${item.name}`}
        >
          -
        </button>
        <span 
          className={`min-w-[2rem] text-center ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
        >
          {item.quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border ${
            darkMode 
              ? 'border-gray-600 text-light hover:bg-gray-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          } transition-colors duration-300`}
          aria-label={`Increase quantity of ${item.name}`}
        >
          +
        </button>
      </div>

      {/* Total Price */}
      <div className={`text-right min-w-[5rem] ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
        <div className="font-semibold">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className={`p-2 rounded-lg ${
          darkMode 
            ? 'text-red-400 hover:bg-red-900/20' 
            : 'text-red-600 hover:bg-red-50'
        } transition-colors duration-300`}
        aria-label={`Remove ${item.name} from cart`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}