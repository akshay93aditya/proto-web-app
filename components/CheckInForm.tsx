import { useState, useEffect, useRef, useContext } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Audio } from 'react-loader-spinner';
import { Button, Circle, Textarea, useToast } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { create } from 'ipfs-http-client';
import { FailedCheckInIcon } from '../dynamic/CheckInIcons';
import { TagList } from './Taglist';
import { OrbisContext } from '../context/OrbisContext';
import { handleCheckInSubmit } from '../utils/handleCheckInSubmit';

export type CheckIN = {
  lat: number;
  lng: number;
  loc: boolean;
  checkInMessage: string;
  loading: boolean;
  success: boolean;
  checkin: pdl;
};

export type pdl = {
  pdl: string;
};

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;

const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export default function CheckInForm() {
  const [lat, setlat] = useState<number>(0);
  const [lng, setlng] = useState<number>(0);
  const [checkInMessage, setcheckInMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [checkInSignature, setCheckInSignature] = useState<string>('');
  const [pdl, setPdl] = useState<string>('');
  const [success, setSuccess] = useState<boolean>();
  const [checkin, setcheckIn] = useState<object>();
  const [imageCount, setImageCount] = useState<number>(0);
  const [files, setFiles] = useState([]);
  const [selectedTag, setSelectedTag] = useState<any>();
  const [orbisTag, setOrbisTag] = useState<any>([
    { title: 'proto', slug: 'proto' },
  ]);
  const [orbisFiles, setOrbisFiles] = useState<any>([]);

  const toast = useToast();
  const wallet = useWallet();
  const { orbis } = useContext(OrbisContext);

  useEffect(() => {
    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: Infinity,
    };
    function success(position: any) {
      setlat(
        Math.round((position.coords.latitude + Number.EPSILON) * 10000) / 10000
      );
      setlng(
        Math.round((position.coords.longitude + Number.EPSILON) * 10000) / 10000
      );
    }
    function error(err: any) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  useEffect(() => {
    if (success == true) {
      toast({
        title: `Check-In Complete`,
        // description: (
        // 	<a
        // 		href={`https://explorer.solana.com/tx/${checkInSignature}?cluster=devnet`}
        // 		rel='noreferrer'
        // 		target='_blank'>
        // 		View in Explorer
        // 	</a>
        // ),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else if (success == false) {
      // errorToast();
      toast({
        title: `Check-In failed`,
        description: (
          <a
            href={`https://explorer.solana.com/tx/${checkInSignature}?cluster=devnet`}
            rel="noreferrer"
            target="_blank"
          >
            View in Explorer
          </a>
        ),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  let baseUrl = 'https://proto-api.onrender.com';

  function handleChange(e: any) {
    setcheckInMessage(e.target.value);
  }

  const handleFileSelect = async (e: any) => {
    if (Array.from(e.target.files).length > 3) {
      alert('You can only select a maximum of 3 files.');
    } else {
      try {
        let uploadedFiles = [];
        let orbisUploadedFiles = [];
        await Promise.all(
          Array.from(e.target.files).map(async (file: File) => {
            const added = await client.add(file);
            uploadedFiles.push({ filename: file.name, hash: added.path });
            orbisUploadedFiles.push({
              url: `ipfs://${added.path}`,
              gateway: 'https://proto-web.infura-ipfs.io/',
            });
          })
        );
        setFiles(uploadedFiles);
        setOrbisFiles(orbisUploadedFiles);
        setImageCount(Array.from(e.target.files).length);
      } catch (e) {
        console.log('Error uploading file: ', e);
      }
    }
  };

  const fileInput = useRef(null);

  const handleClick = () => {
    fileInput.current.click();
  };

  const Tag = ({ title, slug, icon }) => {
    const handleClick = () => {
      let newTag = [{ title: 'proto', slug: 'proto' }];
      newTag.push({ title: title, slug: slug });
      setOrbisTag(newTag);
      setSelectedTag(title);
    };

    return (
      <div
        className={`mx-1 box-border flex h-[60px] w-[100px] cursor-pointer flex-col items-center justify-center p-2 transition-all duration-200 ease-in-out ${
          title === selectedTag && 'rounded-md border-[1.5px] border-primary'
        }`}
        onClick={handleClick}
      >
        {icon}
        <p className="text-center text-[8px] font-medium text-gray-400">
          {title}
        </p>
      </div>
    );
  };

  return (
    <div className="visible absolute bottom-0 z-10 flex h-max w-full flex-col items-center justify-center bg-white pb-4 transition-height duration-500 ease-in-out">
      <div className="relative m-0 flex h-12 w-full flex-col items-center justify-center bg-primary p-0">
        {lat && lng ? (
          <div className="text-lg font-semibold text-white">
            {lat} , {lng}
          </div>
        ) : (
          <div className="text-lg font-semibold text-white">
            <SearchIcon color="gray.300" /> Fetching User Location
          </div>
        )}
        <div className="absolute right-[60px] md:right-[300px]">
          <FailedCheckInIcon />
        </div>
      </div>
      <form
        className=" md:[w-3/5] flex w-[90%] max-w-[600px] flex-col items-center justify-center px-2 py-6 md:px-5 md:py-2"
        onSubmit={(e) =>
          handleCheckInSubmit(
            e,
            wallet,
            setcheckIn,
            setLoading,
            setSuccess,
            checkInMessage,
            files,
            selectedTag,
            orbisTag,
            orbisFiles,
            orbis,
            setPdl,
            checkInSignature,
            setCheckInSignature,
            lat,
            lng
          )
        }
      >
        <div className="flex w-full items-center justify-center pb-4 pt-4">
          <Textarea
            bgColor="#d9d9d980"
            placeholder="what's up?"
            borderWidth="0.8px"
            borderColor="#00000020"
            className="h-32 w-full resize-none rounded-md bg-[#d9d9d980]"
            value={checkInMessage}
            onChange={handleChange}
            isRequired
          />
        </div>
        <div className="mb-4 box-border flex w-full justify-between">
          {TagList.map((tag) => {
            return (
              <Tag
                title={tag.title}
                icon={tag.icon}
                key={tag.title}
                slug={tag.slug}
              />
            );
          })}
        </div>
        <div className="mb-4 flex w-full">
          <input
            type="file"
            name="file"
            id="file"
            max={3}
            // value=''
            style={{ display: 'none' }}
            ref={fileInput}
            multiple
            onChange={handleFileSelect}
          />
          <div className="mx-auto flex w-full items-center justify-between">
            <Button
              w="90%"
              mr="8px"
              // size='sm'
              color="primary"
              variant="outline"
              colorScheme="telegram"
              onClick={handleClick}
              disabled={imageCount >= 3}
            >
              Upload Images
              {/* ({imageCount}/3) */}
            </Button>
            <div className="borderColor w-[10%] rounded-lg border">
              <p className="font-md text-center text-primary">{imageCount}/3</p>
            </div>
          </div>
        </div>
        {!loading ? (
          <Button
            type="submit"
            transition="all ease-in-out duration-500"
            color="#fff"
            bg="#14aede"
            maxW="600px"
            w="full"
            size="lg"
            colorScheme="telegram"
            _hover={{ bg: '#14A1DE' }}
            disabled={!lat || !lng}
            mb={{ base: 16, md: 2 }}
          >
            Check-in
          </Button>
        ) : (
          <Audio
            height="50"
            width="100"
            color="#14aede"
            ariaLabel="audio-loading"
            wrapperStyle={{}}
            wrapperClass="wrapper-class"
            visible={true}
          />
        )}
      </form>
    </div>
  );
}
