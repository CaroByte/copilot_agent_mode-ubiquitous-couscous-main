import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CartProvider, useCart } from './CartContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const sampleItem = {
  productId: 1,
  name: 'SmartFeeder One',
  price: 129.99,
  imgName: 'feeder.png',
};

const discountItem = {
  productId: 2,
  name: 'AutoClean Litter Dome',
  price: 199.99,
  imgName: 'litter-box.png',
  discount: 0.25,
};

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
    act(() => result.current.addItem(sampleItem, 2));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('should increment quantity if product already exists', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(sampleItem, 1));
    act(() => result.current.addItem(sampleItem, 3));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(4);
  });

  it('should ignore quantity <= 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(sampleItem, 0));
    expect(result.current.items).toHaveLength(0);
    act(() => result.current.addItem(sampleItem, -1));
    expect(result.current.items).toHaveLength(0);
  });

  it('should remove a product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(sampleItem, 1));
    act(() => result.current.removeItem(sampleItem.productId));
    expect(result.current.items).toHaveLength(0);
  });

  it('should update quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(sampleItem, 1));
    act(() => result.current.updateQuantity(sampleItem.productId, 5));
    expect(result.current.items[0].quantity).toBe(5);
  });

  it('should remove item when quantity updated to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(sampleItem, 3));
    act(() => result.current.updateQuantity(sampleItem.productId, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it('should clear the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(sampleItem, 1));
    act(() => result.current.addItem(discountItem, 2));
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
  });

  it('should calculate subtotal with per-product discount', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(sampleItem, 1)); // 129.99
    act(() => result.current.addItem(discountItem, 1)); // 199.99 * 0.75 = 149.9925
    const expected = 129.99 + 199.99 * 0.75;
    expect(result.current.subtotal).toBeCloseTo(expected, 2);
  });

  it('should calculate itemCount with multiple items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(sampleItem, 2));
    act(() => result.current.addItem(discountItem, 3));
    expect(result.current.itemCount).toBe(5);
  });

  it('should persist cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(sampleItem, 1));
    const stored = JSON.parse(localStorage.getItem('octocat-cart')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe(sampleItem.productId);
  });

  it('should read cart from localStorage on init', () => {
    localStorage.setItem(
      'octocat-cart',
      JSON.stringify([{ ...sampleItem, quantity: 4 }])
    );
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(4);
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
