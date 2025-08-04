import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'MinMedIQ Pharmacy',
  description: 'Complete pharmacy management system for medical stores - billing, inventory, customers, and analytics',
  keywords: 'pharmacy, medical store, billing, inventory, medicine, healthcare',
  authors: [{ name: 'MinMedIQ Team' }],
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any', type: 'image/png' }
    ],
    apple: [
      { url: '/logo.png', sizes: 'any', type: 'image/png' }
    ]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
