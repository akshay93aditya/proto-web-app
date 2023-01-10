import { Center, Flex, SimpleGrid } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import Timeline from '../../components/Timeline';

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
					<ol className='relative border-l border-[#14AEDE]'>
						<Timeline
							title='Attending Solana Hackerhouse!'
							location='XYZ, USA'
							date='19 November 2022'
							time='18:21:34'
							numimages={2}
							latitude={40.709139}
							longitude={74.000905}
							index={1}
							arrLength={0}
						/>
					</ol>
				</div>
			</Center>
			<div className='bg-[#14aede]'>
				<p className='text-center text-white font-semibold text-lg p-2'>
					40.709139, 74.000905
				</p>
			</div>
			<div className='w-[500px] mx-auto'>
				<p className='text-xs mt-6 opacity-70'>
					Signature:
					4tWNvnVxdeC4Kgb98o8pcu3jKZ4GcwSRotURB4BmaL5krVapfNJuYEZ8zZ3k3BECZthW9XnhxDHHSkfJFHJPpEgA
				</p>
				<p className='text-[10px] opacity-60 mt-2'>
					Signer: EuKeq6QN1UB88LgSXvjyoSd3t49F3ykggrFfpuWotA1K
				</p>
			</div>
		</div>
	);
}
