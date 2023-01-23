import { useState, useEffect, useRef } from 'react';
import { utils, Program, AnchorProvider } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { Audio } from 'react-loader-spinner';
import { Button, Circle, Textarea, useToast } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { create } from 'ipfs-http-client';
import {
	clusterApiUrl,
	ConfirmOptions,
	Connection,
	PublicKey,
	SystemProgram,
} from '@solana/web3.js';
import { latLngToCell } from 'h3-js';
import { FailedCheckInIcon } from '../dynamic/CheckInIcons';
import { Orbis } from '@orbisclub/orbis-sdk';

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

let orbis = new Orbis();

const CheckIn = () => {
	const [lat, setlat] = useState<number>(0);
	const [lng, setlng] = useState<number>(0);
	const [checkInMessage, setcheckInMessage] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [checkInSignature, setCheckInSignature] = useState<string>('');
	const [pdl, setPdl] = useState<string>('');
	const [success, setSuccess] = useState<boolean>(false);
	const [checkin, setcheckIn] = useState<object>();
	const [imageCount, setImageCount] = useState<number>(0);
	const [files, setFiles] = useState([]);
	const [selectedTag, setSelectedTag] = useState<any>([{ title: 'proto', slug: 'proto' }]);

	const [user, setUser] = useState<string>('');

	const wallet = useWallet();

	async function connect() {
		let res = await orbis.connect_v2({
			provider: window?.phantom?.solana,
			chain: 'solana',
		});

		if (res.status == 200) {
			setUser(res.did);
			console.log(user);
			const { data, error } = await orbis.getDids(wallet.publicKey);
			console.log('connect fn:', data[0]);
		} else {
			console.log('Error connecting to Ceramic: ', res);
			alert('Error connecting to Ceramic.');
		}
	}

	const toast = useToast();
	const successToast = () =>
		toast({
			title: `Check-In Complete: ${pdl}`,
			description: (
				<a
					href={`https://explorer.solana.com/tx/${checkInSignature}?cluster=devnet`}
					rel='noreferrer'
					target='_blank'>
					View in Explorer
				</a>
			),
			status: 'success',
			duration: 5000,
			isClosable: true,
		});

	useEffect(() => {
		const options = {
			enableHighAccuracy: false,
			timeout: 5000,
			maximumAge: Infinity,
		};
		function success(position: any) {
			setlat(position.coords.latitude);
			setlng(position.coords.longitude);
		}
		function error(err: any) {
			console.warn(`ERROR(${err.code}): ${err.message}`);
		}
		navigator.geolocation.getCurrentPosition(success, error, options);
	}, []);

	const opts: ConfirmOptions = {
		preflightCommitment: 'processed',
	};

	const network = 'https://solana-devnet.g.alchemy.com/v2/6nOSXYNw7tWYjDzvQ2oLBVBfMg6Gj9Ho';

	const getProvider = () => {
		const connection = new Connection(network, opts.preflightCommitment);
		const provider = new AnchorProvider(connection, window.solana, opts);
		return provider;
	};

	const getProgram = async () => {
		const provider = getProvider();
		// Get metadata about your solana program
		const idl = await Program.fetchIdl(process.env.NEXT_PUBLIC_PROGRAM_ID, provider);
		// Create a program that you can call
		return new Program(idl, process.env.NEXT_PUBLIC_PROGRAM_ID, provider);
	};

	let baseUrl = 'https://proto-api.onrender.com';

	async function CheckInTransaction(mongoId: string) {
		const provider = getProvider();
		const hindex = latLngToCell(lat, lng, 7);

		const program = await getProgram();

		const [checkInPDA] = PublicKey.findProgramAddressSync(
			[
				utils.bytes.utf8.encode('check-in-data'),
				provider.wallet.publicKey.toBuffer(),
				Buffer.from(mongoId),
				Buffer.from(hindex),
			],
			program.programId
		);

		try {
			const sig = await program.methods
				.checkIn(hindex, mongoId, checkInMessage)
				.accounts({
					user: provider.wallet.publicKey,
					checkIn: checkInPDA,
					systemProgram: SystemProgram.programId,
				})
				.rpc();
			// save generated pdl for this checkin
			const checkinPdlResponse = await axios({
				method: 'post',
				url: `${baseUrl}/checkins/ ${mongoId}/pdls`,
				data: {
					pdl: checkInPDA,
				},
			});
			setPdl(checkInPDA.toString());
			setcheckIn(checkinPdlResponse.data);
			setCheckInSignature(sig);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	async function handleSubmit(e: any) {
		e.preventDefault();
		try {
			setLoading(true);
			setSuccess(false);
			if (!wallet.publicKey) {
				alert('Wallet Not Connected');
				setLoading(false);
				return;
			}

			const usersResponse = await orbis.isConnected();
			if (usersResponse.status == 200) {
				// const checkinResponse = await axios({
				// 	method: 'post',
				// 	url: `${baseUrl}/checkins`,
				// 	data: {
				// 		user_wallet_address: wallet.publicKey.toString(),
				// 		message: checkInMessage,
				// 		latitude: lat,
				// 		longitude: lng,
				// 		...(files && { files }),
				// 		tag: selectedTag,
				// 	},
				// });
				console.log(usersResponse);
				const checkinResponse = await orbis.createPost({
					body: checkInMessage,
					data: {
						latitude: lat,
						longitude: lng,
					},
					tags: selectedTag,
					files: files,
				});
				if (checkinResponse.status === 200) {
					console.log(checkinResponse);
					await CheckInTransaction(checkinResponse.doc);
					setcheckIn(checkinResponse.data);
					setLoading(false);
					setSuccess(true);
				}
				// await CheckInTransaction(checkinResponse.data.doc);
				// setcheckIn(checkinResponse.data);
				// setLoading(false);
				// setSuccess(true);
				// successToast();
			}
			// else {
			// 	await axios({
			// 		method: 'post',
			// 		url: `${baseUrl}/users`,
			// 		data: {
			// 			wallet_address: wallet.publicKey.toString(),
			// 		},
			// 	});

			// 	const checkinResponse = await axios({
			// 		method: 'post',
			// 		url: `${baseUrl}/checkins`,
			// 		data: {
			// 			user_wallet_address: wallet.publicKey.toString(),
			// 			message: checkInMessage,
			// 			latitude: lat,
			// 			longitude: lng,
			// 			...(files && { files }),
			// 		},
			// 	});
			// 	await CheckInTransaction(checkinResponse.data._id);
			// 	setcheckIn(checkinResponse.data);
			// 	setLoading(false);
			// 	setSuccess(true);
			// 	// successToast();
			// }
		} catch (error) {
			console.log(error);
			setLoading(false);
			setSuccess(false);
		}
	}

	function handleChange(e: any) {
		setcheckInMessage(e.target.value);
	}

	const handleFileSelect = async (e: any) => {
		if (Array.from(e.target.files).length > 3) {
			alert('You can only select a maximum of 3 files.');
		} else {
			try {
				let uploadedFiles = [];
				await Promise.all(
					Array.from(e.target.files).map(async (file: File) => {
						const added = await client.add(file);
						uploadedFiles.push({
							url: `ipfs://${added.path}`,
							gateway: 'https://proto.infura-ipfs.io',
						});
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

	const handleClick = () => {
		fileInput.current.click();
	};

	const Tag = ({ title, slug, color }) => {
		const icon = title.charAt(0);

		const handleClick = () => {
			let newTag = [{ title: 'proto', slug: 'proto' }];
			newTag.push({ title: title, slug: slug });
			setSelectedTag(newTag);
		};

		return (
			<div
				className={`mx-1 flex flex-col items-center justify-center cursor-pointer p-2 box-border transition-all ease-in-out duration-200 h-[60px] ${
					title === selectedTag[1]?.title && 'border-[1.5px] border-primary rounded-md'
				}`}
				onClick={handleClick}>
				<Circle bg={color} p={1} size='24px'>
					<p className='font-black text-white'>{icon}</p>
				</Circle>
				<p className='text-gray-400 text-[8px] font-medium text-center'>{title}</p>
			</div>
		);
	};

	const tags = [
		{
			title: 'Event',
			slug: 'Event',
			color: '#85b9bc',
		},
		{
			title: 'Landmark',
			slug: 'Landmark',
			color: '#efbc89',
		},
		{
			title: 'Food',
			slug: 'Food',
			color: '#dead2a',
		},
		{
			title: 'Market',
			slug: 'Market',
			color: '#83b8c8',
		},
		{
			title: 'Tourism',
			slug: 'Tourism',
			color: '#ccfe55',
		},
		{
			title: 'Pt of Interest',
			slug: 'PtOfInterest',
			color: '#89d7ef',
		},
	];

	return (
		<div className='w-full flex flex-col justify-center items-center pb-4 absolute bottom-0 bg-white z-10 transition-height duration-500 ease-in-out h-max visible'>
			<div className='bg-primary m-0 p-0 w-full h-12 flex flex-col justify-center items-center relative'>
				{lat && lng ? (
					<div className='text-white text-lg font-semibold'>
						{lat} , {lng}
					</div>
				) : (
					<div className='text-white text-lg font-semibold'>
						<SearchIcon color='gray.300' /> Fetching User Location
					</div>
				)}
				<div className='absolute right-[60px] md:right-[300px]'>
					<FailedCheckInIcon />
				</div>
			</div>
			<form
				className=' flex flex-col justify-center items-center md:px-5 px-2 py-6 md:py-2 w-[90%] md:[w-3/5] max-w-[600px]'
				onSubmit={handleSubmit}>
				<div className='flex w-full justify-center items-center pb-4 pt-4'>
					<Textarea
						bgColor='#d9d9d980'
						placeholder="what's up?"
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
				<div className='flex justify-between w-full mb-4 box-border'>
					{tags.map((tag) => {
						return (
							<Tag
								title={tag.title}
								color={tag.color}
								key={tag.title}
								slug={tag.slug}
							/>
						);
					})}
				</div>
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
					<div className='w-full mx-auto flex justify-between items-center'>
						<Button
							w='90%'
							mr='8px'
							// size='sm'
							color='primary'
							variant='outline'
							colorScheme='telegram'
							onClick={handleClick}
							disabled={imageCount >= 3}>
							Upload Images
							{/* ({imageCount}/3) */}
						</Button>
						<div className='w-[10%] rounded-lg border borderColor'>
							<p className='text-primary font-md text-center'>{imageCount}/3</p>
						</div>
					</div>
				</div>
				{!loading ? (
					<Button
						type='submit'
						transition='all ease-in-out duration-500'
						color='#fff'
						bg='#14aede'
						maxW='600px'
						w='full'
						size='lg'
						colorScheme='telegram'
						_hover={{ bg: '#14A1DE' }}
						disabled={!lat || !lng}
						mb={{ base: 16, md: 2 }}>
						Check-in
					</Button>
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
			{success && successToast()}
		</div>
	);
};

export default CheckIn;
