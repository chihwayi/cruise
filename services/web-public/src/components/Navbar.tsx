'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import { Menu, X, Ship, User, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Ship className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">CruiseRecruit</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/jobs" className="text-gray-700 hover:text-primary-600 transition-colors">
              Browse Jobs
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/candidate/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              href="/jobs"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Jobs
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/candidate/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 bg-primary-600 text-white rounded-md text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

