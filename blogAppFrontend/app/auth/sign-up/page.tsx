'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { signUpUser } from '@/redux/auth/authSlice';
import { SignupData } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, CheckCircle, UserPlus, Eye, EyeOff, Mail, User, Lock, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

// Define a more specific error type
type FieldErrors = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  terms?: string;
};

export default function SignUpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const [formData, setFormData] = useState<SignupData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof SignupData>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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

  // Real-time field validation
  const validateField = (field: keyof SignupData, value: string): string => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        if (!/^[a-zA-Z\s-']+$/.test(value)) return 'First name can only contain letters, spaces, hyphens, and apostrophes';
        return '';

      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        if (!/^[a-zA-Z\s-']+$/.test(value)) return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
        return '';

      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username cannot exceed 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        if (/^\d/.test(value)) return 'Username cannot start with a number';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        if (value.length > 100) return 'Email is too long';
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        if (value.length > 50) return 'Password is too long';
        return '';

      default:
        return '';
    }
  };

  // Validate all fields at once
  const validateAllFields = (): boolean => {
    const errors: FieldErrors = {};
    
    // Validate each field
    Object.keys(formData).forEach((field) => {
      const error = validateField(field as keyof SignupData, formData[field as keyof SignupData]);
      if (error) {
        errors[field as keyof FieldErrors] = error;
      }
    });

    // Validate terms
    if (!termsAccepted) {
      errors.terms = 'You must accept the terms and conditions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const field = id as keyof SignupData;
    
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(field));
    
    // Real-time validation for touched fields
    if (touchedFields.has(field)) {
      const error = validateField(field, value);
      setFormErrors(prev => ({
        ...prev,
        [field]: error || undefined
      }));
    }
  };

  const handleBlur = (field: keyof SignupData) => {
    setTouchedFields(prev => new Set(prev).add(field));
    const error = validateField(field, formData[field]);
    setFormErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched
    const allFields: (keyof SignupData)[] = ['firstName', 'lastName', 'username', 'email', 'password'];
    allFields.forEach(field => setTouchedFields(prev => new Set(prev).add(field)));

    if (!validateAllFields()) {
      // Show field-specific error toasts
      Object.entries(formErrors).forEach(([field, error]) => {
        if (error && field !== 'terms') {
          toast.error(`${field}: ${error}`, {
            position: 'top-right',
            icon: '⚠️',
            duration: 4000,
          });
        }
      });
      
      if (formErrors.terms) {
        toast.error(formErrors.terms, {
          position: 'top-right',
          icon: '📝',
          duration: 4000,
        });
      }
      
      setIsSubmitting(false);
      return;
    }

    try {
      const resultAction = await dispatch(signUpUser(formData));

      if (signUpUser.fulfilled.match(resultAction)) {
        toast.success('🎉 Account created successfully! Redirecting to sign in...', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
        });

        // Wait a moment to show success message before redirecting
        setTimeout(() => {
          router.push('/auth/sign-in');
        }, 2000);
      }
    } catch (err) {
      toast.error('❌ An unexpected error occurred. Please try again.', {
        position: 'top-right',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if field has error
  const hasError = (field: keyof SignupData): boolean => {
    return touchedFields.has(field) && !!formErrors[field];
  };

  // Check if field is valid
  const isValid = (field: keyof SignupData): boolean => {
    return touchedFields.has(field) && !formErrors[field] && formData[field].length > 0;
  };

  // Get password strength indicator
  const getPasswordStrength = (password: string): { score: number; text: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { text: 'Very Weak', color: 'text-red-500' },
      { text: 'Weak', color: 'text-orange-500' },
      { text: 'Fair', color: 'text-yellow-500' },
      { text: 'Good', color: 'text-blue-500' },
      { text: 'Strong', color: 'text-green-500' },
      { text: 'Very Strong', color: 'text-green-600' },
    ];

    return { score, text: levels[score]?.text || '', color: levels[score]?.color || '' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <Toaster
  position="top-right"
  reverseOrder={false}
  gutter={8}
  containerClassName="mt-20"
  toastOptions={{
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
      borderRadius: '10px',
      padding: '16px',
    },
    success: {
      duration: 3000,
      style: {
        background: '#10b981',
        color: 'white',
      },
    },
    error: {
      duration: 4000,
      style: {
        background: '#ef4444',
        color: 'white',
      },
    },
  }}
/>


      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center px-4 py-12">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative w-full max-w-6xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row min-h-[700px]">
            {/* Left side - Visual & Info */}
            <div className="lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold">BlogSphere</h1>
                  </div>

                  <h2 className="text-4xl font-bold mb-6 mt-12">
                    Join Our Creative
                    <span className="block text-indigo-100">Community</span>
                  </h2>
                  <p className="text-lg text-indigo-100 mb-8 max-w-md">
                    Share your stories, connect with readers, and build your audience on our platform designed for passionate writers.
                  </p>

                  <div className="space-y-6 mb-12">
                    {[
                      { icon: '✍️', text: 'Write and publish your articles' },
                      { icon: '👥', text: 'Connect with like-minded writers' },
                      { icon: '📈', text: 'Grow your audience and influence' },
                      { icon: '💬', text: 'Engage with readers through comments' },
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
                  <p className="text-lg mb-3">Already part of our community?</p>
                  <Link href="/auth/sign-in">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-white text-white hover:bg-white/20 hover:text-white transition-all group"
                    >
                      Sign In to Your Account
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Floating shapes */}
              <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm"></div>
              <div className="absolute bottom-24 left-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"></div>
            </div>

            {/* Right side - Sign Up Form */}
            <div className="lg:w-1/2 p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-10">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-2xl">
                      <UserPlus className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Create Account
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fill in your details to join our community of writers
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                  {/* Name fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-medium">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          hasError('firstName') ? 'text-red-500' : isValid('firstName') ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <Input
                          id="firstName"
                          className={`pl-12 py-6 rounded-xl transition-all ${
                            hasError('firstName')
                              ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                              : isValid('firstName')
                              ? 'border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'focus:ring-indigo-500'
                          }`}
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleChange}
                          onBlur={() => handleBlur('firstName')}
                        />
                        {isValid('firstName') && (
                          <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                      </div>
                      {hasError('firstName') && (
                        <p className="text-sm text-red-500 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-medium">
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          hasError('lastName') ? 'text-red-500' : isValid('lastName') ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <Input
                          id="lastName"
                          className={`pl-12 py-6 rounded-xl transition-all ${
                            hasError('lastName')
                              ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                              : isValid('lastName')
                              ? 'border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'focus:ring-indigo-500'
                          }`}
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleChange}
                          onBlur={() => handleBlur('lastName')}
                        />
                        {isValid('lastName') && (
                          <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                      </div>
                      {hasError('lastName') && (
                        <p className="text-sm text-red-500 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Username field */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-700 dark:text-gray-300 font-medium">
                      Username
                    </Label>
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        hasError('username') ? 'text-red-500' : isValid('username') ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <Input
                        id="username"
                        className={`pl-12 py-6 rounded-xl transition-all ${
                          hasError('username')
                            ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                            : isValid('username')
                            ? 'border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'focus:ring-indigo-500'
                        }`}
                        placeholder="johndoe_23"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={() => handleBlur('username')}
                      />
                      {isValid('username') && (
                        <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {hasError('username') ? (
                      <p className="text-sm text-red-500 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.username}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        3-20 characters, letters, numbers, and underscores only
                      </p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        hasError('email') ? 'text-red-500' : isValid('email') ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <Input
                        id="email"
                        type="email"
                        className={`pl-12 py-6 rounded-xl transition-all ${
                          hasError('email')
                            ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                            : isValid('email')
                            ? 'border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'focus:ring-indigo-500'
                        }`}
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                      />
                      {isValid('email') && (
                        <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {hasError('email') && (
                      <p className="text-sm text-red-500 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password field */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                        Password
                      </Label>
                      {formData.password && (
                        <span className={`text-sm font-medium ${passwordStrength.color}`}>
                          Strength: {passwordStrength.text}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        hasError('password') ? 'text-red-500' : isValid('password') ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className={`pl-12 pr-12 py-6 rounded-xl transition-all ${
                          hasError('password')
                            ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                            : isValid('password')
                            ? 'border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'focus:ring-indigo-500'
                        }`}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      {isValid('password') && (
                        <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    
                    {/* Password strength indicator */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.score === 0 ? 'w-1/6 bg-red-500' :
                              passwordStrength.score === 1 ? 'w-1/3 bg-red-400' :
                              passwordStrength.score === 2 ? 'w-1/2 bg-yellow-500' :
                              passwordStrength.score === 3 ? 'w-2/3 bg-blue-400' :
                              passwordStrength.score === 4 ? 'w-5/6 bg-green-500' :
                              'w-full bg-green-600'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                    
                    {hasError('password') ? (
                      <p className="text-sm text-red-500 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.password}
                      </p>
                    ) : (
                      <div className="text-sm text-gray-500 space-y-1">
                        <p className="flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Password must contain:
                        </p>
                        <div className="grid grid-cols-2 gap-1 ml-6">
                          <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                            • 8+ characters
                          </span>
                          <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                            • Lowercase letter
                          </span>
                          <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                            • Uppercase letter
                          </span>
                          <span className={/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                            • Number
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms and conditions */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        className={`mt-1 rounded border-gray-300 focus:ring-indigo-500 ${
                          formErrors.terms ? 'border-red-500' : ''
                        }`}
                        checked={termsAccepted}
                        onChange={(e) => {
                          setTermsAccepted(e.target.checked);
                          if (e.target.checked) {
                            setFormErrors(prev => ({ ...prev, terms: undefined }));
                          }
                        }}
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                        I agree to the{' '}
                        <Link href="/terms" className="text-indigo-600 hover:text-indigo-500 font-medium">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500 font-medium">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {formErrors.terms && (
                      <p className="text-sm text-red-500 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.terms}
                      </p>
                    )}
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full py-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading || isSubmitting ? (
                      <>
                        <Spinner className="w-5 h-5 mr-3" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Sign in link for mobile */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 lg:hidden">
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/auth/sign-in" className="text-indigo-600 hover:text-indigo-500 font-semibold">
                      Sign In
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