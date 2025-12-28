'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Toaster, toast } from 'sonner';

/* ======================
   STATIC TEST ACCOUNTS
====================== */
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const USER_USERNAME = 'user';
const USER_PASSWORD = 'user123';

type FormDataType = {
  username: string;
  password: string;
};

export default function SignInPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataType>({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password } = formData;

    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      /* ================= ADMIN LOGIN ================= */
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        document.cookie = 'authToken=dev-admin-token; path=/';
        document.cookie = 'userRole=ADMIN; path=/';

        toast.success('Admin login successful');
        router.push('/admin');
        setLoading(false);
        return;
      }

      /* ================= USER LOGIN ================= */
      if (username === USER_USERNAME && password === USER_PASSWORD) {
        document.cookie = 'authToken=dev-user-token; path=/';
        document.cookie = 'userRole=USER; path=/';

        toast.success('User login successful');
        router.push('/dashboard');
        setLoading(false);
        return;
      }

      /* ================= INVALID ================= */
      toast.error('Invalid username or password');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-20">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">

        {/* LEFT */}
        <div className="hidden md:flex flex-1 bg-linear-to-br from-indigo-900 via-indigo-700 to-gray-900 items-center justify-center text-white p-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
            <p className="text-sm opacity-90">
              Sign in to access your dashboard
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
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
            <Link href="/auth/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </p>

          <div className="mt-6 text-xs text-center text-gray-500">
            <p className="font-semibold">Test Accounts</p>
            <p>User → user / user123</p>
            <p>Admin → admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
