import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should have empty initial state', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should add a new product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: 1, name: 'Widget', price: 10 });
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('should increment quantity when adding an existing product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: 1, name: 'Widget', price: 10 });
    });
    act(() => {
      result.current.addItem({ productId: 1, name: 'Widget', price: 10 });
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('should ignore addItem with quantity <= 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: 1, name: 'Widget', price: 10 }, 0);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('should remove a product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: 1, name: 'Widget', price: 10 });
    });
    act(() => {
      result.current.removeItem(1);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('should update quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: 1, name: 'Widget', price: 10 });
    });
    act(() => {
      result.current.updateQuantity(1, 5);
    });
    expect(result.current.items[0].quantity).toBe(5);
  });

  it('should remove item when updateQuantity is called with 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: 1, name: 'Widget', price: 10 });
    });
    act(() => {
      result.current.updateQuantity(1, 0);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('should clear the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: 1, name: 'A', price: 10 });
      result.current.addItem({ productId: 2, name: 'B', price: 20 });
    });
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('should calculate subtotal with per-product discount', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: 1, name: 'Widget', price: 100, discount: 0.25 }, 2);
    });
    // 100 * 0.75 * 2 = 150
    expect(result.current.subtotal).toBe(150);
  });

  it('should calculate itemCount with multiple items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: 1, name: 'A', price: 10 }, 3);
      result.current.addItem({ productId: 2, name: 'B', price: 20 }, 2);
    });
    expect(result.current.itemCount).toBe(5);
  });

  it('should persist to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({ productId: 1, name: 'Widget', price: 10 });
    });
    const stored = JSON.parse(localStorage.getItem('octocat-cart')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe(1);
  });

  it('should read from localStorage on init', () => {
    localStorage.setItem(
      'octocat-cart',
      JSON.stringify([{ productId: 5, name: 'Pre', price: 50, quantity: 3 }])
    );
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productId).toBe(5);
  });

  it('should handle invalid localStorage payload gracefully', () => {
    localStorage.setItem('octocat-cart', 'not-json!!!');
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
  });

  it('should throw error when useCart is used outside CartProvider', () => {
    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');
  });
});
