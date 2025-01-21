import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeftStartOnRectangleIcon, UserCircleIcon } from "@heroicons/react/20/solid";

const ProfileDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { signOut } = useAuth();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
      setConfirmLogout(false); // Reset confirmLogout when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    if (confirmLogout) {
      signOut();
    } else {
      setConfirmLogout(true);
      // Wait 5 seconds before setting it false as a timeout
      setTimeout(() => {
        setConfirmLogout(false);
      }, 3000);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
        onClick={toggleDropdown}
      >
        <span className="sr-only">Toggle dashboard menu</span>
        <UserCircleIcon className="w-10 h-10 text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 z-10 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg transition-all duration-200 ease-in-out transform ${
          dropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{ backdropFilter: "blur(10px)" }}
      >
        <div className="p-2">
          <Link
            to="/profile"
            onClick={toggleDropdown}
            className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            My profile
          </Link>
          <Link
            to="/settings"
            onClick={toggleDropdown}
            className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            Settings
          </Link>
        </div>
        <div className="p-2">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
          >
            <div className="w-4 h-4">
              <ArrowLeftStartOnRectangleIcon />
            </div>
            {confirmLogout ? "Are you sure?" : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
