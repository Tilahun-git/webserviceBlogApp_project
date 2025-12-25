// "use client";
//
// import { Alert } from '@/components/ui/alert';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Spinner } from '@/components/ui/spinner';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { ChangeEvent, FormEvent, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { signUpUser } from '@/redux/auth/authSlice';
// import type { RootState, AppDispatch } from '@/redux/store';
//
// type FormDataType = {
//   firstname: string;
//   lastname: string;
//   username: string;
//   email: string;
//   password: string;
// };
//
// export default function SignUpPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//
//   const { loading, error } = useSelector(
//     (state: RootState) => state.auth
//   );
//
//   const [formData, setFormData] = useState<FormDataType>({
//     firstname: '',
//     lastname: '',
//     username: '',
//     email: '',
//     password: '',
//   });
//
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };
//
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//
//     if ( !formData.firstname || !formData.lastname || !formData.username || !formData.email || !formData.password) {
//        alert('Please fill all fields.');
//       return;
//     }
//
//     const result = await dispatch(signUpUser(formData));
// ;
//     if (signUpUser.fulfilled.match(result)) {
//       router.push('/auth/sign-in');
//     }
//   };
//
//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 py-20 px-4">
//       <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
//          <div className="hidden md:flex flex-1 bg-linear-to-br from-indigo-900 via-white-700 to-gray-900 items-center justify-center text-white p-10">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold mb-4">Welcome to Blop App</h1>
//             <p className="text-sm">
//               Join our community. Sign up to get started with your personalized dashboard
//               and enjoy exclusive content.
//             </p>
//           </div>
//         </div>
//         <div className="flex-1 p-8">
//         <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
//           Create Account
//         </h1>
//
//         <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//
//           <div className='grid gap-2'>
//             <Label htmlFor="firstname">First Name:</Label>
//             <Input
//               id="firstname"
//               type="text"
//               placeholder="First Name"
//               value={formData.firstname}
//               onChange={handleChange}/>
//           </div>
//           <div className='grid gap-2'>
//             <Label htmlFor="lastname">Last Name:</Label>
//             <Input
//               id="lastname"
//               type="text"
//               placeholder="Last Name"
//               value={formData.lastname}
//               onChange={handleChange}
//             />
//           </div>
//           <div className='grid gap-2'>
//             <Label htmlFor="username">Username:</Label>
//             <Input
//               id="username"
//               type="text"
//               placeholder="username"
//               value={formData.username}
//               onChange={handleChange}
//             />
//           </div>
//
//           <div className='grid gap-2'>
//             <Label htmlFor="email">Email:</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="name@gmail.com"
//               value={formData.email}
//               onChange={handleChange}
//             />
//           </div>
//
//           <div className='grid gap-2'>
//             <Label htmlFor="password">Password:</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="********"
//               value={formData.password}
//               onChange={handleChange}
//             />
//           </div>
//
//           <Button type="submit" disabled={loading}>
//             {loading ? <Spinner /> : 'Sign Up'}
//           </Button>
//         </form>
//
//         <div className="text-center text-sm mt-4">
//           <span>Already have an account? </span>
//           <Link href="/auth/sign-in" className="text-blue-500 font-medium hover:underline">
//             Sign In
//           </Link>
//         </div>
//
//        {error && <Alert className="mt-4">{error}</Alert>}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { signUpUser } from '@/redux/auth/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// UI Components
import { RootState } from '@/redux/store';
import { signUpUser } from '@/redux/auth/authSlice';
import { SignupData } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';

type FormDataType = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
};
import Link from 'next/link';

export default function SignUpPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const [formData, setFormData] = useState<SignupData>({
    firstname: '',
    lastname: '',
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

    if (!formData.firstname || !formData.lastname || !formData.username || !formData.email || !formData.password) {
      alert('Please fill all fields.');
      return;
    }

    const result = await dispatch(signUpUser(formData));

    if (signUpUser.fulfilled.match(result)) {
    // Validate all fields
    if (!formData.firstname || !formData.lastname || !formData.username || !formData.email || !formData.password) {
      alert('Please fill out all fields.');
      return;
    }

    const resultAction = await dispatch(signUpUser(formData));

    // Navigate to sign-in page on success
    if (signUpUser.fulfilled.match(resultAction)) {
      router.push('/auth/sign-in');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 py-20 px-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="hidden md:flex flex-1 bg-linear-to-br from-indigo-900 via-slate-700 to-gray-900 items-center justify-center text-white p-10">
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
              <Label htmlFor="firstname">First Name:</Label>
              <Input
                id="firstname"
                type="text"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange} />
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

            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : 'Sign Up'}
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            <span>Already have an account? </span>
            <Link href="/auth/sign-in" className="text-blue-500 font-medium hover:underline">
              Sign In
            </Link>
          </div>

          {error && <Alert className="mt-4">{error}</Alert>}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-20">
        <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-12">
          {/* Left info */}
          <div className="hidden md:flex flex-1 bg-linear-to-br from-indigo-800 via-white-700 to-gray-500 items-center justify-center text-white p-10">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome to Blop App!</h1>
              <p className="text-sm">Sign up to create your account and start using the app.</p>
            </div>
          </div>

          {/* Right form */}
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center md:text-left">Create Account</h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {['firstname', 'lastname', 'username', 'email', 'password'].map((field) => (
                  <div className="grid gap-2" key={field}>
                    <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</Label>
                    <Input
                        id={field}
                        type={field === 'password' ? 'password' : 'text'}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={formData[field as keyof SignupData]}
                        onChange={handleChange}
                    />
                  </div>
              ))}

              <Button type="submit" disabled={loading} className="mt-2 w-full">
                {loading ? (
                    <>
                      <Spinner />
                      <span className="pl-3">Loading...</span>
                    </>
                ) : (
                    <span>Sign Up</span>
                )}
              </Button>
            </form>

            <div className="text-center text-sm mt-4">
              <span>Already have an account? </span>
              <Link href="/auth/sign-in" className="text-blue-500 font-medium hover:underline">Sign In</Link>
            </div>

            {error && <Alert className="mt-4" color="failure">{error}</Alert>}
          </div>
        </div>
      </div>
  );
}