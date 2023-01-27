import { Center, Skeleton, SkeletonText } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import Timeline from '../../components/Timeline';
import { useWallet } from '@solana/wallet-adapter-react';
import SEOtag from '../../components/SEOtag';
import { useTimelineData } from '../../utils/checkInInfo';

export default function Lifelog() {
  const [timelineData, setTimelineData] = useState([]);
  const { publicKey } = useWallet();

  const { data, status, error } = useTimelineData(publicKey);

  useEffect(() => {
    if (status == 'success') {
      const reversedData = data.data.sort(
        (a, b) => b.created_at - a.created_at
      );
      console.log(data.data);
      setTimelineData(reversedData);
    }
  }, [data, status, error]);

  return (
    <div>
      <SEOtag title="Lifelog | Proto" />
      <Center>
        {status == 'loading' ? (
          <SkeletonText
            noOfLines={30}
            width="40%"
            maxW="800px"
            mx="auto"
            my={20}
            spacing="4"
            startColor="gray.100"
            endColor="gray.300"
          />
        ) : (
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
        )}
      </Center>
    </div>
  );
}
