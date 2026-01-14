/**
 * Gestion du panier - E-commerce Calots Médicaux
 * Utilise localStorage pour la persistance des données
 */

const Cart = {
    // Clé de stockage localStorage
    STORAGE_KEY: 'medicalscrubs_cart',
    
    /**
     * Récupère le panier depuis localStorage
     */
    getCart() {
        const cart = localStorage.getItem(this.STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    },
    
    /**
     * Sauvegarde le panier dans localStorage
     */
    saveCart(cart) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
        this.updateCartBadge();
        this.dispatchCartUpdate();
    },
    
    /**
     * Ajoute un produit au panier
     */
    addItem(productId, quantity = 1) {
        const cart = this.getCart();
        const product = getProductById(productId);
        
        if (!product) {
            console.error('Produit non trouvé:', productId);
            return false;
        }
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveCart(cart);
        this.showNotification(`${product.name} ajouté au panier !`);
        return true;
    },
    
    /**
     * Retire un produit du panier
     */
    removeItem(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
    },
    
    /**
     * Met à jour la quantité d'un produit
     */
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart(cart);
            }
        }
    },
    
    /**
     * Vide le panier
     */
    clearCart() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateCartBadge();
        this.dispatchCartUpdate();
    },
    
    /**
     * Calcule le sous-total du panier
     */
    getSubtotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    /**
     * Calcule les frais de livraison
     */
    getShipping() {
        const subtotal = this.getSubtotal();
        if (subtotal >= STORE_INFO.freeShippingThreshold) {
            return 0;
        }
        return STORE_INFO.shipping;
    },
    
    /**
     * Calcule le total du panier
     */
    getTotal() {
        return this.getSubtotal() + this.getShipping();
    },
    
    /**
     * Compte le nombre d'articles dans le panier
     */
    getItemCount() {
        const cart = this.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    },
    
    /**
     * Met à jour le badge du panier dans le header
     */
    updateCartBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = this.getItemCount();
        
        badges.forEach(badge => {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    },
    
    /**
     * Affiche une notification
     */
    showNotification(message, type = 'success') {
        // Supprimer les notifications existantes
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Créer la nouvelle notification
        const notification = document.createElement('div');
        notification.className = `cart-notification cart-notification--${type}`;
        notification.innerHTML = `
            <div class="cart-notification__content">
                <svg class="cart-notification__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="10"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Suppression automatique
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    /**
     * Dispatch un événement personnalisé pour les mises à jour
     */
    dispatchCartUpdate() {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: {
                cart: this.getCart(),
                count: this.getItemCount(),
                total: this.getTotal()
            }
        }));
    },
    
    /**
     * Initialise le panier au chargement de la page
     */
    init() {
        this.updateCartBadge();
    }
};

// Initialiser le panier au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});
