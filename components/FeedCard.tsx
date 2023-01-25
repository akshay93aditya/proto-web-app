import dateFormat from 'dateformat';
import { Center, Circle, Divider, Image } from '@chakra-ui/react';
import { TagList } from './Taglist';

export default function FeedCard({
  body,
  tag,
  username,
  lat,
  long,
  date,
  files,
  pfp,
  address,
}) {
  const dateTime = dateFormat(date * 1000, 'dd mmmm yyyy, HH:MM:ss');
  const url = files[0]?.url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  const tagIcon = TagList.find((t) => t.title === tag)?.icon;
  const truncatedAddress =
    address.substring(0, 4) + '...' + address.substring(address.length - 4);
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
              {username ? username : truncatedAddress}
            </p>
          </div>
          <p className=" py-1 text-lg font-medium text-primary">{body}</p>

          <p className="py-2 text-xs text-gray-600">{dateTime}</p>
          {tag && tagIcon}
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
}
