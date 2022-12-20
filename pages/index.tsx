import Head from 'next/head';
import { Suspense } from 'react';
import Loading from '../components/Loading';

export default function Home() {
	return (
		<Suspense fallback={<Loading />}>
			<>{/* map component */}</>
		</Suspense>
	);
}
