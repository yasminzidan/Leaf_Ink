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
// Search Categories for each section on the site
// -------------------------------------------
const CATEGORIES = {
  featured: "bestsellers",          // Featured Books section on Home page
  popular: "fiction",               // Popular Books section on Home page
  bestSelling: "classic literature", // Best Selling Book section (single book)
  store: "fiction",                  // Our Store page (default if no search/filter)
  offers: "self-help",               // Special Offer section
};

// Default Search Category
const DEFAULT_CATEGORY = "fiction";