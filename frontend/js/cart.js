// Enhanced cart functionality with proper click handling and validation

class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartDisplay();
    }

    loadCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    async addToCart(productId, quantity = 1) {
        try {
            // Validate product
            const product = clickHandler.validateProduct(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            // Check if already in cart
            const existingItem = this.cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
                clickHandler.showToast(`${product.name} quantity updated!`, 'success');
            } else {
                this.cart.push({
                    ...product,
                    quantity: quantity,
                    addedAt: new Date().toISOString()
                });
                clickHandler.showToast(`${product.name} added to cart!`, 'success');
                
                // Add cart bounce animation
                const cartBtn = document.getElementById('cart-btn');
                if (cartBtn) {
                    cartBtn.classList.add('cart-bounce');
                    setTimeout(() => cartBtn.classList.remove('cart-bounce'), 300);
                }
            }

            this.saveCart();
            this.updateCartDisplay();

        } catch (error) {
            console.error('Error adding to cart:', error);
            clickHandler.showToast(error.message || 'Failed to add item to cart', 'error');
        }
    }

    async removeFromCart(productId) {
        try {
            const product = this.cart.find(item => item.id === productId);
            if (!product) {
                throw new Error('Item not found in cart');
            }

            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCart();
            this.updateCartDisplay();
            
            clickHandler.showToast(`${product.name} removed from cart`, 'success');
            
        } catch (error) {
            console.error('Error removing from cart:', error);
            clickHandler.showToast(error.message || 'Failed to remove item from cart', 'error');
        }
    }

    async updateQuantity(productId, newQuantity) {
        try {
            if (newQuantity < 1) {
                await this.removeFromCart(productId);
                return;
            }

            const item = this.cart.find(item => item.id === productId);
            if (!item) {
                throw new Error('Item not found in cart');
            }

            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
            
            clickHandler.showToast('Cart updated', 'success');
            
        } catch (error) {
            console.error('Error updating quantity:', error);
            clickHandler.showToast(error.message || 'Failed to update quantity', 'error');
        }
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        // Update cart count in header
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }

        // Update cart modal
        this.renderCartModal();
    }

    renderCartModal() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems || !cartTotal) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = '0.00';
            return;
        }

        cartItems.innerHTML = '';
        
        this.cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})" 
                                aria-label="Decrease quantity">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})" 
                                aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="cart.removeFromCart(${item.id})" 
                        aria-label="Remove ${item.name} from cart">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(itemElement);
        });

        cartTotal.textContent = this.getTotal().toFixed(2);
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            clickHandler.showToast('Your cart is empty', 'error');
            return;
        }

        // Redirect to checkout page
        window.location.href = 'checkout.html';
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Global cart functions for onclick handlers
window.addToCart = (productId) => cart.addToCart(productId);
window.removeFromCart = (productId) => cart.removeFromCart(productId);
window.proceedToCheckout = () => cart.proceedToCheckout();

// Cart modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeBtns = document.querySelectorAll('.close');

    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cart.renderCartModal();
            cartModal.style.display = 'block';
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            cart.proceedToCheckout();
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});
