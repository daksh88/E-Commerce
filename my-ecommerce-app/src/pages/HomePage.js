import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getProducts, getOffers } from '../services/productService';
import ProductCard from '../components/ProductCard';
import '../styles/HomePage.css';


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [cart, setCart] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bestDeals, setBestDeals] = useState([]); // State for Best Deals
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProducts();
        setProducts(productData);

        const offerData = await getOffers();
        setOffers(offerData);

        const response = await fetch('http://localhost:5000/best-deals'); // Fetching Best Deals
        const bestDealsData = await response.json();
        setBestDeals(bestDealsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % offers.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [offers]);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setIsPopupVisible(true);
  };

  const handleQuantityChange = (change) => {
    if (change === 'increment') {
      setQuantity((prev) => prev + 1);
    } else if (change === 'decrement' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCartWithQuantity = () => {
    const updatedCart = [...cart];
    const productIndex = updatedCart.findIndex((item) => item.id === selectedProduct.id);
    
    if (productIndex === -1) {
      updatedCart.push({ ...selectedProduct, quantity });
    } else {
      updatedCart[productIndex].quantity += quantity;
    }

    setCart(updatedCart);
    setIsPopupVisible(false);
    setQuantity(1);
  };

  return (
    <div>
      {/* Slideshow section for Offers */}
      <div className="slideshow-container">
        {offers.map((offer, index) => (
          <div
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            key={offer.id}
          >
            <img
              src={offer.image || 'https://via.placeholder.com/150'}
              alt={offer.title}
            />
            <div className="offer-details">
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Horizontal Product List Section */}
      <div className="product-list-slider">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>

      {/* Best Deals Section */}
      <div>
        <h2 style={{ textAlign: 'center', marginTop: '30px' }}>Best Deals on Mobiles</h2>
        <div className="product-list-slider">
          {bestDeals.map((deal) => (
            <ProductCard key={deal.id} product={deal} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>

      {/* Pop-up for quantity selection */}
      {isPopupVisible && selectedProduct && (
        <div className="popup">
          <div className="popup-content">
            <h2>{selectedProduct.name}</h2>
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange('decrement')}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange('increment')}>+</button>
            </div>
            <button onClick={handleAddToCartWithQuantity}>Add to Cart</button>
            <button onClick={() => setIsPopupVisible(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
