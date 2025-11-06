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
      // Only show logout if user logged in through public portal
      // Check for a flag that indicates public portal login
      const token = localStorage.getItem('token');
      const publicPortalLogin = localStorage.getItem('public_portal_login');
      
      // Only show authenticated state if token exists AND it was set by public portal
      // OR if we're on the same domain (which shouldn't happen, but just in case)
      setIsAuthenticated(!!token && !!publicPortalLogin);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('public_portal_login');
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
                <a 
                  href="http://localhost:4002/dashboard" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={(e) => {
                    // Pass token if available
                    const token = localStorage.getItem('token');
                    if (token) {
                      e.preventDefault();
                      window.location.href = `http://localhost:4002/dashboard?token=${encodeURIComponent(token)}`;
                    }
                  }}
                >
                  Dashboard
                </a>
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
                <a
                  href="http://localhost:4002/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    // Pass token if available
                    const token = localStorage.getItem('token');
                    if (token) {
                      e.preventDefault();
                      window.location.href = `http://localhost:4002/dashboard?token=${encodeURIComponent(token)}`;
                    }
                  }}
                >
                  Dashboard
                </a>
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

