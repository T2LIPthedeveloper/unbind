import { useState } from "react";
import { UserCircleIcon, TrashIcon } from "@heroicons/react/20/solid";

const Comments = ({
    comments,
    postId,
    onAddComment,
    onDeleteComment,
    isLoading,
    user,
  }) => {
    const [newComment, setNewComment] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (newComment.trim()) {
        onAddComment(newComment);
        setNewComment("");
      }
    };
  
    return (
      <div className="space-y-4">
        {user && (
          <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows="3"
            />
            <button
              type="submit"
              disabled={isLoading || !newComment.trim()}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:bg-gray-300"
            >
              {isLoading ? "Posting..." : "Post Comment"}
            </button>
          </form>
        )}
  
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-center text-sm text-gray-500">
                  <UserCircleIcon className="w-4 h-4 mr-1" />
                  <span className="mr-2">{comment.author}</span>
                  <span className="text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                {user?.id === comment.user_id && (
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default Comments;