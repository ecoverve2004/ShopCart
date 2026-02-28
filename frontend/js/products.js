// Enhanced products functionality with proper click handling and validation

// Global products array - will be loaded from API
let products = [];

// Load products from API with fallback to local data
async function loadProductsFromAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (response.ok) {
            products = await response.json();
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        console.warn('API not available, using fallback data');
        // Fallback to sample data
        products = [
            {
                id: 1,
                name: "Wireless Bluetooth Headphones",
                price: 79.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                rating: 4.5,
                description: "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
                inStock: true,
                reviews: 234,
                brand: "SoundMax"
            },
            {
                id: 2,
                name: "Smart Watch Pro",
                price: 199.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
                rating: 4.8,
                description: "Advanced fitness tracking, heart rate monitor, and smartphone integration.",
                inStock: true,
                reviews: 567,
                brand: "TechWear"
            }
        ];
    }
    displayProducts();
}

// Product display functionality with enhanced click handling
let filteredProducts = [...products];
let currentCategory = 'all';

// Enhanced product display
function displayProducts(productsToShow = filteredProducts) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';

    if (productsToShow.length === 0) {
        productGrid.innerHTML = '<p class="no-products">No products found</p>';
        return;
    }

    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Enhanced product card creation with proper accessibility
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `${product.name} - $${product.price}`);
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
        <div class="product-info">
            ${product.brand ? `<span class="product-brand">${product.brand}</span>` : ''}
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <div class="product-rating" aria-label="Rating: ${product.rating} out of 5 stars">
                ${generateStars(product.rating)}
                <span>(${product.reviews})</span>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary add-to-cart-btn" 
                        data-product-id="${product.id}" 
                        aria-label="Add ${product.name} to cart">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn btn-secondary add-to-wishlist-btn" 
                        data-product-id="${product.id}" 
                        aria-label="Add ${product.name} to wishlist">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    // Enhanced click handling with accessibility
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn')) {
            showProductDetail(product);
        }
    });
    
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showProductDetail(product);
        }
    });
    
    // Enhanced click handling for buttons
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    const addToWishlistBtn = card.querySelector('.add-to-wishlist-btn');
    
    addToCartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cart.addToCart(product.id);
    });
    
    addToWishlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        wishlist.addToWishlist(product.id);
    });
    
    return card;
}

// Enhanced star generation with accessibility
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star" aria-hidden="true"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt" aria-hidden="true"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star" aria-hidden="true"></i>';
    }
    
    return stars;
}

// Enhanced product detail with accessibility
function showProductDetail(product) {
    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('product-detail-content');
    
    if (!modal || !content) return;
    
    const features = product.features ? product.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('') : '';
    
    content.innerHTML = `
        <div class="product-detail" role="dialog" aria-labelledby="product-title">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; max-width: 400px; border-radius: 10px; object-fit: cover;">
            <div class="product-detail-info">
                ${product.brand ? `<span class="product-brand">${product.brand}</span>` : ''}
                <h2 id="product-title">${product.name}</h2>
                <p class="price" style="font-size: 1.5rem; font-weight: bold; color: #007bff; margin: 10px 0;">$${product.price.toFixed(2)}</p>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.reviews} reviews)</span>
                </div>
                <p class="description" style="margin: 15px 0; line-height: 1.6;">${product.description}</p>
                ${features ? `<div class="features" style="margin: 15px 0;"><h4 style="margin-bottom: 10px;">Features:</h4><ul style="list-style: none; padding: 0;">${features}</ul></div>` : ''}
                <div class="stock-status" style="margin: 15px 0;">
                    <span style="color: ${product.inStock ? '#28a745' : '#dc3545'}; font-weight: bold;">
                        <i class="fas ${product.inStock ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
                <div class="actions" style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-primary" onclick="cart.addToCart(${product.id})" 
                            style="flex: 1;"
                            aria-label="Add ${product.name} to cart">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn btn-secondary" onclick="wishlist.addToWishlist(${product.id})" 
                            aria-label="Add ${product.name} to wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    modal.setAttribute('aria-modal', 'true');
}

// Enhanced filter and sort functions with clickable categories
function filterByCategory(category) {
    currentCategory = category;
    if (category === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    // Update active category visual
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.category === category) {
            card.classList.add('active');
        }
    });
    
    displayProducts();
    
    // Scroll to products section
    scrollToProducts();
    
    // Show toast notification
    const categoryName = category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1);
    if (window.showToast) {
        window.showToast(`Showing ${categoryName}`, 'info');
    }
}

function sortProducts(sortBy) {
    let sortedProducts = [...filteredProducts];
    
    switch (sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            sortedProducts.reverse();
            break;
        default:
            break;
    }
    
    displayProducts(sortedProducts);
}

function filterByPrice(maxPrice) {
    const filtered = filteredProducts.filter(product => product.price <= maxPrice);
    displayProducts(filtered);
}

function searchProducts(query) {
    const searchResults = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(query.toLowerCase()))
    );
    displayProducts(searchResults);
}

// Enhanced scroll function
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Enhanced event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromAPI();
    
    // Category filter with click handling
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterByCategory(category);
        });
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const category = card.dataset.category;
                filterByCategory(category);
            }
        });
    });
    
    // Sort functionality
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
        sortProducts(e.target.value);
    });
    
    // Price filter
    document.getElementById('price-range')?.addEventListener('input', (e) => {
        document.getElementById('price-value').textContent = e.target.value;
        filterByPrice(parseInt(e.target.value));
    });
    
    // Search functionality
    document.getElementById('search-btn')?.addEventListener('click', () => {
        const query = document.getElementById('search-input')?.value;
        if (query?.trim()) {
            searchProducts(query);
        }
    });
    
    document.getElementById('search-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value;
            if (query?.trim()) {
                searchProducts(query);
            }
        }
    });
    
    // Shop now button
    document.getElementById('shop-now-btn')?.addEventListener('click', () => {
        scrollToProducts();
    });
    
    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal[style*="display: block"]');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
});

// Make functions globally available
window.filterByCategory = filterByCategory;
window.sortProducts = sortProducts;
window.filterByPrice = filterByPrice;
window.searchProducts = searchProducts;
window.scrollToProducts = scrollToProducts;
window.showProductDetail = showProductDetail;
