import React from "react";
import { useAuth } from "../context/AuthContext";
import CTA from "../components/shared/CTA";

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
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-4xl font-bold text-gray-900">Welcome back, User!</h1>
      {/* Add more user-specific content here like stats, fun facts, or maybe even a random quote */}

      {/* Add a your current reads (books) carousel here */}
      <div></div>

      {/* Add a book recommmendations books carousel here */}
      <div></div>

      {/* Add a trending books this week carousel here */}
      <div></div>

      {/* Add a what we loved books carousel here */}
      <div></div>
      
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
