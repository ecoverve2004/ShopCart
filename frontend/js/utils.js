// Centralized utility functions for click handling and validation

class ClickHandler {
    constructor() {
        this.isProcessing = new Set();
        this.loadingStates = new Map();
    }

    // Centralized click handler with validation and error handling
    async handleClick(elementId, callback, options = {}) {
        const {
            showLoading = true,
            preventDuplicate = true,
            loadingText = 'Processing...',
            successMessage = null,
            errorMessage = 'Something went wrong. Please try again.'
        } = options;

        const element = document.getElementById(elementId) || document.querySelector(`[onclick*="${elementId}"]`);
        if (!element) return;

        // Prevent duplicate clicks
        if (preventDuplicate && this.isProcessing.has(elementId)) {
            return;
        }

        try {
            this.isProcessing.add(elementId);
            
            if (showLoading) {
                this.showLoading(element, loadingText);
            }

            await callback();

            if (successMessage) {
                this.showToast(successMessage, 'success');
            }

        } catch (error) {
            console.error(`Error in ${elementId}:`, error);
            this.showToast(errorMessage, 'error');
        } finally {
            this.isProcessing.delete(elementId);
            if (showLoading) {
                this.hideLoading(element);
            }
        }
    }

    showLoading(element, text) {
        const originalText = element.textContent || element.innerHTML;
        this.loadingStates.set(element, originalText);
        
        if (element.tagName === 'BUTTON') {
            element.disabled = true;
            element.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
        } else {
            element.style.opacity = '0.6';
            element.style.pointerEvents = 'none';
        }
    }

    hideLoading(element) {
        const originalText = this.loadingStates.get(element);
        if (originalText) {
            if (element.tagName === 'BUTTON') {
                element.disabled = false;
                element.innerHTML = originalText;
            } else {
                element.style.opacity = '1';
                element.style.pointerEvents = 'auto';
            }
            this.loadingStates.delete(element);
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Validation functions
    validateProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if (!product.inStock) {
            throw new Error('Product is out of stock');
        }
        return product;
    }

    validateCartItem(productId) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === productId);
        return existingItem ? existingItem.quantity : 0;
    }
}

// Global click handler instance
const clickHandler = new ClickHandler();

// Utility functions for common operations
const Utils = {
    formatPrice(price) {
        return `$${price.toFixed(2)}`;
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Accessibility helpers
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
};

// CSS for toast notifications
const toastStyles = `
<style>
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.toast.show {
    transform: translateX(0);
}

.toast-success {
    background-color: #28a745;
}

.toast-error {
    background-color: #dc3545;
}

.toast-info {
    background-color: #17a2b8;
}

.toast i {
    font-size: 18px;
}

/* Loading states */
.btn-loading {
    position: relative;
    overflow: hidden;
}

.btn-loading::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% { left: -100%; }
    100% { left: 100%; }
}

/* Accessibility improvements */
[role="button"]:focus,
button:focus,
a:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', toastStyles);

// Export for use in other files
window.ClickHandler = ClickHandler;
window.Utils = Utils;
window.clickHandler = clickHandler;
