import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
  discount?: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number; // percentage (0-100)
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'LOAD_FROM_STORAGE'; payload: CartState };

interface CartContextType {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
  addItem: (product: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShipping: () => number;
  getTotal: () => number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'octocat-cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload)
      };
    
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.productId !== action.payload.productId)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        couponCode: '',
        couponDiscount: 0
      };
    
    case 'APPLY_COUPON':
      return {
        ...state,
        couponCode: action.payload.code,
        couponDiscount: action.payload.discount
      };
    
    case 'REMOVE_COUPON':
      return {
        ...state,
        couponCode: '',
        couponDiscount: 0
      };
    
    case 'LOAD_FROM_STORAGE':
      return action.payload;
    
    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  couponCode: '',
  couponDiscount: 0
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedState });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state]);

  const addItem = (product: Omit<CartItem, 'quantity'>, quantity: number) => {
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { ...product, quantity } 
    });
  };

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return state.items.reduce((total, item) => {
      const itemPrice = item.discount 
        ? item.price * (1 - item.discount)
        : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getDiscountAmount = () => {
    return state.couponDiscount > 0 ? (getSubtotal() * state.couponDiscount / 100) : 0;
  };

  const getShipping = () => {
    // Free shipping for orders over $100, otherwise $10
    const subtotal = getSubtotal();
    return subtotal > 100 ? 0 : 10;
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    const shipping = getShipping();
    return subtotal - discount + shipping;
  };

  const applyCoupon = (code: string): boolean => {
    // Simple coupon logic - in real app, this would validate with backend
    const validCoupons: Record<string, number> = {
      'SAVE10': 10,
      'SAVE20': 20,
      'WELCOME': 15,
      'OCTOCAT': 25
    };

    const discount = validCoupons[code.toUpperCase()];
    if (discount) {
      dispatch({ type: 'APPLY_COUPON', payload: { code: code.toUpperCase(), discount } });
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const value: CartContextType = {
    items: state.items,
    couponCode: state.couponCode,
    couponDiscount: state.couponDiscount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    getDiscountAmount,
    getShipping,
    getTotal,
    applyCoupon,
    removeCoupon
  };

  return (
    <CartContext.Provider value={value}>
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