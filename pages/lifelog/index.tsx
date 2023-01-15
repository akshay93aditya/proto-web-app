import { Center } from '@chakra-ui/react';
import React from 'react';
import Timeline from '../../components/Timeline';

const timelineData = [
	{
		title: 'Attending Solana Hackerhouse!',
		location: 'XYZ, USA',
		date: '19 November 2022',
		time: '18:21:34',
		numimages: 2,
		latitude: 40.709139,
		longitude: 74.000905,
	},
	{
		title: 'Attending Solana Hackerhouse!',
		location: 'XYZ, USA',
		date: '19 November 2022',
		time: '18:21:34',
		numimages: 2,
		latitude: 40.709139,
		longitude: 74.000905,
	},
	{
		title: 'Attending Solana Hackerhouse!',
		location: 'XYZ, USA',
		date: '19 November 2022',
		time: '18:21:34',
		numimages: 2,
		latitude: 40.709139,
		longitude: 74.000905,
	},
	{
		title: 'Attending Solana Hackerhouse!',
		location: 'XYZ, USA',
		date: '19 November 2022',
		time: '18:21:34',
		numimages: 2,
		latitude: 40.709139,
		longitude: 74.000905,
	},
];

export default function Lifelog() {
	return (
		<div>
			<Center>
				<div className=' z-0 block my-10'>
					<ol className='relative border-l border-primary'>
						{timelineData.map((data, index) => (
							<Timeline
								key={index}
								title={data.title}
								location={data.location}
								date={data.date}
								time={data.time}
								numimages={data.numimages}
								latitude={data.latitude}
								longitude={data.longitude}
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
