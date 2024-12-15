const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv'); // For loading .env variables
dotenv.config(); // Loads environment variables from .env file

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Add this to allow requests from frontend
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// Sample offers data
const offers = [
  { id: 1, title: '50% off on Electronics', description: 'Limited time offer', image: 'https://via.placeholder.com/150' },
  { id: 2, title: 'Buy 1 Get 1 Free', description: 'On selected items', image: 'https://via.placeholder.com/150' },
  { id: 3, title: 'Free Shipping on Orders above $50', description: 'Shop now and save', image: 'https://via.placeholder.com/150' },
];

// Get all offers
app.get('/offers', (req, res) => {
  res.json(offers);
});

// Sample products data
const products = [
  { id: 1, name: 'Product 1', price: 100, image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Product 2', price: 200, image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Product 3', price: 300, image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Product 4', price: 200, image: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Product 5', price: 450, image: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Product 6', price: 360, image: 'https://via.placeholder.com/150' },
];

// Get all products
app.get('/products', (req, res) => {
  res.json(products);
});

const bestDeals = [
  { id: 1, name: 'iPhone 15 Pro', price: 1299, image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Samsung Galaxy S23 Ultra', price: 1199, image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'OnePlus 11', price: 699, image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Google Pixel 8 Pro', price: 1200, image: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Realme Narzo 50A', price: 8000, image: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Motorola', price: 5000, image: 'https://via.placeholder.com/150' },
  { id: 7, name: 'Redmi Note 8 pro', price: 6500, image: 'https://via.placeholder.com/150' },
  { id: 8, name: 'Lava', price: 9000, image: 'https://via.placeholder.com/150' },
];

app.get('/best-deals', (req, res) => {
  res.json(bestDeals);
});


// Users array (temporary, use a database in production)
const users = []; 

// Signup route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Username already exists!' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully!' });
});


// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'User not found!' }); // Send JSON response
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials!' }); // Send JSON response
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
  res.json({ token }); // Send token in JSON format
});

// Validate Token Route
app.post('/validate-token', (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log('Auth Header:', authHeader); // Debugging: Check header value

  const token = authHeader && authHeader.split(' ')[1]; // Ensure "Bearer" prefix is handled
  if (!token) {
    return res.status(400).json({ message: 'Token is missing!' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, decoded) => {
    if (err) {
      console.error('JWT Error:', err); // Debugging: Log the error
      return res.status(401).json({ message: 'Invalid or expired token!' });
    }
    console.log('Decoded Token:', decoded); // Debugging: Check decoded data
    res.status(200).json({ message: 'Token is valid', user: decoded });
  });
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
