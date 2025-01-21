import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon, BookOpenIcon, HeartIcon, TrashIcon, PencilIcon, XMarkIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const BookCard = ({ book, list }) => {
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [targetList, setTargetList] = useState(null);
  const [bookDetails, setBookDetails] = useState({
    bookType: book.book_type || 'physical',
    startDate: book.start_date || '',
    endDate: book.end_date || '',
    note: book.note || '',
  });

  const navigate = useNavigate();
  const { moveBookToList, deleteBookFromList, updateBookInList } = useAuth();
  const queryClient = useQueryClient();

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on actions or menu
    if (e.target.closest('.actions-container') || e.target.closest('.menu-button')) {
      return;
    }
    navigate(`/books/${book.book_code}`);
  };

  const handleMoveInitiate = (newTargetList) => {
    if (newTargetList === list || isLoading) return;
    setTargetList(newTargetList);
    setModalMode('move');
    setShowModal(true);
  };

  const handleEditInitiate = () => {
    setModalMode('edit');
    setBookDetails({
      bookType: book.book_type || 'physical',
      startDate: book.start_date || '',
      endDate: book.end_date || '',
      note: book.note || '',
    });
    setShowModal(true);
  };

  const handleMove = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      const updates = {
        book_type: bookDetails.bookType,
        note: bookDetails.note,
      };

      if (targetList === 'currently_reading') {
        updates.start_date = bookDetails.startDate || new Date().toISOString().split('T')[0];
      } else if (targetList === 'read_books') {
        updates.start_date = bookDetails.startDate || book.start_date || new Date().toISOString().split('T')[0];
        updates.end_date = bookDetails.endDate || new Date().toISOString().split('T')[0];
      }

      await moveBookToList(book.id, list, targetList);
      queryClient.invalidateQueries(['bookLists']);
      setShowModal(false);
    } catch (error) {
      console.error('Error moving book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      
      const updates = {
        note: bookDetails.note,
      };

      if (list === 'currently_reading' || list === 'read_books') {
        updates.book_type = bookDetails.bookType;
      }

      if (list === 'currently_reading' || list === 'read_books') {
        if (bookDetails.startDate) {
          updates.start_date = bookDetails.startDate;
        }
      }

      if (list === 'read_books') {
        if (bookDetails.endDate) {
          updates.end_date = bookDetails.endDate;
        }
      }

      await updateBookInList(list, book.book_code, updates);
      queryClient.invalidateQueries(['bookLists']);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await deleteBookFromList(list, book.book_code);
      queryClient.invalidateQueries(['bookLists']);
    } catch (error) {
      console.error('Error removing book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCardContent = () => (
    <div
      onClick={handleCardClick}
      className={`relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
    >
      <div className="flex p-4">
        <img
          src={book.cover_image || '/api/placeholder/64/96'}
          alt={`${book.book_title} cover`}
          className="w-16 h-24 object-cover rounded"
        />
        <div className="ml-4 flex-grow">
          <h3 className="font-medium text-gray-900 line-clamp-2">{book.book_title}</h3>
          <p className="text-sm text-gray-500">{book.book_author}</p>
          {book.book_type && (
            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
              {book.book_type}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className="menu-button p-1 rounded-full hover:bg-gray-100"
        >
          <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div
        className={`actions-container absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex items-center justify-center space-x-2 transition-opacity duration-200 ${
          showActions && !isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} onClick={showActions ? () => setShowActions(false) : null}
      >
        {list !== 'currently_reading' && (
          <button
            onClick={() => handleMoveInitiate('currently_reading')}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110"
            title="Move to Currently Reading"
            disabled={isLoading}
          >
            <ClockIcon className="w-5 h-5 text-teal-500" />
          </button>
        )}
        
        {list !== 'read_books' && (
          <button
            onClick={() => handleMoveInitiate('read_books')}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110"
            title="Move to Read Books"
            disabled={isLoading}
          >
            <BookOpenIcon className="w-5 h-5 text-teal-500" />
          </button>
        )}
        
        {list !== 'wishlist_books' && (
          <button
            onClick={() => handleMoveInitiate('wishlist_books')}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110"
            title="Move to Wishlist"
            disabled={isLoading}
          >
            <HeartIcon className="w-5 h-5 text-teal-500" />
          </button>
        )}

        <button
          onClick={handleEditInitiate}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110"
          title="Edit"
          disabled={isLoading}
        >
          <PencilIcon className="w-5 h-5 text-teal-500" />
        </button>

        <button
          onClick={handleRemove}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110"
          title="Remove"
          disabled={isLoading}
        >
          <TrashIcon className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );

  const renderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {modalMode === 'move' 
              ? `Move to ${targetList.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`
              : `Edit ${book.book_title}`}
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={modalMode === 'move' ? handleMove : handleEdit} className="space-y-4">
          {(modalMode === 'edit' ? (list === 'currently_reading' || list === 'read_books') 
            : (targetList === 'currently_reading' || targetList === 'read_books')) && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Book Type
              </label>
              <select
                value={bookDetails.bookType}
                onChange={(e) => setBookDetails({...bookDetails, bookType: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              >
                <option value="physical">Physical Book</option>
                <option value="ebook">E-Book</option>
                <option value="audiobook">Audiobook</option>
              </select>
            </div>
          )}

          {(modalMode === 'edit' ? (list === 'currently_reading' || list === 'read_books') 
            : (targetList === 'currently_reading' || targetList === 'read_books')) && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={bookDetails.startDate}
                onChange={(e) => setBookDetails({...bookDetails, startDate: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          )}

          {(modalMode === 'edit' ? list === 'read_books' : targetList === 'read_books') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={bookDetails.endDate}
                onChange={(e) => setBookDetails({...bookDetails, endDate: e.target.value})}
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
              onChange={(e) => setBookDetails({...bookDetails, note: e.target.value})}
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
              {modalMode === 'move' ? 'Move Book' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {renderCardContent()}
      {showModal && renderModal()}
    </>
  );
};

export default BookCard;