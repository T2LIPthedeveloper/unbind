import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Search from "./Search"; // Make sure the Search component is correctly imported

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setIsSignUp } = useAuth(); 

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const { user, signOut } = useAuth();

  // get the current user auth state and update the dropdown menu
  useEffect(() => {
    if (!user) {
      setDropdownOpen(false);
    }
    else if (user) {
      setDropdownOpen(true);
    }
    else {
      setDropdownOpen(false);
    }
  }, [user]);

  return (
    <header className="bg-white">
      <div className="max-w px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link className="text-teal-600 flex items-center" to="/home">
              <span className="sr-only">Home</span>
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              <div className="ml-2 text-lg lg:text-2xl xl:text-3xl sm:text-lg md:text-xl font-serif font-bold">
                Unbind
              </div>
            </Link>
          </div>

          {/* Search Section */}
          <div className="flex-1 px-4 sm:px-6">
            <Search /> {/* Include the Search component */}
          </div>

          {/* Navigation and Profile Section */}
          <div className="flex items-center space-x-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 text-sm">
              <Link
                to="/search"
                className="text-gray-500 transition hover:text-gray-500/75"
              >
                Advanced Search
              </Link>
              <Link
                to="/about"
                className="text-gray-500 transition hover:text-gray-500/75"
              >
                About
              </Link>
              <Link
                to="/blog"
                className="text-gray-500 transition hover:text-gray-500/75"
              >
                Blog
              </Link>
            </nav>

            {user ? (
              <>
                {/* Profile Button (Desktop Only) */}
                <div className="relative hidden md:block">
                  <button
                    type="button"
                    className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
                    onClick={toggleDropdown}
                  >
                    <span className="sr-only">Toggle dashboard menu</span>
                    {/* Placeholder for Profile Image */}
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute right-0 z-10 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg ${
                      dropdownOpen ? "block" : "hidden"
                    }`}
                  >
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      >
                        My profile
                      </Link>
                      <Link
                        to="/lists"
                        className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      >
                        My lists
                      </Link>
                      <Link
                        to="/reviews"
                        className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      >
                        My reviews
                      </Link>
                    </div>
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={signOut}
                        className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        {/* Placeholder for Logout Icon */}
                        <div className="w-4 h-4 bg-gray-300"></div>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  onClick={() => setIsSignUp(false)}
                  className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                >
                  Log In
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsSignUp(true)}
                  className="px-4 py-2 text-sm text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 transition hover:text-gray-600/75"
            >
              {/* Placeholder for Mobile Menu Icon */}
              <div className="h-5 w-5 bg-gray-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <nav className="flex flex-col items-center space-y-4 bg-white px-4 py-6">
          <Link
            to="/search"
            className="text-gray-500 transition hover:text-gray-500/75"
          >
            Advanced Search
          </Link>
          <Link
            to="/about"
            className="text-gray-500 transition hover:text-gray-500/75"
          >
            About
          </Link>
          <Link
            to="/blog"
            className="text-gray-500 transition hover:text-gray-500/75"
          >
            Blog
          </Link>
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-gray-500 transition hover:text-gray-500/75"
              >
                My profile
              </Link>
              <Link
                to="/lists"
                className="text-gray-500 transition hover:text-gray-500/75"
              >
                My lists
              </Link>
              <Link
                to="/reviews"
                className="text-gray-500 transition hover:text-gray-500/75"
              >
                My reviews
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Link
                to="/login"
                onClick={() => setIsSignUp(false)}
                className="w-full px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 text-center"
              >
                Log In
              </Link>
              <Link
                to="/login"
                onClick={() => setIsSignUp(true)}
                className="w-full px-4 py-2 text-sm text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
