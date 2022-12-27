import styled from 'styled-components';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
	{ ssr: false }
);
const ConnectButton = styled(WalletMultiButtonDynamic)`
	background: #14aede;
	width: 130px;
	font-size: 14px;
	padding: 0;
	margin: 0;
	transition: all 0.2s ease-in-out;
	justify-content: center;
	height: 40px;
	font-family: 'Montserrat', sans-serif;
`;

const Home = () => {
	const { connected } = useWallet();

	return <>{!connected ? <ConnectButton>Connect Wallet</ConnectButton> : <ConnectButton />}</>;
};

export default Home;
