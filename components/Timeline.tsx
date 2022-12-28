import React from 'react';

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

export default function TimelineProto() {
	function TimelineRow(props) {
		const { title, location, date, time, numimages, latitude, longitude, index, arrLength } =
			props;
		return (
			<>
				<li className='mb-10 ml-6'>
					<span className='flex absolute -left-3 justify-center items-center w-6 h-6 bg-white rounded-full ring-8 ring-white '>
						<svg
							width='18'
							height='20'
							viewBox='0 0 18 20'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<circle cx='6.5' cy='10.5' r='2.5' fill='#14AEDE' />
							<path
								d='M12.875 10.5C12.875 14.0208 10.0208 16.875 6.5 16.875C2.97918 16.875 0.125 14.0208 0.125 10.5C0.125 6.97918 2.97918 4.125 6.5 4.125C10.0208 4.125 12.875 6.97918 12.875 10.5Z'
								stroke='#14AEDE'
								stroke-width='0.25'
							/>
							<path
								d='M9 19C13.4183 19 17 14.9706 17 10C17 5.02944 13.4183 1 9 1'
								stroke='#14AEDE'
								stroke-width='0.25'
							/>
						</svg>
					</span>
					<h3 className='flex items-center mb-1 text-lg font-medium text-[#14AEDE]'>
						{title}
					</h3>
					<p className='flex items-center mb-1 text-sm text-gray-900'>@{location}</p>
					<time className='block mb-2 text-sm font-normal leading-none text-gray-600 '>
						{date}, {time}
					</time>
					<p className=' font-normal text-gray-500 text-xs'>
						Uploaded {numimages} images
					</p>
					<p className='flex items-center text-sm text-gray-800'>
						{latitude}, {longitude}
					</p>
				</li>
			</>
		);
	}

	return (
		<div className='ml-5 z-0 block'>
			<ol className='relative border-l border-[#14AEDE]'>
				{timelineData.map((data, index) => (
					<TimelineRow
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
	);
}
