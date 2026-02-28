// Main JavaScript file - initializes all components and handles global functionality

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    console.log('ShopEasy E-Commerce Website initialized');
    
    // Initialize navigation
    initNavigation();
    
    // Initialize modals
    initModals();
    
    // Initialize newsletter
    initNewsletter();
    
    // Initialize responsive navigation
    initResponsiveNav();
    
    // Initialize accessibility features
    initAccessibility();
    
    // Initialize loading states
    initLoadingStates();
    
    // Initialize toast function
    initToast();
});

// Toast notification function (global)
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = `toast toast-${type} show`;
        
        setTimeout(() => {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    }
}

// Make showToast available globally
window.showToast = showToast;

// Navigation functionality
function initNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Modal functionality
function initModals() {
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Close modals with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal[style*="display: block"]');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });

    // Close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });
}

// Newsletter functionality
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (!email) {
                showToast('Please enter your email address', 'error');
                return;
            }

            // Simulate newsletter subscription
            showToast('Thank you for subscribing!', 'success');
            newsletterForm.reset();
        });
    }
}

// Responsive navigation
function initResponsiveNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Accessibility features
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #007bff;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add focus indicators
    const style = document.createElement('style');
    style.textContent = `
        .skip-link:focus {
            top: 0 !important;
        }
        
        *:focus {
            outline: 2px solid #007bff;
            outline-offset: 2px;
        }
        
        .btn:focus {
            outline: 2px solid #fff;
            outline-offset: -2px;
        }
    `;
    document.head.appendChild(style);
}

// Loading states
function initLoadingStates() {
    // Add loading class to body when page is loading
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
}

// Toast initialization
function initToast() {
    // Ensure toast element exists
    if (!document.getElementById('toast')) {
        const toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility function to debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility function to throttle
function throttle(func, limit) {
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
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showToast('An error occurred. Please try again.', 'error');
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showToast('An error occurred. Please try again.', 'error');
});

// Export utility functions for global use
window.formatCurrency = formatCurrency;
window.debounce = debounce;
window.throttle = throttle;
