import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Center, Editable, EditableInput, EditablePreview } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { DiscordLogo, InstagramLogo, TwitterLogo } from '../dynamic/Profile';

export default function profile() {
	const { connected, wallet } = useWallet();

	const [userName, setUserName] = useState<string>('John Doe');
	const [editingUserName, setEditingUserName] = useState<boolean>(false);

	const [newUserName, setNewUserName] = useState<string>('');

	const handleChange = (e) => {
		setNewUserName(e.target.value);
		setEditingUserName(true);
	};

	const handleSave = () => {
		setUserName(newUserName);
		setEditingUserName(false);
	};

	return (
		<>
			<div>
				<div className='flex align-middle flex-col justify-between h-[calc(100vh-200px)] max-w-[800px] mx-auto'>
					<div className='p-6'>
						<Image
							src='/profileplaceholder.svg'
							alt='profile placeholder'
							width={150}
							height={150}
							className='mx-auto'
						/>
						<div className='flex items-center mt-6'>
							<p className='font-medium'>Username</p>
							<Editable defaultValue={userName} w='100%' mx='8px'>
								<EditablePreview bg='#D9D9D9' px='8px' w='100%' py='8px' />
								<EditableInput onChange={handleChange} />
							</Editable>
						</div>
						{editingUserName && userName !== newUserName ? (
							<Center>
								<Button
									colorScheme='telegram'
									bg='primary'
									color='#fff'
									onClick={handleSave}
									mt='16px'>
									Save
								</Button>
							</Center>
						) : null}
					</div>
					<div>
						<div className='flex w-full items-center justify-center'>
							<DiscordLogo />
							<TwitterLogo />
							<InstagramLogo />
						</div>
						{connected ? (
							<>
								<div className='bg-primary mx-6 p-2 rounded-md mt-4'>
									<p className='text-center  text-white font-medium cursor-pointer'>
										Connected
									</p>
								</div>
								<p className='text-center '>You're connected to proto via</p>
							</>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}
