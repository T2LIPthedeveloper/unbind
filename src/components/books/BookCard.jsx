import { useState } from 'react';
import { ClockIcon, BookOpenIcon, HeartIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/solid';

const BookCard = ({ book, onMove, onRemove, onEdit }) => {
    const [showActions, setShowActions] = useState(false);
    
    return (
      <div 
        className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex p-4">
          <img
            src={book.image}
            alt={`${book.title} cover`}
            className="w-16 h-24 object-cover rounded"
          />
          <div className="ml-4">
            <h3 className="font-medium text-gray-900">{book.title}</h3>
            <p className="text-sm text-gray-500">{book.author}</p>
          </div>
        </div>
        
        <div
          className={`absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex items-center justify-center space-x-2 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}
        >
          <button
            onClick={() => onMove('currently_reading')}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110"
            title="Move to Currently Reading"
          >
            <ClockIcon className="w-5 h-5 text-teal-500" />
          </button>
          <button
            onClick={() => onMove('read_books')}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110"
            title="Move to Read Books"
          >
            <BookOpenIcon className="w-5 h-5 text-teal-500" />
          </button>
          <button
            onClick={() => onMove('wishlist_books')}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110"
            title="Move to Wishlist"
          >
            <HeartIcon className="w-5 h-5 text-teal-500" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110"
            title="Remove"
          >
            <PencilIcon className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={onRemove}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110"
            title="Remove"
          >
            <TrashIcon className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
    );
  };

export default BookCard;