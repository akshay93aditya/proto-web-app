import '../styles/globals.css';
import { AppProps } from 'next/app';
import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react';
import Layout from '../components/Layout';

const theme = extendTheme({
	styles: {
		global: () => ({
			body: {
				bg: '#fff',
			},
		}),
	},
	// initialColorMode: 'light',
	// useSystemColorMode: false,
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ChakraProvider>
	);
}

export default MyApp;
