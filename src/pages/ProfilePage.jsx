import React, { useState, useEffect } from "react";
import {
  BookOpenIcon,
  PencilIcon,
  ClockIcon,
  HeartIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import BookCard from "../components/books/BookCard";
import { useAuth } from "../context/AuthContext";
import BlogPost from "../components/blog/BlogPost";

const userInfoInitial = {
  username: "BookLover123",
  first_name: "John",
  last_name: "Doe",
  bio: "Just another book lover, passionate about science fiction and classic literature. Always looking for new recommendations and engaging in thoughtful discussions about books.",
  profile_picture:
    "https://ui-avatars.com/api/?name=John+Doe",
  created_at: new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  }),
};

// Main Profile Page Component
const ProfilePage = () => {
  const [activeContentTab, setActiveContentTab] = useState("lists");
  const [currentlyReading, setCurrentlyReading] = useState([
    {
      id: 12345,
      book_title: "Do you not wish for books?",
      cover_image:
        "https://placehold.co/1000x1000?text=No+books+currently+being+read",
      book_author: "Go read a book!",
    },
  ]);
  const [follow, setFollow] = useState([0, 0]);
  const [readBooks, setReadBooks] = useState([
    {
      id: 12345,
      book_title: "Do you not wish for books?",
      cover_image:
        "https://placehold.co/1000x1000?text=No+books+currently+being+read",
      book_author: "Go read a book!",
    },
  ]);
  const [wishlistBooks, setWishlistBooks] = useState([
    {
      id: 12345,
      book_title: "Do you not wish for books?",
      cover_image:
        "https://placehold.co/1000x1000?text=No+books+currently+being+read",
      book_author: "Go read a book!",
    },
  ]);
  const [userBlogPosts, setUserBlogPosts] = useState([
    {
      id: 1,
      title: "Why '1984' Remains Relevant Today",
      content:
        "An exploration of Orwell's masterpiece and its modern implications...",
      user_id: "John Doe",
      created_at: "2025-01-01",
    },
    {
      id: 2,
      title: "The Art of Reading Multiple Books",
      body: "Tips and strategies for managing multiple reads simultaneously...",
      user_id: "John Doe",
      created_at: "2025-01-02",
    },
  ]);
  const [userInfo, setUserInfo] = useState(userInfoInitial);
  const [isEditing, setIsEditing] = useState(false);
  const { useBookLists, useUserData, useFollowers, useBlogPosts, updateUserData, uploadProfilePicture } = useAuth();
  const { data: userData, error: userError } = useUserData();
  const {
    data: bookData,
    reading_count,
    read_count,
    wishlist_count,
    error: bookError,
  } = useBookLists();
  const { data: followerData, error: followerError } = useFollowers();
  const { data: blogData, error: blogError } = useBlogPosts();

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
          if (read_count > 0) {
            setReadBooks(bookData.read_books);
          }
          if (reading_count > 0) {
            setCurrentlyReading(bookData.reading_books);
          }
          if (wishlist_count > 0) {
            setWishlistBooks(bookData.wishlist_books);
          }
        }
      } catch {
        console.error("Error:", bookError);
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

    // Fetching blog posts
    const fetchBlogPosts = async () => {
      // Placeholder for Supabase query to fetch blog posts
      try {
        if (blogData) {
          setUserBlogPosts(blogData);
        }
      } catch {
        console.error(blogError);
      }
    };

    fetchBlogPosts();
  }, [
    userData,
    bookData,
    followerData,
    userError,
    bookError,
    followerError,
    read_count,
    reading_count,
    wishlist_count,
    blogData,
    blogError
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value, created_at: prev.created_at }));
  };

  const handleSave = async () => {
    try {
      setIsEditing(false);
      // Update user info in Supabase
      await updateUserData({
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        bio: userInfo.bio,
        profile_picture: userInfo.profile_picture,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
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
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        name="profile_picture"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              const publicUrl = await uploadProfilePicture(file);
                              setUserInfo((prev) => ({
                                ...prev,
                                profile_picture: publicUrl,
                              }));
                            } catch (error) {
                              console.error("Error uploading profile picture:", error);
                            }
                          }
                        }}
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
                        {read_count || 0}
                      </div>
                      <div className="text-sm text-gray-500">Books Read</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-teal-500 mr-2" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {reading_count || 0}
                      </div>
                      <div className="text-sm text-gray-500">Reading</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <HeartIcon className="w-5 h-5 text-teal-500 mr-2" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {wishlist_count || 0}
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
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center">
                  <ClockIcon className="w-5 h-5 text-teal-500 mr-2" />
                  Currently Reading
                </h2>
                <div className="space-y-4">
                  {currentlyReading.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      list="currently_reading"
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
                      list="read_books"
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
                      list="wishlist_books"
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
                {userBlogPosts.length > 0 ? (
                  userBlogPosts.map((post) => (
                    <BlogPost key={post.id} post={post} />
                  ))
                ) : (
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      No Posts Available
                    </h2>
                    <p className="text-gray-700">
                      Looks like you haven't written any blog posts yet. Get started by sharing your thoughts on books!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
