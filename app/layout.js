import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import PostHogProvider from '@/components/PostHogProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata = {
  title: 'Jake Rosenbloom – Loan Officer | United Mortgage Corp.',
  description:
    'Get personalized mortgage options from Jake Rosenbloom at United Mortgage Corp. Licensed in 26 states. First-time buyers welcome.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>
        <Suspense>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
