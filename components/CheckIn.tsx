import React, { useState, useEffect, useRef } from 'react';
import { idl, Work } from '../proto';
import * as anchor from '@project-serum/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { Audio } from 'react-loader-spinner';
import { Button, Input, Textarea } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { create } from 'ipfs-http-client';
import { Connection, SystemProgram, Transaction } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
export type CheckIN = {
	lat: number;
	lng: number;
	loc: boolean;
	checkInMessage: string;
	loading: boolean;
	success: boolean;
	checkin: pdl;
};

export type pdl = {
	pdl: string;
};

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https',
	headers: {
		authorization: auth,
	},
});

export const getProvider = (wallet: anchor.Wallet) => {
	/* create the provider and return it to the caller */
	/* network set to local network for now */

	const opts = {
		preflightCommitment: 'processed' as anchor.web3.ConfirmOptions,
	};

	const connectionURI = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com';
	const connection = new anchor.web3.Connection(connectionURI, opts.preflightCommitment);

	const provider = new anchor.AnchorProvider(connection, wallet, opts.preflightCommitment);
	return provider;
};

export const anchorProgram = (wallet: anchor.Wallet) => {
	const provider = getProvider(wallet);
	const IDL = idl as anchor.Idl;
	const program = new anchor.Program(
		IDL,
		process.env.PROGRAM_ID,
		provider
	) as unknown as Program<Work>;

	return program;
};

