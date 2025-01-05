import React from "react";
import { useAuth } from "../context/AuthContext";
import CTA from "../components/shared/CTA";
import ItemCarousel from "../components/shared/ItemCarousel";
import BookTile from "../components/books/BookTile";

const HomePage = () => {
  const { user } = useAuth();
  return (
    <>
      {/* conditionally render component X if user is signed in, else render component Y */}
      {user ? <UserHome /> : <MarketingHome />}
    </>
  );
};

export default HomePage;

const UserHome = () => {

  const books = [
    {
      title: "The Great Gatsby",
      image: "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg",
      author: "F. Scott Fitzgerald",
      year_published: 1925,
    },
    {
      title: "To Kill a Mockingbird",
      image: "https://images.pexels.com/photos/904616/pexels-photo-904616.jpeg",
      author: "Harper Lee",
      year_published: 1960,
    },
    {
      title: "1984",
      image: "https://images.pexels.com/photos/955193/pexels-photo-955193.jpeg",
      author: "George Orwell",
      year_published: 1949,
    },
    {
      title: "Pride and Prejudice",
      image: "https://images.pexels.com/photos/1005324/pexels-photo-1005324.jpeg",
      author: "Jane Austen",
      year_published: 1813,
    },
    {
      title: "The Catcher in the Rye",
      image: "https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg",
      author: "J.D. Salinger",
      year_published: 1951,
    },
    {
      title: "The Hobbit",
      image: "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg",
      author: "J.R.R. Tolkien",
      year_published: 1937,
    },
    {
      title: "Moby Dick",
      image: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
      author: "Herman Melville",
      year_published: 1851,
    },
    {
      title: "War and Peace",
      image: "https://images.pexels.com/photos/1053688/pexels-photo-1053688.jpeg",
      author: "Leo Tolstoy",
      year_published: 1869,
    },
    {
      title: "The Odyssey",
      image: "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg",
      author: "Homer",
      year_published: -800,
    },
    {
      title: "Crime and Punishment",
      image: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
      author: "Fyodor Dostoevsky",
      year_published: 1866,
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center justify-center w-full bg-white border-double border-t-4 border-b-4 border-teal-500 py-4 my-4">
      <h1 className="text-4xl font-serif text-gray-900">Welcome back, User!</h1>
        <div className="flex flex-row justify-around w-full mt-4">
          <div className="flex flex-col items-center">
        <span className="text-xl font-serif font-bold text-gray-900">Books Read</span>
        <span className="text-xl text-gray-700">42</span>
          </div>
          <div className="flex flex-col items-center">
        <span className="text-xl font-serif font-bold text-gray-900">Books in Progress</span>
        <span className="text-xl text-gray-700">5</span>
          </div>
          <div className="flex flex-col items-center">
        <span className="text-xl font-serif font-bold text-gray-900">Books in Wishlist</span>
        <span className="text-xl text-gray-700">18</span>
          </div>
        </div>
      </div>
      {/* Add more user-specific content here like stats, fun facts, or maybe even a random quote */}
      {/* Add your current reads (books) carousel here */}
      <div className="flex flex-col items-center justify-center w-full border-double border-t-4 border-b-4 border-teal-500 bg-white py-1 my-2 md:py-2 md:my-4 lg:py-2 lg:my-6 xl:py-2 xl:my-8">
        <ItemCarousel cardType={BookTile} content={books} heading={"Your current reads"} />
      </div>

      {/* Add a book recommendations books carousel here */}
      <div className="flex flex-col items-center justify-center w-full border-double border-t-4 border-b-4 border-teal-500 bg-white py-1 my-2 md:py-2 md:my-4 lg:py-2 lg:my-6 xl:py-2 xl:my-8">
        <ItemCarousel cardType={BookTile} content={books} heading={"We think you'll like"} />
      </div>

      {/* Add a trending books today carousel here */}
      <div className="flex flex-col items-center justify-center w-full border-double border-t-4 border-b-4 border-teal-500 bg-white py-1 my-2 md:py-2 md:my-4 lg:py-2 lg:my-6 xl:py-2 xl:my-8">
        <ItemCarousel cardType={BookTile} content={books} heading={"Today's trending books"} />
      </div>

      {/* Add a what we loved books carousel here */}
      <div className="flex flex-col items-center justify-center w-full border-double border-t-4 border-b-4 border-teal-500 bg-white py-1 my-2 md:py-2 md:my-4 lg:py-2 lg:my-6 xl:py-2 xl:my-8">
        <ItemCarousel cardType={BookTile} content={books} heading={"What we loved this week"} />
      </div>
    </div>
  );
}

const MarketingHome = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <CTA hasButton={false} isLeft={false} tagline={"Unleash Your Reading Potential."} description={"Unbind is your all-in-one reading companion. Track your books, discover new reads, and connect with other book lovers."} image={"https://images.pexels.com/photos/904616/pexels-photo-904616.jpeg"} />
      <CTA hasButton={false} isLeft={true} tagline={"Never Forget Another Book."} description={"Easily track your reading progress, build your to-read list, and organize your entire book collection."} image={"https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg"}/>
      <CTA hasButton={true} isLeft={false} tagline={"Start Your Reading Journey Now."} description={"Unbind is completely free. Sign up today and join the community!"} buttonText={"Join Unbind"} image={"https://images.pexels.com/photos/955193/pexels-photo-955193.jpeg"} />
    </div>
  );
};
