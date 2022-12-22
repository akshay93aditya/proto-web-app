import React from 'react';
import Header from './Header';
import Tabs from './Tabs';

export default function Layout({ children }) {
	return (
		<>
			{/* <Header /> */}
			<main className='bg-white'>{children}</main>
			<Tabs />
		</>
	);
}
