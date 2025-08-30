// checkout.js
document.addEventListener('DOMContentLoaded', function () {
    const cartItems = getCartItems();
    const summaryItems = document.getElementById('summaryItems');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (cartItems.length === 0) {
        summaryItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }

    // Display cart items
    summaryItems.innerHTML = cartItems.map(item => `
        <div class="summary-item">
            <div class="item-image" style="background-image: url('${item.image}')"></div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${item.price} x ${item.quantity}</p>
            </div>
            <div class="item-total">
                ${formatPrice(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity)}
            </div>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = getCartTotal();
    const total = subtotal;

    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(total);

    // Store total in localStorage for verification
    localStorage.setItem('orderTotal', total);

    // Handle form submission
    document.getElementById('paymentForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;

        // Simple validation
        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            alert('Please fill all payment fields');
            return;
        }

        // Create order
        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: cartItems,
            total: total,
            status: 'pending',
            paymentStatus: 'completed',
            refundDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            customer: getCurrentUser()
        };

        // Save order
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        clearCart();

        // Redirect to order confirmation page
        window.location.href = 'order-confirmation.html';
    });
});

function formatPrice(amount) {
    return '₦' + amount.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}