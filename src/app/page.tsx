'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, Info, Building2, Users, Award, Shield, TrendingUp, Heart, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo className="h-8 w-8 text-primary" />
                         <div>
              <h1 className="text-xl font-bold text-gray-900">MinMedIQ</h1>
              <p className="text-xs text-gray-600">Building today for tomorrow's healthcare technology solutions.</p>
             </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/about" target="_blank">
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4 mr-2" />
                About MinMedIQ
              </Button>
            </Link>
            <Link href="https://www.minmind.in" target="_blank">
              <Button variant="ghost" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Website
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Login Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Logo className="h-8 w-8 text-primary" />
                  <h1 className="text-2xl font-bold">MinMedIQ</h1>
                </div>
                <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
             />
           </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
              </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
              </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>Contact your administrator for login credentials</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Information */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
            <Badge className="mb-4" variant="secondary">
              <Building2 className="h-3 w-3 mr-1" />
                About MinMedIQ
            </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Transforming Healthcare Through Technology
            </h2>
                         <p className="text-lg text-gray-600 mb-6">
                MinMedIQ is a comprehensive pharmacy management system designed for modern medical stores. 
                Our platform offers advanced inventory management, automated billing, and real-time analytics.
             </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Award-winning Solutions</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Secure & Reliable</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">Expert Team</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-gray-600">Continuous Innovation</span>
              </div>
            </div>

            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Advanced inventory management
                 </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Automated billing system
          </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Patient record management
        </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Real-time analytics
         </div>
                  <div className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                    Multi-user access control
         </div>
                  <div className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   Unlimited users, inventory & customers
               </div>
                </div>
             </CardContent>
           </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Info className="h-4 w-4 mr-2" />
                  Learn More About MinMedIQ
                </Button>
              </Link>
              <Link href="https://www.minmind.in" target="_blank" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              </Link>
            </div>
          </div>
        </div>
          </div>
     </div>
   );
 }
