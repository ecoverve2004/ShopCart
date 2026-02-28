// WEB WORKER - worker.js
// Handles heavy computations without blocking UI

self.onmessage = function(e) {
    const { cmd, data } = e.data;
    
    switch(cmd) {
        case 'process':
            const result = processData(data);
            self.postMessage({ result });
            break;
        case 'sort':
            const sorted = sortProducts(data);
            self.postMessage({ sorted });
            break;
        case 'filter':
            const filtered = filterProducts(data);
            self.postMessage({ filtered });
            break;
        case 'search':
            const searchResults = searchProducts(data);
            self.postMessage({ searchResults });
            break;
    }
};

// Heavy computation functions
function processData(data) {
    // Process large datasets
    return data.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
    }));
}

function sortProducts(products) {
    return products.sort((a, b) => a.price - b.price);
}

function filterProducts({ products, category, priceRange }) {
    return products.filter(p => 
        p.category === category && 
        p.price >= priceRange.min && 
        p.price <= priceRange.max
    );
}

function searchProducts({ products, query }) {
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
}
