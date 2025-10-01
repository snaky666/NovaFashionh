let currentLang = 'ar';
let cart = [];
let currentCategory = '';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeWilayas();
    updateCartCount();
});

// Language Toggle
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-ar][data-en]');
    elements.forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = el.getAttribute(`data-${currentLang}`);
        } else if (el.tagName === 'OPTION') {
            el.textContent = el.getAttribute(`data-${currentLang}`);
        } else {
            el.textContent = el.getAttribute(`data-${currentLang}`);
        }
    });
    
    // Update category title if on products page
    if (currentCategory) {
        document.getElementById('categoryTitle').textContent = 
            categoryNames[currentCategory][currentLang];
    }
    
    // Update cart if visible
    if (document.getElementById('cartSection').classList.contains('active')) {
        displayCart();
    }
}

// Show Section
function showSection(section) {
    // Hide all sections
    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('categoriesSection').style.display = 'none';
    document.getElementById('productsSection').classList.remove('active');
    document.getElementById('cartSection').classList.remove('active');
    document.getElementById('contactSection').classList.remove('active');
    document.getElementById('aboutSection').classList.remove('active');
    
    // Show requested section
    if (section === 'home') {
        document.getElementById('heroSection').style.display = 'block';
        document.getElementById('categoriesSection').style.display = 'block';
    } else if (section === 'products') {
        document.getElementById('productsSection').classList.add('active');
    } else if (section === 'cart') {
        document.getElementById('cartSection').classList.add('active');
        displayCart();
    } else if (section === 'contact') {
        document.getElementById('contactSection').classList.add('active');
    } else if (section === 'about') {
        document.getElementById('aboutSection').classList.add('active');
    }
}

// Show Products by Category
function showProducts(category) {
    currentCategory = category;
    showSection('products');
    
    const categoryTitle = document.getElementById('categoryTitle');
    categoryTitle.textContent = categoryNames[category][currentLang];
    
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    products[category].forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3 class="product-name">${currentLang === 'ar' ? product.nameAr : product.nameEn}</h3>
                <p class="product-price">${product.price.toLocaleString()} ${currentLang === 'ar' ? 'دج' : 'DZD'}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    ${currentLang === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(productId) {
    let product = null;
    for (let category in products) {
        const found = products[category].find(p => p.id === productId);
        if (found) {
            product = {...found, category};
            break;
        }
    }
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    updateCartCount();
    
    // Show notification
    alert(currentLang === 'ar' ? 'تمت إضافة المنتج إلى السلة!' : 'Product added to cart!');
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Display Cart
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart">${currentLang === 'ar' ? 'السلة فارغة' : 'Cart is empty'}</div>`;
        cartTotal.style.display = 'none';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${currentLang === 'ar' ? item.nameAr : item.nameEn}</h4>
                <p>${item.price.toLocaleString()} ${currentLang === 'ar' ? 'دج' : 'DZD'} × ${item.quantity} = ${itemTotal.toLocaleString()} ${currentLang === 'ar' ? 'دج' : 'DZD'}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">${currentLang === 'ar' ? 'حذف' : 'Remove'}</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    document.getElementById('totalAmount').textContent = total.toLocaleString();
    cartTotal.style.display = 'block';
}

// Update Quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartCount();
    displayCart();
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    displayCart();
}

// Initialize Wilayas
function initializeWilayas() {
    const wilayaSelect = document.getElementById('wilayaSelect');
    for (let wilaya in wilayas) {
        const option = document.createElement('option');
        option.value = wilaya;
        option.textContent = wilaya;
        wilayaSelect.appendChild(option);
    }
}

// Update Communes
function updateCommunes() {
    const wilayaSelect = document.getElementById('wilayaSelect');
    const communeSelect = document.getElementById('communeSelect');
    const selectedWilaya = wilayaSelect.value;
    
    communeSelect.innerHTML = `<option value="">${currentLang === 'ar' ? 'اختر البلدية' : 'Select Commune'}</option>`;
    
    if (selectedWilaya && wilayas[selectedWilaya]) {
        wilayas[selectedWilaya].forEach(commune => {
            const option = document.createElement('option');
            option.value = commune;
            option.textContent = commune;
            communeSelect.appendChild(option);
        });
    }
}

// Submit Order
function submitOrder(event) {
    event.preventDefault();
    
    if (cart.length === 0) {
        alert(currentLang === 'ar' ? 'السلة فارغة! أضف منتجات أولاً.' : 'Cart is empty! Add products first.');
        return;
    }
    
    const fullName = document.getElementById('fullName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const wilaya = document.getElementById('wilayaSelect').value;
    const commune = document.getElementById('communeSelect').value;
    const message = document.getElementById('messageText').value;
    
    // Prepare order details
    let orderText = currentLang === 'ar' ? '🛍️ طلب جديد من Novashop\n\n' : '🛍️ New Order from Novashop\n\n';
    orderText += currentLang === 'ar' ? `👤 الاسم: ${fullName}\n` : `👤 Name: ${fullName}\n`;
    orderText += currentLang === 'ar' ? `📱 الهاتف: ${phoneNumber}\n` : `📱 Phone: ${phoneNumber}\n`;
    orderText += currentLang === 'ar' ? `📍 الولاية: ${wilaya}\n` : `📍 Wilaya: ${wilaya}\n`;
    orderText += currentLang === 'ar' ? `🏘️ البلدية: ${commune}\n\n` : `🏘️ Commune: ${commune}\n\n`;
    orderText += currentLang === 'ar' ? '📦 المنتجات:\n' : '📦 Products:\n';
    
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderText += `• ${currentLang === 'ar' ? item.nameAr : item.nameEn} × ${item.quantity} = ${itemTotal.toLocaleString()} ${currentLang === 'ar' ? 'دج' : 'DZD'}\n`;
    });
    
    orderText += `\n💰 ${currentLang === 'ar' ? 'المجموع' : 'Total'}: ${total.toLocaleString()} ${currentLang === 'ar' ? 'دج' : 'DZD'}`;
    
    if (message) {
        orderText += `\n\n💬 ${currentLang === 'ar' ? 'رسالة' : 'Message'}: ${message}`;
    }
    
    // Send to WhatsApp
    const whatsappUrl = `https://wa.me/213123456789?text=${encodeURIComponent(orderText)}`;
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    alert(currentLang === 'ar' ? 'تم إرسال طلبك! سنتواصل معك قريباً.' : 'Your order has been sent! We will contact you soon.');
    
    // Clear cart
    cart = [];
    updateCartCount();
    showSection('home');
}
