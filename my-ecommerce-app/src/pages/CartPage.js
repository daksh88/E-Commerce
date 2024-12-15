import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart } = useCart();

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Function to format numbers to INR currency
  const formatToINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p className="cart-empty">Your cart is empty!</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <p>{item.name}</p>
                  <p className="cart-item-price">Price: {formatToINR(item.price)}</p>
                  <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                  <p className="cart-item-total">Total: {formatToINR(item.price * item.quantity)}</p>
                </div>
                <div className="cart-actions">
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>

          {/* Checkout Section */}
          <div className="checkout-section">
            <p className="total-price">Total Bill: {formatToINR(totalPrice)}</p>
            <button className="checkout-button">Place Order</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
