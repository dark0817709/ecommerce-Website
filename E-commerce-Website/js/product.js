// Product management functionality
let products = JSON.parse(localStorage.getItem('mstore_products')) || [];

// Add a new product
function addProduct(name, price, imageUrl, sellerEmail, description = '') {
    const newProduct = {
        id: Date.now(),
        name,
        price: `₦${price.toLocaleString('en-NG')}`,
        image: imageUrl,
        imageUrl: imageUrl, // Keep both for compatibility
        seller: sellerEmail,
        description,
        badge: 'New',
        createdAt: new Date().toISOString(),
        status: 'approved'
    };

    products.push(newProduct);
    localStorage.setItem('mstore_products', JSON.stringify(products));
    updateUserDashboardProducts(newProduct);
    reloadProducts();
    return newProduct;
}

// Update user dashboard products
function updateUserDashboardProducts(newProduct) {
    let userProducts = JSON.parse(localStorage.getItem('user_dashboard_products')) || [];
    userProducts.push(newProduct);
    localStorage.setItem('user_dashboard_products', JSON.stringify(userProducts));
    
    // Also update main products for user dashboard display
    let mainProducts = JSON.parse(localStorage.getItem('products')) || [];
    mainProducts.push({
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        image: newProduct.image,
        badge: newProduct.badge || 'New'
    });
    localStorage.setItem('products', JSON.stringify(mainProducts));
}

// Get all products
function getProducts() {
    return products;
}

// Get products by seller
function getProductsBySeller(sellerEmail) {
    return products.filter(product => product.seller === sellerEmail);
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Delete product
function deleteProduct(id) {
    products = products.filter(product => product.id !== parseInt(id));
    localStorage.setItem('mstore_products', JSON.stringify(products));

    // Also remove from user dashboard products
    let userProducts = JSON.parse(localStorage.getItem('user_dashboard_products')) || [];
    userProducts = userProducts.filter(product => product.id !== parseInt(id));
    localStorage.setItem('user_dashboard_products', JSON.stringify(userProducts));
    
    // Remove from main products
    let mainProducts = JSON.parse(localStorage.getItem('products')) || [];
    mainProducts = mainProducts.filter(product => product.id !== parseInt(id));
    localStorage.setItem('products', JSON.stringify(mainProducts));
}

// Update product
function updateProduct(id, updates) {
    const index = products.findIndex(product => product.id === parseInt(id));
    if (index !== -1) {
        // Ensure imageUrl is also updated for compatibility
        if (updates.image) {
            updates.imageUrl = updates.image;
        }
        products[index] = { ...products[index], ...updates };
        localStorage.setItem('mstore_products', JSON.stringify(products));

        let userProducts = JSON.parse(localStorage.getItem('user_dashboard_products')) || [];
        const userIndex = userProducts.findIndex(product => product.id === parseInt(id));
        if (userIndex !== -1) {
            userProducts[userIndex] = { ...userProducts[userIndex], ...updates };
            localStorage.setItem('user_dashboard_products', JSON.stringify(userProducts));
        }
        return products[index];
    }
    return null;
}

// Initialize products if not exists
function initializeProducts() {
    if (products.length === 0) {
        // Add some sample products
        const sampleProducts = [
            {
                id: 1,
                name: "Modern Luxury Sofa",
                price: "₦249,999",
                image: "images/sofa.avif",
                seller: "EliteInteriors",
                badge: "New",
                description: "Beautiful modern luxury sofa for contemporary homes"
            },
            {
                id: 2,
                name: "Minimalist Desk Lamp",
                price: "₦7,999",
                image: "images/lamp.avif",
                seller: "LightDesigns",
                badge: "Popular",
                description: "Sleek minimalist desk lamp with adjustable brightness"
            }
        ];

        products = sampleProducts;
        localStorage.setItem('mstore_products', JSON.stringify(products));
    }
}

// Call initialization
initializeProducts();

// Reload products from localStorage on page load
function reloadProducts() {
    products = JSON.parse(localStorage.getItem('mstore_products')) || [];
}
reloadProducts();