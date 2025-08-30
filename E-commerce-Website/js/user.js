// user.js - Main user dashboard functionality

// Load cart functionality
let cart = JSON.parse(localStorage.getItem('mstore_cart')) || [];

// Product click functionality - redirect to product detail view
function viewProduct(productId) {
    // Store the clicked product ID for the detail page
    localStorage.setItem('currentProductId', productId);
    // Redirect to a product detail page (you can create this)
    window.location.href = 'product-detail.html';
}

// Add to cart functionality
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

    // Show success notification
    showNotification('Product added to cart!');
    return true;
}

// Update cart count in header
function updateCartCount() {
    const cartBadge = document.querySelector('.badge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: 500;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Handle category filtering
function filterProducts(category) {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => btn.classList.remove('active'));

    // Add active class to clicked button
    event.target.classList.add('active');

    // Filter logic can be added here
    console.log('Filtering by category:', category);
}

// Handle wishlist functionality
function toggleWishlist(productId, element) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        element.innerHTML = '<i class="far fa-heart"></i>';
    } else {
        wishlist.push(productId);
        element.innerHTML = '<i class="fas fa-heart"></i>';
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Search functionality
function searchProducts() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.toLowerCase();

    if (query.length > 0) {
        // Filter products based on search query
        const allProducts = document.querySelectorAll('.product-card');
        allProducts.forEach(product => {
            const title = product.querySelector('.product-title').textContent.toLowerCase();
            if (title.includes(query)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    } else {
        // Show all products if search is empty
        const allProducts = document.querySelectorAll('.product-card');
        allProducts.forEach(product => {
            product.style.display = 'block';
        });
    }
}

// Initialize dashboard functionality
document.addEventListener('DOMContentLoaded', function () {
    // Update cart count on page load
    updateCartCount();

    // Add search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', searchProducts);
    }

    // Add category filter functionality
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterProducts(this.textContent);
        });
    });

    // Cart button functionality is handled by onclick in HTML
});