const CheckIn = () => {
	const [lat, setlat] = useState<number>(0);
	const [lng, setlng] = useState<number>(0);
	// const [address, setAddress] = useState("");
	const [checkInMessage, setcheckInMessage] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);
	const [checkin, setcheckIn] = useState<pdl>();
	const [imageCount, setImageCount] = useState<number>(0);
	const [files, setFiles] = useState([]);

	const wallet = useAnchorWallet();
	useEffect(() => {
		const options = {
			enableHighAccuracy: false,
			timeout: 5000,
			maximumAge: Infinity,
		};
		function success(position) {
			setlat(position.coords.latitude);
			setlng(position.coords.longitude);
		}
		function error(err) {
			console.warn(`ERROR(${err.code}): ${err.message}`);
		}
		navigator.geolocation.getCurrentPosition(success, error, options);
	}, []);

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setLoading(true);
			setSuccess(false);
			if (!wallet) {
				alert('Wallet Not Connected');
				setLoading(false);
				return;
			}
			const program = anchorProgram(wallet as NodeWallet);
			async () => {
				const connection = new Connection(
					process.env.ANCHOR_PROVIDER_URL || 'https://api.devnet.solana.com'
				);
				const recentBlockhash = await connection.getLatestBlockhash();
				const transaction = new Transaction().add(
					SystemProgram.transfer({
						fromPubkey: wallet.publicKey,
						toPubkey: wallet.publicKey,
						lamports: 20,
					})
				);
			};
			const usersResponse = await axios({
				method: 'get',
				url: 'https://proto-api.onrender.com/users',
				params: { wallet_address: wallet.publicKey.toString() },
			});
			//   console.log(usersResponse);
			//   console.log(usersResponse.data.length);

			if (usersResponse.data.length) {
				const checkinResponse = await axios({
					method: 'post',
					url: 'https://proto-api.onrender.com/checkins',
					data: {
						user_wallet_address: wallet.publicKey.toString(),
						message: checkInMessage,
						latitude: lat,
						longitude: lng,
					},
				});
				// console.log(usersResponse);
				// // console.log(usersResponse.data.length);
				setcheckIn(checkinResponse.data);
				setLoading(false);
				setSuccess(true);
				console.log(checkinResponse.data);
			} else {
				const newUserResponse = await axios({
					method: 'post',
					url: 'https://proto-api.onrender.com/users',
					data: {
						wallet_address: wallet.publicKey.toString(),
					},
				});

				// console.log(newUserResponse);

				const checkinResponse = await axios({
					method: 'post',
					url: 'https://proto-api.onrender.com/checkins',
					data: {
						user_wallet_address: wallet.publicKey.toString(),
						message: checkInMessage,
						latitude: lat,
						longitude: lng,
					},
				});
				setcheckIn(checkinResponse.data);
				setLoading(false);
				setSuccess(true);
				console.log(checkinResponse.data);
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			setSuccess(false);
		}
	}

	function handleChange(e) {
		setcheckInMessage(e.target.value);
	}

	const handleFileSelect = async (e) => {
		if (Array.from(e.target.files).length > 3) {
			alert('You can only select a maximum of 3 files.');
		} else {
			try {
				let uploadedFiles = [];
				await Promise.all(
					Array.from(e.target.files).map(async (file: File) => {
						const added = await client.add(file);
						uploadedFiles.push({ filename: file.name, hash: added.path });
					})
				);
				setFiles(uploadedFiles);
				setImageCount(Array.from(e.target.files).length);
			} catch (e) {
				console.log('Error uploading file: ', e);
			}
		}
	};

	const fileInput = useRef(null);

	const handleClick = (e) => {
		fileInput.current.click();
	};

	return (
		<div className='w-full flex flex-col justify-center items-center pb-4 absolute bottom-0 bg-white z-10 transition-height duration-500 ease-in-out h-max visible'>
			<div className='bg-[#14AEDE] m-0 p-0 w-full h-12 flex flex-col justify-center items-center'>
				{lat && lng ? (
					<div className='text-white text-lg font-semibold'>
						{lat} , {lng}
					</div>
				) : (
					<div className='text-white text-lg font-semibold'>
						<SearchIcon color='gray.300' /> Fetching User Location
					</div>
				)}
				{/* <div className="text-white font-normal text-xs">
          Brooklyn Bridge, New York, USA
        </div> */}
			</div>
			<form
				className='w-full flex flex-col justify-center items-center pl-5 pr-5'
				onSubmit={handleSubmit}>
				<div className='flex w-full justify-center items-center pb-4 pt-4'>
					<Textarea
						w={{ base: '90%', md: 3 / 5 }}
						bgColor='#d9d9d980'
						maxW='600px'
						placeholder="what's up"
						borderWidth='0.8px'
						borderColor='#00000020'
						className='w-full h-32 resize-none rounded-md bg-[#d9d9d980]'
						value={checkInMessage}
						onChange={handleChange}
						isRequired
					/>
				</div>
				{/* <Wallets /> */}
				{/* {loading && (
          <Audio
            height="50"
            width="100"
            color="#14aede"
            ariaLabel="audio-loading"
            wrapperStyle={{}}
            wrapperClass="wrapper-class"
            visible={true}
          />
        )} */}
				<div className='flex mb-4 w-full'>
					<input
						type='file'
						name='file'
						id='file'
						max={3}
						// value=''
						style={{ display: 'none' }}
						ref={fileInput}
						multiple
						onChange={handleFileSelect}
					/>
					<div className='w-[90%] md:w-3/5 mx-auto flex max-w-[600px] justify-between items-center'>
						<Button
							w='70%'
							mr='8px'
							bg='#89d7ef'
							color='#fff'
							_hover={{ bg: '#89d7ef' }}
							_active={{ bg: '#14aede' }}
							onClick={handleClick}
							disabled={imageCount >= 3}>
							Upload Images
						</Button>
						<div className='w-[20%] rounded-lg border'>
							<p className='text-[#14aede] font-bold'>{imageCount}/3</p>
						</div>
					</div>
				</div>
				{!loading ? (
					lat && lng ? (
						<Button
							type='submit'
							transition='all ease-in-out duration-500'
							color='#fff'
							bg='#14aede'
							mb={6}
							maxW='600px'
							w={{ base: '90%', md: 3 / 5 }}
							size={{ base: 'md', md: 'lg' }}
							colorScheme='telegram'
							_hover={{ bg: '#14A1DE' }}>
							Check-in
						</Button>
					) : (
						<Button
							type='submit'
							transition='all ease-in-out duration-500'
							color='#fff'
							bg='#14aede'
							mb={6}
							w={{ base: '90%', md: 3 / 5 }}
							maxW='600px'
							size={{ base: 'md', md: 'lg' }}
							colorScheme='telegram'
							_hover={{ bg: '#14A1DE' }}
							disabled>
							Check In
						</Button>
					)
				) : (
					<Audio
						height='50'
						width='100'
						color='#14aede'
						ariaLabel='audio-loading'
						wrapperStyle={{}}
						wrapperClass='wrapper-class'
						visible={true}
					/>
				)}
			</form>
			{success && (
				<div
					className='pdl'
					style={{
						display: `flex`,
						flexDirection: `column`,
						justifyContent: `center`,
						alignItems: `center`,
						width: `100%`,
						marginTop: `16px`,
					}}>
					<div className='pdl-data' style={{ paddingBottom: `16px` }}>
						Check-In Complete : {`${checkin.pdl}`}
					</div>
					<div className='explorer'>
						<a
							href={`https://explorer.solana.com/address/${checkin.pdl}?cluster=devnet`}
							target='_blank'>
							View in Explorer
						</a>
					</div>
				</div>
			)}
		</div>
	);
};

export default CheckIn;
