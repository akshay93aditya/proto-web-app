import React from 'react';
import { Logo } from '../dynamic/Logo';

export default function Loading() {
	return (
		<>
			<div className='flex flex-col h-screen justify-center z-10'>
				<div className='my-48'>
					<Logo />
				</div>
				<div className='flex items-center w-2/3 mx-auto my-16'>
					<div className='border-t border-solid border-slate-500 flex-grow m-2'></div>
					<span>de_plan</span>
					<div className='border-t border-slate-500 flex-grow m-2'></div>
				</div>
			</div>
		</>
	);
}
