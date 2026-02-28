const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'shopeasy-secret-key-2024';

// Data file paths
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// Helper functions for data management
const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
};

const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
    }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from frontend directory - more specific routes first
app.use('/css', express.static(path.join(__dirname, '..', 'frontend', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'frontend', 'js')));
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend', 'assets')));

// Serve admin static files
app.use('/admin/css', express.static(path.join(__dirname, '..', 'frontend', 'css')));
app.use('/admin/js', express.static(path.join(__dirname, '..', 'frontend', 'js')));

// API Routes
app.use('/api', require('cors')());

// Products
app.get('/api/products', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    res.json(products);
});

app.get('/api/products/category/:category', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const filtered = products.filter(p => p.category === req.params.category);
    res.json(filtered);
});

app.get('/api/products/search', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const query = req.query.q?.toLowerCase();
    if (!query) return res.json(products);
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
    );
    res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const product = products.find(p => p.id == req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.post('/api/products', authenticateAdmin, (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        ...req.body,
        rating: req.body.rating || 0,
        reviews: req.body.reviews || 0,
        inStock: req.body.inStock !== undefined ? req.body.inStock : true
    };
    products.push(newProduct);
    writeData(PRODUCTS_FILE, products);
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', authenticateAdmin, (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const productIndex = products.findIndex(p => p.id == req.params.id);
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...req.body };
        writeData(PRODUCTS_FILE, products);
        res.json(products[productIndex]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.delete('/api/products/:id', authenticateAdmin, (req, res) => {
    let products = readData(PRODUCTS_FILE);
    const productIndex = products.findIndex(p => p.id == req.params.id);
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        writeData(PRODUCTS_FILE, products);
        res.json({ message: 'Product deleted' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Users - Registration
app.post('/api/auth/register', (req, res) => {
    const users = readData(USERS_FILE);
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    const newUser = {
        id: uuidv4(),
        name,
        email,
        password,
        role: 'user',
        createdAt: new Date()
    };
    users.push(newUser);
    writeData(USERS_FILE, users);
    
    // Generate JWT token
    const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name, role: 'user' },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
        message: 'User registered successfully',
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: 'user' }
    });
});

// Users - Login
app.post('/api/auth/login', (req, res) => {
    const users = readData(USERS_FILE);
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role || 'user' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({ 
            message: 'Login successful', 
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role || 'user' }
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// User Profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
    const users = readData(USERS_FILE);
    const user = users.find(u => u.id === req.user.id);
    
    if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.put('/api/user/profile', authenticateToken, (req, res) => {
    const users = readData(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex !== -1) {
        const { name, email, phone, address, country } = req.body;
        users[userIndex] = { 
            ...users[userIndex], 
            name: name || users[userIndex].name,
            email: email || users[userIndex].email,
            phone: phone || users[userIndex].phone,
            address: address || users[userIndex].address,
            country: country || users[userIndex].country
        };
        writeData(USERS_FILE, users);
        
        const { password, ...userWithoutPassword } = users[userIndex];
        res.json(userWithoutPassword);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.put('/api/user/password', authenticateToken, (req, res) => {
    const users = readData(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex !== -1) {
        const { currentPassword, newPassword } = req.body;
        
        if (users[userIndex].password !== currentPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        users[userIndex].password = newPassword;
        writeData(USERS_FILE, users);
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// User Orders
app.get('/api/user/orders', authenticateToken, (req, res) => {
    const orders = readData(ORDERS_FILE);
    const userOrders = orders.filter(o => o.userId === req.user.id);
    res.json(userOrders);
});

// Orders - Checkout
app.post('/api/orders', authenticateToken, (req, res) => {
    const orders = readData(ORDERS_FILE);
    const { items, shipping, payment, total } = req.body;
    
    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }
    
    const newOrder = {
        id: uuidv4(),
        userId: req.user.id,
        userName: req.user.name,
        userEmail: req.user.email,
        items,
        shipping,
        payment,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    orders.push(newOrder);
    writeData(ORDERS_FILE, orders);
    
    res.status(201).json({ 
        message: 'Order placed successfully',
        order: newOrder
    });
});

// Guest Checkout
app.post('/api/orders/guest', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const { items, shipping, payment, total, email } = req.body;
    
    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }
    
    const newOrder = {
        id: uuidv4(),
        userId: 'guest',
        userName: shipping.firstName + ' ' + shipping.lastName,
        userEmail: email,
        items,
        shipping,
        payment,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    orders.push(newOrder);
    writeData(ORDERS_FILE, orders);
    
    res.status(201).json({ 
        message: 'Order placed successfully',
        order: newOrder
    });
});

app.get('/api/orders', authenticateToken, (req, res) => {
    const orders = readData(ORDERS_FILE);
    
    // If admin, return all orders
    if (req.user.role === 'admin') {
        return res.json(orders);
    }
    
    // If user, return only their orders
    const userOrders = orders.filter(o => o.userId === req.user.id);
    res.json(userOrders);
});

app.get('/api/orders/:id', authenticateToken, (req, res) => {
    const orders = readData(ORDERS_FILE);
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns the order or is admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(order);
});

app.put('/api/orders/:id', authenticateAdmin, (req, res) => {
    const orders = readData(ORDERS_FILE);
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex !== -1) {
        orders[orderIndex] = { 
            ...orders[orderIndex], 
            ...req.body,
            updatedAt: new Date()
        };
        writeData(ORDERS_FILE, orders);
        res.json(orders[orderIndex]);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

// Admin routes
app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    
    if (email === 'admin@shopeasy.com' && password === 'admin123') {
        const token = jwt.sign(
            { id: 'admin', email, name: 'Admin', role: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            message: 'Admin login successful',
            token,
            user: { id: 'admin', email, name: 'Admin', role: 'admin' }
        });
    } else {
        res.status(401).json({ message: 'Invalid admin credentials' });
    }
});

app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const users = readData(USERS_FILE);
    const orders = readData(ORDERS_FILE);
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    
    const recentOrders = orders.slice(-10).reverse();
    
    // Calculate category distribution
    const categoryStats = {};
    products.forEach(p => {
        categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
    });
    
    // Calculate top selling products
    const productSales = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
        });
    });
    
    const topProducts = Object.entries(productSales)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    
    const stats = {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue,
        pendingOrders,
        completedOrders,
        categoryStats,
        topProducts,
        recentOrders
    };
    res.json(stats);
});

// Admin - Get all users
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
    const users = readData(USERS_FILE);
    const usersWithoutPassword = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPassword);
});

// Admin - Delete user
app.delete('/api/admin/users/:id', authenticateAdmin, (req, res) => {
    let users = readData(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        writeData(USERS_FILE, users);
        res.json({ message: 'User deleted successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Admin Authentication Middleware
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        req.user = user;
        next();
    });
};

// Serve frontend pages - specific routes first
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/checkout.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'checkout.html'));
});

app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'profile.html'));
});

app.get('/order-confirmation.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'order-confirmation.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'about.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'contact.html'));
});

// Admin routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'admin-login.html'));
});

app.get('/admin/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'admin-dashboard.html'));
});

// Default route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`ShopEasy E-Commerce Server running on http://localhost:${PORT}`);
    console.log(`Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`API Endpoint: http://localhost:${PORT}/api`);
});
