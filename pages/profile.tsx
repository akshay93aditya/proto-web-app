import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Center, Circle, Editable, EditableInput, EditablePreview } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { DiscordLogo, InstagramLogo, TwitterLogo } from '../dynamic/Profile';
import { WalletName } from '@solana/wallet-adapter-base';

export default function profile() {
	const { connected, wallet } = useWallet();

	const [userName, setUserName] = useState<string>('');
	const [editingUserName, setEditingUserName] = useState<boolean>(false);
	const [newUserName, setNewUserName] = useState<string>('');

	const [selectedImage, setSelectedImage] = useState<any>(null);

	function onImageUpload(e) {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = () => setSelectedImage(reader.result);
		reader.readAsDataURL(file);
	}

	const handleChangeUserName = (e) => {
		setNewUserName(e.target.value);
		setEditingUserName(true);
	};

	const handleSaveUserName = () => {
		setUserName(newUserName);
		setEditingUserName(false);
	};

	return (
		<>
			<div>
				<div className='flex align-middle flex-col justify-between h-[calc(100vh-200px)] max-w-[800px] mx-auto'>
					<div className='p-6'>
						<label className='relative'>
							<Image
								src={selectedImage ? selectedImage : '/profileplaceholder.svg'}
								alt='/'
								className='mx-auto rounded-full object-cover h-32 w-32 cursor-pointer'
								height={10}
								width={10}
							/>
							<input
								type='file'
								className='absolute top-0 left-0 w-32 h-32 m-auto opacity-0 cursor-pointer z-0'
								onChange={onImageUpload}
							/>
						</label>
						<div className='flex items-center mt-6'>
							<p className='font-medium'>Username</p>
							<Editable defaultValue={userName} w='100%' mx='8px'>
								<EditablePreview px='8px' w='100%' py='8px' />
								<EditableInput onChange={handleChangeUserName} py='8px' />
							</Editable>
						</div>
						{editingUserName && userName !== newUserName ? (
							<Center>
								<Button
									colorScheme='telegram'
									bg='primary'
									color='#fff'
									onClick={handleSaveUserName}
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
								<p className='text-center '>You're connected to proto via </p>
							</>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}
