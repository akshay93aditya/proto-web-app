import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  initialColorMode: 'light',
  useSystemColorMode: false,
  colors: {
    primary: '#14aede',
  },
  styles: {
    global: () => ({
      body: {
        bg: '#fff',
      },
    }),
  },
});
