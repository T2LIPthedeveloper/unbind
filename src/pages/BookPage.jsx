import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpenIcon,
  StarIcon,
  BookmarkIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  TagIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";

const fetchBookData = async ({ queryKey }) => {
  const [, id] = queryKey;
  const [details, ratings, popularity] = await Promise.all([
    fetch(`https://openlibrary.org/works/${id}.json`).then((res) => res.json()),
    fetch(`https://openlibrary.org/works/${id}/ratings.json`).then((res) =>
      res.json()
    ),
    fetch(`https://openlibrary.org/works/${id}/bookshelves.json`).then((res) =>
      res.json()
    ),
  ]);
  return { details, ratings, popularity };
};

const fetchAuthor = async ({ queryKey }) => {
  const [, authorKey] = queryKey;
  const response = await fetch(`https://openlibrary.org${authorKey}.json`);
  if (!response.ok) {
    throw new Error("Failed to fetch author");
  }
  return response.json();
};

const BookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addBookToList, useBookLists, deleteBookFromList } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeList, setActiveList] = useState(null);
  const [showListDropdown, setShowListDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [bookDetails, setBookDetails] = useState({
    bookType: "physical",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Fetch book data
  const {
    data: bookData,
    isLoading: isLoadingBook,
    error: bookError,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: fetchBookData,
  });

  // Fetch author data
  const {
    data: authorData,
    isLoading: isLoadingAuthor,
    error: authorError,
  } = useQuery({
    queryKey: ["author", bookData?.details?.authors?.[0]?.author?.key],
    queryFn: fetchAuthor,
    enabled: !!bookData?.details?.authors?.[0]?.author?.key,
  });

  // Check if book is in any lists
  const { data: userLists } = useQuery({
    queryKey: ["bookLists", user?.id],
    queryFn: useBookLists,
    enabled: !!user,
    onSuccess: (lists) => {
      if (lists) {
        for (const listType of [
          "currently_reading",
          "read_books",
          "wishlist_books",
        ]) {
          const bookFound = lists[listType]?.some(
            (item) => item.book_code === id
          );
          if (bookFound) {
            setActiveList(listType);
            break;
          }
        }
      }
    },
  });

  // useEffect to check if book is in any lists
  useEffect(() => {
    const checkExistingBook = async () => {
      if (!user || initialCheckDone) return;

      try {
        setLoading(true);
        const bookCode = id;
        const allLists = userLists;

        // Check each list for the book
        for (const listType of ["currently_reading", "read_books", "wishlist_books"]) {
          const listData = allLists[listType];
          const bookFound = listData?.some((item) => item.book_code === bookCode);

          if (bookFound) {
            setActiveList(listType);
            break;
          }
        }
      } catch (error) {
        console.error("Error checking existing book:", error);
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };

    checkExistingBook();
  }, [user, id, initialCheckDone, userLists]);

  const lists = [
    { id: "wishlist_books", name: "Wishlist", icon: "⭐" },
    { id: "currently_reading", name: "Currently Reading", icon: "📖" },
    { id: "read_books", name: "Read", icon: "✅" },
  ];

  const handleListClick = (listId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (listId === activeList) {
      handleAddToList(listId);
    } else if (listId === "wishlist_books") {
      handleAddToList(listId);
    } else {
      setSelectedList(listId);
      setShowModal(true);
      setShowListDropdown(false);
    }
  };

  const handleAddToList = async (listId, additionalDetails = null) => {
    setLoading(true);
    try {
      if (activeList === listId) {
        // Remove from list functionality would go here
        await deleteBookFromList(activeList, id);
        setActiveList(null);
      } else {
        const bookInfo = {
          user_id: user.id,
          book_code: id,
          book_title: bookData.details.title,
          book_author: authorData ? authorData.name : "Unknown Author",
          cover_image: bookData.details.covers?.[0]
            ? `https://covers.openlibrary.org/b/id/${bookData.details.covers[0]}-L.jpg`
            : null,
          date_added: new Date(),
          note: additionalDetails?.note || "",
        };

        if (listId === "currently_reading") {
          bookInfo.start_date = additionalDetails?.startDate || new Date();
          bookInfo.book_type = additionalDetails?.bookType;
        }

        if (listId === "read_books") {
          bookInfo.start_date = additionalDetails?.startDate;
          bookInfo.end_date = additionalDetails?.endDate;
          bookInfo.book_type = additionalDetails?.bookType;
        }

        await addBookToList(listId, bookInfo);
        setActiveList(listId);
      }
    } catch (error) {
      console.error("Error updating book list:", error);
    } finally {
      setLoading(false);
      setShowListDropdown(false);
      setShowModal(false);
      setBookDetails({
        bookType: "physical",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        note: "",
      });
    }
  };

  const handleSubmitDetails = (e) => {
    e.preventDefault();
    handleAddToList(selectedList, bookDetails);
  };

  if (isLoadingBook || isLoadingAuthor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpenIcon className="h-12 w-12 mx-auto text-teal-500 animate-pulse" />
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            Loading book details...
          </h2>
        </div>
      </div>
    );
  }

  if (bookError || authorError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold">Error loading book details</h2>
          <p className="mt-2">{bookError?.message || authorError?.message}</p>
        </div>
      </div>
    );
  }

  const { details: book, ratings } = bookData;
  const authors = authorData ? [authorData] : [];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="relative">
            {book.covers?.[0] && (
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
                  alt="Book cover"
                  className="w-full h-full object-cover filter blur opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-50" />
              </div>
            )}
            <div className="relative pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-b-4 border-teal-500">
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                  {book.covers?.[0] ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
                      alt={book.title}
                      className="w-48 h-72 object-cover rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="w-48 h-72 bg-gray-200 rounded-lg flex items-center justify-center">
                      <BookOpenIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {/* Book Info */}
                <div className="flex-grow">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {book.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-teal-400 mr-1" />
                      <span className="text-lg font-medium">
                        {ratings?.summary?.average?.toFixed(1) || "No ratings"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="h-5 w-5 text-teal-500 mr-1" />
                      <span className="text-lg font-medium">
                        {ratings?.summary?.count || 0} ratings
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-6">
                    {/* List Button */}
                    <div className="relative">
                      <button
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          activeList
                            ? "bg-teal-700"
                            : "bg-teal-600 hover:bg-teal-700"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => setShowListDropdown(!showListDropdown)}
                        disabled={loading}
                      >
                        <BookmarkIcon className="h-5 w-5 mr-2" />
                        {activeList
                          ? `In ${lists.find((l) => l.id === activeList)?.name}`
                          : "Add to List"}
                      </button>

                      {showListDropdown && (
                        <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            {lists.map((list) => (
                              <button
                                key={list.id}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${
                                  activeList === list.id
                                    ? "bg-teal-50 text-teal-700"
                                    : "text-gray-700 hover:bg-teal-50"
                                }`}
                                onClick={() => handleListClick(list.id)}
                                disabled={loading}
                              >
                                <span className="flex items-center">
                                  <span className="mr-2">{list.icon}</span>
                                  {list.name}
                                </span>
                                {activeList === list.id && (
                                  <CheckCircleIcon className="h-5 w-5 text-teal-600" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Modal */}
                      {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-medium">
                                Add to{" "}
                                {lists.find((l) => l.id === selectedList)?.name}
                              </h3>
                              <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <XMarkIcon className="h-6 w-6" />
                              </button>
                            </div>

                            <form
                              onSubmit={handleSubmitDetails}
                              className="space-y-4"
                            >
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Book Type
                                </label>
                                <select
                                  value={bookDetails.bookType}
                                  onChange={(e) =>
                                    setBookDetails({
                                      ...bookDetails,
                                      bookType: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                >
                                  <option value="physical">
                                    Physical Book
                                  </option>
                                  <option value="ebook">E-Book</option>
                                  <option value="audiobook">Audiobook</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  value={bookDetails.startDate}
                                  onChange={(e) =>
                                    setBookDetails({
                                      ...bookDetails,
                                      startDate: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                />
                              </div>

                              {selectedList === "read_books" && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    End Date
                                  </label>
                                  <input
                                    type="date"
                                    value={bookDetails.endDate}
                                    onChange={(e) =>
                                      setBookDetails({
                                        ...bookDetails,
                                        endDate: e.target.value,
                                      })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                  />
                                </div>
                              )}

                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Notes
                                </label>
                                <textarea
                                  value={bookDetails.note}
                                  onChange={(e) =>
                                    setBookDetails({
                                      ...bookDetails,
                                      note: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                  rows="3"
                                />
                              </div>

                              <div className="flex justify-end space-x-3">
                                <button
                                  type="button"
                                  onClick={() => setShowModal(false)}
                                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md"
                                >
                                  Add to List
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                    {book.ia && (
                      <a
                        href={`https://archive.org/details/${book.ia[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                      >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Read Online
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-6 lg:p-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About the Book
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {book.description?.value ||
                    book.description ||
                    "No description available."}
                </p>
              </section>
              {/* Subjects */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Subjects
                </h2>
                <div className="flex flex-wrap gap-2">
                  {book.subjects?.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
                    >
                      <TagIcon className="h-4 w-4 mr-1" />
                      {subject}
                    </span>
                  ))}
                </div>
              </section>
            </div>
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Publication Info */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Publication Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <BookOpenIcon className="h-5 w-5 text-teal-600 mr-2" />
                    <span className="text-gray-600">
                      by{" "}
                      {authors
                        ? authors.map((author) => author.name).join(", ")
                        : "Author unknown"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-teal-600 mr-2" />
                    <span className="text-gray-600">
                      Published{" "}
                      {new Date(book.created?.value).toLocaleDateString() ||
                        "Not available"}
                    </span>
                  </div>
                </div>
              </section>
              {/* Purchase Links */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Where to Buy
                </h2>
                <div className="space-y-3">
                  {["Amazon", "Barnes & Noble", "Goodreads"].map((store) => (
                    <a
                      key={store}
                      href={`https://www.${store
                        .toLowerCase()
                        .replace(/ & /g, "and")}.com/s?k=${encodeURIComponent(
                        book.title
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-teal-600 hover:text-teal-800"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                      {store}
                    </a>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
