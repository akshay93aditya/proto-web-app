import { Center, Circle, Divider, Image } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import Timeline from '../components/Timeline';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { Orbis } from '@orbisclub/orbis-sdk';
import dateFormat from 'dateformat';

let orbis = new Orbis();

export default function Lifelog() {
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

  const FeedCard = ({ body, tag, username, lat, long, date, files, pfp }) => {
    const dateTime = dateFormat(date * 1000, 'dd mmmm yyyy, HH:MM:ss');
    const url = files[0]?.url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    const tagIcon = tag?.charAt(0);
    return (
      <div className="m-2 px-2 py-4 ">
        <div className="flex items-center justify-between">
          <div className="mx-6">
            <div className="flex items-center align-middle ">
              <Image
                src={pfp ? pfp : 'profileplaceholder.svg'}
                alt="pfp"
                className=" mr-2 h-8 w-8 cursor-pointer rounded-full border border-[#b6b8b9] object-cover"
              />
              <p className="py-2 text-sm font-semibold text-gray-700">
                {username}
              </p>
            </div>
            <p className=" py-1 text-lg font-medium text-primary">{body}</p>

            <p className="py-2 text-xs text-gray-600">{dateTime}</p>
            {tag && (
              <Circle bg="primary" p={1} size="18px">
                <p className="text-xs font-bold text-white">{tagIcon}</p>
              </Circle>
            )}
            <p className="py-2 text-xs text-gray-600">
              {lat}, {long}
            </p>
          </div>
          <div className="mx-6">
            {files?.length > 0 && (
              <Image src={url} alt="" className="h-16 w-16 object-cover" />
            )}
          </div>
        </div>
        {/* <Divider color='gray.500' /> */}
      </div>
    );
  };

  return (
    <div className="mb-24">
      <div>
        <Center>
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
              />
            ))}
          </div>
        </Center>
      </div>
    </div>
  );
}
