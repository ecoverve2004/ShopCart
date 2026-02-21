// Fallback data used when live API is unavailable

export const fallbackProducts = [
  {
    id: 101,
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
    id: 102,
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
    id: 103,
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
    id: 104,
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
    id: 105,
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
    id: 106,
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
    id: 107,
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
    id: 108,
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
    id: 109,
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
    id: 110,
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
]

export const fallbackFeatured = [
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
]

export const fallbackStats = {
  totalProducts: 10,
  totalSubscribers: 3,
  totalMessages: 2,
  totalOrders: 2,
  revenueValue: 433.98,
  revenue: '$433.98',
  activeCustomers: 2
}

export const fallbackOrders = [
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
]

export const ERROR_MESSAGE = 'Live data is unavailable right now. Showing preview content.'
