import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Function to format numbers to INR currency
  const formatToINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleQuantityChange = (change) => {
    if (change === 'increment') {
      setQuantity((prev) => prev + 1);
    } else if (change === 'decrement' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{formatToINR(product.price)}</p>

      <div className="quantity-control">
        <button onClick={() => handleQuantityChange('decrement')}>-</button>
        <span>{quantity}</span>
        <button onClick={() => handleQuantityChange('increment')}>+</button>
      </div>

      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
