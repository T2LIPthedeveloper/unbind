import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const query = useQuery().get('query');
  const [randomBooks, setRandomBooks] = useState([]);

  useEffect(() => {
    if (!query) {
      // Fetch random books from the API
      fetch('https://api.example.com/random-books')
        .then(response => response.json())
        .then(data => setRandomBooks(data))
        .catch(error => console.error('Error fetching random books:', error));
    }
  }, [query]);

  return (
    <div>
      {query ? (
        <h1>Search Results for: {query}</h1>
      ) : (
        <div>
          <h1>Advanced Search</h1>
          {/* Add advanced search form here */}
          <h2>Random Books</h2>
          <ul>
            {randomBooks.map(book => (
              <li key={book.id}>{book.title}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Add detailed search logic here */}
    </div>
  );
}

export default SearchPage;