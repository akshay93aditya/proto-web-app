import { useRouter } from 'next/router';
import React from 'react';
import { TimeLineDot } from '../dynamic/CheckInIcons';
import dateFormat from 'dateformat';

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
  return (
    <>
      <li
        className="mb-10 ml-6 cursor-pointer"
        onClick={() => router.push(`/lifelog/${id}`)}
      >
        <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-8 ring-white ">
          <TimeLineDot />
        </span>
        <h3 className="mb-1 flex items-center text-lg font-medium text-[#14AEDE]">
          {message}
        </h3>
        {/* <p className='flex items-center mb-1 text-sm text-gray-900'>@{location}</p> */}
        <time className="mb-2 block text-sm font-normal leading-none text-gray-600 ">
          {dateTime}
        </time>
        <p className=" text-xs font-normal text-gray-500">
          Uploaded {numImages} images
        </p>
        <p className="flex items-center text-sm text-gray-800">
          {latitude}, {longitude}
        </p>
      </li>
    </>
  );
}
