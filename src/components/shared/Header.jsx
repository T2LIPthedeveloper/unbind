import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Search from "./Search";
import ProfileDropdown from "./ProfileDropdown";
import { BookOpenIcon } from "@heroicons/react/20/solid";
import {
  Bars3Icon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/solid";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, setIsSignUp, signOut } = useAuth();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-white sticky z-20 shadow-md">
      <div className="max-w px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link className="text-teal-600 flex items-center" to="/home">
              <span className="sr-only">Home</span>
              <div className="h-8 w-8 p-1 bg-teal-600 rounded-full">
                <BookOpenIcon className="text-white" />
              </div>
              <div className="ml-2 text-lg lg:text-2xl xl:text-3xl sm:text-lg md:text-xl font-serif font-bold">
                Unbind
              </div>
            </Link>
          </div>

          <div className="flex-1 px-4 sm:px-6">
            <Search />
          </div>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6 text-sm">
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
              <div className="hidden md:flex">
                <ProfileDropdown />
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
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

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 transition hover:text-gray-600/75"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <nav className="flex flex-col items-center space-y-4 bg-white px-4 py-6">
          <Link
            to="/about"
            onClick={toggleMobileMenu}
            className="text-gray-500 transition hover:text-gray-500/75"
          >
            About
          </Link>
          <Link
            to="/blog"
            onClick={toggleMobileMenu}
            className="text-gray-500 transition hover:text-gray-500/75"
          >
            Blog
          </Link>
          {user ? (
            <>
              <Link
                to="/profile"
                onClick={toggleMobileMenu}
                className="text-gray-500 transition hover:text-gray-500/75"
              >
                My profile
              </Link>
              <Link
                to="/settings"
                onClick={toggleMobileMenu}
                className="text-gray-500 transition hover:text-gray-500/75"
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center justify-center space-x-2 hover:rounded"
              >
                <ArrowLeftStartOnRectangleIcon className="w-4 h-4" />
                <span>Logout</span>
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
