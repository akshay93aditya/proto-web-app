import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
	Button,
	Center,
	FormControl,
	FormHelperText,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { DiscordLogo, InstagramLogo, TwitterLogo } from '../dynamic/Profile';
import axios from 'axios';
import Options from '../components/Options';

// import { Orbis } from '@orbisclub/orbis-sdk';

// let orbis = new Orbis();

export default function Profile() {
	const wallet = useWallet();
	const [userName, setUserName] = useState<string>(null);
	const [editingUserName, setEditingUserName] = useState<boolean>(false);
	const [newUserName, setNewUserName] = useState<string>(null);
	const [_id, set_id] = useState<string>(null);

	const [selectedImage, setSelectedImage] = useState<any>(null);
	const [user, setUser] = useState(null);

	// async function connect() {
	// 	let res = await orbis.connect_v2({
	// 		provider: window?.phantom?.solana,
	// 		chain: 'solana',
	// 	});
	// 	if (res.status == 200) {
	// 		setUser(res.did);
	// 		console.log(user);
	// 	} else {
	// 		console.log('Error connecting to Ceramic: ', res);
	// 		alert('Error connecting to Ceramic.');
	// 	}
	// }

	// async function isConnected() {
	// 	const res = await orbis.isConnected();
	// 	if (res.status == 200) {
	// 		console.log(res);
	// 	}
	// }

	useEffect(() => {
		const fetchUserName = async () => {
			try {
				const res = await axios.get('https://proto-api.onrender.com/users', {
					params: { wallet_address: wallet.publicKey },
				});
				setUserName(res.data[0].name);
				set_id(res.data[0]._id);
			} catch (e) {
				console.log(e);
			}
		};
		if (wallet.publicKey) fetchUserName();
	}, [wallet.publicKey]);

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
		const updateUserName = async () => {
			try {
				const res = await axios.patch(`https://proto-api.onrender.com/users/${_id}`, {
					name: newUserName,
				});
			} catch (e) {
				console.log(e);
			}
		};
		updateUserName();
	};

	return (
		<>
			<div>
				{/* <Button onClick={() => connect()}>Orbis</Button>
				<Button onClick={() => isConnected()}>connected?</Button> */}

				<div className=' align-middle h-[calc(100vh-200px)] max-w-[600px] mx-auto'>
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
						<Options />
					</div>

					<div className='flex w-full items-center justify-center pb-24'>
						<DiscordLogo />
						<TwitterLogo />
						<InstagramLogo />
					</div>
				</div>
			</div>
		</>
	);
}
