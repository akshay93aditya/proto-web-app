import { useRouter } from 'next/router';
import React from 'react';
import { TimeLineDot } from '../dynamic/CheckInIcons';
import dateFormat from 'dateformat';
import { Circle } from '@chakra-ui/react';
import { TagList } from './Taglist';

export default function Timeline(props) {
  const router = useRouter();
  const {
    message,
    createdAt,
    files,
    latitude,
    longitude,
    tag,
    index,
    arrLength,
    id,
  } = props;
  const dateTime = dateFormat(createdAt, 'dd mmmm yyyy, HH:MM:ss');
  const numImages = files.length;
  const tagIcon = TagList.find((item) => item.title === tag)?.icon;
  return (
    <>
      <li
        className="mb-10 ml-6 cursor-pointer"
        onClick={() => router.push(`/lifelog/${id}`)}
      >
        <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-8 ring-white ">
          <TimeLineDot />
        </span>
        <h3 className="mb-2 flex items-center text-[1.35rem] text-primary">
          {message}
        </h3>
        <div className="mb-1 flex items-center">
          {tag && (
            <>
              <Circle bg="primary" p={1} my={2} size="18px">
                <p className="text-xs font-bold text-white">{tagIcon}</p>
              </Circle>
              <p className="mx-2 text-gray-400">·</p>
            </>
          )}
          <p className=" flex items-center  text-gray-600">
            {latitude}, {longitude}
          </p>
        </div>
        {/* <p className='flex items-center mb-1 text-sm text-gray-900'>@{location}</p> */}
        <time className="my-2 block text-[13px] font-light leading-none text-gray-500 ">
          {dateTime}
        </time>
        <p className=" text-xs font-normal text-gray-400">
          Uploaded {numImages} images
        </p>
      </li>
    </>
  );
}
