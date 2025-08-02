'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Building2, 
  Users, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  Shield,
  Zap,
  TrendingUp,
  Heart
} from 'lucide-react';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
                         <Image
               src="/logo.png"
               alt="MinMind Logo"
               width={40}
               height={40}
               className="rounded-lg"
             />
                         <div>
               <h1 className="text-xl font-bold text-gray-900">MinMind</h1>
               <p className="text-xs text-gray-600">Building Today Tomorrow</p>
             </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="https://www.minmind.in" target="_blank">
              <Button variant="ghost" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Website
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="sm"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="transition-all duration-300"
              >
                Access MinMedIQ
                <ArrowRight className={`h-4 w-4 ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
                     <div className="flex justify-center mb-8">
             <Image
               src="/logo.png"
               alt="MinMind Logo"
               width={120}
               height={120}
               className="rounded-2xl shadow-lg"
             />
           </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MinMind
            </span>
          </h1>
                     <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
             Building today's healthcare technology solutions for tomorrow's pharmacy management 
             and patient care through innovative software development.
           </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6">
                <Zap className="h-5 w-5 mr-2" />
                Access MinMedIQ
              </Button>
            </Link>
            <Link href="https://www.minmind.in" target="_blank">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Globe className="h-5 w-5 mr-2" />
                Visit Website
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4" variant="secondary">
              <Building2 className="h-3 w-3 mr-1" />
              About MinMind
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Transforming Healthcare Through Technology
            </h2>
                         <p className="text-lg text-gray-600 mb-6">
               MinMind is a forward-thinking healthcare technology company building today's 
               solutions for tomorrow's pharmacy operations and patient care. 
               Our flagship product, MinMedIQ, represents the future of pharmacy management.
             </p>
            <div className="grid grid-cols-2 gap-6">
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
          </div>
          <div className="relative">
            <Card className="p-8 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Heart className="h-6 w-6 text-red-500 mr-2" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                                 <p className="text-gray-600">
                   To build today's cutting-edge software solutions for tomorrow's pharmacy 
                   management, improving efficiency, accuracy, and patient outcomes.
                 </p>
                                 <div className="bg-blue-50 p-4 rounded-lg">
                   <h4 className="font-semibold text-blue-900 mb-2">MinMedIQ Features</h4>
                   <ul className="text-sm text-blue-800 space-y-1">
                     <li>• Advanced inventory management</li>
                     <li>• Automated billing system</li>
                     <li>• Patient record management</li>
                     <li>• Real-time analytics</li>
                     <li>• Multi-user access control</li>
                     <li>• Flexible subscription plans</li>
                     <li>• Unlimited users, inventory & customers</li>
                   </ul>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

             {/* Services Section */}
       <section className="container mx-auto px-4 py-20">
         <div className="text-center mb-16">
           <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
             Comprehensive healthcare technology solutions designed for modern pharmacies
           </p>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
           <Card className="text-center p-6 hover:shadow-lg transition-shadow">
             <CardHeader>
               <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                 <Building2 className="h-8 w-8 text-blue-600" />
               </div>
               <CardTitle>Pharmacy Management</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-gray-600">
                 Complete pharmacy management solution with inventory tracking, 
                 billing, and customer management.
               </p>
             </CardContent>
           </Card>
           <Card className="text-center p-6 hover:shadow-lg transition-shadow">
             <CardHeader>
               <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                 <Users className="h-8 w-8 text-green-600" />
               </div>
               <CardTitle>Patient Care</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-gray-600">
                 Enhanced patient care through better record management, 
                 prescription tracking, and health monitoring.
               </p>
             </CardContent>
           </Card>
           <Card className="text-center p-6 hover:shadow-lg transition-shadow">
             <CardHeader>
               <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                 <TrendingUp className="h-8 w-8 text-purple-600" />
               </div>
               <CardTitle>Analytics & Insights</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-gray-600">
                 Advanced analytics and reporting tools to optimize 
                 pharmacy operations and business performance.
               </p>
             </CardContent>
           </Card>
         </div>
       </section>

       {/* Subscription Plans Section */}
       <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
         <div className="text-center mb-16">
           <h2 className="text-4xl font-bold text-gray-900 mb-4">MinMedIQ Subscription Plans</h2>
           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
             Choose the perfect plan for your pharmacy. All plans include unlimited users, inventory, and customers with no artificial limits.
           </p>
         </div>
         
         {/* Plan Comparison Table */}
         <div className="mb-16">
           <Card className="overflow-hidden">
             <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
               <CardTitle className="text-2xl">Plan Comparison</CardTitle>
               <CardDescription className="text-blue-100">
                 Detailed comparison of all MinMedIQ subscription plans
               </CardDescription>
             </CardHeader>
             <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                       <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Basic</th>
                       <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Premium</th>
                       <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200">
                                           <tr className="bg-white">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Price</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900">
                          <span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>4,999
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900">
                          <span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>8,999
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900">
                          <span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>24,999
                        </td>
                      </tr>
                     <tr className="bg-gray-50">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Duration</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">6 Months</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">1 Year</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">1 Year</td>
                     </tr>
                     <tr className="bg-white">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Users</td>
                       <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Unlimited</td>
                       <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Unlimited</td>
                       <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Unlimited</td>
                     </tr>
                     <tr className="bg-gray-50">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Inventory Items</td>
                       <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Unlimited</td>
                       <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Unlimited</td>
                       <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Unlimited</td>
                     </tr>
                     <tr className="bg-white">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Customers</td>
                       <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Unlimited</td>
                       <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Unlimited</td>
                       <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Unlimited</td>
                     </tr>
                     <tr className="bg-gray-50">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Billing System</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                     </tr>
                     <tr className="bg-white">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Inventory Management</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                     </tr>
                     <tr className="bg-gray-50">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Customer Management</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                     </tr>
                     <tr className="bg-white">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Basic Reporting</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                     </tr>
                     <tr className="bg-gray-50">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Advanced Reporting</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-400">✗</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                     </tr>
                     <tr className="bg-white">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Bulk Operations</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-400">✗</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                     </tr>
                     <tr className="bg-gray-50">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Advanced Analytics</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-400">✗</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-400">✗</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                     </tr>
                     <tr className="bg-white">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">API Access</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-400">✗</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-400">✗</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                     </tr>
                     <tr className="bg-gray-50">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Custom Integrations</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-400">✗</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-400">✗</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">✓</td>
                     </tr>
                     <tr className="bg-white">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">Support</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">Email</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">Priority</td>
                       <td className="px-6 py-4 text-center text-sm text-gray-900">24/7</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
             </CardContent>
           </Card>
         </div>

         {/* Do's and Don'ts */}
         <div className="grid md:grid-cols-2 gap-8 mb-16">
           <Card className="border-green-200 bg-green-50">
             <CardHeader>
               <CardTitle className="text-green-800 flex items-center">
                 <Shield className="h-5 w-5 mr-2" />
                 What You Can Do
               </CardTitle>
             </CardHeader>
             <CardContent>
               <ul className="space-y-3 text-sm text-green-700">
                 <li className="flex items-start">
                   <span className="text-green-600 mr-2">✓</span>
                   Add unlimited users (staff members) to your pharmacy
                 </li>
                 <li className="flex items-start">
                   <span className="text-green-600 mr-2">✓</span>
                   Manage unlimited inventory items and medicines
                 </li>
                 <li className="flex items-start">
                   <span className="text-green-600 mr-2">✓</span>
                   Store unlimited customer records and patient data
                 </li>
                 <li className="flex items-start">
                   <span className="text-green-600 mr-2">✓</span>
                   Generate bills and invoices without restrictions
                 </li>
                 <li className="flex items-start">
                   <span className="text-green-600 mr-2">✓</span>
                   Access real-time analytics and reporting
                 </li>
                 <li className="flex items-start">
                   <span className="text-green-600 mr-2">✓</span>
                   Use pill-based and strip-based billing
                 </li>
                 <li className="flex items-start">
                   <span className="text-green-600 mr-2">✓</span>
                   Search and filter inventory efficiently
                 </li>
                 <li className="flex items-start">
                   <span className="text-green-600 mr-2">✓</span>
                   Print professional bills and receipts
                 </li>
               </ul>
             </CardContent>
           </Card>

           <Card className="border-red-200 bg-red-50">
             <CardHeader>
               <CardTitle className="text-red-800 flex items-center">
                 <Shield className="h-5 w-5 mr-2" />
                 What You Cannot Do
               </CardTitle>
             </CardHeader>
             <CardContent>
               <ul className="space-y-3 text-sm text-red-700">
                 <li className="flex items-start">
                   <span className="text-red-600 mr-2">✗</span>
                   Share your account credentials with unauthorized users
                 </li>
                 <li className="flex items-start">
                   <span className="text-red-600 mr-2">✗</span>
                   Use the system for illegal pharmaceutical activities
                 </li>
                 <li className="flex items-start">
                   <span className="text-red-600 mr-2">✗</span>
                   Manipulate or falsify billing and inventory records
                 </li>
                 <li className="flex items-start">
                   <span className="text-red-600 mr-2">✗</span>
                   Access other users' data without proper authorization
                 </li>
                 <li className="flex items-start">
                   <span className="text-red-600 mr-2">✗</span>
                   Use expired or invalid medicines in billing
                 </li>
                 <li className="flex items-start">
                   <span className="text-red-600 mr-2">✗</span>
                   Bypass security measures or authentication
                 </li>
                 <li className="flex items-start">
                   <span className="text-red-600 mr-2">✗</span>
                   Use the system for non-pharmacy related activities
                 </li>
                 <li className="flex items-start">
                   <span className="text-red-600 mr-2">✗</span>
                   Violate data privacy and protection regulations
                 </li>
               </ul>
             </CardContent>
           </Card>
         </div>

         {/* Plan Cards */}
         <div className="grid md:grid-cols-3 gap-8">
           <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-gray-200">
             <CardHeader>
               <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                 <Building2 className="h-8 w-8 text-blue-600" />
               </div>
               <CardTitle className="text-xl">Basic Plan</CardTitle>
               <CardDescription>Perfect for small pharmacies</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                               <div className="text-3xl font-bold text-gray-900">
                  <span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>4,999
                </div>
               <div className="text-sm text-gray-600">6 months validity</div>
               <ul className="text-sm text-gray-600 space-y-2 text-left">
                 <li className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   Unlimited users, inventory & customers
                 </li>
                 <li className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   Basic reporting & analytics
                 </li>
                 <li className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   Email support
                 </li>
                 <li className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   Billing & inventory management
                 </li>
               </ul>
               <Link href="/login">
                 <Button className="w-full mt-4">
                   Get Started
                 </Button>
               </Link>
             </CardContent>
           </Card>

           <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-blue-500 relative">
             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
               <Badge className="bg-blue-600 text-white">Most Popular</Badge>
             </div>
             <CardHeader>
               <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                 <TrendingUp className="h-8 w-8 text-green-600" />
               </div>
               <CardTitle className="text-xl">Premium Plan</CardTitle>
               <CardDescription>Ideal for growing pharmacies</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                               <div className="text-3xl font-bold text-gray-900">
                  <span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>8,999
                </div>
               <div className="text-sm text-gray-600">1 year validity</div>
               <ul className="text-sm text-gray-600 space-y-2 text-left">
                 <li className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   Everything in Basic
                 </li>
                 <li className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   Advanced reporting & analytics
                 </li>
                 <li className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   Priority support
                 </li>
                 <li className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   Bulk operations
                 </li>
               </ul>
               <Link href="/login">
                 <Button className="w-full mt-4">
                   Get Started
                 </Button>
               </Link>
             </CardContent>
           </Card>

           <Card className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-purple-200">
             <CardHeader>
               <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                 <Award className="h-8 w-8 text-purple-600" />
               </div>
               <CardTitle className="text-xl">Enterprise Plan</CardTitle>
               <CardDescription>For large pharmacy chains</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                               <div className="text-3xl font-bold text-gray-900">
                  <span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>24,999
                </div>
               <div className="text-sm text-gray-600">1 year validity</div>
               <ul className="text-sm text-gray-600 space-y-2 text-left">
                 <li className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   Everything in Premium
                 </li>
                 <li className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   Advanced analytics & insights
                 </li>
                 <li className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   24/7 dedicated support
                 </li>
                 <li className="flex items-center">
                   <span className="text-green-600 mr-2">✓</span>
                   API access & custom integrations
                 </li>
               </ul>
               <Link href="/login">
                 <Button className="w-full mt-4">
                   Get Started
                 </Button>
               </Link>
             </CardContent>
           </Card>
         </div>
       </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-600">
            Ready to transform your pharmacy? Contact us today.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold">Website</p>
                  <a href="https://www.minmind.in" target="_blank" className="text-blue-600 hover:underline">
                    www.minmind.in
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:info@minmind.in" className="text-green-600 hover:underline">
                    info@minmind.in
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href="tel:+91-6006223504" className="text-purple-600 hover:underline">
                    +91-6006223504
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-semibold">Address</p>
                                     <p className="text-gray-600">
                
                     Kulgam, Jammu & Kashmir<br />
                     India - 192231
                   </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Get Started?</h3>
                         <p className="text-gray-600 mb-6">
               Experience tomorrow's pharmacy management with MinMedIQ today. 
               Our team is ready to help you implement the perfect solution for your pharmacy.
             </p>
            <div className="space-y-4">
              <Link href="/login">
                <Button size="lg" className="w-full">
                  <Zap className="h-5 w-5 mr-2" />
                  Access MinMedIQ Now
                </Button>
              </Link>
              <Link href="https://www.minmind.in" target="_blank">
                <Button variant="outline" size="lg" className="w-full">
                  <Globe className="h-5 w-5 mr-2" />
                  Learn More About MinMind
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
                             <div className="flex items-center space-x-3 mb-4">
                 <Image
                   src="/logo.png"
                   alt="MinMind Logo"
                   width={32}
                   height={32}
                   className="rounded-lg"
                 />
                <span className="text-xl font-bold">MinMind</span>
              </div>
                             <p className="text-gray-400">
                 Building today for tomorrow's healthcare technology solutions.
               </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/login" className="hover:text-white">MinMedIQ</a></li>
                <li><a href="#" className="hover:text-white">Pharmacy Solutions</a></li>
                <li><a href="#" className="hover:text-white">Healthcare Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://www.minmind.in" target="_blank" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MinMind. All rights reserved.</p>
          </div>
                 </div>
       </footer>
     </div>
   );
 }
