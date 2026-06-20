import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CartProvider, useCart } from '../../context/CartContext';
import CartPage from './CartPage';

const sampleItems = [
  { productId: 1, name: 'SmartFeeder One', price: 129.99, imgName: 'feeder.png' },
  { productId: 2, name: 'AutoClean Litter Dome', price: 199.99, imgName: 'litter-box.png', discount: 0.25 },
];

// Helper that pre-populates the cart before rendering CartPage
const SetupCart: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addItem } = useCart();
  React.useEffect(() => {
    addItem(sampleItems[0], 2);
    addItem(sampleItems[1], 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <>{children}</>;
};

const renderWithCart = (preload = true) => {
  if (preload) {
    return render(
      <CartProvider>
        <SetupCart>
          <CartPage />
        </SetupCart>
      </CartProvider>
    );
  }
  return render(
    <CartProvider>
      <CartPage />
    </CartProvider>
  );
};

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show empty cart message when cart is empty', () => {
    renderWithCart(false);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('should disable Proceed To Checkout button when cart is empty', () => {
    renderWithCart(false);
    expect(screen.getByText('Proceed To Checkout')).toBeDisabled();
  });

  it('should disable Clear Cart button when cart is empty', () => {
    renderWithCart(false);
    expect(screen.getByText('Clear Cart')).toBeDisabled();
  });

  it('should render items with name, unit price, and line total', () => {
    renderWithCart();
    expect(screen.getByText('SmartFeeder One')).toBeInTheDocument();
    expect(screen.getByText('AutoClean Litter Dome')).toBeInTheDocument();

    // SmartFeeder: $129.99 each
    expect(screen.getByTestId('unit-price-1')).toHaveTextContent('$129.99');
    // Line total: 129.99 * 2 = 259.98
    expect(screen.getByTestId('line-total-1')).toHaveTextContent('$259.98');

    // Litter Dome with 25% discount: 199.99 * 0.75 = 149.99
    expect(screen.getByTestId('unit-price-2')).toHaveTextContent('$149.99');
    // Line total: 149.99 * 1
    expect(screen.getByTestId('line-total-2')).toHaveTextContent('$149.99');
  });

  it('should show order summary with subtotal, discount, shipping, and grand total', () => {
    renderWithCart();
    // subtotal = 259.98 + 149.9925 ≈ 409.97
    const subtotal = 129.99 * 2 + 199.99 * 0.75;
    const discount = subtotal * 0.05;
    const grandTotal = subtotal - discount + 10;

    expect(screen.getByTestId('subtotal')).toHaveTextContent(`Subtotal: $${subtotal.toFixed(2)}`);
    expect(screen.getByTestId('discount')).toHaveTextContent(`Discount (5%): -$${discount.toFixed(2)}`);
    expect(screen.getByTestId('shipping')).toHaveTextContent('Shipping: $10.00');
    expect(screen.getByTestId('grand-total')).toHaveTextContent(`Grand Total: $${grandTotal.toFixed(2)}`);
  });

  it('should increment quantity with + button and recalculate total', async () => {
    const user = userEvent.setup();
    renderWithCart();

    const plusButton = screen.getByLabelText('Increase quantity of SmartFeeder One');
    await user.click(plusButton);

    expect(screen.getByTestId('qty-1')).toHaveTextContent('3');
    // New line total: 129.99 * 3 = 389.97
    expect(screen.getByTestId('line-total-1')).toHaveTextContent('$389.97');
  });

  it('should decrement quantity with − button', async () => {
    const user = userEvent.setup();
    renderWithCart();

    const minusButton = screen.getByLabelText('Decrease quantity of SmartFeeder One');
    await user.click(minusButton);

    expect(screen.getByTestId('qty-1')).toHaveTextContent('1');
  });

  it('should remove item when quantity reaches 0 via − button', async () => {
    const user = userEvent.setup();
    renderWithCart();

    // Litter Dome has quantity 1 — click minus once to reach 0
    const minusButton = screen.getByLabelText('Decrease quantity of AutoClean Litter Dome');
    await user.click(minusButton);

    expect(screen.queryByText('AutoClean Litter Dome')).not.toBeInTheDocument();
  });

  it('should clear cart when Clear Cart is clicked', async () => {
    const user = userEvent.setup();
    renderWithCart();

    const clearButton = screen.getByText('Clear Cart');
    await user.click(clearButton);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });
});
