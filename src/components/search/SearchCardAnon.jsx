import React from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { fetchSearchBooks } from "../../lib/api/openLibrary";
import { StarIcon } from "@heroicons/react/24/solid"

const SearchCardAnon = ({ book }) => {
  const loading = false;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleViewDetails = () => {
    navigate(`/books/${book.key.replace("/works/", "")}`);
  };

  const handleHover = () => {
    queryClient.prefetchQuery(
      ["searchBooks", { query: book.query }],
      () => fetchSearchBooks(book.query),
      {
        cacheTime: 2 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
      }
    );
  };

  const truncateRating = (rating) => {
    return rating ? rating.toString().substring(0, 3) : "N/A";
  };

  const coverImage = book.cover_i
    ? `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "http://covers.openlibrary.org/b/id/11505604-M.jpg";

  return (
    <div
      className="max-w-sm w-full border-solid border-teal-500 border-2 lg:max-w-full lg:flex p-4 bg-white shadow-md rounded-3xl overflow-hidden h-64 md:h-72 lg:h-80 xl:h-96"
      onMouseEnter={handleHover}
    >
      <div className="flex-none w-48 relative">
        <img
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
          src={coverImage}
          alt={`${book.title} cover`}
        />
      </div>
      <div className="flex flex-col justify-between p-4 leading-normal w-full">
        <div className="mb-8 space-y-2 flex-grow">
          <h3 className="text-md font-serif text-black md:text-lg lg:text-lg xl:text-2xl">
            {book.title.length > 50
              ? `${book.title.substring(0, 50)}...`
              : book.title}
          </h3>
          <p className="text-sm font-medium italic tracking-wider text-teal-600">
            {book.author
              ? `by ${book.author.split(", ").slice(0, 3).join(", ")}${
                  book.author.split(", ").length > 3 ? " and more" : ""
                }`
              : "Author unknown"}
          </p>
          <p className="text-sm text-teal-600">{book.year_published}</p>
          <p className="text-sm text-gray-700 flex items-center">
            <span className="font-semibold">{truncateRating(book.rating)}</span>
            <StarIcon className="h-4 w-4 text-teal-500 ml-1" />
          </p>
        </div>
        <div className="flex flex-1 items-center mt-auto">
          <button
            className="bg-white hover:bg-teal-50 text-teal-600 border-teal-500 border-2 py-2 px-4 rounded mr-4 transition-colors duration-200"
            onClick={handleViewDetails}
            disabled={loading}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchCardAnon;
