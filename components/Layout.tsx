import React from 'react';
import Header from './Header';
import Tabs from './Tabs';
import { Montserrat } from '@next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className={`${montserrat.variable} font-sans`}>{children}</main>
      <Tabs />
    </>
  );
}
