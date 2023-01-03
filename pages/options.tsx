import { Circle, Heading } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface Region {
	continents: number;
	countries: number;
	cities: number;
}

interface Places {
	events: number;
	attractions: number;
	landmarks: number;
}

export default function options() {
	const [regions, setRegions] = useState<Region | []>([]);
	const [places, setPlaces] = useState<Places | []>([]);
	const { connected, wallet } = useWallet();

	return (
		<div className='max-w-[800px] mx-auto'>
			<div className='h-[calc(100vh-200px)] px-6 py-2 flex flex-col'>
				<div className='border-2 border-[#14aede] rounded-lg relative h-1/3 m-2'>
					<Heading fontSize='2xl' color='#14aede' className='absolute left-4 bottom-2'>
						Check-In Map
					</Heading>
				</div>
				<div className='flex h-1/3 relative'>
					<div className='w-1/2 relative bg-[#6fe0a8] rounded-lg m-2'>
						<Circle
							mx='auto'
							my='16px'
							size='100px'
							bgImage='/profileplaceholder.svg'
							bgPosition='center'
							bgSize='cover'
						/>
						{/* <Image src='/profileplaceholder.svg' alt='placeholder' fill /> */}
						<Heading fontSize='2xl' color='#fff' className='absolute left-4 bottom-2 '>
							Profile
						</Heading>
					</div>
					<div className='w-1/2 relative bg-[#DEAD2A] rounded-lg m-2'>
						<Heading fontSize='2xl' color='#fff' className='absolute left-4 bottom-2'>
							Check-In's
						</Heading>
					</div>
				</div>
				<div className='flex h-1/3'>
					<div className='w-1/2 relative bg-[#077191] rounded-lg m-2'>
						<Heading fontSize='2xl' color='#fff' className='absolute left-4 bottom-2'>
							Regions
						</Heading>
					</div>
					<div className='w-1/2 relative bg-[#0c747a] rounded-lg m-2'>
						<Heading fontSize='2xl' color='#fff' className='absolute left-4 bottom-2'>
							Places
						</Heading>
					</div>
				</div>
			</div>
			<div>
				{connected ? (
					<>
						<div className='bg-[#14AEDE] mx-8 py-2  rounded-md mt-4'>
							<p className='text-center  text-white font-medium cursor-pointer'>
								Connected
							</p>
						</div>
						{/* <p className='text-center '>You're connected to proto via</p> */}
					</>
				) : null}
			</div>
		</div>
	);
}
