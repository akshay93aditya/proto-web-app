import '../styles/globals.css';
import { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Layout from '../components/Layout';
import Wallets from '../components/Wallets';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

import { theme } from '../config/chakra.config';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { OrbisContext } from '../context/OrbisContext';
import { Orbis } from '@orbisclub/orbis-sdk';

const queryClient = new QueryClient();

let orbis = new Orbis();

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<string>(null);

  async function isConnectedtoOrbis() {
    let res = await orbis.isConnected();
    if (res && res.status == 200) {
      setUser(res.details);
    } else {
      await orbis.connect_v2({
        provider: window?.phantom?.solana,
        chain: 'solana',
      });
    }
  }
  useEffect(() => {
    if (!user) {
      isConnectedtoOrbis();
    }
  }, [user]);

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <Wallets>
          <OrbisContext.Provider value={{ user, setUser, orbis }}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </OrbisContext.Provider>
        </Wallets>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
