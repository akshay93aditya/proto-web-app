import { Suspense } from 'react';
import Loading from '../components/Loading';

export default function Home() {
	return (
		<Suspense fallback={<Loading />}>
			<div className='w-full text-black'>hello world</div>
		</Suspense>
	);
}
