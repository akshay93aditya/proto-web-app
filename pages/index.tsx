import {
	Circle,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import React, { useState, useEffect, Suspense } from 'react';
import Loading from '../components/Loading';

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

export default function Options() {
	const [regions, setRegions] = useState<Region | []>([]);
	const [places, setPlaces] = useState<Places | []>([]);
	const { connected, wallet } = useWallet();

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const timer = setTimeout(() => {
			onOpen();
		}, 6000);
		return () => clearTimeout(timer);
	}, []);

	const WelcomeModal = () => {
		return (
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent p={2} bg='#fff'>
					<ModalHeader textAlign='center' pt='0.5rem'>
						Welcome!
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<div className='w-full text-black flex flex-col justify-center items-center px-6 pb-6 pt-2'>
							Hey Everyone! This is proto, a decentralized application for creating
							lifelogs. Please provide location access to the application. LFG!!
							<ol>
								<li>1. Click on the Location Marker icon in the footer</li>
								<li>
									2. Notice that a map is shown with your realtime location.
									Pretty cool,right!
								</li>
								<li>
									3. Connect your wallet and then click on the blue "check in"
									icon{' '}
								</li>
								<li>
									4. Wait for your location coordinates to be fetched after which
									you gotta add a check in message and click check in.{' '}
								</li>
								<li>
									5. Voila! In just a few clicks, You have checked in and a unique
									PDA has been generated. Verify the transaction on the solana
									explorer.{' '}
								</li>
								<li>
									6. Click on the hexagonal profile picture container to navigate
									to the Profile page where the user would be inserting their
									username.
								</li>
								<li>
									7. Click on the third footer icon to navigate to the Options
									page wherein the user can redirect to the Map or their Profile
									pages.
								</li>
							</ol>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	};

	const OptionsPage = () => {
		return (
			<div className='max-w-[800px] mx-auto'>
				<WelcomeModal />
				<div className='h-[calc(100vh-200px)] px-2 md:px-6 py-2 flex flex-col'>
					<Link
						href='/checkin'
						className='border-2 border-primary rounded-lg relative h-1/3 m-2 bg-[url("/map-placeholder.png")] bg-no-repeat
					bg-cover bg-'>
						<Heading
							fontSize='2xl'
							color='primary'
							className='absolute left-4 bottom-2'>
							Check-In Map
						</Heading>
					</Link>
					<div className='flex h-1/3 relative'>
						<Link
							href='/profile'
							className='w-1/2 relative bg-[#6fe0a8] rounded-lg m-2'>
							<Circle
								mx='auto'
								my='16px'
								size='100px'
								bgImage='/profileplaceholder.svg'
								bgPosition='center'
								bgSize='cover'
							/>
							{/* <Image src='/profileplaceholder.svg' alt='placeholder' fill /> */}
							<Heading
								fontSize='2xl'
								color='#fff'
								className='absolute left-4 bottom-2 '>
								Profile
							</Heading>
						</Link>
						<div className='w-1/2 relative bg-[#DEAD2A] rounded-lg m-2'>
							<Heading
								fontSize='2xl'
								color='#fff'
								className='absolute left-4 bottom-2'>
								Check-In's
							</Heading>
						</div>
					</div>
					<div className='flex h-1/3'>
						<div className='w-1/2 relative bg-[#077191] rounded-lg m-2'>
							<Heading
								fontSize='2xl'
								color='#fff'
								className='absolute left-4 bottom-2'>
								Regions
							</Heading>
						</div>
						<div className='w-1/2 relative bg-[#0c747a] rounded-lg m-2'>
							<Heading
								fontSize='2xl'
								color='#fff'
								className='absolute left-4 bottom-2'>
								Places
							</Heading>
						</div>
					</div>
				</div>
				<div>
					{connected ? (
						<>
							<div className='bg-primary mx-8 py-2  rounded-md mt-4'>
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
	};

	return (
		<Suspense fallback={<Loading />}>
			<OptionsPage />
		</Suspense>
	);
}
