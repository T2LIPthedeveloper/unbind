import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import {
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import BlogPost from "../components/blog/BlogPost";

const BlogPage = () => {
  const { user, useBlogPosts, addComment, deleteComment, createBlogPost, useComments } =
    useAuth();
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const queryClient = useQueryClient();
  const { data: posts, error: postError, isLoading: postLoading, post_count } = useBlogPosts();
  console.log(posts);
  const { data: comments, error: commentError, isLoading: commentLoading } = useComments();

  const createPostMutation = useMutation({
    mutationFn: ({ title, content }) => createBlogPost(title, content),
    onSuccess: () => {
      queryClient.invalidateQueries(["blogPosts"]);
      setShowNewPostForm(false);
      setNewPost({ title: "", content: "" });
    },
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    createPostMutation.mutate(newPost);
  };

  if (postLoading || commentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Blog Posts
          </h1>
          {user && (
            <button
              onClick={() => setShowNewPostForm(true)}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              New Post
            </button>
          )}
        </div>

        {showNewPostForm && (
          <NewPostForm
            newPost={newPost}
            setNewPost={setNewPost}
            onSubmit={handleCreatePost}
            onClose={() => setShowNewPostForm(false)}
            isLoading={createPostMutation.isLoading}
          />
        )}

        <div className="space-y-6">
          {post_count > 0 ? (
            posts.map((post) => <BlogPost key={post.id} post={post} />)
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Posts Available</h2>
              <p className="text-gray-700">There are currently no blog posts to display. Be the first to create a new post!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NewPostForm = ({ newPost, setNewPost, onSubmit, onClose, isLoading }) => {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Write your post content..."
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-40"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:bg-gray-300"
        >
          {isLoading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};



export default BlogPage;
