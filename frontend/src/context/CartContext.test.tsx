import { describe, it, expect, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { CartProvider, useCart, CartItem } from './CartContext';

function TestConsumer({ onCart }: { onCart: (cart: ReturnType<typeof useCart>) => void }) {
  const cart = useCart();
  onCart(cart);
  return null;
}

function renderWithCart(onCart: (cart: ReturnType<typeof useCart>) => void) {
  return render(
    <CartProvider>
      <TestConsumer onCart={onCart} />
    </CartProvider>
  );
}

const sampleProduct = {
  productId: 1,
  name: 'SmartFeeder One',
  price: 129.99,
  imgName: 'feeder.png',
};

const discountProduct = {
  productId: 2,
  name: 'AutoClean Litter Dome',
  price: 200,
  imgName: 'litter.png',
  discount: 0.25,
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty cart', () => {
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    expect(cart.items).toEqual([]);
    expect(cart.itemCount).toBe(0);
    expect(cart.subtotal).toBe(0);
  });

  it('addItem adds a new product', () => {
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    act(() => cart.addItem(sampleProduct, 2));
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
  });

  it('addItem increments quantity if product already exists', () => {
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    act(() => cart.addItem(sampleProduct, 1));
    act(() => cart.addItem(sampleProduct, 3));
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(4);
  });

  it('addItem ignores quantity <= 0', () => {
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    act(() => cart.addItem(sampleProduct, 0));
    act(() => cart.addItem(sampleProduct, -1));
    expect(cart.items).toHaveLength(0);
  });

  it('removeItem removes the product', () => {
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    act(() => cart.addItem(sampleProduct, 1));
    act(() => cart.removeItem(sampleProduct.productId));
    expect(cart.items).toHaveLength(0);
  });

  it('updateQuantity updates the quantity', () => {
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    act(() => cart.addItem(sampleProduct, 1));
    act(() => cart.updateQuantity(sampleProduct.productId, 5));
    expect(cart.items[0].quantity).toBe(5);
  });

  it('updateQuantity with 0 removes the item', () => {
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    act(() => cart.addItem(sampleProduct, 1));
    act(() => cart.updateQuantity(sampleProduct.productId, 0));
    expect(cart.items).toHaveLength(0);
  });

  it('clearCart empties the cart', () => {
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    act(() => cart.addItem(sampleProduct, 2));
    act(() => cart.addItem(discountProduct, 3));
    act(() => cart.clearCart());
    expect(cart.items).toHaveLength(0);
  });

  it('calculates subtotal with per-product discount', () => {
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    act(() => cart.addItem(sampleProduct, 1));        // 129.99
    act(() => cart.addItem(discountProduct, 2));       // 200 * 0.75 * 2 = 300
    expect(cart.subtotal).toBeCloseTo(129.99 + 300, 2);
  });

  it('calculates itemCount with multiple items', () => {
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    act(() => cart.addItem(sampleProduct, 3));
    act(() => cart.addItem(discountProduct, 2));
    expect(cart.itemCount).toBe(5);
  });

  it('persists items to localStorage', () => {
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    act(() => cart.addItem(sampleProduct, 1));
    const stored = JSON.parse(localStorage.getItem('octocat-cart')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe(sampleProduct.productId);
  });

  it('reads cart from localStorage on init', () => {
    const saved: CartItem[] = [{ ...sampleProduct, quantity: 7 }];
    localStorage.setItem('octocat-cart', JSON.stringify(saved));
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(7);
  });

  it('handles invalid localStorage payload gracefully', () => {
    localStorage.setItem('octocat-cart', 'not-json!!!');
    let cart!: ReturnType<typeof useCart>;
    renderWithCart(c => { cart = c; });
    expect(cart.items).toEqual([]);
  });

  it('useCart throws if used outside CartProvider', () => {
    expect(() => {
      function Bad() { useCart(); return null; }
      render(<Bad />);
    }).toThrow('useCart must be used within a CartProvider');
  });
});
