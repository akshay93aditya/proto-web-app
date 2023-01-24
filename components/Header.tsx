import React from 'react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Button from './ConnectButton';
import { useRouter } from 'next/router';
import { LogoSmall } from '../dynamic/Logo';

export default function Header() {
	const router = useRouter();

	return (
		<div className='flex py-2 px-2 md:px-8 justify-between items-center shadow sticky top-0 w-full z-20 bg-white'>
			{/* <ProfileIcon onClick={() => router.push('/profile')} /> */}
			<LogoSmall onClick={() => router.push('/')} />
			{router.pathname === '/' && (
				<InputGroup ml='4'>
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
