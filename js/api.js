async function fetchWithRetry(url, retries = 6, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;

            if (response.status === 503 && i < retries - 1) {
                console.warn(`محاولة ${i + 1} فشلت (503)، إعادة المحاولة...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            throw new Error(`فشل الطلب: ${response.status}`);
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}
async function fetchBooks(query = DEFAULT_CATEGORY, maxResults = MAX_RESULTS) {
    var cacheKey = "books_cache_" + query + "_" + maxResults;

    // 1. نتأكد لو فيه نسخة مخزنة من قبل، ونستخدمها فورًا
    var cached = localStorage.getItem(cacheKey);
    if (cached) {
        console.log("تم جلب البيانات من الذاكرة المؤقتة (Cache)");
        return JSON.parse(cached);
    }

    // 2. لو مفيش، نطلب من الـ API عادي
    try {
        const url = `${BASE_URL}?q=${query}&key=${API_KEY}&maxResults=${maxResults}&langRestrict=${DEFAULT_LANGUAGE}&orderBy=${DEFAULT_ORDER}`;
        const response = await fetchWithRetry(url);
        const data = await response.json();
        const items = data.items || [];

        // 3. نخزن النتيجة عشان المرة الجاية
        if (items.length > 0) {
            localStorage.setItem(cacheKey, JSON.stringify(items));
        }

        return items;
    } catch (error) {
        console.error("حصل خطأ في جلب الكتب:", error);
        return [];
    }
}

async function fetchBookById(bookId) {
    var cacheKey = "book_cache_" + bookId;

    var cached = localStorage.getItem(cacheKey);
    if (cached) {
        console.log("تم جلب تفاصيل الكتاب من الذاكرة المؤقتة (Cache)");
        return JSON.parse(cached);
    }

    try {
        const url = `${BASE_URL}/${bookId}?key=${API_KEY}`;
        const response = await fetchWithRetry(url);
        const book = await response.json();

        localStorage.setItem(cacheKey, JSON.stringify(book));
        return book;
    } catch (error) {
        console.error("حصل خطأ في جلب تفاصيل الكتاب:", error);
        return null;
    }
}