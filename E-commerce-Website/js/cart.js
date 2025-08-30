// cart.js
let cart = JSON.parse(localStorage.getItem('mstore_cart')) || [];

// Reload cart from localStorage
function reloadCart() {
    cart = JSON.parse(localStorage.getItem('mstore_cart')) || [];
}

function addToCart(product) {
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('mstore_cart', JSON.stringify(cart));
    updateCartCount();
    return true;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('mstore_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('mstore_cart', JSON.stringify(cart));
        }
    }
    updateCartCount();
}

function getCartItems() {
    reloadCart();
    return cart;
}

function clearCart() {
    cart = [];
    localStorage.setItem('mstore_cart', JSON.stringify(cart));
    updateCartCount();
}

function getCartTotal() {
    return cart.reduce((total, item) => {
        // Remove currency symbols and commas, then convert to number
        const price = typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^\d.]/g, ''))
            : item.price;
        return total + (price * item.quantity);
    }, 0);
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count, .badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function () {
    reloadCart();
    updateCartCount();
});