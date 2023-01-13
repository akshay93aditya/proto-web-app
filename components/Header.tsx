import React from 'react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Button from './ConnectButton';
import { useRouter } from 'next/router';

export default function Header() {
	const router = useRouter();
	const ProfileIcon = () => {
		return (
			<svg
				className='mr-4 shrink-0 cursor-pointer'
				width='40'
				height='40'
				viewBox='0 0 50 50'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				onClick={() => router.push('/profile')}>
				<path d='M25 0L46.6506 12.5V37.5L25 50L3.34937 37.5V12.5L25 0Z' fill='#14AEDE' />
				<path
					d='M25.25 3.56699L25 3.42265L24.75 3.56699L6.56347 14.067L6.31347 14.2113V14.5V35.5V35.7887L6.56347 35.933L24.75 46.433L25 46.5774L25.25 46.433L43.4365 35.933L43.6865 35.7887V35.5V14.5V14.2113L43.4365 14.067L25.25 3.56699Z'
					fill='#2E2D2C'
					stroke='#D9D9D9'
				/>
			</svg>
		);
	};
	return (
		<div className='flex py-2 px-2 md:px-8 justify-between items-center shadow sticky top-0 w-full z-20 bg-white'>
			<ProfileIcon />
			{router.pathname === '/checkin' && (
				<InputGroup>
					<Input
						placeholder='Search'
						variant='filled'
						type='text'
						border='1px'
						borderColor='gray.300'
						color='gray.800'
						fontFamily='Montserrat'
					/>
					<InputLeftElement
						pointerEvents='none'
						children={<SearchIcon color='gray.300' />}
					/>
				</InputGroup>
			)}
			<div className='ml-4'>
				<Button />
			</div>
		</div>
	);
}
