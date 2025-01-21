import React from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { fetchSearchBooks } from '../../lib/api/openLibrary';

const BookTile = ({ title, image, author, year_published, link, book_title, book_author, cover_image, date_added, book_code }) => {
  const queryClient = useQueryClient();

  if (book_title) {
    title = book_title;
  }
  if (cover_image) {
    image = cover_image;
  }
  if (book_author) {
    author = book_author;
  }
  if (date_added) {
    year_published = new Date(date_added).getFullYear();
  }
  if (book_code) {
    link = `/book/${book_code}`;
  }

  const prefetchLink = () => {
    queryClient.prefetchQuery(['searchBooks', link], () =>
      fetchSearchBooks(link)
    );
  };

  return (
    <Link
      to={link}
      className="group flex flex-col h-full w-full max-w-48 max-h-72 bg-white border-solid border-2 border-teal-500 rounded-3xl overflow-hidden"
      onMouseEnter={prefetchLink}
    >
      <img
        src={image}
        alt={title}
        className="h-2/3 w-full object-cover opacity-75 max-h-48 transition-all duration-300 ease-in-out group-hover:h-1/5 group-hover:opacity-50 group-hover:blur-sm"
        style={{
          objectFit: 'cover',
        }}
      />
      <div className="flex w-full flex-col justify-between p-1 sm:p-2 lg:p-2 xl:p-4 h-1/3 group-hover:h-4/5 transition-all duration-500 ease-in-out">
        <p className="text-md font-serif text-black md:text-lg lg:text-lg xl:text-2xl">{title.length > 60? title.substring(0,50) + "..." : title}</p>
        <div className="mt-4 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
          <p className="text-sm font-medium italic tracking-wider text-teal-600">{author}</p>
          <p className="text-sm text-teal-600">{year_published}</p>
        </div>
      </div>
    </Link>
  );
};

export default BookTile;
