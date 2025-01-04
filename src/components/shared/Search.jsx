import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce, fetchWithDelay } from "../../lib/utils/search_utils";

const Search = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 2) {
            debounceFetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            navigate(`/search?query=${query}`);
        }
    };

    const debounceFetchSuggestions = debounce(async (value) => {
        try {
            const response = await fetchWithDelay(
                `https://openlibrary.org/search.json?q=${value}`
            );
            setSuggestions(response.docs.map((book) => book.title));
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    }, 300);

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setSuggestions([]);
        navigate(`/search?query=${suggestion}`);
    };

    return (
        <div className="relative flex items-center w-full max-w-sm">
            {/* Input Box */}
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Search for books..."
                className="w-full rounded-md border-gray-200 py-2.5 pr-10 text-sm xl:text-md lg:text-md shadow-sm font-serif"
            />

            {/* Search Button Icon */}
            <span className="absolute inset-y-0 right-0 flex items-center justify-center w-10">
                <button type="button" className="text-gray-600 hover:text-gray-700">
                    <span className="sr-only">Search</span>

                    {/* Placeholder for Search Icon */}
                    <div className="h-6 w-6 bg-gray-300"></div>
                </button>
            </span>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-md font-serif">
                    {suggestions.slice(0, 5).map((suggestion) => (
                        <li
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;
