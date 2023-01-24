import { Center, Flex, SimpleGrid } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Timeline from '../../components/Timeline';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function SingleLifelog() {
	const NearbyImage = () => {
		return (
			<Image
				src='/profileplaceholder.svg'
				alt='profile placeholder'
				width={120}
				height={120}
				className='m-4 rounded-lg'
			/>
		);
	};

	const router = useRouter();
	const { slug } = router.query;
	const [checkIn, setCheckin] = useState<any>();

	useEffect(() => {
		async function getCheckInDetails() {
			try {
				const checkInDetails = await axios.get(
					`https://proto-api.onrender.com/checkins/${slug}`
				);
				console.log(checkInDetails);
				setCheckin(checkInDetails.data);
			} catch (e) {
				console.log(e);
			}
		}
		if (slug) {
			getCheckInDetails();
		}
	}, [slug]);

	return (
		<div>
			<Flex flexDir='column'>
				<Flex justifyContent='center'>
					<NearbyImage />
					<NearbyImage />
				</Flex>
				<Flex justifyContent='center'>
					<NearbyImage />
					<NearbyImage />
				</Flex>
			</Flex>
			<Center>
				<div className=' z-0 block mt-4'>
					<ol className='relative border-l border-primary'>
						{checkIn && (
							<Timeline
								message={checkIn.message}
								createdAt={checkIn.createdAt}
								latitude={checkIn.latitude}
								longitude={checkIn.longitude}
								index={1}
								arrLength={0}
								files={checkIn.files}
							/>
						)}
					</ol>
				</div>
			</Center>
			<div className='bg-primary'>
				{checkIn && (
					<p className='text-center text-white font-semibold text-lg p-2'>
						{checkIn.latitude}, {checkIn.longitude}
					</p>
				)}
			</div>
			{/* <div className='w-auto md:w-[500px] mx-auto p-4'>
				<p className='text-xs mt-6 opacity-70'>
					Signature:
					4tWNvnVxdeC4Kgb98o8pcu3jKZ4GcwSRotURB4BmaL5krVapfNJuYEZ8zZ3k3BECZthW9XnhxDHHSkfJFHJPpEgA
				</p>
				<p className='text-[10px] opacity-60 mt-2'>
					Signer: EuKeq6QN1UB88LgSXvjyoSd3t49F3ykggrFfpuWotA1K
				</p>
			</div> */}
		</div>
	);
}
