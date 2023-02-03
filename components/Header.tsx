import React from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  Button as ChakraButton,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Button from './ConnectButton';
import { useRouter } from 'next/router';
import { LogoSmall } from '../dynamic/Logo';

export default function Header() {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-20 flex w-full items-center justify-between bg-white py-2 px-2 shadow md:px-8">
      <LogoSmall onClick={() => router.push('/')} />
      <div className="ml-4 flex items-center">
        {router.pathname === '/' && (
          <ChakraButton
            colorScheme="telegram"
            variant="outline"
            color="primary"
            mr="8px"
            onClick={() => router.push('/history')}
          >
            View Check-In History
          </ChakraButton>
        )}
        {router.pathname === '/history' && (
          <ChakraButton
            colorScheme="telegram"
            variant="outline"
            color="primary"
            mr="8px"
            onClick={() => router.push('/')}
          >
            New Check-In
          </ChakraButton>
        )}
        <Button />
      </div>
    </div>
  );
}
