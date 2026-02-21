import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const roundMoney = (value) => Math.round(value * 100) / 100;

// In-memory store so the whole site works without external setup.
let products = [
  {
    id: 1,
    name: 'AeroPulse Wireless Headphones',
    description: 'Noise-canceling over-ear headphones with 40-hour battery life.',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80',
    category: 'Audio',
    rating: 4.7,
    reviews: 186,
    stock: 23,
    featured: true,
    createdAt: '2026-01-03T09:30:00.000Z'
  },
  {
    id: 2,
    name: 'NovaFit Smart Watch',
    description: 'Track sleep, heart rate, workouts, and notifications all day.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80',
    category: 'Wearables',
    rating: 4.8,
    reviews: 241,
    stock: 15,
    featured: true,
    createdAt: '2026-01-08T12:05:00.000Z'
  },
  {
    id: 3,
    name: 'Vector Mechanical Keyboard',
    description: 'Tactile switches, hot-swappable keys, and compact layout.',
    price: 129.5,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80',
    category: 'Accessories',
    rating: 4.6,
    reviews: 172,
    stock: 31,
    featured: false,
    createdAt: '2026-01-11T17:12:00.000Z'
  },
  {
    id: 4,
    name: 'Flux 4K Webcam',
    description: 'Ultra-wide field of view and low-light auto correction.',
    price: 154.0,
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1000&q=80',
    category: 'Video',
    rating: 4.4,
    reviews: 98,
    stock: 19,
    featured: true,
    createdAt: '2026-01-14T08:40:00.000Z'
  },
  {
    id: 5,
    name: 'Orbit USB-C Hub',
    description: '7-in-1 aluminum hub with HDMI, SD card, and fast charging.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1000&q=80',
    category: 'Accessories',
    rating: 4.3,
    reviews: 212,
    stock: 42,
    featured: false,
    createdAt: '2026-01-17T14:55:00.000Z'
  },
  {
    id: 6,
    name: 'PixelBeam Projector',
    description: 'Portable mini projector with native 1080p resolution.',
    price: 319.0,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80',
    category: 'Video',
    rating: 4.5,
    reviews: 76,
    stock: 9,
    featured: false,
    createdAt: '2026-01-22T11:20:00.000Z'
  },
  {
    id: 7,
    name: 'EchoPods Pro',
    description: 'True wireless earbuds with adaptive EQ and ANC.',
    price: 139.99,
    image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&w=1000&q=80',
    category: 'Audio',
    rating: 4.7,
    reviews: 267,
    stock: 28,
    featured: true,
    createdAt: '2026-01-25T16:10:00.000Z'
  },
  {
    id: 8,
    name: 'Glide Ergonomic Mouse',
    description: 'Vertical ergonomic design with programmable side buttons.',
    price: 69.0,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80',
    category: 'Accessories',
    rating: 4.2,
    reviews: 124,
    stock: 35,
    featured: false,
    createdAt: '2026-01-27T10:47:00.000Z'
  },
  {
    id: 9,
    name: 'ZenDesk Lamp',
    description: 'Dimmable desk light with wireless charging base.',
    price: 84.75,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
    category: 'Home Office',
    rating: 4.6,
    reviews: 88,
    stock: 26,
    featured: false,
    createdAt: '2026-02-01T13:34:00.000Z'
  },
  {
    id: 10,
    name: 'Studio Mic X1',
    description: 'USB condenser microphone for podcasts and streaming.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
    category: 'Audio',
    rating: 4.8,
    reviews: 151,
    stock: 18,
    featured: true,
    createdAt: '2026-02-04T07:15:00.000Z'
  }
];

const featuredCollections = [
  {
    id: 1,
    title: 'Creator Starter Kits',
    subtitle: 'Audio + video bundles for students and creators',
    image: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 2,
    title: 'Back to Campus',
    subtitle: 'Desk setups built for focus and productivity',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 3,
    title: 'New This Week',
    subtitle: 'Fresh arrivals from top-performing categories',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1400&q=80'
  }
];

