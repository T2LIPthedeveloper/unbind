import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

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

            const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            });

            return () => {
                authListener.unsubscribe();
            };
        };

        fetchSession();
    }, []);
    
    const signIn = async (email, password) => {
        const { user, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Error signing in:', error.message);
            throw error;
        }
        setUser(user);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
    };

    const signUp = async(email, password, firstName, lastName, userName) => {
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    username: userName,
                }
            }
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
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        if (error) throw error;
        return data;
    };

    const useUserData = () => {
        const { data, error, isLoading } = useQuery({
            queryKey: ['userData', user.id],
            queryFn: fetchUserData,
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
        });

        return {
            data,
            error,
            isLoading,
        };
    };

    const fetchFollowers = async () => {
        const { data: followers, error: followersError } = await supabase
            .from('followers')
            .select('*')
            .eq('followed_id', user.id);
        if (followersError) throw followersError;

        const { data: following, error: followingError } = await supabase
            .from('followers')
            .select('*')
            .eq('follower_id', user.id);
        if (followingError) throw followingError;

        return {
            followers: followers,
            following: following,
        };
    };

    const useFollowers = () => {
        const { data, error, isLoading } = useQuery({
            queryKey: ['followers', user.id],
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

    const updateProfile = async (updates) => {
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('user_id', user.id);
        if (error) throw error;
    };

    const followUser = async (followedId) => {
        const { error } = await supabase
            .from('followers')
            .insert({
                follower_id: user.id,
                followed_id: followedId,
                created_at: new Date(),
            });
        if (error) throw error;
    };

    const unfollowUser = async (followedId) => {
        const { error } = await supabase
            .from('followers')
            .delete()
            .eq('follower_id', user.id)
            .eq('followed_id', followedId);
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
            .from('read_books')
            .select('*')
            .eq('user_id', user.id);

        const { data: reading_books, error: reading_error } = await supabase
            .from('currently_reading')
            .select('*')
            .eq('user_id', user.id);

        const { data: wishlist_books, error: wishlist_error } = await supabase
            .from('wishlist_books')
            .select('*')
            .eq('user_id', user.id);

        if (read_error || reading_error || wishlist_error) {
            throw read_error || reading_error || wishlist_error;
        }

        return {
            read_books: read_books,
            reading_books: reading_books,
            wishlist_books: wishlist_books
        };
    };

    const useBookLists = () => {
        const { data, error, isLoading } = useQuery({
            queryKey: ['bookLists', user.id],
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
    const moveBookToRead = async (bookId) => {
        // Move book from currently_reading to read_books
        const { data, error } = await supabase
            .from('currently_reading')
            .select('*')
            .eq('id', bookId)
            .single();
        if (error) throw error;

        const { error: insertError } = await supabase
            .from('read_books')
            .insert({
                ...data,
                end_date: new Date(),
            });
        if (insertError) throw insertError;

        const { error: deleteError } = await supabase
            .from('currently_reading')
            .delete()
            .eq('id', bookId);
        if (deleteError) throw deleteError;
    };

    const moveBookToCurrentlyReading = async (bookId) => {
        // Move book from wishlist_books to currently_reading
        const { data, error } = await supabase
            .from('wishlist_books')
            .select('*')
            .eq('id', bookId)
            .single();
        if (error) throw error;

        const { error: insertError } = await supabase
            .from('currently_reading')
            .insert({
                ...data,
                start_date: new Date(),
            });
        if (insertError) throw insertError;

        const { error: deleteError } = await supabase
            .from('wishlist_books')
            .delete()
            .eq('id', bookId);
        if (deleteError) throw deleteError;
    };

    const deleteBookFromList = async (list, book_code) => {
        // Delete book from any list
        const { error } = await supabase
            .from(list)
            .delete()
            .eq('book_code', book_code);
        if (error) throw error;
    };

    const updateBookInList = async (list, bookId, updates) => {
        // Update book in any list
        const { error } = await supabase
            .from(list)
            .update(updates)
            .eq('id', bookId);
        if (error) throw error;
    };

    const addBookToList = async (list, book) => {
        // Ensure the book is only in one of the lists
        const lists = ['read_books', 'currently_reading', 'wishlist_books'];
        const bookId = book.id;

        // Remove the book from other lists
        for (const otherList of lists) {
            if (otherList !== list) {
                await supabase
                    .from(otherList)
                    .delete()
                    .eq('id', bookId)
                    .eq('user_id', user.id);
            }
        }

        // Check for duplicates in the specified list and delete older ones
        const { data: existingBooks, error: fetchError } = await supabase
            .from(list)
            .select('*')
            .eq('user_id', user.id)
            .eq('book_code', book.book_code)
            .order('date_added', { ascending: true });

        if (fetchError) throw fetchError;

        if (existingBooks.length > 0) {
            // Delete all but the latest entry
            for (let i = 0; i < existingBooks.length - 1; i++) {
                await supabase
                    .from(list)
                    .delete()
                    .eq('id', existingBooks[i].id);
            }
        }

        // Add the book to the specified list
        const { error } = await supabase
            .from(list)
            .insert(book);
        if (error) throw error;
    };

    // Blog CRUD operations
    /*
    blog_posts schema:
    - id: UUID
    - user_id: UUID (foreign key to profiles)
    - created_at: date
    - title: text
    - content: text

    comments schema:
    - id: UUID
    - user_id: UUID (foreign key to profiles)
    - content: text
    - created_at: date
    - post_id: UUID (foreign key to blog_posts)
    */

    const fetchBlogPosts = async () => {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('user_id', user.id);
        if (error) throw error;
        return data;
    };

    const useBlogPosts = () => {
        return useQuery(['blogPosts', user.id], fetchBlogPosts, {
            staleTime: 10 * 60 * 1000, // 10 minutes
            cacheTime: 20 * 60 * 1000, // 20 minutes
        });
    };

    const createBlogPost = async (title, content) => {
        const { error } = await supabase
            .from('blog_posts')
            .insert({
                user_id: user.id,
                title: title,
                content: content,
                created_at: new Date(),
            });
        if (error) throw error;
    };

    const updateBlogPost = async (postId, updates) => {
        const { error } = await supabase
            .from('blog_posts')
            .update(updates)
            .eq('id', postId);
        if (error) throw error;
    };

    const deleteBlogPost = async (postId) => {
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', postId);
        if (error) throw error;
    };

    const fetchComments = async (postId) => {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId);
        if (error) throw error;
        return data;
    };

    const addComment = async (postId, content) => {
        const { error } = await supabase
            .from('comments')
            .insert({
                user_id: user.id,
                post_id: postId,
                content: content,
                created_at: new Date(),
            });
        if (error) throw error;
    };

    const updateComment = async (commentId, updates) => {
        const { error } = await supabase
            .from('comments')
            .update(updates)
            .eq('id', commentId);
        if (error) throw error;
    };

    const deleteComment = async (commentId) => {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            signIn, 
            signOut, 
            signUp, 
            isSignUp, 
            setIsSignUp,
            fetchUserData,
            fetchFollowers,
            updateProfile,
            followUser,
            unfollowUser,
            fetchBookLists,
            moveBookToRead,
            moveBookToCurrentlyReading,
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
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};