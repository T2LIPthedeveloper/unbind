import React, { useState, useEffect } from "react";
import {
  BookOpenIcon,
  StarIcon,
  PencilIcon,
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  HeartIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import BookCard from "../components/books/BookCard";
import { useAuth } from "../context/AuthContext";

const userInfoInitial = {
  username: "BookLover123",
  first_name: "John",
  last_name: "Doe",
  bio: "Just another book lover, passionate about science fiction and classic literature. Always looking for new recommendations and engaging in thoughtful discussions about books.",
  profile_picture:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
  created_at: new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  }),
};

// Main Profile Page Component
const ProfilePage = () => {
  const [activeContentTab, setActiveContentTab] = useState("lists");
  const [currentlyReading, setCurrentlyReading] = useState([{
    id: 12345,
    title: "Do you not wish for books?",
    image:
      "https://placehold.co/1000x1000?text=No+books+currently+being+read",
    author: "Go read a book!",
  }]);
  const [follow, setFollow] = useState([0, 0]);
  const [readBooks, setReadBooks] = useState([{
    id: 12345,
    title: "Do you not wish for books?",
    image:
      "https://placehold.co/1000x1000?text=No+books+currently+being+read",
    author: "Go read a book!",
  }]);
  const [wishlistBooks, setWishlistBooks] = useState([{
    id: 12345,
    title: "Do you not wish for books?",
    image:
      "https://placehold.co/1000x1000?text=No+books+currently+being+read",
    author: "Go read a book!",
  }]);
  const [userInfo, setUserInfo] = useState(userInfoInitial);
  const [isEditing, setIsEditing] = useState(false);
  const { useBookLists, useUserData, useFollowers } = useAuth();
  const { data: userData, error: userError } = useUserData();
  const { data: bookData, error: bookError } = useBookLists();
  const { data: followerData, error: followerError } = useFollowers();

  useEffect(() => {
    const fetchUserData = async () => {
      // Placeholder for Supabase query to fetch user data
      try {
        if (userData) {
          setUserInfo({
            username: userData.username,
            first_name: userData.first_name,
            last_name: userData.last_name,
            bio: userData.bio,
            profile_picture: userData.profile_picture,
            created_at: new Date(userData.created_at).toLocaleDateString(
              "en-US",
              {
                month: "short",
                year: "numeric",
              }
            ),
          });
        }
      } catch {
        console.error(userError);
      }
    };

    fetchUserData();

    const fetchBooks = async () => {
      // Placeholder for Supabase query to fetch books
      try {
        if (bookData) {
          console.log(JSON.stringify(bookData));
          if (bookData.readBooks.length > 0) {
            setReadBooks(bookData.readBooks);
          }
          if (bookData.currentlyReading.length > 0) {
            setCurrentlyReading(bookData.currentlyReading);
          }
          if (bookData.wishlistBooks.length > 0) {
            setWishlistBooks(bookData.wishlistBooks);
          }
        }
      } catch {
        console.error(bookError);
      }
    };
    fetchBooks();

    const fetchFollowers = async () => {
      // Placeholder for Supabase query to fetch followers
      try {
        if (followerData) {
          // Update state with follower data
          setFollow([followerData.followers, followerData.following]);
        }
      } catch {
        console.error(followerError);
      }
    };
    fetchFollowers();
  }, [userData, bookData, followerData, userError, bookError, followerError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    // Placeholder for Supabase query to save updated userInfo
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUserInfo(userData);
    setIsEditing(false);
  };

  const handleMoveBook = async (bookId, fromList, toList) => {
    // Placeholder for Supabase query to move book between lists
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Update state after moving book
  };

  const handleRemoveBook = async (bookId, fromList) => {
    // Placeholder for Supabase query to remove book from list
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Update state after removing book
  };

  const blogPosts = [
    {
      id: 1,
      title: "Why '1984' Remains Relevant Today",
      body: "An exploration of Orwell's masterpiece and its modern implications...",
      author: "John Doe",
      createdAt: "2025-01-01",
    },
    {
      id: 2,
      title: "The Art of Reading Multiple Books",
      body: "Tips and strategies for managing multiple reads simultaneously...",
      author: "John Doe",
      createdAt: "2025-01-02",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="flex-shrink-0">
                <img
                  src={userInfo?.profile_picture}
                  alt={`${userInfo?.firstName} ${userInfo?.lastName}`}
                  className="w-48 h-48 rounded-full object-cover shadow-lg"
                />
              </div>

              <div className="flex-grow text-center lg:text-left">
                {isEditing ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={userInfo?.first_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={userInfo?.last_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4 pointer-events-none">
                      <label className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={userInfo?.username}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-400 rounded-md shadow-sm sm:text-sm select-all"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={userInfo?.bio ? userInfo?.bio : ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">
                      {userInfo?.first_name} {userInfo?.last_name}
                    </h1>
                    <p className="text-lg text-gray-600">
                      @{userInfo?.username}
                    </p>
                    <p className="text-md text-gray-500 mb-4">
                      Joined {userInfo?.created_at}
                    </p>
                    <p className="text-gray-600 mb-6 max-w-2xl">
                      {userInfo?.bio}
                    </p>
                  </>
                )}

                {isEditing ? (
                  <div className="flex justify-center lg:justify-start gap-4 mt-4 mb-6">
                    <Link
                      onClick={handleSave}
                      className="px-4 py-1 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600"
                    >
                      Save
                    </Link>
                    <Link
                      onClick={handleCancel}
                      className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300"
                    >
                      Cancel
                    </Link>
                  </div>
                ) : (
                  <Link
                    className="mb-6 flex flex-1 items-center justify-center md:justify-start py-2 text-gray-400 underline hover:text-teal-600"
                    onClick={handleEdit}
                  >
                    <PencilIcon className="w-3 h-3 mr-2" />
                    Edit Profile
                  </Link>
                )}
                <div className="flex flex-row justify-center lg:justify-start gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    <div
                      className="font-bold text-gray-900 hover:underline"
                      onClick={() => {
                        if (follow[0].length > 0) {
                          console.log("Followers clicked");
                        }
                      }}
                    >
                      {follow[0].length}
                    </div>
                    <div className="text-gray-500">Followers</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    <div
                      className="font-bold text-gray-900 hover:underline"
                      onClick={() => {
                        if (follow[1].length > 0) {
                          console.log("Following clicked");
                        }
                      }}
                    >
                      {follow[1].length}
                    </div>
                    <div className="text-gray-500">Following</div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                  <div className="flex items-center">
                    <BookOpenIcon className="w-5 h-5 text-teal-500 mr-2" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {bookData?.readBooks?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Books Read</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-teal-500 mr-2" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {bookData?.currentlyReading?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Reading</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <HeartIcon className="w-5 h-5 text-teal-500 mr-2" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {bookData?.wishlistBooks?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Wishlist</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="flex">
              {["lists", "blog"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveContentTab(tab)}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-300 ${
                    activeContentTab === tab
                      ? "text-teal-600 border-b-2 border-teal-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8 transition-opacity duration-300">
          {activeContentTab === "lists" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Currently Reading */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <ClockIcon className="w-5 h-5 text-teal-500 mr-2" />
                  Currently Reading
                </h2>
                <div className="space-y-4">
                  {currentlyReading.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onMove={(target) =>
                        handleMoveBook(book.id, "currentlyReading", target)
                      }
                      onRemove={() =>
                        handleRemoveBook(book.id, "currentlyReading")
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Read Books */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpenIcon className="w-5 h-5 text-teal-500 mr-2" />
                  Read Books
                </h2>
                <div className="space-y-4">
                  {readBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onMove={(target) =>
                        handleMoveBook(book.id, "readBooks", target)
                      }
                      onRemove={() => handleRemoveBook(book.id, "readBooks")}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center">
                  <HeartIcon className="w-5 h-5 text-teal-500 mr-2" />
                  Wishlist
                </h2>
                <div className="space-y-4">
                  {wishlistBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onMove={(target) =>
                        handleMoveBook(book.id, "wishlistBooks", target)
                      }
                      onRemove={() =>
                        handleRemoveBook(book.id, "wishlistBooks")
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeContentTab === "blog" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <PencilIcon className="w-6 h-6 text-teal-500 mr-2" />
                Blog Posts
              </h2>
              <div className="space-y-6">
                {blogPosts.map((post) => (
                  <ContentCard key={post.id} content={post} type="blog" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Content Card Component
const ContentCard = ({ content, type }) => {
  const { title, body, author, rating, createdAt } = content;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{body}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <UserCircleIcon className="w-4 h-4 mr-1" />
            {author}
          </span>
          <span className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>

        {type === "review" && (
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? "text-teal-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
