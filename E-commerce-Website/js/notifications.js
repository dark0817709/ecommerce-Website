// Notification system for entrepreneurs
function createOrderNotifications(cartItems, orderId, deliveryAddress) {
    const products = JSON.parse(localStorage.getItem('mstore_products')) || [];
    
    cartItems.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const sellerEmail = product ? (product.seller || product.sellerEmail) : item.seller;
        
        if (sellerEmail) {
            const price = typeof item.price === 'string'
                ? parseFloat(item.price.replace(/[^\d.]/g, ''))
                : item.price;
            
            const addressString = typeof deliveryAddress === 'object' 
                ? `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.zip}, ${deliveryAddress.country}`
                : deliveryAddress;
            
            const notification = {
                id: Date.now() + Math.random(),
                sellerId: sellerEmail,
                orderId: orderId,
                productName: item.name,
                quantity: item.quantity,
                total: price * item.quantity,
                deliveryAddress: addressString,
                date: new Date().toISOString(),
                read: false,
                type: 'order'
            };
            
            saveNotification(notification);
        }
    });
}

function saveNotification(notification) {
    let notifications = JSON.parse(localStorage.getItem('mstore_notifications')) || [];
    notifications.push(notification);
    localStorage.setItem('mstore_notifications', JSON.stringify(notifications));
}

function getNotificationsForSeller(sellerEmail) {
    const notifications = JSON.parse(localStorage.getItem('mstore_notifications')) || [];
    return notifications.filter(n => n.sellerId === sellerEmail).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function markNotificationAsRead(notificationId) {
    let notifications = JSON.parse(localStorage.getItem('mstore_notifications')) || [];
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        localStorage.setItem('mstore_notifications', JSON.stringify(notifications));
    }
}

function getUnreadCount(sellerEmail) {
    const notifications = getNotificationsForSeller(sellerEmail);
    return notifications.filter(n => !n.read).length;
}