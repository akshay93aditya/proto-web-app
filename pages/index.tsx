import { Button, Center } from '@chakra-ui/react';
import React, { Suspense, useEffect, useState, useRef } from 'react';
import CheckIn from '../components/CheckInForm';
import Loading from '../components/Loading';
import Map from '../components/Map';

export default function Checkin() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  function ClickedOutside(ref) {
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
  ClickedOutside(wrapperRef);

  return (
    <Suspense fallback={<Loading />}>
      <Center>
        <Button
          transition="all ease-in-out duration-500"
          _hover={{ bg: '#14A1DE' }}
          color="#fff"
          bg="#14aede"
          position="absolute"
          zIndex="10"
          bottom="0"
          mb={{ base: 20, md: 4 }}
          w={{ base: '90%', md: 3 / 5 }}
          maxW="600px"
          size="lg"
          colorScheme="telegram"
          onClick={() => setIsOpen(true)}
        >
          Check-in
        </Button>
      </Center>
      <Map />
      <div>
        {isOpen ? (
          <div ref={wrapperRef}>
            <CheckIn />
          </div>
        ) : (
          <div className="height-0 width-0 invisible"></div>
        )}
      </div>
    </Suspense>
  );
}
