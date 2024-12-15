// Function to fetch products
export const getProducts = async () => {
  const response = await fetch('http://localhost:5000/products');
  const data = await response.json();
  return data;
};

// Function to fetch offers
export const getOffers = async () => {
  const response = await fetch('http://localhost:5000/offers');
  const data = await response.json();
  return data;
};
