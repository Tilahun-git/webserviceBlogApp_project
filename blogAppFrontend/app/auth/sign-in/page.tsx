'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import Cookies from "js-cookie";

import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInUser } from '@/redux/auth/authSlice';
import type { RootState, AppDispatch } from '@/redux/store';
import { toast } from 'sonner';
import { openSSLCertificatePage } from '@/lib/api';

type FormDataType = {
  username: string;
  password: string;
};

export default function SignInPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState<FormDataType>({
    username: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password } = formData;

    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await dispatch(signInUser({ username, password}));

    if (signInUser.fulfilled.match(result)) {
          const role: string = result.payload?.roleName ??null;

//           if (role) {
//   Cookies.set("authToken", result.payload.token, { expires: 1 }); // 1 day
//   Cookies.set("userRole", role, { expires: 1 }); // "ADMIN" or "USER"
// }
    // Redirect based on role
    if (role.match("ADMIN")) {
      toast.success('Admin Login successful');
      setFormData({ username: '', password: '' });
      router.push("/admin");
    } else if (role.match("USER")) {
      toast.success('User Login successful');
      setFormData({ username: '', password: '' });
      router.push("/dashboard");
    } else {
      toast.error("Unauthorized role");
    }
 // clear form
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-20">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">

        {/* LEFT */}
        <div className="hidden md:flex flex-1 bg-linear-to-br from-indigo-900 via-indigo-700 to-gray-900 items-center justify-center text-white p-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
            <p className="text-sm opacity-90">
              Sign in to access your dashboard and start creating amazing content.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Sign In
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="username">Username:</Label>
              <Input
                id="username"
                placeholder='Enter your username'
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password:</Label>
              <Input
                id="password"
                type="password"
                placeholder='Enter your password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-sm mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200 rounded-lg">
              <div className="flex flex-col gap-2">
                <span>{error}</span>
                {error.includes('SSL Certificate Error') && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openSSLCertificatePage}
                    className="self-start"
                  >
                    🔒 Fix SSL Certificate
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}