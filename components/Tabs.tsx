import { Box } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { CheckInIcon, LifelogIcon, OptionsIcon } from '../dynamic/Tabs';

export default function Tabs() {
	const TabLinks = [
		{
			name: 'LifeLog',
			icon: <LifelogIcon />,
			link: '/lifelog',
		},
		{
			name: 'CheckIn',
			icon: <CheckInIcon />,
			link: '/checkin',
		},
		{
			name: 'Options',
			icon: <OptionsIcon />,
			link: '/',
		},
	];

	return (
		<div className='w-full z-20'>
			<section className='block fixed inset-x-0 bottom-0 z-10 bg-white shadow p-2'>
				<div className='flex justify-around'>
					{TabLinks.map((tab, index) => {
						return (
							<a href={tab.link} key={index}>
								{tab.icon}
							</a>
						);
					})}
				</div>
			</section>
		</div>
	);
}
