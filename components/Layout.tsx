import React from 'react';
import Header from './Header';
import Tabs from './Tabs';
import { Inter } from '@next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className={`${inter.variable} font-sans`}>{children}</main>
      <Tabs />
    </>
  );
}
