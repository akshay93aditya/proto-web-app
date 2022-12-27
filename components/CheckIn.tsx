import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { Audio } from 'react-loader-spinner';
import { ToastContainer } from 'react-toastify';
import { Textarea } from '@chakra-ui/react';

const CheckIn = () => {
	const [lat, setlat] = useState(0);
	const [lng, setlng] = useState(0);
	// const [address, setAddress] = useState("");
	const [checkInMessage, setcheckInMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const { connected, publicKey } = useWallet();

	console.log(publicKey);
	console.log(connected);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				setlat(position.coords.latitude);
				setlng(position.coords.longitude);
			});
		}
	});

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setLoading(true);
			setSuccess(false);
			if (!connected) {
				alert('Wallet Not Connected');
				setLoading(false);
				return;
			}
			const usersResponse = await axios({
				method: 'get',
				url: 'https://proto-api.onrender.com/users',
				params: { wallet_address: publicKey.toString() },
			});

			if (usersResponse.data.length) {
				const checkinResponse = await axios({
					method: 'post',
					url: 'https://proto-api.onrender.com/checkins',
					data: {
						user_wallet_address: publicKey.toString(),
						message: checkInMessage,
						latitude: lat,
						longitude: lng,
					},
				});
			}
			const newUserResponse = await axios({
				method: 'post',
				url: 'https://proto-api.onrender.com/users',
				data: {
					wallet_address: publicKey.toString(),
				},
			});

			const checkinResponse = await axios({
				method: 'post',
				url: 'https://proto-api.onrender.com/checkins',
				data: {
					user_wallet_address: publicKey.toString(),
					message: checkInMessage,
					latitude: lat,
					longitude: lng,
				},
			});
			setLoading(false);
			setSuccess(true);
		} catch (error) {
			console.log(error);
			setLoading(false);
			setSuccess(false);
		}
	}

	function handleChange(e) {
		setcheckInMessage(e.target.value);
	}

	return (
		<div className='w-full flex flex-col justify-center items-center pb-4 absolute bottom-0 bg-white z-10 transition-height duration-500 ease-in-out h-fit visible'>
			<div className='bg-[#14AEDE] m-0 p-0 w-full h-12 flex flex-col justify-center items-center'>
				<div className='text-white text-lg font-semibold'>
					{lat},{lng}
				</div>
				{/* <div className="text-white font-normal text-xs">
          Brooklyn Bridge, New York, USA
        </div> */}
			</div>
			<form
				className='w-full flex flex-col justify-center items-center pl-5 pr-5'
				onSubmit={handleSubmit}>
				<div className='flex w-full justify-center items-center pb-4 pt-4'>
					<Textarea
						bgColor='#d9d9d980'
						placeholder="what's up"
						borderWidth='0.8px'
						borderColor='#00000020'
						className='w-full h-32 resize-none rounded-md bg-[#d9d9d980]'
						value={checkInMessage}
						onChange={handleChange}
					/>
				</div>
				{/* <Wallets /> */}
				{loading && (
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
				{!loading && (
					<button
						type='submit'
						style={{
							background: `#14aede`,
							width: `100%`,
							display: `flex`,
							justifyContent: `center`,
							alignItems: `center`,
							paddingLeft: `20px`,
							paddingRight: `20px`,
							height: `35px`,
							borderRadius: `6px`,
							color: `white`,
							fontWeight: `700`,
							fontSize: `20px`,
						}}>
						Check In
					</button>
				)}
			</form>
			{success && (
				<ToastContainer
					position='top-right'
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme='dark'
				/>
			)}
		</div>
	);
};

export default CheckIn;
