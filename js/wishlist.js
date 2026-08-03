function getWishlist() {
    var data = localStorage.getItem("wishlist");
    return data ? JSON.parse(data) : [];
}

function saveWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// -------------------------------------------
// Add/Remove Book (used by details.js when clicking on the heart)
// -------------------------------------------
function toggleWishlist(id, title, author, price, image) {
    var wishlist = getWishlist();
    var existingIndex = wishlist.findIndex(function (item) {
        return item.id === id;
    });

    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1); // It already exists, we'll remove it.
    } else {
        wishlist.push({ id: id, title: title, author: author, price: price, image: image });
    }

    saveWishlist(wishlist);
    renderWishlistPage();
    return existingIndex === -1; // true if added, false if removed
}

function isInWishlist(id) {
    var wishlist = getWishlist();
    return wishlist.some(function (item) {
        return item.id === id;
    });
}

function removeFromWishlist(id) {
    var wishlist = getWishlist();
    wishlist = wishlist.filter(function (item) {
        return item.id !== id;
    });
    saveWishlist(wishlist);
    renderWishlistPage();
}

// -------------------------------------------
// View wishlist.html page
// -------------------------------------------
function renderWishlistPage() {
    var emptyMessage = document.querySelector("#wishlist-empty");
    var itemsContainer = document.querySelector("#wishlist-items");

    if (!itemsContainer) return; // Not on the Wishlist page, don't do anything

    var wishlist = getWishlist();
    itemsContainer.innerHTML = "";

    if (wishlist.length === 0) {
        emptyMessage.style.display = "flex";
        itemsContainer.style.display = "none";
        return;
    }

    emptyMessage.style.display = "none";
    itemsContainer.style.display = "flex";

    wishlist.forEach(function (item) {
        var cardHTML = `
            <div class="wishlist-card" data-id="${item.id}">
                <button class="remove-wishlist" onclick="removeFromWishlist('${item.id}')">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <a href="book-details.html?id=${item.id}">
                    <img src="${item.image}" alt="${item.title}">
                </a>
                <h4>${item.title}</h4>
                <div class="price">${item.price}</div>
            </div>
        `;
        itemsContainer.insertAdjacentHTML("beforeend", cardHTML);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    renderWishlistPage();
});