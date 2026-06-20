import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider } from '../../context/CartContext';
import CartPage from './CartPage';

const product1 = {
  productId: 1,
  name: 'SmartFeeder One',
  price: 100,
  imgName: 'feeder.png',
};

const product2 = {
  productId: 2,
  name: 'AutoClean Dome',
  price: 200,
  imgName: 'dome.png',
  discount: 0.1,
};

function renderCartPage(items: { product: typeof product1; qty: number }[] = []) {
  if (items.length > 0) {
    const cartItems = items.map(({ product, qty }) => ({ ...product, quantity: qty }));
    localStorage.setItem('octocat-cart', JSON.stringify(cartItems));
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

  it('shows empty cart message when cart is empty', () => {
    renderCartPage();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('disables Proceed To Checkout and Clear Cart when empty', () => {
    renderCartPage();
    expect(screen.getByText('Proceed To Checkout')).toBeDisabled();
    expect(screen.getByText('Clear Cart')).toBeDisabled();
  });

  it('renders items with name, unit price, and line total', () => {
    renderCartPage([{ product: product1, qty: 2 }]);
    const row = screen.getByTestId('cart-row-1');
    expect(within(row).getByText('SmartFeeder One')).toBeInTheDocument();
    const cells = row.querySelectorAll('td');
    expect(cells[1].textContent).toBe('$100.00'); // unit price
    expect(cells[3].textContent).toBe('$200.00'); // line total
  });

  it('shows order summary with subtotal, discount, shipping, and grand total', () => {
    renderCartPage([{ product: product1, qty: 1 }]);
    const summary = screen.getByTestId('order-summary');
    expect(within(summary).getByText('Subtotal')).toBeInTheDocument();
    expect(within(summary).getByText('Discount (5%)')).toBeInTheDocument();
    expect(within(summary).getByText('Shipping')).toBeInTheDocument();
    expect(within(summary).getByText('Grand Total')).toBeInTheDocument();
  });

  it('increments quantity with + button', async () => {
    const user = userEvent.setup();
    renderCartPage([{ product: product1, qty: 1 }]);
    const plusBtn = screen.getByLabelText('Increase quantity of SmartFeeder One');
    await user.click(plusBtn);
    const row = screen.getByTestId('cart-row-1');
    const cells = row.querySelectorAll('td');
    expect(cells[3].textContent).toBe('$200.00'); // 2 * 100
  });

  it('decrements quantity with - button', async () => {
    const user = userEvent.setup();
    renderCartPage([{ product: product1, qty: 3 }]);
    const minusBtn = screen.getByLabelText('Decrease quantity of SmartFeeder One');
    await user.click(minusBtn);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('removes item with Remove button', async () => {
    const user = userEvent.setup();
    renderCartPage([{ product: product1, qty: 1 }]);
    await user.click(screen.getByText('Remove'));
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('clears cart with Clear Cart button', async () => {
    const user = userEvent.setup();
    renderCartPage([{ product: product1, qty: 1 }, { product: product2, qty: 2 }]);
    await user.click(screen.getByText('Clear Cart'));
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('enables buttons when there are items', () => {
    renderCartPage([{ product: product1, qty: 1 }]);
    expect(screen.getByText('Proceed To Checkout')).not.toBeDisabled();
    expect(screen.getByText('Clear Cart')).not.toBeDisabled();
  });
});
