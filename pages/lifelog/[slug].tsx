import { Center, Flex, SimpleGrid } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Timeline from '../../components/Timeline';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import SingleCheckIn from '../../components/SingleCheckIn';

export default function SingleLifelog() {
  const router = useRouter();
  const { slug } = router.query;
  const [checkIn, setCheckin] = useState<any>();
  const [user, setUser] = useState<any>();

  const wallet = useWallet();

  useEffect(() => {
    async function getCheckInDetails() {
      try {
        const checkInDetails = await axios.get(
          `https://proto-api.onrender.com/checkins/${slug}`
        );
        console.log(checkInDetails.data);
        setCheckin(checkInDetails.data);
      } catch (e) {
        console.log(e);
      }
    }
    async function getUserDetails() {
      try {
        const res = await axios.get('https://proto-api.onrender.com/users', {
          params: { wallet_address: wallet.publicKey },
        });
        console.log(res.data);
        setUser(res.data[0]);
      } catch (e) {
        console.log(e);
      }
    }
    if (slug) {
      getCheckInDetails();
    }
    if (wallet) {
      getUserDetails();
    }
  }, [slug, wallet]);

  return (
    <div>
      {checkIn && user && (
        <SingleCheckIn
          address={checkIn.user_wallet_address}
          body={checkIn.message}
          tag={checkIn.tag}
          username={user.name}
          lat={checkIn.latitude}
          long={checkIn.longitude}
          date={checkIn.createdAt}
          files={checkIn.files}
          pfp={user.profile_picture?.hash}
        />
      )}

      {/* <div className='w-auto md:w-[500px] mx-auto p-4'>
				<p className='text-xs mt-6 opacity-70'>
					Signature:
					4tWNvnVxdeC4Kgb98o8pcu3jKZ4GcwSRotURB4BmaL5krVapfNJuYEZ8zZ3k3BECZthW9XnhxDHHSkfJFHJPpEgA
				</p>
				<p className='text-[10px] opacity-60 mt-2'>
					Signer: EuKeq6QN1UB88LgSXvjyoSd3t49F3ykggrFfpuWotA1K
				</p>
			</div> */}
    </div>
  );
}
