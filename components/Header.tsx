import React from 'react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

export default function Header() {
	return (
		<div className='flex p-2'>
			<InputGroup>
				<Input
					placeholder='Search'
					variant='filled'
					type='text'
					border='1px'
					borderColor='gray.300'
					// _text={{ color: 'black' }}
					color='gray.800'
				/>
				<InputLeftElement pointerEvents='none' children={<SearchIcon color='gray.300' />} />
			</InputGroup>
		</div>
	);
}
