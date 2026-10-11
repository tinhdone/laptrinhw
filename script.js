function getCart() {
    let cart = localStorage.getItem('celltech_cart');
    return cart ? JSON.parse(cart) : [];
}
function saveCart(cart) {
    localStorage.setItem('celltech_cart', JSON.stringify(cart));
    updateCartCount();
}
function updateCartCount() {
    let cart = getCart();
    let totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    let badge = document.getElementById('cartCount');
    if (badge) badge.innerText = totalCount;
}
function addToCart(name, price) {
    let cart = getCart();
    let found = cart.find(item => item.name === name);
    if (found) { found.qty++; } else {
        cart.push({ name: name, price: price, qty: 1, img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80' });
    }
    saveCart(cart);
    showToast(`Đã thêm "${name}" vào giỏ hàng!`);
}
function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2500);
}

// Authentication System
function getCurrentUser() {
    let userStr = localStorage.getItem('celltech_current_user');
    return userStr ? JSON.parse(userStr) : null;
}

function checkAdminAccess() {
    let user = getCurrentUser();
    // Only 'Đỗ Phạm Trung Tính' or admin account is allowed as Admin
    if (!user || user.role !== 'admin') {
        alert('Bạn không có quyền truy cập trang quản trị! Vui lòng đăng nhập tài khoản Admin.');
        window.location.href = 'login.html';
    }
}

function handleLogin(e) {
    e.preventDefault();
    let username = document.getElementById('loginUser').value.trim();
    let pass = document.getElementById('loginPass').value;

    // Default predefined Admin account for Đỗ Phạm Trung Tính
    if ((username === 'admin' || username.toLowerCase() === 'đỗ phạm trung tính') && pass === '123456') {
        let adminUser = { name: 'Đỗ Phạm Trung Tính', username: 'admin', role: 'admin' };
        localStorage.setItem('celltech_current_user', JSON.stringify(adminUser));
        alert('Đăng nhập thành công với quyền Quản trị viên!');
        window.location.href = 'admin.html';
        return;
    }

    // Check predefined account yeukimtruc
    if (username === 'yeukimtruc' && pass === '09022007') {
        let yktUser = { name: 'Yêu Kim Trúc', username: 'yeukimtruc', role: 'user' };
        localStorage.setItem('celltech_current_user', JSON.stringify(yktUser));
        alert('Đăng nhập thành công với tài khoản yeukimtruc!');
        window.location.href = 'index.html';
        return;
    }

    // Regular user login lookup from registered users
    let users = JSON.parse(localStorage.getItem('celltech_users') || '[]');
    let foundUser = users.find(u => u.username === username && u.pass === pass);
    if (foundUser) {
        localStorage.setItem('celltech_current_user', JSON.stringify(foundUser));
        alert('Đăng nhập thành công!');
        window.location.href = 'index.html';
    } else {
        alert('Sai tên đăng nhập hoặc mật khẩu!');
    }
}

function handleRegister(e) {
    e.preventDefault();
    let name = document.getElementById('regName').value.trim();
    let username = document.getElementById('regUser').value.trim();
    let pass = document.getElementById('regPass').value;

    let users = JSON.parse(localStorage.getItem('celltech_users') || '[]');
    if (users.some(u => u.username === username)) {
        alert('Tên đăng nhập này đã tồn tại!');
        return;
    }

    let newUser = { name: name, username: username, pass: pass, role: 'user' };
    users.push(newUser);
    localStorage.setItem('celltech_users', JSON.stringify(users));
    alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
    window.location.href = 'login.html';
}

function logoutUser() {
    localStorage.removeItem('celltech_current_user');
    alert('Đã đăng xuất tài khoản!');
    window.location.href = 'index.html';
}

function updateHeaderAuth() {
    let user = getCurrentUser();
    let authContainer = document.getElementById('authHeaderContainer');
    if (!authContainer) return;

    if (user) {
        let roleBadge = user.role === 'admin' ? '<span style="color:#ffeb3b; font-weight:bold;">(Admin)</span>' : '';
        authContainer.innerHTML = `
            <span style="color:white; font-size:12px;">Xin chào, <b>${user.name}</b> ${roleBadge}</span>
            ${user.role === 'admin' ? '<a href="admin.html" class="admin-link"><i class="fa-solid fa-user-shield"></i> Admin</a>' : ''}
            <button onclick="logoutUser()" style="background:rgba(255,255,255,0.2); border:none; color:white; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px;">Đăng xuất</button>
        `;
    } else {
        authContainer.innerHTML = `
            <a href="login.html" class="admin-link" style="color:white;"><i class="fa-solid fa-right-to-bracket"></i> Đăng nhập / Đăng ký</a>
        `;
    }
}

// Auto-inject requested user account if not already present
function initPredefinedUsers() {
    let users = JSON.parse(localStorage.getItem('celltech_users') || '[]');
    let targetUser = users.find(u => u.username === 'yeukimtruc');
    if (!targetUser) {
        users.push({ name: 'Yêu Kim Trúc', username: 'yeukimtruc', pass: '09022007', role: 'user' });
        localStorage.setItem('celltech_users', JSON.stringify(users));
    }
}
document.addEventListener('DOMContentLoaded', () => {
    initPredefinedUsers();
    updateCartCount();
    updateHeaderAuth();
    loadOrdersToAdmin();
});

