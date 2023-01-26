import { Center, Circle, Divider, Image } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Orbis } from '@orbisclub/orbis-sdk';
import FeedCard from '../components/FeedCard';
import SEOtag from '../components/SEOtag';

let orbis = new Orbis();

export default function Feed() {
  const [feedData, setFeedData] = useState<any>();
  const { publicKey } = useWallet();

  useEffect(() => {
    async function getPosts() {
      let isConnectedtoOrbis = await orbis.isConnected();
      console.log(isConnectedtoOrbis);
      if (!isConnectedtoOrbis) {
        await orbis.connect_v2({
          provider: window?.phantom?.solana,
          chain: 'solana',
        });
      } else {
        const { data, error } = await orbis.getPosts({ tag: 'proto' });
        console.log(data);
        setFeedData(data);
      }
    }

    if (publicKey) getPosts();
  }, [publicKey]);

  return (
    <div className="mb-24">
      <SEOtag title="Feed | Proto" />
      <div>
        <div className="mx-auto">
          <div className="divide-y divide-gray-300">
            {feedData?.map((data, index) => (
              <FeedCard
                key={index}
                body={data.content.body}
                files={data.content.files}
                lat={data.content.data.latitude}
                long={data.content.data.longitude}
                tag={data.content.tags[1]?.title}
                username={data?.creator_details?.profile?.username}
                pfp={data?.creator_details?.profile?.pfp}
                date={data.timestamp}
                address={data?.creator_details?.metadata?.address}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
