import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      return () => {
        authListener.unsubscribe();
      };
    };

    fetchSession();
  }, []);

  const signIn = async (email, password) => {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error signing in:", error.message);
      throw error;
    }
    setUser(user);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const signUp = async (email, password, firstName, lastName, userName) => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          username: userName,
        },
      },
    });
    if (error) throw error;
    setIsSignUp(false); // Reset isSignUp after successful signup
  };

  // User Profile CRUD operations
  /*
    profiles schema:
    - id: UUID
    - user_id: UUID (foreign key to auth.users.id)
    - first_name: text
    - last_name: text
    - username: text - unique
    - email: text - unique
    - bio: text
    - profile_picture: text

    followers schema:
    - id: UUID
    - follower_id: UUID (foreign key to profiles)
    - followed_id: UUID (foreign key to profiles)
    - created_at: date

    */
  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (error) throw error;
    return data;
  };

  const useUserData = () => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["userData", user.id],
      queryFn: async () => {
        const userData = await fetchUserData();
        if (userData.profile_picture) {
          const response = await fetch(userData.profile_picture);
          const blob = await response.blob();
          const localUrl = URL.createObjectURL(blob);
          userData.localProfilePicture = localUrl;
        }
        return userData;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
      data,
      error,
      isLoading,
    };
  };

  const uploadProfilePicture = async (file) => {
    if (!user) {
      throw new Error("User is not logged in");
    }

    const fileExt = file.name.split(".").pop().toLowerCase();
    const fileName = `${user.user_metadata.username}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    // If the user already has a profile picture, delete the existing file
    if (user.profile_picture) {
      const existingFileName = user.profile_picture.split("/").pop();
      const existingFilePath = `avatars/${existingFileName}`;
      await supabase.storage.from("avatars").remove([existingFilePath]);

      // Delete the local URL to prevent memory leaks
      const localUrl = URL.createObjectURL(file);
      URL.revokeObjectURL(localUrl);
    }
    // Upload file to Supabase Storage, replacing any existing file  
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { cacheControl: "3600" });

    if (error) {
      throw new Error(`Failed to upload profile picture: ${error.message}`);
    }

    // Construct the public URL
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
      throw new Error("Failed to retrieve the public URL of the profile picture");
    }

    // Update the user's profile with the new picture URL
    await updateUserData({ profile_picture: publicUrl });

    return publicUrl; // Return the new public URL for display purposes
  };

  const fetchFollowers = async () => {
    const { data: followers, error: followersError } = await supabase
      .from("followers")
      .select("*")
      .eq("followed_id", user.id);
    if (followersError) throw followersError;

    const { data: following, error: followingError } = await supabase
      .from("followers")
      .select("*")
      .eq("follower_id", user.id);
    if (followingError) throw followingError;

    return {
      followers: followers,
      following: following,
    };
  };

  const useFollowers = () => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["followers", user.id],
      queryFn: fetchFollowers,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
      data,
      error,
      isLoading,
      followers_count: data?.followers?.length ?? 0,
      following_count: data?.following?.length ?? 0,
    };
  };

  const updateUserData = async (updates) => {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);
    if (error) throw error;
  };

  const followUser = async (followedId) => {
    const { error } = await supabase.from("followers").insert({
      follower_id: user.id,
      followed_id: followedId,
      created_at: new Date(),
    });
    if (error) throw error;
  };

  const unfollowUser = async (followedId) => {
    const { error } = await supabase
      .from("followers")
      .delete()
      .eq("follower_id", user.id)
      .eq("followed_id", followedId);
    if (error) throw error;
  };

  // User can delete their account (to be implemented later)

  // Book List CRUD operations
  // User can create, read, update, and delete book lists
  // For currently reading: User can update reading progress, add notes, and mark as complete, or delete
  // For completed: User can add rating, review, and notes, or delete
  // For wishlist: User can add notes, or delete
  const fetchBookLists = async () => {
    const { data: read_books, error: read_error } = await supabase
      .from("read_books")
      .select("*")
      .eq("user_id", user.id);

    const { data: reading_books, error: reading_error } = await supabase
      .from("currently_reading")
      .select("*")
      .eq("user_id", user.id);

    const { data: wishlist_books, error: wishlist_error } = await supabase
      .from("wishlist_books")
      .select("*")
      .eq("user_id", user.id);

    if (read_error || reading_error || wishlist_error) {
      throw read_error || reading_error || wishlist_error;
    }

    return {
      read_books: read_books,
      reading_books: reading_books,
      wishlist_books: wishlist_books,
    };
  };

  const useBookLists = () => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["bookLists", user.id],
      queryFn: fetchBookLists,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
      data,
      error,
      isLoading,
      read_count: data?.read_books?.length ?? 0,
      reading_count: data?.reading_books?.length ?? 0,
      wishlist_count: data?.wishlist_books?.length ?? 0,
    };
  };
  /*
    read_books schema:
    - id: UUID
    - user_id: UUID
    - book_code: text - Open Library book code (OLID)
    - book_type: text (e-book, audiobook, physical book)
    - start_date: date
    - end_date: date
    - note: text
    - date_added: date
    - cover_image: text
    - book_title: text
    - book_author: text

    currently_reading schema:
    - id: UUID
    - user_id: UUID
    - book_code: text - Open Library book code (OLID)
    - book_type: text (e-book, audiobook, physical book)
    - start_date: date
    - note: text
    - date_added: date
    - book_title: text
    - book_author: text
    - cover_image: text

    wishlist_books schema:
    - id: UUID
    - user_id: UUID
    - book_code: text - Open Library book code (OLID)
    - note: text
    - date_added: date
    - book_title: text
    - book_author: text
    - cover_image: text
    */
  const moveBookToList = async (bookId, fromList, toList, updates) => {
    // Move book from any list to another list
    const { data, error } = await supabase
      .from(fromList)
      .select("*")
      .eq("id", bookId)
      .eq("user_id", user.id)
      .single();
    if (error) throw error;

    // Remove the book from the target list if it already exists
    const { error: deleteExistingError } = await supabase
      .from(toList)
      .delete()
      .eq("book_code", data.book_code)
      .eq("user_id", user.id);
    if (deleteExistingError) throw deleteExistingError;

    // Prepare the data for insertion into the target list
    const newData = {
      ...data,
      date_added: new Date(),
      ...(toList === "read_books" && { end_date: new Date() }),
      ...(toList === "currently_reading" && { start_date: new Date() }),
    };
    console.log("Updates:", updates);

    // updates from read_books
    if (fromList === "read_books") {
      if (toList === "currently_reading" || toList === "wishlist_books") {
        delete newData.end_date;
      }
      if (toList === "wishlist_books") {
        delete newData.start_date;
      }
    }

    // updates from currently_reading
    if (fromList === "currently_reading") {
      if (toList === "wishlist_books") {
        delete newData.start_date;
      }
      if (toList === "read_books") {
        newData.end_date = updates.end_date;
      }
    }

    // updates from wishlist_books
    if (fromList === "wishlist_books") {
      if (toList === "currently_reading" || toList === "read_books") {
        newData.start_date = updates.start_date;
      }
      if (toList === "read_books") {
        newData.end_date = updates.end_date;
      }
    }

    // Insert the book into the target list
    const { error: insertError } = await supabase.from(toList).insert(newData);
    if (insertError) throw insertError;

    // Delete the book from the original list
    const { error: deleteError } = await supabase
      .from(fromList)
      .delete()
      .eq("id", bookId)
      .eq("user_id", user.id);
    if (deleteError) throw deleteError;
  };

  const deleteBookFromList = async (list, book_code) => {
    // Delete book from any list
    const { error } = await supabase
      .from(list)
      .delete()
      .eq("book_code", book_code);
    if (error) throw error;
  };

  const updateBookInList = async (list, book_code, updates) => {
    try {
      // Validate the list type
      const validLists = ["read_books", "currently_reading", "wishlist_books"];
      if (!validLists.includes(list)) {
        throw new Error(`Invalid list type: ${list}`);
      }

      // Validate required fields based on list type
      if (list === "read_books" && updates.end_date) {
        const { data: book, error: fetchError } = await supabase
          .from(list)
          .select("start_date")
          .eq("book_code", book_code)
          .eq("user_id", user.id)
          .single();
        if (fetchError) throw fetchError;
        if (!updates.start_date && !book.start_date) {
          throw new Error("Start date is required for read books");
        }
      }

      // Clean up updates object to only include valid fields for the list
      const validFields = {
        all: ["book_type", "note"], // Fields valid for all lists
        read_books: ["start_date", "end_date"],
        currently_reading: ["start_date"],
        wishlist_books: [],
      };

      const allowedFields = [...validFields.all, ...validFields[list]];
      const cleanUpdates = Object.keys(updates)
        .filter((key) => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key];
          return obj;
        }, {});

      const { error } = await supabase
        .from(list)
        .update(cleanUpdates)
        .eq("book_code", book_code)
        .eq("user_id", user.id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error(`Error updating book in ${list}:`, error.message);
      throw error;
    }
  };

  const addBookToList = async (list, book) => {
    // Ensure the book is only in one of the lists
    const lists = ["read_books", "currently_reading", "wishlist_books"];
    const bookId = book.id;

    // Remove the book from other lists
    for (const otherList of lists) {
      if (otherList !== list) {
        await supabase
          .from(otherList)
          .delete()
          .eq("id", bookId)
          .eq("user_id", user.id);
      }
    }

    // Check for duplicates in the specified list and delete older ones
    const { data: existingBooks, error: fetchError } = await supabase
      .from(list)
      .select("*")
      .eq("user_id", user.id)
      .eq("book_code", book.book_code)
      .order("date_added", { ascending: true });

    if (fetchError) throw fetchError;

    if (existingBooks.length > 0) {
      // Delete all but the latest entry
      for (let i = 0; i < existingBooks.length - 1; i++) {
        await supabase.from(list).delete().eq("id", existingBooks[i].id);
      }
    }

    // Add the book to the specified list
    const { error } = await supabase.from(list).insert(book);
    if (error) throw error;
  };

  const fetchAllBlogPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  };

  const fetchBlogPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  };

  // Update the useBlogPosts hook to match the structure of other hooks
  const useBlogPosts = () => {
    const { data, error, isLoading } = useQuery({
      queryKey: "blogPosts",
      queryFn: fetchAllBlogPosts,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
      data,
      error,
      isLoading,
      post_count: data?.length ?? 0,
    };
  };

  const createBlogPost = async (title, content) => {
    const { error } = await supabase.from("blog_posts").insert({
      user_id: user.id,
      title: title,
      content: content,
      username: user.user_metadata.username,
      created_at: new Date(),
    });
    if (error) throw error;
  };

  const updateBlogPost = async (postId, updates) => {
    const { error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", postId);
    if (error) throw error;
  };

  const deleteBlogPost = async (postId) => {
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", postId);
    if (error) throw error;
  };

  const fetchComments = async (postId) => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId);
    if (error) throw error;
    return data;
  };

  const useComments = (postId) => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["comments", postId],
      queryFn: () => fetchComments(postId),
      enabled: !!postId && !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
      data,
      error,
      isLoading,
      comment_count: data?.length ?? 0,
    };
  };

  const addComment = async (postId, content) => {
    try {
      if (!user) throw new Error("User must be authenticated to add a comment");
      if (!postId) throw new Error("Post ID is required");
      if (!content?.trim()) throw new Error("Comment content cannot be empty");

      const { data, error } = await supabase
        .from("comments")
        .insert({
          user_id: user.id,
          post_id: postId,
          content: content.trim(),
          created_at: new Date(),
          author: user.user_metadata.username,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding comment:", error.message);
      throw error;
    }
  };

  const updateComment = async (commentId, updates) => {
    const { error } = await supabase
      .from("comments")
      .update(updates)
      .eq("id", commentId);
    if (error) throw error;
  };

  const deleteComment = async (commentId) => {
    try {
      if (!user)
        throw new Error("User must be authenticated to delete a comment");
      if (!commentId) throw new Error("Comment ID is required");

      // First verify the user owns this comment
      const { data: comment, error: fetchError } = await supabase
        .from("comments")
        .select("user_id")
        .eq("id", commentId)
        .single();

      if (fetchError) throw fetchError;
      if (!comment) throw new Error("Comment not found");
      if (comment.user_id !== user.id)
        throw new Error("Unauthorized to delete this comment");

      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting comment:", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        signUp,
        isSignUp,
        setIsSignUp,
        fetchUserData,
        fetchFollowers,
        updateUserData,
        followUser,
        unfollowUser,
        fetchBookLists,
        moveBookToList,
        deleteBookFromList,
        updateBookInList,
        addBookToList,
        fetchBlogPosts,
        createBlogPost,
        updateBlogPost,
        deleteBlogPost,
        fetchComments,
        addComment,
        updateComment,
        deleteComment,
        useUserData,
        useFollowers,
        useBookLists,
        useBlogPosts,
        useComments,
        uploadProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
