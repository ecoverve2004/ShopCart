// Enhanced wishlist functionality with proper click handling

class Wishlist {
    constructor() {
        this.wishlist = this.loadWishlist();
        this.updateWishlistDisplay();
    }

    loadWishlist() {
        return JSON.parse(localStorage.getItem('wishlist') || '[]');
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }

    addToWishlist(productId) {
        try {
            const product = products.find(p => p.id === productId);
            if (!product) {
                showToast('Product not found', 'error');
                return;
            }

            const existingItem = this.wishlist.find(item => item.id === productId);
            
            if (existingItem) {
                showToast(`${product.name} is already in your wishlist`, 'info');
                return;
            }

            this.wishlist.push({
                ...product,
                addedAt: new Date().toISOString()
            });
            
            this.saveWishlist();
            this.updateWishlistDisplay();
            
            // Add heart animation
            const heartBtn = document.querySelector(`[data-product-id="${productId}"].add-to-wishlist-btn`);
            if (heartBtn) {
                heartBtn.classList.add('wishlist-heart');
                setTimeout(() => heartBtn.classList.remove('wishlist-heart'), 500);
            }
            
            showToast(`${product.name} added to wishlist!`, 'success');
            
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            showToast('Failed to add item to wishlist', 'error');
        }
    }

    removeFromWishlist(productId) {
        try {
            const product = this.wishlist.find(item => item.id === productId);
            if (!product) {
                showToast('Item not found in wishlist', 'error');
                return;
            }

            this.wishlist = this.wishlist.filter(item => item.id !== productId);
            this.saveWishlist();
            this.updateWishlistDisplay();
            
            showToast(`${product.name} removed from wishlist`, 'success');
            
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            showToast('Failed to remove item from wishlist', 'error');
        }
    }

    moveToCart(productId) {
        try {
            const item = this.wishlist.find(item => item.id === productId);
            if (!item) {
                showToast('Item not found in wishlist', 'error');
                return;
            }

            cart.addToCart(productId);
            this.removeFromWishlist(productId);
            
            showToast(`${item.name} moved to cart`, 'success');
            
        } catch (error) {
            console.error('Error moving to cart:', error);
            showToast('Failed to move item to cart', 'error');
        }
    }

    updateWishlistDisplay() {
        const wishlistCount = document.getElementById('wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
        }

        this.renderWishlistModal();
    }

    renderWishlistModal() {
        const wishlistItems = document.getElementById('wishlist-items');
        if (!wishlistItems) return;

        if (this.wishlist.length === 0) {
            wishlistItems.innerHTML = '<p class="empty-wishlist">Your wishlist is empty</p>';
            return;
        }

        wishlistItems.innerHTML = '';
        
        this.wishlist.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'wishlist-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
                <div class="wishlist-item-details">
                    <h4>${item.name}</h4>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <div class="wishlist-actions" style="display: flex; gap: 10px; margin-top: 10px;">
                        <button class="btn btn-primary" onclick="wishlist.moveToCart(${item.id})" 
                                style="flex: 1;"
                                aria-label="Move ${item.name} to cart">
                            <i class="fas fa-cart-plus"></i> Move to Cart
                        </button>
                        <button class="btn btn-danger" onclick="wishlist.removeFromWishlist(${item.id})" 
                                aria-label="Remove ${item.name} from wishlist">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            wishlistItems.appendChild(itemElement);
        });
    }

    isInWishlist(productId) {
        return this.wishlist.some(item => item.id === productId);
    }

    clearWishlist() {
        this.wishlist = [];
        this.saveWishlist();
        this.updateWishlistDisplay();
        showToast('Wishlist cleared', 'success');
    }
}

// Initialize wishlist
const wishlist = new Wishlist();

// Global wishlist functions for onclick handlers
window.addToWishlist = (productId) => wishlist.addToWishlist(productId);

// Wishlist modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const wishlistBtn = document.getElementById('wishlist-btn');
    const wishlistModal = document.getElementById('wishlist-modal');

    if (wishlistBtn && wishlistModal) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            wishlist.renderWishlistModal();
            wishlistModal.style.display = 'block';
        });
    }
});
