'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CircleUser,
  CreditCard,
  IndianRupee,
  Menu,
  Package2,
  Search,
  Settings,
  Users,
  Receipt,
  Building2,
  Calendar,
  Crown,
  ChevronDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  const navItems = [
    { href: '/dashboard', icon: IndianRupee, label: 'Dashboard' },
    { href: '/inventory', icon: Package2, label: 'Inventory' },
    { href: '/billing', icon: CreditCard, label: 'Billing' },
    { href: '/bills', icon: Receipt, label: 'Bills' },
    { href: '/customers', icon: Users, label: 'Customers' },
    ...(user?.role === 'admin' ? [{ href: '/users', icon: Users, label: 'Users' }] : []),
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];
  
  return (
    <ProtectedRoute>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-card md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Logo className="h-6 w-6 text-primary" />
                <span className="">MinMedIQ</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {navItems.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                  >
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="sr-only">MinMedIQ</span>
                  </Link>
                  {navItems.map(({ href, icon: Icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              {/* Can add a search bar here if needed in the future */}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleTimeString()}
              </div>
              <ThemeToggle />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 px-4 py-2 h-auto hover:bg-accent/50 transition-colors">
                  <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                    <AvatarImage src="https://placehold.co/100x100" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left min-w-0 flex-1">
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-sm font-semibold truncate">{user?.name || 'User'}</span>
                      {user?.subscription?.plan?.name === 'premium' && (
                        <Crown className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                    {user?.shopName && (
                      <span className="text-xs text-muted-foreground truncate w-full">{user.shopName}</span>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      {user?.subscription?.plan?.name && (
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {user.subscription.plan.name.charAt(0).toUpperCase() + user.subscription.plan.name.slice(1)}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-80 p-2">
                 <DropdownMenuLabel className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                   <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                     <AvatarImage src="https://placehold.co/100x100" alt="User" />
                     <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                       {user?.name?.charAt(0).toUpperCase() || 'U'}
                     </AvatarFallback>
                   </Avatar>
                   <div className="flex flex-col flex-1 min-w-0">
                     <div className="flex items-center gap-2">
                       <span className="font-semibold truncate">{user?.name || 'User'}</span>
                       {user?.subscription?.plan?.name === 'premium' && (
                         <Crown className="h-4 w-4 text-amber-500 flex-shrink-0" />
                       )}
                     </div>
                     <span className="text-sm text-muted-foreground truncate">{user?.email}</span>
                   </div>
                 </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                                 {/* Shop Information */}
                 {user?.shopName && (
                   <>
                     <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                       <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                         <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                       </div>
                       <div className="flex flex-col flex-1 min-w-0">
                         <span className="text-sm font-medium truncate">{user.shopName}</span>
                         {user.phone && (
                           <span className="text-xs text-muted-foreground truncate">{user.phone}</span>
                         )}
                       </div>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                   </>
                 )}
                
                                 {/* Subscription Status */}
                 <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                   <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                     <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
                   </div>
                   <div className="flex flex-col flex-1 min-w-0">
                     <span className="text-sm font-medium">
                       {user?.subscription?.plan?.name ? 
                         `${user.subscription.plan.name.charAt(0).toUpperCase() + user.subscription.plan.name.slice(1)} Plan` : 
                         'No Subscription'
                       }
                     </span>
                     <span className="text-xs text-muted-foreground">
                       {user?.subscription?.status || 'No active subscription'}
                     </span>
                   </div>
                 </DropdownMenuItem>
                
                                 {/* Current Time */}
                 <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                   <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                     <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                   </div>
                   <div className="flex flex-col flex-1 min-w-0">
                     <span className="text-sm font-medium">
                       {currentTime.toLocaleDateString()}
                     </span>
                     <span className="text-xs text-muted-foreground">
                       {currentTime.toLocaleTimeString()}
                     </span>
                   </div>
                 </DropdownMenuItem>
                
                                 <DropdownMenuSeparator />
                 <DropdownMenuItem 
                   onClick={logout}
                   className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                 >
                   <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                     <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                     </svg>
                   </div>
                   <span className="font-medium">Logout</span>
                 </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
