import React, { Suspense, useEffect, useState, useRef } from 'react';
import CheckIn from '../components/CheckIn';
import Loading from '../components/Loading';
import Map from '../components/Map';

const CheckinIcon2 = () => {
	return (
		<svg width='33' height='33' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<g clipPath='url(#prefix__clip0_202_247)'>
				<path
					d='M26.77 14.025v.066c-.016 2.13-.794 3.978-2.083 5.802-1.308 1.851-3.128 3.66-5.19 5.707 0 0 0 0 0 0l-.015.016c-.976.969-1.981 1.966-2.994 3.035-.83-.882-1.688-1.746-2.521-2.585h0c-1.973-1.987-3.867-3.896-5.272-5.872C7.293 18.222 6.4 16.211 6.4 14.025 6.4 8.41 10.97 3.84 16.585 3.84c5.616 0 10.185 4.57 10.185 10.186zm-5.716 13.142h0l.051-.05c4.16-4.131 7.874-7.82 7.874-13.092 0-6.835-5.56-12.394-12.393-12.394C9.75 1.63 4.19 7.19 4.19 14.025c0 2.686 1.066 5.087 2.617 7.309 1.547 2.215 3.593 4.275 5.583 6.279l.008.009h0l.03.03c1.089 1.097 2.207 2.223 3.235 3.362l.592.656.22.245.224-.243.597-.652s0 0 0 0c1.26-1.373 2.526-2.631 3.757-3.853zm-6.505-5.235l.248.237.202-.276 8.551-11.68.177-.241-.242-.178-1.297-.95-.243-.178-.177.242-7.263 9.92-2.296-2.204-.217-.207-.207.216-1.114 1.161-.208.217.217.207 3.87 3.714z'
					fill='#fff'
					stroke='#fff'
					strokeWidth='.6'
				/>
			</g>
			<defs>
				<clipPath id='prefix__clip0_202_247'>
					<path fill='#fff' transform='translate(.7 .7)' d='M0 0h32v32H0z' />
				</clipPath>
			</defs>
		</svg>
	);
};

export default function checkin() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	function clickedOutside(ref) {
		useEffect(() => {
			function handleClickOutside(event) {
				if (ref.current && !ref.current.contains(event.target)) {
					setIsOpen(false);
				}
			}
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, [ref]);
	}

	const wrapperRef = useRef(null);
	clickedOutside(wrapperRef);

	return (
		<>
			<div
				className='absolute bottom-[32px] right-[24px] z-10 p-2 bg-[#14AEDE] rounded-lg shadow-lg transition-all ease-in-out duration-1000 cursor-pointer'
				onClick={() => setIsOpen(true)}>
				<CheckinIcon2 />
			</div>
			<Map />
			<div>
				{isOpen ? (
					<div ref={wrapperRef}>
						<CheckIn />
					</div>
				) : (
					<div className='invisible height-0 width-0'></div>
				)}
			</div>
		</>
	);
}
