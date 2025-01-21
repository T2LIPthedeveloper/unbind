import React from "react";
import { useAuth } from "../context/AuthContext";
import CTA from "../components/shared/CTA";
import ItemCarousel from "../components/shared/ItemCarousel";
import BookTile from "../components/books/BookTile";
import { useTrendingBooks } from "../lib/hooks/bookHooks";

const HomePage = () => {
  const { user } = useAuth();
  return <>{user ? <UserHome /> : <MarketingHome />}</>;
};

export default HomePage;

const UserHome = () => {
  const { user, useBookLists } = useAuth();
  const {
    data: trendingBooksDaily,
    isLoading: loadingDaily,
    error: errorDaily,
  } = useTrendingBooks("daily");
  if (!trendingBooksDaily) {
    console.log("trendingBooksDaily is null");
  }
  const {
    data: trendingBooksWeekly,
    isLoading: loadingWeekly,
    error: errorWeekly,
  } = useTrendingBooks("weekly");
  if (!trendingBooksWeekly) {
    console.log("trendingBooksWeekly is null");
  }

  const {
    data,
    read_count,
    reading_count,
    wishlist_count,
  } = useBookLists();

  let reading_books = data?.reading_books || [];

  if (reading_books.length === 0) {
    // add a placeholder book to reading_books without affecting read_count
    reading_books = [
      {
        title: "No books currently being read",
        image: "https://placehold.co/1000x1000?text=No+books+currently+being+read",
        author: "Go read something!",
        year_published: "2025",
        link: "/books/OL244537W",
      },
    ];
  }

  const books = [
    {
      title: "The Great Gatsby",
      image:
        "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg",
      author: "F. Scott Fitzgerald",
      year_published: 1925,
      link: "/books/the-great-gatsby",
    },
    {
      title: "To Kill a Mockingbird",
      image: "https://images.pexels.com/photos/904616/pexels-photo-904616.jpeg",
      author: "Harper Lee",
      year_published: 1960,
      link: "/books/to-kill-a-mockingbird",
    },
    {
      title: "1984",
      image: "https://images.pexels.com/photos/955193/pexels-photo-955193.jpeg",
      author: "George Orwell",
      year_published: 1949,
      link: "/books/1984",
    },
    {
      title: "Pride and Prejudice",
      image: "https://placehold.co/600x900?text=Pride+and+Prejudice",
      author: "Jane Austen",
      year_published: 1813,
      link: "/books/pride-and-prejudice",
    },
    {
      title: "The Catcher in the Rye",
      image:
        "https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg",
      author: "J.D. Salinger",
      year_published: 1951,
      link: "/books/the-catcher-in-the-rye",
    },
    {
      title: "The Hobbit",
      image: "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg",
      author: "J.R.R. Tolkien",
      year_published: 1937,
      link: "/books/the-hobbit",
    },
    {
      title: "Moby Dick",
      image: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
      author: "Herman Melville",
      year_published: 1851,
      link: "/books/moby-dick",
    },
    {
      title: "War and Peace",
      image:
        "https://images.pexels.com/photos/1053688/pexels-photo-1053688.jpeg",
      author: "Leo Tolstoy",
      year_published: 1869,
      link: "/books/war-and-peace",
    },
    {
      title: "The Odyssey",
      image: "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg",
      author: "Homer",
      year_published: -800,
      link: "books/the-odyssey",
    },
    {
      title: "Crime and Punishment",
      image: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
      author: "Fyodor Dostoevsky",
      year_published: 1866,
      link: "books/crime-and-punishment",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center justify-center w-full bg-white border-double border-t-4 border-b-4 border-teal-500 py-4 my-4">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-serif font-bold text-teal-900 sm:text-4xl">
              Welcome back, {user.user_metadata.first_name}!
            </h2>
            <p className="mt-4 font-serif text-teal-600 sm:text-xl">
              What would you like to do today?
            </p>
          </div>
          <dl className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-3 lg:grid-cols-3">
            <div className="flex flex-col rounded-lg bg-teal-50 px-4 py-8 text-center border-dashed border-teal-500 border-2">
              <dt className="order-last text-lg font-serif font-medium text-teal-500">
                Books Read
              </dt>
              <dd className="text-4xl font-extrabold text-teal-600 md:text-5xl">
                {read_count}
              </dd>
            </div>
            <div className="flex flex-col rounded-lg bg-teal-50 px-4 py-8 text-center border-dashed border-teal-500 border-2">
              <dt className="order-last text-lg font-serif font-medium text-teal-500">
                Current Reads
              </dt>
              <dd className="text-4xl font-extrabold text-teal-600 md:text-5xl">
                {reading_count}
              </dd>
            </div>
            <div className="flex flex-col rounded-lg bg-teal-50 px-4 py-8 text-center border-dashed border-teal-500 border-2">
              <dt className="order-last text-lg font-serif font-medium text-teal-500">
                On your wishlist
              </dt>
              <dd className="text-4xl font-extrabold text-teal-600 md:text-5xl">
                {wishlist_count}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      {/* Add more user-specific content here like stats, fun facts, or maybe even a random quote */}
      {/* Add your current reads (books) carousel here */}
      <div className="flex flex-col items-center justify-center w-full border-double border-t-4 border-b-4 border-teal-500 bg-white py-1 my-2 md:py-2 md:my-4 lg:py-2 lg:my-6 xl:py-2 xl:my-8">
        <ItemCarousel
          cardType={BookTile}
          content={reading_books}
          heading={"Your current reads"}
        />
      </div>

      {/* Add a trending books today carousel here */}
      <div className="flex flex-col items-center justify-center w-full border-double border-t-4 border-b-4 border-teal-500 bg-white py-1 my-2 md:py-2 md:my-4 lg:py-2 lg:my-6 xl:py-2 xl:my-8">
        {loadingDaily ? (
          <ItemCarousel
            cardType={BookTile}
            content={Array(10).fill({
              title: "A Book",
              author: "An Author",
              year_published: 2024,
              image:
                "https://placehold.co/600x900?text=Imagine+there+was+a+book+here",
            })}
            heading={"Trending Books Today"}
          />
        ) : errorDaily ? (
          <p className="error-message">Error: {errorDaily}</p>
        ) : (
          <ItemCarousel
            cardType={BookTile}
            content={trendingBooksDaily}
            heading={"Trending Books Today"}
          />
        )}
      </div>

      {/* Add a book recommendations books carousel here */}
      <div className="flex flex-col items-center justify-center w-full border-double border-t-4 border-b-4 border-teal-500 bg-white py-1 my-2 md:py-2 md:my-4 lg:py-2 lg:my-6 xl:py-2 xl:my-8">
        <ItemCarousel
          cardType={BookTile}
          content={books}
          heading={"We think you'll like"}
        />
      </div>

      {/* Add a trending books today carousel here */}
      <div className="flex flex-col items-center justify-center w-full border-double border-t-4 border-b-4 border-teal-500 bg-white py-1 my-2 md:py-2 md:my-4 lg:py-2 lg:my-6 xl:py-2 xl:my-8">
        {loadingWeekly ? (
          <ItemCarousel
            cardType={BookTile}
            content={Array(10).fill({
              title: "A Book",
              author: "An Author",
              year_published: 2024,
              image:
                "https://placehold.co/600x900?text=Imagine+there+was+a+book+here",
            })}
            heading={"What We Liked This Week"}
          />
        ) : errorWeekly ? (
          <p className="error-message">Error: {errorWeekly}</p>
        ) : (
          <ItemCarousel
            cardType={BookTile}
            content={trendingBooksWeekly}
            heading={"What we liked this week"}
          />
        )}
      </div>
    </div>
  );
};

const MarketingHome = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <CTA
        hasButton={false}
        isLeft={false}
        tagline={"Unleash Your Reading Potential."}
        description={
          "Unbind is your all-in-one reading companion. Track your books, discover new reads, and connect with other book lovers."
        }
        image={
          "https://images.pexels.com/photos/904616/pexels-photo-904616.jpeg"
        }
      />
      <CTA
        hasButton={false}
        isLeft={true}
        tagline={"Never Forget Another Book."}
        description={
          "Easily track your reading progress, build your to-read list, and organize your entire book collection."
        }
        image={
          "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg"
        }
      />
      <CTA
        hasButton={true}
        isLeft={false}
        tagline={"Start Your Reading Journey Now."}
        description={
          "Unbind is completely free. Sign up today and join the community!"
        }
        buttonText={"Join Unbind"}
        image={
          "https://images.pexels.com/photos/955193/pexels-photo-955193.jpeg"
        }
      />
    </div>
  );
};
