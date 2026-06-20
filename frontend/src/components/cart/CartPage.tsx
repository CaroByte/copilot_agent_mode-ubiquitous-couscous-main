import React from 'react';
import { useCart } from '../../context/CartContext';

const SHIPPING_COST = 10;
const ORDER_DISCOUNT_RATE = 0.05;

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();

  const orderDiscount = subtotal * ORDER_DISCOUNT_RATE;
  const grandTotal = subtotal - orderDiscount + SHIPPING_COST;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {items.map(item => {
              const effectivePrice = item.discount
                ? item.price * (1 - item.discount)
                : item.price;
              const lineTotal = effectivePrice * item.quantity;

              return (
                <div key={item.productId} data-testid={`cart-item-${item.productId}`} className="flex items-center justify-between border p-4 rounded">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p data-testid={`unit-price-${item.productId}`}>${effectivePrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span data-testid={`qty-${item.productId}`}>{item.quantity}</span>
                    <button
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p data-testid={`line-total-${item.productId}`}>${lineTotal.toFixed(2)}</p>
                  <button aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.productId)}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 border-t pt-6 space-y-2">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <p data-testid="subtotal">Subtotal: ${subtotal.toFixed(2)}</p>
          <p data-testid="discount">Discount (5%): -${orderDiscount.toFixed(2)}</p>
          <p data-testid="shipping">Shipping: ${SHIPPING_COST.toFixed(2)}</p>
          <p data-testid="grand-total" className="text-lg font-bold">
            Grand Total: ${grandTotal.toFixed(2)}
          </p>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            disabled={items.length === 0}
            className="px-6 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Proceed To Checkout
          </button>
          <button
            disabled={items.length === 0}
            onClick={clearCart}
            className="px-6 py-2 border rounded disabled:opacity-50"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