let subscribers = [
  { id: 1, email: 'alex@campusmail.com', createdAt: '2026-02-08T09:25:00.000Z' },
  { id: 2, email: 'nina@school.edu', createdAt: '2026-02-10T18:45:00.000Z' },
  { id: 3, email: 'jamie@learnhub.net', createdAt: '2026-02-13T13:10:00.000Z' }
];

let messages = [
  {
    id: 1,
    name: 'Mia Johnson',
    email: 'mia@example.com',
    phone: '+1 (555) 821-9074',
    subject: 'Bulk order for class',
    message: 'Can you share pricing for 18 headsets for our media lab?',
    status: 'new',
    createdAt: '2026-02-15T11:20:00.000Z'
  },
  {
    id: 2,
    name: 'Ethan Patel',
    email: 'ethan@example.com',
    phone: '',
    subject: 'Shipping time',
    message: 'How long does delivery take to New Jersey?',
    status: 'resolved',
    createdAt: '2026-02-16T08:12:00.000Z'
  }
];

let orders = [
  {
    id: 1,
    items: [{ productId: 7, name: 'EchoPods Pro', quantity: 2, price: 139.99 }],
    total: 279.98,
    customer: 'Olivia M.',
    status: 'shipped',
    createdAt: '2026-02-12T15:17:00.000Z'
  },
  {
    id: 2,
    items: [{ productId: 4, name: 'Flux 4K Webcam', quantity: 1, price: 154.0 }],
    total: 154.0,
    customer: 'Noah K.',
    status: 'processing',
    createdAt: '2026-02-18T10:40:00.000Z'
  }
];

let nextProductId = products.length + 1;
let nextMessageId = messages.length + 1;
let nextSubscriberId = subscribers.length + 1;
let nextOrderId = orders.length + 1;

const computeStats = () => {
  const revenueValue = roundMoney(orders.reduce((sum, order) => sum + order.total, 0));
  const uniqueCustomers = new Set(orders.map((order) => order.customer)).size;

  return {
    totalProducts: products.length,
    totalSubscribers: subscribers.length,
    totalMessages: messages.length,
    totalOrders: orders.length,
    revenueValue,
    revenue: `$${revenueValue.toFixed(2)}`,
    activeCustomers: uniqueCustomers
  };
};

const sortProducts = (list, sort) => {
  switch (sort) {
    case 'price-asc':
      return [...list].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...list].sort((a, b) => b.price - a.price);
    case 'rating':
      return [...list].sort((a, b) => b.rating - a.rating);
    case 'newest':
      return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    default:
      return list;
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/products', (req, res) => {
  const { q = '', category = 'All', sort = 'newest' } = req.query;
  const query = q.toString().trim().toLowerCase();

  const filtered = products.filter((product) => {
    const categoryMatch = category === 'All' || category === '' || product.category === category;
    const textMatch =
      query === '' ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    return categoryMatch && textMatch;
  });

  res.json(sortProducts(filtered, sort.toString()));
});

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

app.get('/api/categories', (req, res) => {
  const categories = ['All', ...new Set(products.map((product) => product.category))];
  res.json(categories);
});

app.get('/api/featured', (req, res) => {
  res.json(featuredCollections);
});

