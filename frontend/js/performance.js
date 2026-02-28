// PERFORMANCE OPTIMIZATION FOR 1 CRORE USERS
// File: js/performance.js

// 1. SERVICE WORKER - Offline Support & Caching
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration failed'));
}

// 2. LAZY LOADING - Images load only when visible
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));

// 3. REQUEST DEBOUNCING - Reduce API calls
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// 4. CACHING STRATEGY
const cache = {
    set: (key, value, ttl = 3600000) => {
        localStorage.setItem(key, JSON.stringify({
            value,
            expires: Date.now() + ttl
        }));
    },
    get: (key) => {
        const item = JSON.parse(localStorage.getItem(key));
        if (!item) return null;
        if (Date.now() > item.expires) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    }
};

// 5. API OPTIMIZATION
const apiCache = new Map();
async function fetchWithCache(url, options = {}) {
    const cacheKey = url + JSON.stringify(options);
    
    if (apiCache.has(cacheKey)) {
        return apiCache.get(cacheKey);
    }
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        apiCache.set(cacheKey, data);
        
        // Clear cache after 5 minutes
        setTimeout(() => apiCache.delete(cacheKey), 300000);
        
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

// 6. PAGINATION - Load products in chunks
let currentPage = 1;
const itemsPerPage = 20;

async function loadProductsPage(page) {
    const response = await fetchWithCache(
        `http://localhost:3000/api/products?page=${page}&limit=${itemsPerPage}`
    );
    return response;
}

// 7. COMPRESSION - Minify data
function compressData(data) {
    return JSON.stringify(data).replace(/\s+/g, '');
}

// 8. CONNECTION OPTIMIZATION
if ('connection' in navigator) {
    const connection = navigator.connection;
    const effectiveType = connection.effectiveType;
    
    if (effectiveType === '4g') {
        // Load high quality images
    } else if (effectiveType === '3g') {
        // Load medium quality images
    } else {
        // Load low quality images
    }
}

// 9. MEMORY OPTIMIZATION
class MemoryPool {
    constructor(size = 100) {
        this.pool = [];
        this.size = size;
    }
    
    acquire() {
        return this.pool.pop() || {};
    }
    
    release(obj) {
        if (this.pool.length < this.size) {
            this.pool.push(obj);
        }
    }
}

// 10. BATCH OPERATIONS
async function batchFetch(urls) {
    return Promise.all(urls.map(url => fetchWithCache(url)));
}

// 11. VIRTUAL SCROLLING - Only render visible items
class VirtualScroller {
    constructor(container, items, itemHeight) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.visibleItems = [];
        this.init();
    }
    
    init() {
        this.container.addEventListener('scroll', () => this.render());
        this.render();
    }
    
    render() {
        const scrollTop = this.container.scrollTop;
        const startIndex = Math.floor(scrollTop / this.itemHeight);
        const endIndex = startIndex + Math.ceil(this.container.clientHeight / this.itemHeight);
        
        this.visibleItems = this.items.slice(startIndex, endIndex);
        this.updateDOM();
    }
    
    updateDOM() {
        // Update only visible items
    }
}

// 12. WORKER THREADS - Heavy computation
if (typeof Worker !== 'undefined') {
    const worker = new Worker('worker.js');
    
    worker.postMessage({
        cmd: 'process',
        data: largeDataset
    });
    
    worker.onmessage = (e) => {
        console.log('Worker result:', e.data);
    };
}

// 13. RESOURCE HINTS
function addResourceHints() {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'http://localhost:3000';
    document.head.appendChild(link);
}

// 14. MONITORING
class PerformanceMonitor {
    static measure(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name}: ${end - start}ms`);
        return result;
    }
}

// 15. EXPORT
window.Performance = {
    cache,
    fetchWithCache,
    debounce,
    VirtualScroller,
    PerformanceMonitor
};
