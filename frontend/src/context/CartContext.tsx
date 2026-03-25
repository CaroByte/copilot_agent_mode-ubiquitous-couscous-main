import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: { productId: number; name: string; price: number; imgName: string }, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  applyCoupon: (code: string) => boolean;
  couponCode: string;
  discount: number;
  shipping: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'octocat-cart';
const COUPON_CODES = {
  'SAVE10': 0.10,
  'WELCOME20': 0.20,
  'STUDENT15': 0.15
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const shipping = 9.99; // Fixed shipping cost

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setItems(parsed.items || []);
        setCouponCode(parsed.couponCode || '');
        setDiscount(parsed.discount || 0);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        items,
        couponCode,
        discount
      }));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items, couponCode, discount]);

  const addToCart = (product: { productId: number; name: string; price: number; imgName: string }, quantity: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.productId === product.productId);
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscount(0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount + (items.length > 0 ? shipping : 0);
    return Math.max(0, total);
  };

  const applyCoupon = (code: string) => {
    const upperCode = code.toUpperCase();
    if (COUPON_CODES[upperCode as keyof typeof COUPON_CODES]) {
      setCouponCode(upperCode);
      setDiscount(COUPON_CODES[upperCode as keyof typeof COUPON_CODES]);
      return true;
    }
    return false;
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getSubtotal,
      applyCoupon,
      couponCode,
      discount,
      shipping
    }}>
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