// ===== TELEGRAM PRODUCTS =====
const telegramProducts = {
    premium: [
        { 
            id: 1, 
            name: "Premium 1oy (Kirib)", 
            price: 0,
            icon: "fab fa-telegram"
        },
        { 
            id: 2, 
            name: "Premium 1yil (Kirib)", 
            price: 0,
            icon: "fab fa-telegram"
        },
        { 
            id: 3, 
            name: "Premium 3oy (Kirmasda)", 
            price: 0, 
            icon: "fab fa-telegram"
        },
        { 
            id: 4, 
            name: "Premium 6oy (Kirmasda)", 
            price: 0, 
            icon: "fab fa-telegram"
        },
        { 
            id: 5, 
            name: "Premium 1yil (Kirmasda)", 
            price: 0, 
            icon: "fab fa-telegram"
        }
    ],
    
    stars: [
        { id: 6, name: "50 Stars", price: 0, icon: "fas fa-star" },
        { id: 7, name: "100 Stars", price: 0, icon: "fas fa-star" },
        { id: 8, name: "200 Stars", price: 0, icon: "fas fa-star" },
        { id: 9, name: "500 Stars", price: 0, icon: "fas fa-star" }
    ],
    
    numbers: [
        { id: 10, name: "🇺🇸 Amerika", price: 0, icon: "fas fa-phone" },
        { id: 11, name: "🇰🇪 Keniya", price: 0, icon: "fas fa-phone" },
        { id: 12, name: "🇮🇩 Indoneziya", price: 0, icon: "fas fa-phone" },
        { id: 13, name: "🇧🇩 Bangladesh", price: 0, icon: "fas fa-phone" }
    ]
};

// ===== GLOBAL CART FUNCTION =====
window.addToCart = function(id, name, price, category) {
    console.log('Mahsulot qo\'shilmoqda:', name);
    
    // 1. Savatni olish
    let cart = JSON.parse(localStorage.getItem('telegram_cart')) || [];
    
    // 2. Mahsulot mavjudligini tekshirish
    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity += 1;
            found = true;
            break;
        }
    }
    
    // 3. Yangi mahsulot qo'shish
    if (!found) {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1,
            category: category
        });
    }
    
    // 4. Saqlash
    localStorage.setItem('telegram_cart', JSON.stringify(cart));
    console.log('Savat saqlandi:', cart);
    
    // 5. Savat sonini darhol yangilash
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // 6. Agar savat modal ochiq bo'lsa, uni yangilash
    const cartModal = document.getElementById('cartModal');
    if (cartModal && cartModal.classList.contains('active')) {
        if (typeof updateCartDisplay === 'function') {
            updateCartDisplay();
        }
    }
    
    // 7. Xabarnoma
    if (typeof showNotification === 'function') {
        showNotification(`${name} savatga qo'shildi!`);
    } else {
        // Agar showNotification topilmasa, oddiy alert
        alert(`${name} savatga qo'shildi!`);
    }
};

// ===== LOAD PRODUCTS =====
function loadProducts() {
    // Premium
    const premiumContent = document.getElementById('premiumContent');
    if (premiumContent) {
        premiumContent.innerHTML = telegramProducts.premium.map(product => createProductCard(product, 'premium')).join('');
    }
    
    // Stars
    const starsContent = document.getElementById('starsContent');
    if (starsContent) {
        starsContent.innerHTML = telegramProducts.stars.map(product => createProductCard(product, 'stars')).join('');
    }
    
    // Numbers
    const numbersContent = document.getElementById('numbersContent');
    if (numbersContent) {
        numbersContent.innerHTML = telegramProducts.numbers.map(product => createProductCard(product, 'numbers')).join('');
    }
}

// ===== CREATE PRODUCT CARD =====
function createProductCard(product, category) {
    // Oddiy mahsulot karti
    return `
        <div class="product-card">
            <div class="product-header">
                <i class="${product.icon}"></i>
                <h3 class="product-title">${product.name}</h3>
            </div>
            <div class="product-body">
                <div class="product-price">${product.price.toLocaleString()} UZS</div>
                <button class="btn-buy" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${category}')">
                    <i class="fas fa-cart-plus"></i> Savatga
                </button>
            </div>
        </div>
    `;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mahsulotlar yuklanmoqda...');
    loadProducts();
    
    // Dastlabki savat sonini yangilash
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('telegram_cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
});