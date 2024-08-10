"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="py-6">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        >
          E-Shop
        </Link>
        <form onSubmit={handleSearch} className="flex-grow max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-purple-500 focus:outline-none focus:border-pink-500 bg-gray-800 text-white placeholder-gray-400"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-purple-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </form>
        <div className="flex items-center space-x-6">
          <Link
            href="/cart"
            className="text-white hover:text-pink-400 transition duration-300"
          >
            <ShoppingCartIcon className="h-6 w-6" />
          </Link>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="text-white hover:text-pink-400 transition duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <UserIcon className="h-6 w-6" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-600 hover:text-white transition duration-300"
                  >
                    Profile
                  </Link>
                  {user.is_admin && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-600 hover:text-white transition duration-300"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-600 hover:text-white transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-white hover:text-pink-400 transition duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
