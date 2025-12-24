// 'use client';
//
// import { Alert } from '@/components/ui/alert';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Spinner } from '@/components/ui/spinner';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, AppDispatch } from '@/redux/store';
// import { signInUser, loadToken } from '@/redux/auth/authSlice';
//
// type FormDataType = {
//   email: string;
//   password: string;
// };
//
// export default function SignInPage() {
//   const [formData, setFormData] = useState<FormDataType>({
//     email: '',
//     password: '',
//   });
//
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//
//   const { loading, error, isAuthenticated } = useSelector(
//     (state: RootState) => state.auth
//   );
//
//   // Load token if present
//   useEffect(() => {
//     dispatch(loadToken());
//   }, [dispatch]);
//
//   // Redirect if logged in
//   useEffect(() => {
//     if (isAuthenticated) router.push('/');
//   }, [isAuthenticated, router]);
//
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };
//
//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) return;
//
//     dispatch(signInUser(formData));
//   };
//
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-20">
//       <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-12">
//
//         <div className="hidden md:flex flex-1 bg-linear-to-br from-indigo-800 via-white-700 to-gray-500 items-center justify-center text-white p-10">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
//             <p className="text-sm">
//               Sign in to continue and access your dashboard, manage your profile, and enjoy personalized content.
//             </p>
//           </div>
//         </div>
//
//
//         <div className="flex-1 p-8">
//           <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center md:text-left">
//             Sign In
//           </h2>
//
//           <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//             <div className="grid gap-2">
//               <Label htmlFor="email">Email:</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="name@example.com"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//
//             <div className="grid gap-2">
//               <Label htmlFor="password">Password:</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="********"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//
//             <Button type="submit" disabled={loading} className="mt-2 w-full">
//               {loading ? (
//                 <>
//                   <Spinner />
//                   <span className="pl-3">Loading...</span>
//                 </>
//               ) : (
//                 'Sign In'
//               )}
//             </Button>
//           </form>
//
//           <div className="text-center text-sm mt-4">
//             <span>Don&apos;t have an account? </span>
//             <Link
//               href="/auth/sign-up"
//               className="text-blue-500 font-medium hover:underline"
//             >
//               Sign Up
//             </Link>
//           </div>
//
//           {error && (
//             <Alert className="mt-4" color="failure">
//               {error}
//             </Alert>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { signInUser, loadToken } from '@/redux/auth/authSlice';

type FormDataType = {
  username: string; // must match backend LoginRequestDto
  password: string;
};

export default function SignInPage() {
  const [formData, setFormData] = useState<FormDataType>({
    username: '',
    password: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error, isAuthenticated } = useSelector(
      (state: RootState) => state.auth
  );

  // Load token if present
  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  // Redirect if logged in
  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    // Dispatch async thunk
    const resultAction = await dispatch(signInUser(formData));

    // Optionally handle rejected login immediately
    if (signInUser.rejected.match(resultAction)) {
      console.error('Login failed:', resultAction.payload);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-20">
        <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-12">

          {/* LEFT INFO SECTION */}
          <div className="hidden md:flex flex-1 bg-linear-to-br from-indigo-800 via-white-700 to-gray-500 items-center justify-center text-white p-10">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-sm">
                Sign in to continue and access your dashboard, manage your profile, and enjoy personalized content.
              </p>
            </div>
          </div>

          {/* RIGHT FORM SECTION */}
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center md:text-left">
              Sign In
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="username">Username:</Label>
                <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
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
                    'Sign In'
                )}
              </Button>
            </form>

            <div className="text-center text-sm mt-4">
              <span>Don&apos;t have an account? </span>
              <Link
                  href="/auth/sign-up"
                  className="text-blue-500 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </div>

            {error && (
                <Alert className="mt-4" color="failure">
                  {error}
                </Alert>
            )}
          </div>
        </div>
      </div>
  );
}
