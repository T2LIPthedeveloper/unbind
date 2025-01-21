import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { fetchSearchBooks } from "../../lib/api/openLibrary";
import { 
  BookmarkIcon,
  CheckCircleIcon,
  CheckIcon,
  StarIcon
} from "@heroicons/react/24/solid";
import { BookmarkIcon as UnfilledBookmarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const SearchCard = ({ book }) => {
  const [activeList, setActiveList] = useState("");
  const [addedToList, setAddedToList] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, addBookToList, fetchBookLists, deleteBookFromList, useBookLists } = useAuth();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const lists = [
    { id: 'currently_reading', name: 'Reading List', icon: '📖' },
    { id: 'read_books', name: 'Completed List', icon: '✅' },
    { id: 'wishlist_books', name: 'Wishlist', icon: '⭐' }
  ];

  const { data: allLists, isLoading: listsLoading } = useBookLists();

  useEffect(() => {
    const checkExistingBook = async () => {
      if (!user || initialCheckDone || listsLoading) return;

      try {
        setLoading(true);
        const bookCode = book.key.replace("/works/", "");
        
        // Check each list for the book
        for (const listType of [
          { id: 'currently_reading', name: 'Reading List', icon: '📖' },
          { id: 'read_books', name: 'Completed List', icon: '✅' },
          { id: 'wishlist_books', name: 'Wishlist', icon: '⭐' }
        ]) {
          const listData = allLists[listType.id];
          const bookFound = listData?.some(item => item.book_code === bookCode);
          
          if (bookFound) {
            setActiveList(listType.id);
            setAddedToList(true);
            break;
          }
        }
      } catch (error) {
        console.error('Error checking existing book:', error);
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };

    checkExistingBook();
  }, [user, book.key, initialCheckDone, allLists, listsLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleAddToList = async (selectedList) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const bookCode = book.key.replace("/works/", "");

      // Fetch all lists to check for existing book
      const allLists = await fetchBookLists();

      // If the selected list is not the wishlist, only allow deletion
      if (selectedList.id !== 'wishlist_books') {
        if (selectedList.id === activeList) {
          await deleteBookFromList(selectedList.id, bookCode);
          setActiveList("");
          setAddedToList(false);
        } else {
          console.error('You can only add books to the Wishlist.');
          // You might want to show an error notification here
        }
        return;
      }

      // Check if the book exists in any other list and delete it
      for (const listType of lists) {
        if (listType.id !== selectedList.id) {
          const listData = allLists[listType.id];
          const bookFound = listData?.some(item => item.book_code === bookCode);
          if (bookFound) {
            await deleteBookFromList(listType.id, bookCode);
          }
        }
      }

      // Prepare book data for database
      const bookData = {
        user_id: user.id,
        book_code: bookCode,
        book_title: book.title,
        book_author: book.author || "Unknown Author",
        cover_image: book.cover_i 
          ? `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : "http://covers.openlibrary.org/b/id/11505604-M.jpg",
        date_added: new Date(),
        note: ""
      };

      await addBookToList(selectedList.id, bookData);
      setActiveList(selectedList.id);
      setAddedToList(true);
    } catch (error) {
      console.error('Error adding book to list:', error);
      // You might want to show an error notification here
    } finally {
      setLoading(false);
      setDropdownVisible(false);
    }
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
          <div className="relative" ref={dropdownRef}>
            {dropdownVisible && (
              <div className="absolute right-0 bottom-full mb-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {lists.map((listItem) => (
                    <button
                      key={listItem.id}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-teal-50 flex items-center justify-between ${
                        activeList === listItem.id ? 'text-teal-600 bg-teal-50' : 'text-gray-700'
                      }`}
                      onClick={() => handleAddToList(listItem)}
                      disabled={loading}
                    >
                      <span className="flex items-center">
                        <span className="mr-2">{listItem.icon}</span>
                        {listItem.name}
                      </span>
                      {activeList === listItem.id && (
                        <CheckCircleIcon className="h-4 w-4 text-teal-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              className={`hover:bg-teal-50 p-2 rounded-lg inline-flex items-center transition-colors duration-200 relative ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => setDropdownVisible(!dropdownVisible)}
              disabled={loading}
              aria-label="Add to list"
            >
              {addedToList ? (
                <BookmarkIcon className="h-6 w-6 text-teal-500" />
              ) : (
                <UnfilledBookmarkIcon className="h-6 w-6 text-teal-500" />
              )}
              {activeList && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  <CheckIcon className="h-3 w-3" />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;