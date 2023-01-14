import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { Center, chakra, Flex } from '@chakra-ui/react';
import '@solana/wallet-adapter-react-ui/styles.css';
import { WalletIcon } from '../dynamic/WalletIcon';

import { WalletIcon as Icon } from '@solana/wallet-adapter-react-ui';

const WalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
	{ ssr: false }
);

const ConnectButton = chakra(WalletMultiButtonDynamic);

const Button = () => {
	const { connected, wallet } = useWallet();

	return (
		<>
			{!connected ? (
				<ConnectButton
					bg='#14aede'
					fontSize={{ base: '11px', md: '14px' }}
					padding={{ base: '6px', md: '16px' }}
					height='40px'
					transition='0.2s ease-in-out'
					whiteSpace='nowrap'>
					<WalletIcon />
				</ConnectButton>
			) : (
				<ConnectButton
					bg='primary'
					fontSize={{ base: '11px', md: '14px' }}
					padding={{ base: '6px', md: '16px' }}
					// height='40px'
					transition='0.2s ease-in-out'
					whiteSpace='nowrap'
					// color='transparent'
					p='0'
					m='0'
					h='40px'
					className='m-0 p-0'>
					{/* <WalletIcon /> */}
				</ConnectButton>
			)}
		</>
	);
};

export default Button;
