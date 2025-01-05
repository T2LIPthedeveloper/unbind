const axios = require('axios');

const BASE_URL = 'https://openlibrary.org/search.json';
const RATE_LIMIT_HEADER = 'x-ratelimit-limit';
const RATE_LIMIT_REMAINING_HEADER = 'x-ratelimit-remaining';
const RATE_LIMIT_RESET_HEADER = 'x-ratelimit-reset';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRateLimit = async (url, retries = 3) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await axios.get(url);
            const rateLimitRemaining = response.headers[RATE_LIMIT_REMAINING_HEADER];
            const rateLimitReset = response.headers[RATE_LIMIT_RESET_HEADER];

            if (rateLimitRemaining === '0') {
                const resetTime = rateLimitReset * 1000 - Date.now();
                await sleep(resetTime > 0 ? resetTime : 1000);
            }

            return response.data.docs;
        } catch (error) {
            if (attempt < retries - 1) {
                const retryAfter = error.response.headers['retry-after'];
                const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : (2 ** attempt) * 1000;
                await sleep(waitTime);
            } else {
                console.error('Error fetching data:', error);
                throw error;
            }
        }
    }
};

/**
 * Fetch books based on a query and optional filters.
 * @param {string} query - The search query.
 * @param {Object} filters - Optional filters to apply to the search.
 * @param {string} [filters.author] - Filter by author name.
 * @param {string} [filters.title] - Filter by book title.
 * @param {string} [filters.publisher] - Filter by publisher.
 * @param {string} [filters.language] - Filter by language.
 * @param {number} [filters.year] - Filter by publication year.
 * @param {string} [filters.isbn] - Filter by ISBN.
 * @returns {Promise<Array>} - A promise that resolves to an array of books.
 */
const fetchBooks = async (query, filters = {}) => {
    let url = `${BASE_URL}?q=${encodeURIComponent(query)}`;

    // Add filters to the URL
    Object.keys(filters).forEach(key => {
        url += `&${key}=${encodeURIComponent(filters[key])}`;
    });

    return fetchWithRateLimit(url);
};

/**
 * Fetch book suggestions based on a query.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} - A promise that resolves to an array of book titles.
 */
const fetchSuggestions = async (query) => {
    const url = `${BASE_URL}?q=${encodeURIComponent(query)}`;
    const docs = await fetchWithRateLimit(url);
    return docs.map(book => book.title);
};

/**
 * Fetch books by author name.
 * @param {string} query - The author name.
 * @returns {Promise<Array>} - A promise that resolves to an array of books.
 */
const fetchAuthors = async (query) => {
    const url = `${BASE_URL}?author=${encodeURIComponent(query)}`;
    return fetchWithRateLimit(url);
};

/**
 * Fetch books by publication year.
 * @param {number} year - The publication year.
 * @returns {Promise<Array>} - A promise that resolves to an array of books.
 */
const fetchBooksByYear = async (year) => {
    const url = `${BASE_URL}?publish_year=${encodeURIComponent(year)}`;
    return fetchWithRateLimit(url);
};

/**
 * Fetch books by ISBN.
 * @param {string} isbn - The ISBN number.
 * @returns {Promise<Array>} - A promise that resolves to an array of books.
 */
const fetchBooksByISBN = async (isbn) => {
    const url = `${BASE_URL}?isbn=${encodeURIComponent(isbn)}`;
    return fetchWithRateLimit(url);
};

/**
 * Fetch trending books for today.
 * @returns {Promise<Array>} - A promise that resolves to an array of trending books.
 */
const fetchTrendingToday = async () => {
    const url = `${BASE_URL}?sort=editions&limit=10`;
    return fetchWithRateLimit(url);
};

/**
 * Fetch trending books for this week.
 * @returns {Promise<Array>} - A promise that resolves to an array of trending books.
 */
const fetchTrendingThisWeek = async () => {
    const url = `${BASE_URL}?sort=editions&limit=10&timeframe=week`;
    return fetchWithRateLimit(url);
};

/**
 * Fetch trending books for this month.
 * @returns {Promise<Array>} - A promise that resolves to an array of trending books.
 */
const fetchTrendingThisMonth = async () => {
    const url = `${BASE_URL}?sort=editions&limit=10&timeframe=month`;
    return fetchWithRateLimit(url);
};

module.exports = {
    fetchBooks,
    fetchSuggestions,
    fetchAuthors,
    fetchBooksByYear,
    fetchBooksByISBN,
    fetchTrendingToday,
    fetchTrendingThisWeek,
    fetchTrendingThisMonth
};