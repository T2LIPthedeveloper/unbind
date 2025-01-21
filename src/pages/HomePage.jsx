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
        "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781949846386/the-great-gatsby-large-print-9781949846386_hr.jpg",
      author: "F. Scott Fitzgerald",
      year_published: 1925,
      link: "/books/OL468431W",
    },
    {
      title: "To Kill a Mockingbird",
      image: "https://i5.walmartimages.com/asr/7ce3c127-b99d-4f7f-a560-f22e1f12f13d.faacd1fa3174923ea5756f03b0b5890e.jpeg",
      author: "Harper Lee",
      year_published: 1960,
      link: "/books/OL3140822W",
    },
    {
      title: "1984",
      image: "https://d30a6s96kk7rhm.cloudfront.net/original/readings/978/014/103/9780141036144.jpg",
      author: "George Orwell",
      year_published: 1949,
      link: "/books/OL1168083W",
    },
    {
      title: "Pride and Prejudice",
      image: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781524861759/pride-and-prejudice-9781524861759_hr.jpg",
      author: "Jane Austen",
      year_published: 1813,
      link: "/books/OL66554W",
    },
    {
      title: "The Catcher in the Rye",
      image:
        "https://media.npr.org/assets/bakertaylor/covers/c/catcher-in-the-rye/9780316769488_custom-b6fc2e108f3865eb320720875c20e4f869da8065-s6-c30.jpg",
      author: "J.D. Salinger",
      year_published: 1951,
      link: "/books/OL3335245W",
    },
    {
      title: "The Hobbit",
      image: "https://i1.wp.com/voicesfilm.com/wp-content/uploads/2014/01/TheHobbit_TDOS_Bilbo_DOM_RGB_1600x2333.jpg?resize=1600%2C2333",
      author: "J.R.R. Tolkien",
      year_published: 1937,
      link: "/books/OL27482W",
    },
    {
      title: "Moby Dick",
      image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/439fe97a-7418-4646-9530-2e1fd050a2c2/d6rt002-02b7a101-d072-4ae0-82c3-6b047094475c.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi80MzlmZTk3YS03NDE4LTQ2NDYtOTUzMC0yZTFmZDA1MGEyYzIvZDZydDAwMi0wMmI3YTEwMS1kMDcyLTRhZTAtODJjMy02YjA0NzA5NDQ3NWMuanBnIn1dXX0.a5wahsR8sf9W-VQ0PnnzLgmZRExD-yNHhfQGp0cMvh0",
      author: "Herman Melville",
      year_published: 1851,
      link: "/books/OL102749W",
    },
    {
      title: "War and Peace",
      image:
        "https://images-na.ssl-images-amazon.com/images/I/A1aDb5U5myL.jpg",
      author: "Leo Tolstoy",
      year_published: 1869,
      link: "/books/OL267171W",
    },
    {
      title: "The Odyssey",
      image: "https://cdn.shopify.com/s/files/1/0154/4706/4624/products/canon-classics-books-the-odyssey-worldview-edition-28066900279344.jpg?v=1616168314",
      author: "Homer",
      year_published: -800,
      link: "books/OL61982W",
    },
    {
      title: "Crime and Punishment",
      image: "https://wordsworth-editions.com/wp-content/uploads/2023/07/Crime-and-Punishment-Front-Cover-1.jpg",
      author: "Fyodor Dostoevsky",
      year_published: 1866,
      link: "books/OL166894W",
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
