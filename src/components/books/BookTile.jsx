import React from 'react';
import { Link } from 'react-router-dom';

const BookTile = ({ title, image, author, year_published }) => {
  return (
    <Link
      to="#"
      className="group flex flex-col h-full bg-white border-solid border-2 border-teal-500 rounded-3xl overflow-hidden"
    >
      <img
        src={image}
        alt={title}
        className="h-2/3 w-full object-cover opacity-75 transition-all group-hover:h-1/2 group-hover:opacity-50"
      />
      <div className="flex flex-col justify-between p-1 sm:p-2 lg:p-2 xl:p-4 h-1/3 group-hover:h-1/2 transition-all">
        <p className="text-md font-serif text-black md:text-lg lg:text-lg xl:text-2xl">{title}</p>
        <div className="mt-4 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="text-sm font-medium italic tracking-wider text-teal-600">{author}</p>
          <p className="text-sm text-teal-600">{year_published}</p>
        </div>
      </div>
    </Link>
  );
};

export default BookTile;
