import { Center } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import Timeline from '../../components/Timeline';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { Orbis } from '@orbisclub/orbis-sdk';

// let orbis = new Orbis();

export default function Lifelog() {
  const [timelineData, setTimelineData] = useState([]);
  const { publicKey } = useWallet();

  useEffect(() => {
    async function getTimelineData() {
      try {
        const timelineResponse = await axios.get(
          'https://proto-api.onrender.com/checkins',
          {
            params: { user_wallet_address: publicKey },
          }
        );
        const reversedData = timelineResponse.data.sort(
          (a, b) => b.created_at - a.created_at
        );
        setTimelineData(reversedData);
      } catch (err) {
        console.log(err);
      }
    }

    if (publicKey) getTimelineData();
  }, [publicKey]);

  return (
    <div>
      <Center>
        <div className=" z-0 my-10 block">
          <ol className="relative border-l border-primary">
            {timelineData?.map((data, index) => (
              <Timeline
                key={index}
                message={data.message}
                location={data.location}
                createdAt={data.createdAt}
                files={data.files}
                latitude={data.latitude}
                longitude={data.longitude}
                tag={data?.tag}
                index={index}
                id={data._id}
                arrLength={timelineData.length}
              />
            ))}
          </ol>
        </div>
      </Center>
    </div>
  );
}
