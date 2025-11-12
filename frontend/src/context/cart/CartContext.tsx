import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartContextType } from '../../types/cart';

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'cart-items';
const DISCOUNT_RATE = 0.05; // 5% discount
const SHIPPING_COST = 10;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initialization
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate structure
        if (Array.isArray(parsed)) {
          return parsed.filter(item => 
            item && 
            typeof item.id === 'number' && 
            typeof item.name === 'string' && 
            typeof item.price === 'number' && 
            typeof item.quantity === 'number' &&
            typeof item.image === 'string'
          );
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  });
  const [coupon, setCoupon] = useState<string | null>(null);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate discount (5% when coupon is applied)
  const discount = coupon ? subtotal * DISCOUNT_RATE : 0;
  
  // Calculate shipping ($10 flat rate)
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  
  // Calculate total
  const total = subtotal - discount + shipping;

  const addToCart = (item: { id: number; name: string; price: number; image: string }, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code: string) => {
    // Simple coupon validation - in real app would validate with backend
    if (code && code.trim().length > 0) {
      setCoupon(code);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        discount,
        shipping,
        total,
        coupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
