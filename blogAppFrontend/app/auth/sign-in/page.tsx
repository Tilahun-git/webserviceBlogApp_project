'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, CheckCircle, Eye, EyeOff, Key, LogIn, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { signInUser, loadToken } from '@/redux/auth/authSlice';
import { toast, Toaster } from 'react-hot-toast';

type FormDataType = {
  username: string;
  password: string;
};

export default function SignInPage() {
  const [formData, setFormData] = useState<FormDataType>({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<FormDataType>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Show error toast when Redux error occurs
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: 'top-right',
        icon: '❌',
        style: {
          background: '#fee',
          color: '#c53030',
          border: '1px solid #fed7d7',
        },
      });
    }
  }, [error]);

  useEffect(() => {
  dispatch(loadToken());
}, [dispatch]);

useEffect(() => {
  if (error) {
    toast.error(error);
  }
}, [error]);

useEffect(() => {
  if (isAuthenticated) {
    toast.success('Successfully signed in!');
    router.replace('/dashboard');
  }
}, [isAuthenticated, router]);



  // Show success toast on successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Successfully signed in! Redirecting...', {
        duration: 2000,
        position: 'top-right',
        icon: '🎉',
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        },
      });
    }
  }, [isAuthenticated]);

  const validateForm = (): boolean => {
    const errors: Partial<FormDataType> = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[id as keyof FormDataType]) {
      setFormErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);
  await dispatch(signInUser(formData));
  setIsSubmitting(false);
};

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   if (!validateForm()) {
  //     toast.error('Please fill in all required fields correctly', {
  //       position: 'top-right',
  //       icon: '⚠️',
  //     });
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   try {
  //     const resultAction = await dispatch(signInUser(formData));

  //     if (signInUser.fulfilled.match(resultAction)) {
  //       toast.success('Welcome back! Redirecting to dashboard...', {
  //         duration: 2000,
  //         position: 'top-right',
  //         icon: '👋',
  //         style: {
  //           background: '#f0fdf4',
  //           color: '#166534',
  //           border: '1px solid #bbf7d0',
  //         },
  //       });

  //       // Small delay to show success message before redirecting
  //       setTimeout(() => {
  //         router.push('/dashboard');
  //       }, 1500);
  //     } else if (signInUser.rejected.match(resultAction)) {
  //       // Error is already handled by Redux and shown via toast in useEffect
  //       console.error('Login failed:', resultAction.payload);
  //     }
  //   } catch (err) {
  //     toast.error('An unexpected error occurred. Please try again.', {
  //       position: 'top-right',
  //       icon: '❌',
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleBlur = (field: keyof FormDataType) => {
    if (!formData[field] && !formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
      }));
    }
  };

  // Demo credentials for easier testing
  const fillDemoCredentials = () => {
    setFormData({
      username: 'demo_user',
      password: 'Demo@123',
    });
    toast.success('Demo credentials filled!', {
      position: 'top-right',
      duration: 2000,
      icon: '👤',
    });
  };

  return (
    <>
      <Toaster
  position="top-right"
  reverseOrder={false}
  gutter={8}
  containerClassName="mt-20"
  toastOptions={{
    // Default options for all toasts
    duration: 4000,
    style: {
      background: "#363636",
      color: "#fff",
    },
    // Success toast overrides
    success: {
      duration: 3000,
      style: {
        background: "green",
        color: "white",
      },
    },
    // Error toast overrides
    error: {
      duration: 4000,
      style: {
        background: "red",
        color: "white",
      },
    },
  }}
/>


      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center px-4 py-12">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative w-full max-w-6xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row min-h-[700px]">
            {/* Left side - Visual & Info */}
            <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <LogIn className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold">BlogSphere</h1>
                  </div>

                  <h2 className="text-4xl font-bold mb-6 mt-12">
                    Welcome Back to
                    <span className="block text-blue-100">Your Writing Space</span>
                  </h2>
                  <p className="text-lg text-blue-100 mb-8 max-w-md">
                    Continue your writing journey, engage with your readers, and manage your articles in your personalized dashboard.
                  </p>

                  <div className="space-y-6 mb-12">
                    {[
                      { icon: '📊', text: 'Track your article performance' },
                      { icon: '💌', text: 'Manage comments and interactions' },
                      { icon: '⚡', text: 'Quick access to your drafts' },
                      { icon: '📈', text: 'Monitor your reader growth' },
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-xl">{feature.icon}</span>
                        </div>
                        <span className="text-lg">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <p className="text-lg mb-3">New to BlogSphere?</p>
                  <Link href="/auth/sign-up">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-white text-white hover:bg-white/20 hover:text-white transition-all group"
                    >
                      Create Your Writer Account
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Floating shapes */}
              <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm"></div>
              <div className="absolute bottom-24 left-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"></div>
            </div>

            {/* Right side - Sign In Form */}
            <div className="lg:w-1/2 p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-10">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-2xl">
                      <LogIn className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Sign In
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter your credentials to access your account
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Username field */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-700 dark:text-gray-300 font-medium">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="username"
                        className={`pl-12 py-6 rounded-xl text-lg ${formErrors.username ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={() => handleBlur('username')}
                      />
                    </div>
                    {formErrors.username && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.username}
                      </p>
                    )}
                  </div>

                  {/* Password field */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                        Password
                      </Label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className={`pl-12 pr-12 py-6 rounded-xl text-lg ${formErrors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember me checkbox */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="remember"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
                        Remember me
                      </Label>
                    </div>
                  </div>

                  {/* Demo credentials button */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={fillDemoCredentials}
                      className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Try demo credentials
                    </button>
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group"
                  >
                    {loading || isSubmitting ? (
                      <>
                        <Spinner className="w-5 h-5 mr-3" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  {/* Social login options */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="py-4 rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="py-4 rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </Button>
                  </div>
                </form>

                {/* Sign up link for mobile */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 lg:hidden">
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/sign-up" className="text-blue-600 hover:text-blue-500 font-semibold">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS for blob animation */}
        <style jsx>{`
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
    </>
  );
}