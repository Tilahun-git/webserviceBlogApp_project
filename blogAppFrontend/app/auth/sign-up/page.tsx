"use client";

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '@/redux/auth/authSlice';
import type { RootState, AppDispatch } from '@/redux/store';
import { openSSLCertificatePage, testSSLConnection } from '@/lib/api';

type FormDataType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState<FormDataType>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password) {
      return;
    }

    const result = await dispatch(signUpUser(formData));

    if (signUpUser.fulfilled.match(result)) {
      router.push('/auth/sign-in');
    }
  };

  const handleTestConnection = async () => {
    const isWorking = await testSSLConnection();
    if (isWorking) {
      alert('✅ SSL Connection is working! You can now register.');
    } else {
      alert('❌ SSL Certificate needs to be accepted. Click "Fix SSL Certificate" button.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 py-20 px-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="hidden md:flex flex-1 bg-linear-to-br from-indigo-900 via-indigo-700 to-gray-900 items-center justify-center text-white p-10 rounded-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Blog App</h1>
            <p className="text-sm">
              Join our community. Sign up to get started with your personalized dashboard
              and enjoy exclusive content.
            </p>
          </div>
        </div>
        
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Create Account 
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className='grid gap-2'>
              <Label htmlFor="firstName">First Name:</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className='grid gap-2'>
              <Label htmlFor="lastName">Last Name:</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className='grid gap-2'>
              <Label htmlFor="username">Username:</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor="email">Email:</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor="password">Password:</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            <span>Already have an account? </span>
            <Link href="/auth/sign-in" className="text-blue-500 font-medium hover:underline">
              Sign In
            </Link>
          </div>

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
