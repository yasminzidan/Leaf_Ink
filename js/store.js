document.addEventListener("DOMContentLoaded", function () {
    initAuthModal();
    initLiveSearch();
    loadStoreBooks("fiction");
    attachCategoryEvents();
});

function attachCategoryEvents() {
    var categoryItems = document.querySelectorAll(".category-item");

    categoryItems.forEach(function (item) {
        item.addEventListener("click", function () {
            categoryItems.forEach(function (i) {
                i.classList.remove("active");
            });
            item.classList.add("active");
            var selectedCategory = item.getAttribute("data-category");
            loadStoreBooks(selectedCategory);
        });
    });
}

async function loadStoreBooks(category) {
    var productList = document.querySelector("#store .product-list .row");
    productList.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-secondary" role="status"></div>
            <p class="mt-2 text-muted">Loading books...</p>
        </div>`;

    try {
        const books = await fetchBooks(
            category || (typeof CATEGORIES !== 'undefined' ? CATEGORIES.store : "fiction"),
            typeof MAX_RESULTS !== 'undefined' ? MAX_RESULTS : 12
        );

        if (!books || books.length === 0) {
            showStoreError();
            return;
        }

        renderStoreBooks(books);
    } catch (error) {
        console.error("Error loading store books:", error);
        showStoreError();
    }
}

function renderStoreBooks(books) {
    var productList = document.querySelector("#store .product-list .row");
    productList.innerHTML = "";

    books.forEach(function (book) {
        var info = book.volumeInfo || {};
        var title = info.title || "Unknown Title";

        var image = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop";
        if (info.imageLinks && info.imageLinks.thumbnail) {
            image = info.imageLinks.thumbnail.replace("http://", "https://");
        }

        var author = "Unknown author";
        if (info.authors && info.authors.length > 0) {
            author = info.authors[0];
        }

        var price = "";
        if (book.saleInfo && book.saleInfo.listPrice) {
            price = book.saleInfo.listPrice.amount + " " + (book.saleInfo.listPrice.currencyCode || "EGP");
        } else {
            // price = (Math.random() * 300 + 100).toFixed(2) + " EGP";
            var seed = book.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
            price = ((seed % 300) + 100).toFixed(2) + " EGP";
        }

        productList.innerHTML += `
            <div class="col-lg-3 col-md-6 mb-4 d-flex align-items-stretch">
                <div class="book-card w-100 bg-white p-3 rounded-4 shadow-sm d-flex flex-column justify-content-between text-center" data-id="${book.id}">
                    <div>
                        <div class="book-img-wrapper rounded-3 mb-3 d-flex align-items-center justify-content-center p-3">
                            <a href="book-details.html?id=${book.id}" class="d-block w-100 h-100 d-flex align-items-center justify-content-center">
                                <img src="${image}" alt="${title}" class="img-fluid rounded-2">
                            </a>
                        </div>
                        <h6 class="book-title fw-bold text-dark mb-1 text-truncate-2" title="${title}">${title}</h6>
                        <p class="book-author text-muted small mb-2 text-truncate">${author}</p>
                    </div>
                    <div>
                        <div class="book-price fw-bold text-dark my-2">${price}</div>
                        <button type="button" class="btn btn-dark-custom w-100 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2 add-to-cart">
                            <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    attachAddToCartEvents();
}

function attachAddToCartEvents() {
    var addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach(function (button) {
        var newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener("click", function () {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                openAuthView('login');
                return;
            }

            var productItem = newButton.closest(".book-card");
            var id = productItem.getAttribute("data-id");
            var title = productItem.querySelector(".book-title").innerText;
            var author = productItem.querySelector(".book-author").innerText;
            var price = productItem.querySelector(".book-price").innerText;
            var image = productItem.querySelector("img").getAttribute("src");

            if (typeof addToCart === "function") {
                addToCart(id, title, author, price, image, 1);
            }
        });
    });
}

function showStoreError() {
    var productList = document.querySelector("#store .product-list .row");
    productList.innerHTML = `
        <div class="col-12 text-center py-5">
            <p class="text-danger fw-semibold">Could not load books. Please try again later.</p>
        </div>`;
}