app.post('/api/newsletter', (req, res) => {
  const email = (req.body?.email || '').trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  const exists = subscribers.some((subscriber) => subscriber.email === email);
  if (exists) {
    return res.status(200).json({ success: true, message: 'You are already subscribed', alreadySubscribed: true });
  }

  subscribers.unshift({
    id: nextSubscriberId++,
    email,
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({ success: true, message: 'Subscribed successfully', email });
});

app.post('/api/contact', (req, res) => {
  const name = (req.body?.name || '').trim();
  const email = (req.body?.email || '').trim().toLowerCase();
  const phone = (req.body?.phone || '').trim();
  const subject = (req.body?.subject || '').trim();
  const message = (req.body?.message || '').trim();

  if (!name || !email || !message || !subject) {
    return res.status(400).json({ error: 'Name, email, subject and message are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  messages.unshift({
    id: nextMessageId++,
    name,
    email,
    phone,
    subject,
    message,
    status: 'new',
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({ success: true, message: 'Message sent successfully' });
});

app.post('/api/checkout', (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  if (items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const normalizedItems = items
    .map((item) => {
      const product = products.find((productItem) => productItem.id === Number(item.id));
      const quantity = Math.max(1, Number(item.quantity) || 1);
      if (!product) return null;

      return {
        productId: product.id,
        name: product.name,
        quantity,
        price: product.price
      };
    })
    .filter(Boolean);

  if (normalizedItems.length === 0) {
    return res.status(400).json({ error: 'No valid items found in cart' });
  }

  const total = roundMoney(normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0));

  const order = {
    id: nextOrderId++,
    items: normalizedItems,
    total,
    customer: 'Guest Customer',
    status: 'processing',
    createdAt: new Date().toISOString()
  };

  orders.unshift(order);

  return res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    orderId: order.id,
    total
  });
});

app.get('/api/stats', (req, res) => {
  res.json(computeStats());
});

app.get('/api/admin/stats', (req, res) => {
  const stats = computeStats();

  const latestOrders = orders
    .slice(0, 5)
    .map((order) => ({ id: order.id, total: order.total, status: order.status, createdAt: order.createdAt }));

  res.json({
    ...stats,
    latestOrders
  });
});

app.get('/api/admin/products', (req, res) => {
  res.json(products);
});

app.post('/api/admin/products', (req, res) => {
  const payload = req.body || {};
  const name = (payload.name || '').trim();
  const description = (payload.description || '').trim();
  const image = (payload.image || '').trim();
  const category = (payload.category || '').trim();
  const price = Number(payload.price);
  const stock = Number(payload.stock);
  const rating = Number(payload.rating || 4.5);
  const reviews = Number(payload.reviews || 0);

  if (!name || !description || !image || !category || Number.isNaN(price)) {
    return res.status(400).json({ error: 'Name, description, image, category and valid price are required' });
  }

  const newProduct = {
    id: nextProductId++,
    name,
    description,
    image,
    category,
    price: roundMoney(price),
    rating: Number.isNaN(rating) ? 4.5 : rating,
    reviews: Number.isNaN(reviews) ? 0 : reviews,
    stock: Number.isNaN(stock) ? 0 : stock,
    featured: Boolean(payload.featured),
    createdAt: new Date().toISOString()
  };

  products.unshift(newProduct);
  return res.status(201).json(newProduct);
});

app.put('/api/admin/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = products[index];
  const payload = req.body || {};
  const nextPrice = payload.price !== undefined ? Number(payload.price) : existing.price;
  const nextStock = payload.stock !== undefined ? Number(payload.stock) : existing.stock;
  const nextRating = payload.rating !== undefined ? Number(payload.rating) : existing.rating;
  const nextReviews = payload.reviews !== undefined ? Number(payload.reviews) : existing.reviews;

  const updated = {
    ...existing,
    ...payload,
    id,
    price: Number.isNaN(nextPrice) ? existing.price : roundMoney(nextPrice),
    stock: Number.isNaN(nextStock) ? existing.stock : nextStock,
    rating: Number.isNaN(nextRating) ? existing.rating : nextRating,
    reviews: Number.isNaN(nextReviews) ? existing.reviews : nextReviews
  };

  products[index] = updated;
  return res.json(updated);
});

app.delete('/api/admin/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = products.some((product) => product.id === id);

  if (!exists) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products = products.filter((product) => product.id !== id);
  return res.status(204).send();
});

app.get('/api/admin/messages', (req, res) => {
  res.json(messages);
});

app.patch('/api/admin/messages/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const status = (req.body?.status || '').trim().toLowerCase();
  const validStatuses = ['new', 'in-progress', 'resolved'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const index = messages.findIndex((message) => message.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }

  messages[index] = { ...messages[index], status };
  return res.json(messages[index]);
});

app.get('/api/admin/subscribers', (req, res) => {
  res.json(subscribers);
});

app.get('/api/admin/orders', (req, res) => {
  res.json(orders);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
