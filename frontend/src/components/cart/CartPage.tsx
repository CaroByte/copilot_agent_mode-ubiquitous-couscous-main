import { useCart } from '../../context/CartContext';

const DISCOUNT_RATE = 0.05;
const SHIPPING_COST = 10;

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();

  const discount = subtotal * DISCOUNT_RATE;
  const grandTotal = subtotal - discount + SHIPPING_COST;
  const hasItems = items.length > 0;

  return (
    <div className="cart-page p-6">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {!hasItems && <p>Your cart is empty</p>}

      {hasItems && (
        <table className="w-full mb-6" role="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit Price</th>
              <th>Qty</th>
              <th>Line Total</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const unitPrice = item.discount
                ? item.price * (1 - item.discount)
                : item.price;
              const lineTotal = unitPrice * item.quantity;
              return (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>${unitPrice.toFixed(2)}</td>
                  <td>
                    <button
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </td>
                  <td>${lineTotal.toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeItem(item.productId)}>Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="order-summary" aria-label="Order Summary">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <div data-testid="subtotal">Subtotal: ${subtotal.toFixed(2)}</div>
        <div data-testid="discount">Discount (5%): −${discount.toFixed(2)}</div>
        <div data-testid="shipping">Shipping: ${SHIPPING_COST.toFixed(2)}</div>
        <div data-testid="grand-total" className="font-bold">
          Grand Total: ${grandTotal.toFixed(2)}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button disabled={!hasItems} onClick={clearCart}>
          Clear Cart
        </button>
        <button disabled={!hasItems}>Proceed To Checkout</button>
      </div>
    </div>
  );
}
