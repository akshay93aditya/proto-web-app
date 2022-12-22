import Head from 'next/head';
import { Suspense } from 'react';
import Tabs from '../components/Tabs';
import Header from '../components/Header';
import Loading from '../components/Loading';

export default function Home() {
	return (
		<Suspense fallback={<Loading />}>
			<>{/* map component */}</>
			<div className='w-full bg-white'>
				<Header />
				<Tabs />
			</div>
		</Suspense>
	);
}