let currentQty = 1;
function adjustQty(val) {
    currentQty += val;
    if (currentQty < 1) currentQty = 1;
    let input = document.getElementById('qtyInput');
    if (input) input.value = currentQty;
}
function changeImg(el) {
    let mainImg = document.getElementById('pMainImg');
    if (mainImg) mainImg.src = el.src;
}
function addCurrentProductToCart() {
    let titleEl = document.getElementById('pTitle');
    let priceEl = document.getElementById('pPrice');
    if (titleEl && priceEl) {
        addToCart(titleEl.innerText, 16990000);
    }
}
function buyNow() {
    addCurrentProductToCart();
    window.location.href = 'cart.html';
}

function renderCart() {
    let cart = getCart();
    let container = document.getElementById('cartItemsContainer');
    let countEl = document.getElementById('cartItemCount');
    let subtotalEl = document.getElementById('subtotalPrice');
    let totalEl = document.getElementById('totalPrice');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 40px; color:#707070;">Giỏ hàng trống!</p>';
        if (countEl) countEl.innerText = 0;
        if (subtotalEl) subtotalEl.innerText = '0₫';
        if (totalEl) totalEl.innerText = '0₫';
        return;
    }
    let html = '';
    let subtotal = 0;
    cart.forEach((item, index) => {
        subtotal += item.price * item.qty;
        html += `
            <div class="cart-item-row">
                <img src="${item.img}" alt="Item">
                <div class="cart-item-info"><h4>${item.name}</h4><p style="color:var(--primary-red); font-weight:bold;">${item.price.toLocaleString('vi-VN')}₫</p></div>
                <div class="quantity-selector"><button onclick="changeCartQty(${index}, -1)">-</button><input type="text" value="${item.qty}" readonly><button onclick="changeCartQty(${index}, 1)">+</button></div>
                <button onclick="removeCartItem(${index})" style="background:none; border:none; color:#dc2626; cursor:pointer; margin-left:15px;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });
    container.innerHTML = html;
    if (countEl) countEl.innerText = cart.reduce((s, i) => s + i.qty, 0);
    if (subtotalEl) subtotalEl.innerText = subtotal.toLocaleString('vi-VN') + '₫';
    if (totalEl) totalEl.innerText = subtotal.toLocaleString('vi-VN') + '₫';
}
function changeCartQty(index, change) {
    let cart = getCart();
    cart[index].qty += change;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}
function removeCartItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

function renderCheckout() {
    let cart = getCart();
    let container = document.getElementById('checkoutItemsList');
    let totalEl = document.getElementById('checkoutTotal');
    if (!container) return;
    let html = '';
    let total = 0;
    cart.forEach(item => {
        let sum = item.price * item.qty;
        total += sum;
        html += `<div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:13px;"><span>${item.name} (x${item.qty})</span><strong>${sum.toLocaleString('vi-VN')}₫</strong></div>`;
    });
    container.innerHTML = html;
    if (totalEl) totalEl.innerText = total.toLocaleString('vi-VN') + '₫';
}
function submitOrder(e) {
    e.preventDefault();
    let name = document.getElementById('cusName').value;
    let phone = document.getElementById('cusPhone').value;
    let address = document.getElementById('cusAddress').value;
    let cart = getCart();
    let total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    let orderCode = '#CT' + Math.floor(100000 + Math.random() * 900000);
    let newOrder = { code: orderCode, name: name, phone: phone, address: address, total: total, status: 'Chờ xử lý' };
    let allOrders = JSON.parse(localStorage.getItem('celltech_orders') || '[]');
    allOrders.unshift(newOrder);
    localStorage.setItem('celltech_orders', JSON.stringify(allOrders));
    localStorage.removeItem('celltech_cart');
    updateCartCount();
    document.getElementById('orderCode').innerText = orderCode;
    document.getElementById('successModal').style.display = 'flex';
}

function switchTab(tabName) {
    let tabs = document.querySelectorAll('.admin-tab-content');
    tabs.forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tabName).classList.add('active');
}
function initAdmin() {
    checkAdminAccess();
    loadOrdersToAdmin();
}
function loadOrdersToAdmin() {
    let table = document.getElementById('adminOrdersTable');
    let tableFull = document.getElementById('adminOrdersTableFull');
    let orders = JSON.parse(localStorage.getItem('celltech_orders') || '[]');
    if (orders.length === 0) {
        if (table) table.innerHTML = '<tr><td colspan="5" style="text-align:center;">Chưa có đơn hàng.</td></tr>';
        if (tableFull) tableFull.innerHTML = '<tr><td colspan="6" style="text-align:center;">Chưa có đơn hàng.</td></tr>';
        return;
    }
    let html = '';
    orders.forEach(o => {
        html += `<tr><td><b>${o.code}</b></td><td>${o.name}</td><td>${o.phone || ''}</td><td>${o.address || ''}</td><td>${o.total.toLocaleString('vi-VN')}₫</td><td><span class="badge-status pending">${o.status}</span></td></tr>`;
    });
    if (table) table.innerHTML = html;
    if (tableFull) tableFull.innerHTML = html;
}
function handleSearch() { alert('Đang tìm kiếm sản phẩm...'); }
