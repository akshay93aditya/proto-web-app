import React from 'react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Button from './ConnectButton';
import { useRouter } from 'next/router';
import { LogoSmall } from '../dynamic/Logo';

export default function Header() {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-20 flex w-full items-center justify-between bg-white py-2 px-2 shadow md:px-8">
      <LogoSmall onClick={() => router.push('/')} />
      {router.pathname === '/' && (
        <InputGroup ml="4">
          <Input
            placeholder="Search"
            variant="filled"
            type="text"
            border="1px"
            borderColor="gray.300"
            color="gray.800"
            fontFamily="Inter"
          />
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
        </InputGroup>
      )}
      <div className="ml-4">
        <Button />
      </div>
    </div>
  );
}
