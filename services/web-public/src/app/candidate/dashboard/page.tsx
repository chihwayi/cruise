'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CandidateDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // Redirect to candidate portal with token
    if (token) {
      window.location.href = `http://localhost:4002/dashboard?token=${encodeURIComponent(token)}`;
    } else {
      // No token, redirect to login
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

