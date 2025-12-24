'use client';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';

type FormDataType = {
  firstname? : string;
  lastname?: string;
  username? : string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormDataType>({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setErrorMessage(data.message || 'Signup failed');
        return;
      }

      setLoading(false);
      router.push('/auth/sign-in');
    } catch (error) {
      setLoading(false);
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 py-20 px-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
         <div className="hidden md:flex flex-1 bg-linear-to-br from-indigo-900 via-white-700 to-gray-900 items-center justify-center text-white p-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Blop App</h1>
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
            <Label htmlFor="firstname">First Name:</Label>
            <Input
              id="firstname"
              type="text"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}/>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor="lastname">Last Name:</Label>
            <Input
              id="lastname"
              type="text"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor="username">Username:</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor="password">Password:</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? (
              <>
                <Spinner />
                <span className="pl-3">Loading...</span>
              </>
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

        {errorMessage && (
          <Alert className="mt-4" color="failure">
            {errorMessage}
          </Alert>
        )}
        </div>
      </div>
    </div>
  );
}
