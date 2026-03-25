import { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  applyCoupon: (code: string) => boolean;
  couponDiscount: number;
  couponCode: string | null;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  const addToCart = (product: Product, quantity: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.product.productId === product.productId);
      if (existingItem) {
        return prev.map(item =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(item => item.product.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponDiscount(0);
    setCouponCode(null);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => {
      const itemPrice = item.product.discount 
        ? item.product.price * (1 - item.product.discount)
        : item.product.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const applyCoupon = (code: string): boolean => {
    // Simple coupon validation - in real app this would be API call
    const validCoupons: Record<string, number> = {
      'SAVE10': 0.1,
      'WELCOME': 0.05,
      'STUDENT': 0.15
    };

    if (validCoupons[code.toUpperCase()]) {
      setCouponDiscount(validCoupons[code.toUpperCase()]);
      setCouponCode(code.toUpperCase());
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
      getItemCount,
      getSubtotal,
      applyCoupon,
      couponDiscount,
      couponCode
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