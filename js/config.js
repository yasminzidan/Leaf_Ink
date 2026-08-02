// ===========================================
// Google Books API Configuration
// ===========================================

// API Key
const API_KEY = "AIzaSyBmwl1188_9BrR0ZLWl_dO6hSxDXJFOI-M";

// Base URL
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

// Number of Books Per Request
const MAX_RESULTS = 20;

// Default Language
const DEFAULT_LANGUAGE = "en";

// Default Order
const DEFAULT_ORDER = "relevance";


// -------------------------------------------
// Search Categories لكل قسم في الموقع
// -------------------------------------------
const CATEGORIES = {
  featured: "bestsellers",       // قسم Featured Books في الـ Home
  popular: "fiction",             // قسم Popular Books في الـ Home
  bestSelling: "classic literature", // قسم Best Selling Book (كتاب واحد)
  store: "fiction",                // صفحة Our Store (الافتراضي لو مفيش بحث/فلترة)
  offers: "self-help",             // قسم Special Offer
};

//// Default Search Category
const DEFAULT_CATEGORY = "fiction";