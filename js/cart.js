function getCart() {
    var cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function extractPriceNumber(priceText) {
    if (!priceText) return 0;
    var match = priceText.toString().match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
}

function addToCart(id, title, author, price, image, quantity) {
    quantity = quantity || 1;

    var cart = getCart();
    var existingItem = cart.find(function (item) {
        return String(item.id) === String(id);
    });

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: id,
            title: title,
            author: author,
            price: price,
            image: image,
            quantity: quantity
        });
    }

    saveCart(cart);
    updateCartCount();
    alert('The "' + title + '" has been successfully added to the cart');
}

function removeFromCart(id) {
    var cart = getCart();
    var item = cart.find(function (i) {
        return String(i.id) === String(id);
    });
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart = cart.filter(function (i) {
                return String(i.id) !== String(id);
            });
        }
    }
    saveCart(cart);
    updateCartCount();
    renderCartPage();
}

function updateCartItemQuantity(id, change) {
    var cart = getCart();
    var item = cart.find(function (i) {
        return String(i.id) === String(id);
    });

    if (item) {
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1;
        saveCart(cart);
        updateCartCount();
        renderCartPage();
    }
}
function updateCartCount() {
    var cart = getCart();
    var totalItems = cart.reduce(function (sum, item) {
        return sum + item.quantity;
    }, 0);

    var cartCountElements = document.querySelectorAll(".cart-count");
    cartCountElements.forEach(function (el) {
        el.textContent = totalItems;
    });
}

function renderCartPage() {
    var cartContainer = document.querySelector(".cart1");
    if (!cartContainer) return;

    var cart = getCart();

    // Remove previous cart elements while preserving the header
    var oldItems = cartContainer.querySelectorAll(".item, .cart-actions, .empty-cart-msg");
    oldItems.forEach(function (el) {
        el.remove();
    });

    if (cart.length === 0) {
        cartContainer.insertAdjacentHTML(
            "beforeend",
            '<p class="empty-cart-msg text-center" style="padding:40px 0; font-size: 18px; color: #666;">Your cart is currently empty.</p>'
        );
        updateCartTotals(0);
        return;
    }

    var subtotal = 0;

    cart.forEach(function (item) {
        var unitPrice = extractPriceNumber(item.price);
        var itemSubtotal = unitPrice * item.quantity;
        subtotal += itemSubtotal;

        var imgHTML = item.image ? `<img src="${item.image}" alt="${item.title}" style="width:110px;height:110px;object-fit:cover;border-radius:5px;margin-right:10px;">` : '';

        var itemHTML = `
            <div class="item" data-id="${item.id}">
                <div class="product d-flex align-items-center">
                    ${imgHTML}
                    <div>
                        <h3 style="margin:0; font-size:16px;">${item.title}</h3>
                        <p style="margin:0; font-size:13px; color:#777;">${item.author || ''}</p>
                    </div>
                </div>

                <p>${unitPrice.toFixed(2)} EGP</p>

                <div class="quantity">
                    <button type="button" onclick="updateCartItemQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="updateCartItemQuantity('${item.id}', 1)">+</button>
                </div>

                <p>${itemSubtotal.toFixed(2)} EGP</p>

                <i class="fa-regular fa-trash-can" style="cursor:pointer;" onclick="removeFromCart('${item.id}')"></i>
            </div>
        `;

        cartContainer.insertAdjacentHTML("beforeend", itemHTML);
    });

    var cartActionsHTML = `
        <div class="cart-actions">
            <div class="coupon">
                <input type="text" placeholder="Coupon code">
                <button class="apply-btn">APPLY COUPON</button>
            </div>
            <button class="update-btn" onclick="renderCartPage()">UPDATE CART</button>
        </div>
    `;
    cartContainer.insertAdjacentHTML("beforeend", cartActionsHTML);

    updateCartTotals(subtotal);
}

function updateCartTotals(subtotal) {
    var shipping = subtotal > 0 ? 50 : 0;
    var total = subtotal + shipping;

    var rows = document.querySelectorAll(".total .total-row span");
    if (rows.length >= 6) {
        rows[1].textContent = subtotal.toFixed(2) + " EGP";
        rows[3].textContent = shipping > 0 ? "Flat rate: " + shipping.toFixed(2) + " EGP" : "Free";
        rows[5].textContent = total.toFixed(2) + " EGP";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    renderCartPage();
})