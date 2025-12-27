// ===== CART SYSTEM =====
let cart = JSON.parse(localStorage.getItem('telegram_cart')) || [];

// ===== DOM ELEMENTS =====
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');

// ===== GLOBAL FUNCTIONS (boshqa fayllardan chaqirish uchun) =====
window.updateCartDisplay = updateCartDisplay;
window.showNotification = showNotification;
window.removeFromCart = removeFromCart;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sayt yuklandi, savatni yangilash...');
    initEventListeners();
    updateCartDisplay(); // Dastlabki savatni yangilash
});

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Cart ochish
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
    
    // Cart yopish
    if (closeCart) {
        closeCart.addEventListener('click', closeCartModal);
    }
    
    // Overlay orqali yopish
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartModal);
    }
    
    // Cart actions
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', sendToTelegram);
    }
    
    // ESC tugmasi bilan yopish
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeCartModal();
        }
    });
}

// ===== CART FUNCTIONS =====
function openCart() {
    console.log('Savat ochildi');
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateCartDisplay(); // Har safar ochilganda yangilash
}

function closeCartModal() {
    console.log('Savat yopildi');
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateCartDisplay() {
    console.log('Savat yangilanmoqda...', cart);
    
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartCount || !cartItems || !cartEmpty || !cartTotal) {
        console.error('Savat elementlari topilmadi');
        return;
    }
    
    // Cart ni localStorage dan yangilash
    cart = JSON.parse(localStorage.getItem('telegram_cart')) || [];
    
    // Savat sonini yangilash
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    console.log('Jami mahsulotlar:', totalItems);
    
    // Bo'sh savat holati
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItems.style.display = 'none';
        cartTotal.textContent = '0 UZS';
        console.log('Savat bo\'sh');
        return;
    }
    
    // Mahsulotlarni ko'rsatish
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'block';
    
    // Jami summani hisoblash
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `${total.toLocaleString()} UZS`;
    console.log('Jami summa:', total);
    
    // Mahsulotlarni chiqarish
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.price.toLocaleString()} UZS × ${item.quantity}</div>
            </div>
            <div class="item-total">${itemTotal.toLocaleString()} UZS</div>
            <button class="item-remove" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // O'chirish tugmasi uchun event listener qo'shish
        const removeBtn = cartItem.querySelector('.item-remove');
        removeBtn.addEventListener('click', function() {
            removeFromCart(index);
        });
        
        cartItems.appendChild(cartItem);
    });
    
    console.log('Savat yangilandi');
}

// ===== CART OPERATIONS =====
function removeFromCart(index) {
    console.log('O\'chirilmoqda:', index);
    
    if (index >= 0 && index < cart.length) {
        const removedItem = cart[index].name;
        cart.splice(index, 1);
        localStorage.setItem('telegram_cart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification(`${removedItem} savatdan olib tashlandi`, 'warning');
    }
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('Savat bo\'sh!', 'warning');
        return;
    }
    
    if (confirm('Savatni tozalashni tasdiqlaysizmi?')) {
        cart = [];
        localStorage.setItem('telegram_cart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification('Savat tozalandi', 'warning');
    }
}

// ===== TELEGRAM SEND =====
function sendToTelegram() {
    if (cart.length === 0) {
        showNotification('Savat bo\'sh!', 'warning');
        return;
    }
    
    // Create message
    let message = `🛒 *YANGI BUYURTMA*\n\n`;
    
    // Add items
    cart.forEach((item, index) => {
        const total = item.price * item.quantity;
        message += `${index + 1}. ${item.name} - ${item.quantity} × ${item.price.toLocaleString()} = ${total.toLocaleString()} UZS\n`;
    });
    
    // Calculate total
    const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n💰 *JAMI:* ${grandTotal.toLocaleString()} UZS\n`;
    message += `\n📅 ${new Date().toLocaleString('uz-UZ')}`;
    
    // Open Telegram
    const telegramUrl = `https://t.me/ownerkents?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
    
    // Clear cart after sending
    setTimeout(() => {
        cart = [];
        localStorage.setItem('telegram_cart', JSON.stringify(cart));
        updateCartDisplay();
        closeCartModal();
        showNotification('Buyurtma Telegramga yuborildi!');
    }, 1000);
}

// ===== NOTIFICATION =====
function showNotification(message, type = 'success') {
    console.log('Xabarnoma:', message);
    
    // Mavjud xabarnomalarni o'chirish
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4cc9f0' : '#ff4757'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Poppins', sans-serif;
        cursor: pointer;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Klik orqali o'chirish
    notification.addEventListener('click', function() {
        notification.remove();
    });
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

// Add animations for notifications
(function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { 
                transform: translateX(100%); 
                opacity: 0; 
            }
            to { 
                transform: translateX(0); 
                opacity: 1; 
            }
        }
        
        @keyframes slideOut {
            from { 
                transform: translateX(0); 
                opacity: 1; 
            }
            to { 
                transform: translateX(100%); 
                opacity: 0; 
            }
        }
    `;
    document.head.appendChild(style);
})();

// Savatni har 1 soniyada avtomatik yangilash (agar modal ochiq bo'lsa)
setInterval(function() {
    if (cartModal && cartModal.classList.contains('active')) {
        updateCartDisplay();
    }
}, 1000);