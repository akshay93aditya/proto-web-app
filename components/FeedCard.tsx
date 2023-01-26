import dateFormat from 'dateformat';
import {
  Box,
  Image,
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
} from '@chakra-ui/react';
import { TagList } from './Taglist';
import { useState } from 'react';

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
  const url1 = files[0]?.url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  const url2 = files[1]?.url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  const url3 = files[2]?.url.replace('ipfs://', 'https://ipfs.io/ipfs/');

  const [url, setUrl] = useState<string>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const ModalImage = ({ src, ...props }) => {
    const handleClick = (e) => {
      onOpen();
      setUrl(src);
    };
    return (
      <Image
        src={src}
        onClick={handleClick}
        alt=""
        {...props}
        cursor="pointer"
      />
    );
  };

  const Modal = () => {
    return (
      <ChakraModal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <Image src={url} alt="" />
        </ModalContent>
      </ChakraModal>
    );
  };

  const tagIcon = TagList.find((t) => t.title === tag)?.icon;
  const truncatedAddress =
    address.substring(0, 4) + '...' + address.substring(address.length - 4);
  return (
    <div className="my-2 mx-auto w-96  px-2 py-4">
      <Modal />
      <div className="flex items-center align-middle ">
        <Image
          src={pfp ? pfp : '/profileplaceholder.svg'}
          alt="pfp"
          className=" mr-2 h-16 w-16 cursor-pointer rounded-full border border-[#b6b8b9] object-cover"
        />
        <div>
          <div className="flex items-center">
            <p className=" text-gray-700">
              {username ? '@' + username : truncatedAddress}
            </p>
            <p className="mx-2 text-gray-600">{username ? '·' : null}</p>
            <p className="text-gray-400">
              {username ? truncatedAddress : null}
            </p>
          </div>
          <p className=" text-[14px] text-gray-400">{dateTime}</p>
        </div>
      </div>
      <p className=" ml-1 py-4 text-xl text-primary">{body}</p>
      <div className=" flex items-center pb-2">
        <div className="mx-1 ">{tag && tagIcon}</div>
        <p className=" py-2 text-xs text-gray-600">
          {lat}, {long}
        </p>
      </div>

      {files && files.length == 1 && (
        <Box
          w={96}
          h={64}
          borderRadius="10px"
          borderWidth="1px"
          borderColor="gray.300"
        >
          <ModalImage
            src={url1}
            alt=""
            objectFit="cover"
            h="full"
            w="full"
            borderRadius="10px"
          />
        </Box>
      )}
      {files && files.length == 2 && (
        <Box
          w={96}
          h={64}
          borderRadius="10px"
          borderWidth="1px"
          borderColor="gray.300"
        >
          <div className="flex">
            <ModalImage
              src={url1}
              alt=""
              objectFit="cover"
              className="h-64 w-1/2"
              borderLeftRadius="10px"
            />
            <div className="border border-gray-300"></div>
            <ModalImage
              src={url2}
              alt=""
              objectFit="cover"
              className="h-64 w-1/2"
              borderRightRadius="10px"
            />
          </div>
        </Box>
      )}
      {files && files.length == 3 && (
        <Box
          w={96}
          h={64}
          borderRadius="10px"
          borderWidth="1px"
          borderColor="gray.300"
        >
          <div>
            <ModalImage
              src={url1}
              alt=""
              objectFit="cover"
              className="h-32 w-full"
              borderTopRadius="10px"
            />
            <div className="border border-gray-300"></div>
            <div className="flex">
              <ModalImage
                src={url2}
                alt=""
                objectFit="cover"
                className="h-32 w-1/2"
                borderBottomLeftRadius="10px"
              />
              <div className="border border-gray-300"></div>
              <ModalImage
                src={url3}
                alt=""
                objectFit="cover"
                className="h-32 w-1/2"
                borderBottomRightRadius="10px"
              />
            </div>
          </div>
        </Box>
      )}
      {/* <Divider /> */}
    </div>
  );
}
