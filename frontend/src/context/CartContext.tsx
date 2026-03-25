import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
  sku: string;
  discount?: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  couponCode: string | null;
  couponDiscount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedCoupon = localStorage.getItem('cartCoupon');
    const savedDiscount = localStorage.getItem('cartCouponDiscount');
    
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    
    if (savedCoupon) {
      setCouponCode(savedCoupon);
      setCouponDiscount(savedDiscount ? parseFloat(savedDiscount) : 0);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Save coupon to localStorage whenever it changes
  useEffect(() => {
    if (couponCode) {
      localStorage.setItem('cartCoupon', couponCode);
      localStorage.setItem('cartCouponDiscount', couponDiscount.toString());
    } else {
      localStorage.removeItem('cartCoupon');
      localStorage.removeItem('cartCouponDiscount');
    }
  }, [couponCode, couponDiscount]);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.productId === product.productId);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...currentItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(currentItems => currentItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setCouponDiscount(0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => {
      const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    return subtotal * (1 - couponDiscount);
  };

  const applyCoupon = (code: string): boolean => {
    // Simple coupon system - in a real app this would validate with the backend
    const validCoupons: Record<string, number> = {
      'SAVE10': 0.1,
      'SAVE20': 0.2,
      'WELCOME': 0.15,
      'CAT20': 0.2
    };

    const discount = validCoupons[code.toUpperCase()];
    if (discount) {
      setCouponCode(code.toUpperCase());
      setCouponDiscount(discount);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponDiscount(0);
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
      removeCoupon,
      couponCode,
      couponDiscount
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