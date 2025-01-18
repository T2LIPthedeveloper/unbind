import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import SearchCard from "../components/search/SearchCard";
import { useTrendingBooks, useSearchBooks } from "../lib/hooks/bookHooks";

const useQueryString = () => {
  return new URLSearchParams(useLocation().search);
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
  </div>
);

const SearchResults = ({ query, searchQuery }) => {
  const loadingRef = useRef(null);
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
    error 
  } = searchQuery;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center justify-center w-full border-double border-t-4 border-b-4 border-teal-500 bg-white p-4 my-4">
        <h2 className="text-2xl font-serif font-bold mx-4 px-4 py-2">
          Search Results for "{query}"
        </h2>
      </div>
      {isLoading ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-6 pb-6 my-2">
          {Array(100)
            .fill()
            .map((_, i) => (
              <li key={i} className="shadow-3xl rounded-3xl">
                <LoadingSpinner />
              </li>
            ))}
        </ul>
      ) : error ? (
        <p className="text-red-600">Error: {error.message}</p>
      ) : data?.pages?.length ? (
        <>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-6 pb-6 my-2">
            {data.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.map((book) => (
                  <li key={book.key} className="shadow-3xl rounded-3xl">
                    <SearchCard book={{
                      ...book,
                      rating: book.rating ? book.rating : "No ratings",
                    }} />
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
          {/* Loading indicator */}
          {hasNextPage && (
            <div 
              ref={loadingRef}
              className="w-full flex justify-center p-4 mb-8"
            >
              {isFetchingNextPage ? (
                <LoadingSpinner />
              ) : (
                <div className="h-4 w-full"></div>
              )}
            </div>
          )}
        </>
      ) : (
        <p>No results found for "{query}".</p>
      )}
    </div>
  );
};

const Categories = ({ categories }) => (
  <ul className="flex flex-wrap justify-center w-full p-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {categories.map((category) => (
      <li key={category} className="bg-white shadow-lg border-solid border-teal-500 border-2 rounded-lg p-4 flex items-center justify-center">
        <button
          onClick={() => console.log(`Selected category: ${category}`)}
          className="text-teal-700 font-serif text-center"
        >
          {category}
        </button>
      </li>
    ))}
  </ul>
);

const TrendingBooks = ({ trendingBooks, loading, error }) => (
  <div className="flex flex-col items-center justify-center w-full">
    <div className="flex flex-col items-center justify-center w-full border-double border-t-4 border-b-4 border-teal-500 bg-white p-4 my-4">
      <h2 className="text-2xl font-serif font-bold mx-4 px-4 py-2">
        Trending Books
      </h2>
    </div>
    {loading ? (
      <LoadingSpinner />
    ) : error ? (
      <p className="text-red-600">Error: {error.message}</p>
    ) : (
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-6 pb-6 my-2">
        {trendingBooks.map((book) => (
          <li key={book.link} className="shadow-3xl rounded-3xl">
            <SearchCard book={{
              title: book.title,
              cover_i: book.image.replace("https://covers.openlibrary.org/b/id/", "").replace("-M.jpg", "") || "",
              author: book.author,
              year_published: book.year_published,
              rating: book.rating || "No ratings",
              key: book.link.replace("/books/", ""),
            }} />
          </li>
        ))}
      </ul>
    )}
  </div>
);

const SearchPage = () => {
  const query = useQueryString().get("query");
  const searchQuery = useSearchBooks(query);
  const {
    data: trendingBooks,
    isLoading: trendingLoading,
    error: trendingError,
  } = useTrendingBooks({ timeframe: "now" });

  const categories = [
    "Fiction",
    "Poetry",
    "Fantasy",
    "Romance",
    "Adult",
    "Mystery",
  ];

  return (
    <div className="search-page-container text-teal-900">
      <div className="flex flex-col items-center justify-center w-full bg-white border-double border-t-4 border-b-4 border-teal-500 p-4 my-4">
        <h1 className="text-4xl font-serif text-gray-900">Search</h1>
      </div>
      {query ? (
        <SearchResults
          query={query}
          searchQuery={searchQuery}
        />
      ) : (
        <>
          <Categories categories={categories} />
          <TrendingBooks
            trendingBooks={trendingBooks || []}
            loading={trendingLoading}
            error={trendingError}
          />
        </>
      )}
    </div>
  );
};

export default SearchPage;