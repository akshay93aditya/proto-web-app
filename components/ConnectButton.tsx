import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { chakra } from '@chakra-ui/react';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
	{ ssr: false }
);

const ConnectButton = chakra(WalletMultiButtonDynamic);

const Button = () => {
	const { connected } = useWallet();

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
					Connect Wallet
				</ConnectButton>
			) : (
				<ConnectButton
					bg='#14aede'
					fontSize={{ base: '11px', md: '14px' }}
					padding={{ base: '6px', md: '16px' }}
					height='40px'
					transition='0.2s ease-in-out'
					whiteSpace='nowrap'
				/>
			)}
		</>
	);
};

export default Button;
