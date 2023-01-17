import { Center } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import Timeline from '../../components/Timeline';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Lifelog() {
	const [timelineData, setTimelineData] = useState([]);
	const { publicKey } = useWallet();
	useEffect(() => {
		async function getTimelineData() {
			try {
				const timelineResponse = await axios.get(
					'https://proto-api.onrender.com/checkins',
					{
						params: { user_wallet_address: publicKey },
					}
				);
				setTimelineData(timelineResponse.data);
			} catch (err) {
				console.log(err);
			}
		}

		if (publicKey) getTimelineData();
	}, [publicKey]);

	return (
		<div>
			<Center>
				<div className=' z-0 block my-10'>
					<ol className='relative border-l border-primary'>
						{timelineData?.map((data, index) => (
							<Timeline
								key={index}
								message={data.message}
								location={data.location}
								createdAt={data.createdAt}
								files={data.files}
								latitude={data.latitude}
								longitude={data.longitude}
								tag={data?.tag}
								index={index}
								arrLength={timelineData.length}
							/>
						))}
					</ol>
				</div>
			</Center>
		</div>
	);
}
