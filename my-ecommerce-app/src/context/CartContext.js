import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    console.log("Adding to cart:", product.name, "Quantity:", product.quantity);
  
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
  
      if (existingProduct) {
        // Update the existing product's quantity
        const updatedCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity } // Update quantity
            : item
        );
        console.log("Updated product quantity in cart:", updatedCart);
        return updatedCart;
      } else {
        // Add the new product to the cart
        const newCart = [...prevCart, product];
        console.log("Adding new product to cart:", newCart);
        return newCart;
      }
    });
  };
  

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
  };

  useEffect(() => {
    console.log("Current Cart:", cart);
  }, [cart]);
  useEffect(() => {
    console.log("Cart Updated:", JSON.stringify(cart, null, 2));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
