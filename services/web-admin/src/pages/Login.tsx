import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogIn, Mail, Lock, Ship, Shield, TrendingUp } from 'lucide-react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('admin_token', response.data.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Decorative ship icon */}
      <div className="absolute top-10 left-10 hidden md:block">
        <Ship className="h-16 w-16 text-white/20" />
      </div>
      <div className="absolute bottom-10 right-10 hidden md:block">
        <Shield className="h-16 w-16 text-white/20" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl mb-4 shadow-lg">
            <Ship className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CruiseRecruit</h1>
          <p className="text-blue-100 text-sm font-semibold">Recruiter & Admin Dashboard</p>
        </div>

        <Card className="w-full backdrop-blur-lg bg-white/95 shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Recruiter Dashboard</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Sign in to manage candidates, jobs, and applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="Email Address"
                placeholder="admin@cruiserecruit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock className="h-4 w-4" />}
              />
              <div className="pt-2">
                <Button type="submit" className="w-full text-base py-3 shadow-lg hover:shadow-xl transition-all duration-200" isLoading={isLoading}>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In to Dashboard
                </Button>
              </div>
            </form>

            {/* Features highlight */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <TrendingUp className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Analytics</p>
                </div>
                <div>
                  <Shield className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Secure</p>
                </div>
                <div>
                  <Ship className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Management</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-white/80 text-sm mt-6">
          © {new Date().getFullYear()} CruiseRecruit. All rights reserved.
        </p>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}


