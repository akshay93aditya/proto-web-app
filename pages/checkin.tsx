import React from 'react';
import CheckIn from '../components/CheckIn';
import Map from '../components/Map';

export default function checkin() {
	return (
		<div className='m-0 p-0'>
			<Map />
			<CheckIn />
		</div>
	);
}
