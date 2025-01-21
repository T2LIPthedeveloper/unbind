import { UserCircleIcon, TrashIcon } from "@heroicons/react/20/solid";

const Comments = ({
    comments,
    onDeleteComment,
    user,
  }) => {
  
    return (
      <div className="space-y-4">
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