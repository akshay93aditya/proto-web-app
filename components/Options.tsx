import {
  Center,
  Heading,
  Skeleton,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FailedCheckInIcon, SuccessCheckInIcon } from '../dynamic/CheckInIcons';
import { useTimelineData } from '../utils/checkInInfo';
import { placesCounter } from '../utils/placesCounter';
import { regionCounter } from '../utils/regionCounter';

interface Region {
  countries: number;
  continents: number;
  // cities: number;
}

interface Places {
  Event: number;
  Food: number;
  Landmark: number;
  Market: number;
  'Pt of Interest': number;
  Tourism: number;
}

export default function Options() {
  const [regions, setRegions] = useState<Region>({
    countries: 0,
    continents: 0,
  });
  const [places, setPlaces] = useState<Places>({
    Event: 0,
    Food: 0,
    Landmark: 0,
    Market: 0,
    'Pt of Interest': 0,
    Tourism: 0,
  });
  const wallet = useWallet();
  const [checkInCount, setCheckInCount] = useState();

  const { data, status, error } = useTimelineData(wallet.publicKey);

  useEffect(() => {
    if (status == 'success') {
      setCheckInCount(data.data.length);
      console.log(data.data);
      setRegions(regionCounter(data.data));
      console.log(placesCounter(data.data));
      setPlaces(placesCounter(data.data));
    }
  }, [data, status, error]);

  return (
    <div className="mx-auto max-w-[800px]">
      {/* {tour && <Button onClick={tour.start}>Open Tour</Button>} */}
      <div className=" flex flex-col py-2 md:px-6">
        <div className="flex h-[200px]">
          <Link
            href="/history"
            className='relative m-2 w-1/2 rounded-lg
                    border-2 border-primary
					bg-[#6fe0a8] bg-[url("/map-placeholder.png")] bg-cover bg-no-repeat shadow-md'
          >
            {/* <Image src='/profileplaceholder.svg' alt='placeholder' fill /> */}
            <Heading
              fontSize="2xl"
              color="primary"
              className="absolute left-4 bottom-2"
              fontFamily="Inter"
            >
              Check-In Map
            </Heading>
          </Link>
          <div className="relative m-2 w-1/2 rounded-lg bg-[#DEAD2A] shadow-md">
            {checkInCount && (
              <Center>
                {status == 'loading' ? (
                  <>
                    <Skeleton height="20px" />
                  </>
                ) : (
                  <div className="flex p-4">
                    <div className="flex flex-col items-center">
                      <Heading color="#F8EED3" fontFamily="Inter">
                        0
                      </Heading>
                      <SuccessCheckInIcon />
                    </div>
                    <Heading color="#F8EED3" mx="8px" fontFamily="Inter">
                      /
                    </Heading>
                    <div className="flex flex-col items-center">
                      <Heading color="#F8EED3" fontFamily="Inter">
                        {checkInCount}
                      </Heading>
                      <FailedCheckInIcon />
                    </div>
                  </div>
                )}
              </Center>
            )}
            <Heading
              fontSize="2xl"
              color="#F1DDA7"
              className="absolute left-4 bottom-2"
              fontFamily="Inter"
            >
              Check-Ins
            </Heading>
          </div>
        </div>
        <div className="flex h-[200px]">
          <div className="relative m-2 w-1/2 rounded-lg bg-[#077191] p-4 shadow-md">
            <div className="flex items-center justify-between">
              <Heading color="#CEF2FD" fontFamily="Inter">
                {regions && regions.countries}
              </Heading>
              <Text color="#CEF2FD">Countries</Text>
            </div>
            <div className="flex items-center justify-between">
              <Heading color="#CEF2FD" fontFamily="Inter">
                {regions && regions.continents}
              </Heading>
              <Text color="#CEF2FD">Continents</Text>
            </div>

            <Heading
              fontSize="2xl"
              color="#9EE5FA"
              className="absolute left-4 bottom-2"
              fontFamily="Inter"
            >
              Regions
            </Heading>
          </div>
          <div className="relative m-2 w-1/2 rounded-lg bg-[#0c747a] p-4 shadow-md">
            <Heading
              fontSize="2xl"
              color="#A2F1F6"
              className="absolute left-4 bottom-2"
              fontFamily="Inter"
            >
              Places
            </Heading>
            <div className="text-sm">
              <div className="flex items-center justify-between">
                <Text color="#D1F8FA">{places && places.Event}</Text>
                <Text color="#D1F8FA">Events</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text color="#D1F8FA">{places && places.Food}</Text>
                <Text color="#D1F8FA">Food</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text color="#D1F8FA">{places && places.Landmark}</Text>
                <Text color="#D1F8FA">Landmarks</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text color="#D1F8FA">{places && places.Tourism}</Text>
                <Text color="#D1F8FA">Tourism</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text color="#D1F8FA">{places && places.Market}</Text>
                <Text color="#D1F8FA">Market</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text color="#D1F8FA">
                  {places && places['Pt of Interest']}
                </Text>
                <Text color="#D1F8FA">Points of Interest</Text>
              </div>
            </div>
          </div>
        </div>
        {wallet.connected && (
          <>
            <div className="mt-6 p-2">
              <p className=" text-sm text-gray-500 ">Wallet Address</p>
              <p className="text-gray-600 ">{wallet.publicKey?.toBase58()}</p>
            </div>
            <div className="rounded-md bg-primary p-2 ">
              <p className="text-center  font-medium text-white ">Connected</p>
            </div>
            {/* <p className='text-center '>You're connected to proto via </p> */}
          </>
        )}
      </div>
    </div>
  );
}
