import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import SingleCheckIn from '../../components/SingleCheckIn';
import { useSingleCheckIn } from '../../utils/singleCheckInInfo';
import { useGetUserInfo } from '../../utils/userInfo';

export default function SingleLifelog() {
  const router = useRouter();
  const { slug } = router.query;
  const [checkIn, setCheckin] = useState<any>();
  const [user, setUser] = useState<any>();

  const wallet = useWallet();

  const { data, status, error } = useSingleCheckIn(slug);

  const {
    data: userData,
    status: userStatus,
    error: userError,
  } = useGetUserInfo(wallet.publicKey);

  useEffect(() => {
    if (status == 'success') {
      console.log(data.data);
      setCheckin(data.data);
    }

    if (userStatus == 'success') {
      console.log(userData.data);
      setUser(userData.data[0]);
    }
  }, [data, status, error, userData, userStatus, userError]);

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
