import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { UserCircleIcon, CalendarIcon, ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/20/solid";
import Comments from "./Comments";

const BlogPost = ({ post }) => {
    const { user, useComments, addComment, deleteComment, deleteBlogPost } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const queryClient = useQueryClient();
    const { data: comments, error, isLoading } = useComments(post.id);
  
    const addCommentMutation = useMutation({
      mutationFn: (content) => addComment(post.id, content),
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", post.id]);
      },
      onError: (error) => {
        console.error("Error adding comment:", error);
      },
    });
  
    const deleteCommentMutation = useMutation({
      mutationFn: (commentId) => deleteComment(commentId),
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", post.id]);
      },
      onError: (error) => {
        console.error("Error deleting comment:", error);
      },
    });

    const deleteBlogPostMutation = useMutation({
      mutationFn: () => deleteBlogPost(post.id),
      onSuccess: () => {
        queryClient.invalidateQueries(["blogPosts"]);
      },
      onError: (error) => {
        console.error("Error deleting blog post:", error);
      },
    });
  
    if (isLoading) return <div>Loading comments...</div>;
    if (error) return <div>Error loading comments: {error.message}</div>;
  
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <UserCircleIcon className="w-4 h-4 mr-1" />
            <span className="mr-4">{post.username}</span>
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
  
          <div className="flex items-center gap-4 text-gray-500">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center hover:text-teal-600"
            >
              <ChatBubbleLeftIcon className="w-5 h-5 mr-1" />
              <span>{comments?.length || 0} Comments</span>
            </button>
            {user?.id === post.user_id && (
              <button
                onClick={() => deleteBlogPostMutation.mutate()}
                className="flex items-center hover:text-red-600"
              >
                <TrashIcon className="w-5 h-5 mr-1" />
                <span>Delete Post</span>
              </button>
            )}
          </div>
        </div>
  
        {showComments && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {comments?.length > 0 ? (
              <Comments
                comments={comments}
                postId={post.id}
                onAddComment={addCommentMutation.mutate}
                onDeleteComment={deleteCommentMutation.mutate}
                isLoading={addCommentMutation.isLoading}
                user={user}
              />
            ) : (
              <div>No comments yet. Be the first to comment!</div>
            )}
            {user && (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Add a comment..."
                  rows="3"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addCommentMutation.mutate(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

export default BlogPost;