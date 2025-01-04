// /Users/atulp/Documents/VSC/unbind/src/lib/utils/search_utils.js

// Debounce function to limit the rate at which a function can fire
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Function to handle API requests with a delay
export async function fetchWithDelay(url, options = {}, delay = 300) {
    await new Promise(resolve => setTimeout(resolve, delay));
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

// Function to handle search input changes with debounce
export function handleSearchInputChange(event, searchFunction, wait = 300) {
    const debouncedSearch = debounce(searchFunction, wait);
    debouncedSearch(event.target.value);
}