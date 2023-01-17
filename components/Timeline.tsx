import { useRouter } from 'next/router';
import React from 'react';
import { TimeLineDot } from '../dynamic/CheckInIcons';
import dateFormat from 'dateformat';

export default function Timeline(props) {
	const router = useRouter();
	const { message, createdAt, files, latitude, longitude, tag, index, arrLength } = props;
	const date = dateFormat(createdAt, 'dd mmmm yyyy, HH:MM:ss');
	const numImages = files.length;
	return (
		<>
			<li
				className='mb-10 ml-6 cursor-pointer'
				onClick={() => router.push(`/lifelog/${latitude + longitude}`)}>
				<span className='flex absolute -left-3 justify-center items-center w-6 h-6 bg-white rounded-full ring-8 ring-white '>
					<TimeLineDot />
				</span>
				<h3 className='flex items-center mb-1 text-lg font-medium text-[#14AEDE]'>
					{message}
				</h3>
				{/* <p className='flex items-center mb-1 text-sm text-gray-900'>@{location}</p> */}
				<time className='block mb-2 text-sm font-normal leading-none text-gray-600 '>
					{date}
				</time>
				<p className=' font-normal text-gray-500 text-xs'>Uploaded {numImages} images</p>
				<p className='flex items-center text-sm text-gray-800'>
					{latitude}, {longitude}
				</p>
			</li>
		</>
	);
}
