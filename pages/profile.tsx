import React, { useState } from 'react';
import Image from 'next/image';
import {
	Button,
	Center,
	Circle,
	Editable,
	EditableInput,
	EditablePreview,
	FormControl,
	FormHelperText,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { DiscordLogo, InstagramLogo, TwitterLogo } from '../dynamic/Profile';
import { WalletName } from '@solana/wallet-adapter-base';

export default function Profile() {
	const { connected, wallet, publicKey } = useWallet();

	const [userName, setUserName] = useState<string>(null);
	const [editingUserName, setEditingUserName] = useState<boolean>(false);
	const [newUserName, setNewUserName] = useState<string>(null);

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
				<div className='flex align-middle flex-col justify-between h-[calc(100vh-200px)] max-w-[600px] mx-auto'>
					<div className='p-6'>
						<label className='relative'>
							<Image
								src={selectedImage ? selectedImage : '/profileplaceholder.svg'}
								alt='/'
								className='mx-auto rounded-full object-cover h-32 w-32 cursor-pointer border border-[#b6b8b9]'
								height={10}
								width={10}
							/>
							<p className='text-[#AEB4B7] text-center mt-1 text-xs font-medium cursor-pointer'>
								{!selectedImage ? 'Add a pic' : 'Change'}
							</p>
							<input
								type='file'
								className='absolute top-0 left-0 w-32 h-36 m-auto opacity-0 cursor-pointer z-0'
								onChange={onImageUpload}
							/>
						</label>
						<div className='flex items-center mt-6'>
							{/* <p className='font-medium'>Username</p> */}
							{!userName ? (
								<FormControl>
									<FormLabel
										fontSize='sm'
										mb='-0.5px'
										color='gray.500'
										fontWeight={400}>
										Username
									</FormLabel>
									<InputGroup>
										<Input
											placeholder='Set a username...'
											borderColor='#E2E8F0'
											type='text'
											onChange={handleChangeUserName}
										/>
										<InputRightElement w='4.5rem'>
											{editingUserName &&
											newUserName.length !== 0 &&
											userName !== newUserName ? (
												<Center>
													<Button
														h='32px'
														mr='4px'
														colorScheme='telegram'
														bg='primary'
														color='#fff'
														onClick={handleSaveUserName}>
														Save
													</Button>
												</Center>
											) : null}
										</InputRightElement>
									</InputGroup>
									<FormHelperText color='gray.400'>
										*You can only set your username once
									</FormHelperText>
								</FormControl>
							) : (
								<p className='text-center font-medium text-2xl text-gray-700 mx-auto'>
									{userName}
								</p>
							)}
						</div>
						{connected && (
							<div className='mt-8'>
								<p className=' text-gray-500 text-sm'>Wallet Address</p>
								<p className='text-gray-600 '>{publicKey?.toBase58()}</p>
							</div>
						)}
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
								{/* <p className='text-center '>You're connected to proto via </p> */}
							</>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}
