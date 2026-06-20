import { useCart } from '../../context/CartContext';

const DISCOUNT_RATE = 0.05;
const SHIPPING_COST = 10;

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const isEmpty = items.length === 0;
  const discount = subtotal * DISCOUNT_RATE;
  const grandTotal = subtotal - discount + SHIPPING_COST;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {isEmpty ? (
          <p>Your cart is empty</p>
        ) : (
          <table className="w-full mb-6">
            <thead>
              <tr>
                <th className="text-left">Product</th>
                <th className="text-right">Unit Price</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Total</th>
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
                  <tr key={item.productId} data-testid={`cart-row-${item.productId}`}>
                    <td>{item.name}</td>
                    <td className="text-right">${unitPrice.toFixed(2)}</td>
                    <td className="text-center">
                      <button
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </td>
                    <td className="text-right">${lineTotal.toFixed(2)}</td>
                    <td>
                      <button onClick={() => removeItem(item.productId)}>Remove</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="border-t pt-4 mb-6" data-testid="order-summary">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Discount (5%)</span><span>-${discount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>${SHIPPING_COST.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold mt-2"><span>Grand Total</span><span>${grandTotal.toFixed(2)}</span></div>
        </div>

        <div className="flex gap-4">
          <button disabled={isEmpty} onClick={() => alert('Checkout')}>
            Proceed To Checkout
          </button>
          <button disabled={isEmpty} onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
