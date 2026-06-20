import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '../../context/CartContext';
import CartPage from './CartPage';
import type { ReactNode } from 'react';

// Helper to seed cart before rendering CartPage
function SeedCart({ items, children }: { items: { productId: number; name: string; price: number; discount?: number; quantity: number }[]; children: ReactNode }) {
  return (
    <CartProvider>
      <SeedCartInner items={items} />
      {children}
    </CartProvider>
  );
}

function SeedCartInner({ items }: { items: { productId: number; name: string; price: number; discount?: number; quantity: number }[] }) {
  const { addItem } = useCart();
  // Seed on first render
  if (items.length > 0) {
    // Use a ref-like approach — items are seeded via localStorage before provider mounts
  }
  // We'll use localStorage seeding instead
  return null;
}

function renderCartPage(initialItems: { productId: number; name: string; price: number; discount?: number; quantity: number }[] = []) {
  if (initialItems.length > 0) {
    localStorage.setItem('octocat-cart', JSON.stringify(initialItems));
  }
  return render(
    <CartProvider>
      <CartPage />
    </CartProvider>
  );
}

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show "Your cart is empty" when cart has no items', () => {
    renderCartPage();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('should have "Proceed To Checkout" button disabled when cart is empty', () => {
    renderCartPage();
    expect(screen.getByText('Proceed To Checkout')).toBeDisabled();
  });

  it('should have "Clear Cart" button disabled when cart is empty', () => {
    renderCartPage();
    expect(screen.getByText('Clear Cart')).toBeDisabled();
  });

  it('should render items with name, unit price, and line total', () => {
    renderCartPage([
      { productId: 1, name: 'Widget A', price: 50, quantity: 2 },
    ]);
    expect(screen.getByText('Widget A')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('should show Order Summary with subtotal, discount, shipping, and grand total', () => {
    renderCartPage([
      { productId: 1, name: 'Widget A', price: 100, quantity: 1 },
    ]);
    expect(screen.getByTestId('subtotal')).toHaveTextContent('$100.00');
    expect(screen.getByTestId('discount')).toHaveTextContent('$5.00');
    expect(screen.getByTestId('shipping')).toHaveTextContent('$10.00');
    expect(screen.getByTestId('grand-total')).toHaveTextContent('$105.00');
  });

  it('should increment quantity with + button and recalculate total', async () => {
    const user = userEvent.setup();
    renderCartPage([
      { productId: 1, name: 'Widget A', price: 50, quantity: 1 },
    ]);
    const plusButton = screen.getByLabelText('Increase quantity of Widget A');
    await user.click(plusButton);
    expect(screen.getByTestId('subtotal')).toHaveTextContent('$100.00');
  });

  it('should remove an item with the Remove button', async () => {
    const user = userEvent.setup();
    renderCartPage([
      { productId: 1, name: 'Widget A', price: 50, quantity: 1 },
    ]);
    await user.click(screen.getByText('Remove'));
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('should clear the cart with Clear Cart button', async () => {
    const user = userEvent.setup();
    renderCartPage([
      { productId: 1, name: 'Widget A', price: 50, quantity: 1 },
      { productId: 2, name: 'Widget B', price: 30, quantity: 2 },
    ]);
    await user.click(screen.getByText('Clear Cart'));
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('should enable buttons when there are items in the cart', () => {
    renderCartPage([
      { productId: 1, name: 'Widget A', price: 50, quantity: 1 },
    ]);
    expect(screen.getByText('Proceed To Checkout')).toBeEnabled();
    expect(screen.getByText('Clear Cart')).toBeEnabled();
  });
});
