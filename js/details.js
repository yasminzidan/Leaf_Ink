document.addEventListener("DOMContentLoaded", function () {
    initAuthModal();
    initLiveSearch();
    loadBookDetails();
});

async function loadBookDetails() {
    var params = new URLSearchParams(window.location.search);
    var bookId = params.get("id");

    if (!bookId) {
        console.error("There's no ID in the link");
        showDetailsError();
        return;
    }

    var book = await fetchBookById(bookId);

    if (!book) {
        showDetailsError();
        return;
    }
    renderBookDetails(book);
}

function renderBookDetails(book) {
    var info = book.volumeInfo;

    // ===============================
    // BOOK IMAGE
    // ===============================
    var imageUrl = "";
    if (info.imageLinks) {
        imageUrl =
            info.imageLinks.large ||
            info.imageLinks.medium ||
            info.imageLinks.thumbnail ||
            info.imageLinks.smallThumbnail ||
            "";
    }
    if (imageUrl && imageUrl.startsWith("http://")) {
        imageUrl = imageUrl.replace("http://", "https://");
    }
    var bookImage = document.getElementById("book-img");
    if (bookImage) {
        bookImage.src = imageUrl || "images/placeholder.jpg";
    }

    // BOOK TITLE
    document.getElementById("bookTitle").innerText = info.title || "Unknown Title";


    // AUTHOR
    var author = "Unknown Author";
    if (info.authors) {
        author = info.authors.join(", ");
    }
    document.getElementById("bookAuthor").innerText = "By " + author;

    // DESCRIPTION
    document.getElementById("bookDescription").innerText =
        info.description || "No description available.";

    // CATEGORY
    var category = "Not available";
    if (info.categories) {
        category = info.categories.join(", ");
    }
    document.getElementById("bookCategory").innerText = "Categories: " + category;

    // TAGS
    document.getElementById("bookTags").innerText =
        "Tags: " + (info.categories ? info.categories.join(", ") : "book");

    // SKU
    document.getElementById("bookSku").innerText = "Book ID: " + book.id;

    // PRICE

    var price = "Price not available";
    if (book.saleInfo && book.saleInfo.listPrice) {
        price = book.saleInfo.listPrice.amount + " " + book.saleInfo.listPrice.currencyCode;
    } else {
        // price = (Math.random() * 300 + 100).toFixed(2) + " EGP"; //
        var seed = book.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        price = ((seed % 300) + 100).toFixed(2) + " EGP";
    }
    document.getElementById("bookPrice").innerText = price;

    // RATING
    var rating = info.averageRating ? Math.round(info.averageRating) : 4;
    var ratingElement = document.getElementById("bookRating");
    ratingElement.innerHTML = "";
    for (var i = 1; i <= 5; i++) {
        if (i <= rating) {
            ratingElement.innerHTML += '<i class="fa-solid fa-star"></i>';
        } else {
            ratingElement.innerHTML += '<i class="fa-regular fa-star"></i>';
        }
    }
    ratingElement.innerHTML += ' <span>(Customer Reviews)</span>';

    // QUANTITY
    var quantity = 1;
    var quantityElement = document.getElementById("quantity");
    var plusBtn = document.getElementById("plusBtn");
    var minusBtn = document.getElementById("minusBtn");

    if (plusBtn) {
        plusBtn.addEventListener("click", function () {
            quantity++;
            quantityElement.innerText = quantity;
        });
    }

    if (minusBtn) {
        minusBtn.addEventListener("click", function () {
            if (quantity > 1) {
                quantity--;
            }
            quantityElement.innerText = quantity;
        });
    }
    var addToCartBtn = document.querySelector(".details-add-to-cart");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", function () {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) { openAuthView('login'); return; }
            var currentQuantity = parseInt(document.getElementById("quantity").innerText);
            addToCart(
                book.id,
                info.title,
                (info.authors ? info.authors.join(", ") : "Unknown"),
                document.getElementById("bookPrice").innerText,
                document.getElementById("book-img").src,
                currentQuantity
            );
        });
    }
    // ===============================
    // WISHLIST BUTTON

    var wishlistBtn = document.querySelector(".favorite");
    var wishlistIcon = wishlistBtn ? wishlistBtn.querySelector("i") : null;

    if (wishlistBtn) {
        if (isInWishlist(book.id)) {
            wishlistIcon.classList.remove("fa-regular");
            wishlistIcon.classList.add("fa-solid");
        }

        wishlistBtn.addEventListener("click", function () {
            var added = toggleWishlist(
                book.id,
                info.title,
                (info.authors ? info.authors.join(", ") : "Unknown"),
                document.getElementById("bookPrice").innerText,
                document.getElementById("book-img").src
            );
            if (added) {
                wishlistIcon.classList.remove("fa-regular");
                wishlistIcon.classList.add("fa-solid");
            } else {
                wishlistIcon.classList.remove("fa-solid");
                wishlistIcon.classList.add("fa-regular");
            }
        });
    }
}
function showDetailsError() {
    var container = document.querySelector("#book-details .container");
    if (container) {
        container.innerHTML = `<p class="text-center">Book details could not be loaded at this time.</p>`;
    }
}