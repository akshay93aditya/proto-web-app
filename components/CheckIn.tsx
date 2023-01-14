import { useState, useEffect, useRef } from 'react'
import { utils, Program, AnchorProvider } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import axios from 'axios'
import { Audio } from 'react-loader-spinner'
import { Button, Textarea } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { create } from 'ipfs-http-client'
import {
  clusterApiUrl,
  ConfirmOptions,
  Connection,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js'
import { latLngToCell } from 'h3-js'

export type CheckIN = {
  lat: number
  lng: number
  loc: boolean
  checkInMessage: string
  loading: boolean
  success: boolean
  checkin: pdl
}

export type pdl = {
  pdl: string
}

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})

const CheckIn = () => {
  const [lat, setlat] = useState<number>(0)
  const [lng, setlng] = useState<number>(0)
  const [checkInMessage, setcheckInMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [checkInSignature, setCheckInSignature] = useState<string>('')
  const [pdl, setPdl] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [checkin, setcheckIn] = useState<object>()
  const [imageCount, setImageCount] = useState<number>(0)
  const [files, setFiles] = useState([])

  const wallet = useWallet()

  useEffect(() => {
    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: Infinity,
    }
    function success(position: any) {
      setlat(position.coords.latitude)
      setlng(position.coords.longitude)
    }
    function error(err: any) {
      console.warn(`ERROR(${err.code}): ${err.message}`)
    }
    navigator.geolocation.getCurrentPosition(success, error, options)
  }, [])

  const opts: ConfirmOptions = {
    preflightCommitment: 'processed',
  }

  const network = clusterApiUrl('devnet')

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment)
    const provider = new AnchorProvider(connection, window.solana, opts)
    return provider
  }

  const getProgram = async () => {
    const provider = getProvider()
    // Get metadata about your solana program
    const idl = await Program.fetchIdl(process.env.NEXT_PUBLIC_PROGRAM_ID, provider)
    // Create a program that you can call
    return new Program(idl, process.env.NEXT_PUBLIC_PROGRAM_ID, provider)
  }

  let baseUrl = 'https://proto-api.onrender.com'

  async function CheckInTransaction(mongoId: string) {
    const provider = getProvider()
    const hindex = latLngToCell(lat, lng, 7)

    const program = await getProgram()

    const [checkInPDA] = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode('check-in-data'),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(mongoId),
        Buffer.from(hindex),
      ],
      program.programId
    )

    try {
      const sig = await program.methods
        .checkIn(hindex, mongoId, checkInMessage)
        .accounts({
          user: provider.wallet.publicKey,
          checkIn: checkInPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
      // save generated pdl for this checkin
      const checkinPdlResponse = await axios({
        method: 'post',
        url: `${baseUrl}/checkins/${mongoId}/pdls`,
        data: {
          pdl: checkInPDA,
        },
      })
      setPdl(checkInPDA.toString())
      setcheckIn(checkinPdlResponse.data)
      setCheckInSignature(sig)
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    try {
      setLoading(true)
      setSuccess(false)
      if (!wallet.publicKey) {
        alert('Wallet Not Connected')
        setLoading(false)
        return
      }

      const usersResponse = await axios({
        method: 'get',
        url: `${baseUrl}/users`,
        params: { wallet_address: wallet.publicKey.toString() },
      })

      if (usersResponse.data.length) {
        const checkinResponse = await axios({
          method: 'post',
          url: `${baseUrl}/checkins`,
          data: {
            user_wallet_address: wallet.publicKey.toString(),
            message: checkInMessage,
            latitude: lat,
            longitude: lng,
            ...(files && { files }),
          },
        })
        await CheckInTransaction(checkinResponse.data._id)
        setcheckIn(checkinResponse.data)
        setLoading(false)
        setSuccess(true)
      } else {
        await axios({
          method: 'post',
          url: `${baseUrl}/users`,
          data: {
            wallet_address: wallet.publicKey.toString(),
          },
        })

        const checkinResponse = await axios({
          method: 'post',
          url: `${baseUrl}/checkins`,
          data: {
            user_wallet_address: wallet.publicKey.toString(),
            message: checkInMessage,
            latitude: lat,
            longitude: lng,
            ...(files && { files }),
          },
        })
        await CheckInTransaction(checkinResponse.data._id)
        setcheckIn(checkinResponse.data)
        setLoading(false)
        setSuccess(true)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      setSuccess(false)
    }
  }

  function handleChange(e: any) {
    setcheckInMessage(e.target.value)
  }

  const handleFileSelect = async (e: any) => {
    if (Array.from(e.target.files).length > 3) {
      alert('You can only select a maximum of 3 files.')
    } else {
      try {
        let uploadedFiles = []
        await Promise.all(
          Array.from(e.target.files).map(async (file: File) => {
            const added = await client.add(file)
            uploadedFiles.push({ filename: file.name, hash: added.path })
          })
        )
        setFiles(uploadedFiles)
        setImageCount(Array.from(e.target.files).length)
      } catch (e) {
        console.log('Error uploading file: ', e)
      }
    }
  }

  const fileInput = useRef(null)

  const handleClick = () => {
    fileInput.current.click()
  }

  return (
    <div className="w-full flex flex-col justify-center items-center pb-4 absolute bottom-0 bg-white z-10 transition-height duration-500 ease-in-out h-max visible">
      <div className="bg-[#14AEDE] m-0 p-0 w-full h-12 flex flex-col justify-center items-center">
        {lat && lng ? (
          <div className="text-white text-lg font-semibold">
            {lat} , {lng}
          </div>
        ) : (
          <div className="text-white text-lg font-semibold">
            <SearchIcon color="gray.300" /> Fetching User Location
          </div>
        )}
        {/* <div className="text-white font-normal text-xs">
          Brooklyn Bridge, New York, USA
        </div> */}
      </div>
      <form
        className="w-full flex flex-col justify-center items-center pl-5 pr-5"
        onSubmit={handleSubmit}>
        <div className="flex w-full justify-center items-center pb-4 pt-4">
          <Textarea
            bgColor="#d9d9d980"
            placeholder="what's up"
            borderWidth="0.8px"
            borderColor="#00000020"
            className="w-full h-32 resize-none rounded-md bg-[#d9d9d980]"
            value={checkInMessage}
            onChange={handleChange}
            isRequired
          />
        </div>
        {/* <Wallets /> */}
        {/* {loading && (
          <Audio
            height="50"
            width="100"
            color="#14aede"
            ariaLabel="audio-loading"
            wrapperStyle={{}}
            wrapperClass="wrapper-class"
            visible={true}
          />
        )} */}
        <div className="flex mb-4 w-full">
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
          <Button
            w="70%"
            mr="8px"
            bg="#89d7ef"
            color="#fff"
            _hover={{ bg: '#89d7ef' }}
            _active={{ bg: '#14aede' }}
            onClick={handleClick}
            disabled={imageCount >= 3}>
            Upload Images
          </Button>
          <Button
            w="30%"
            bg="#89d7ef"
            color="#fff"
            _hover={{ bg: '#89d7ef' }}
            _active={{ bg: '#14aede' }}>
            {imageCount}/3
          </Button>
        </div>
        {!loading ? (
          lat && lng ? (
            <button
              type="submit"
              style={{
                background: '#14aede',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: '20px',
                paddingRight: '20px',
                height: '35px',
                borderRadius: '6px',
                color: 'white',
                fontWeight: '700',
                fontSize: '20px',
              }}>
              Check In
            </button>
          ) : (
            <button
              type="submit"
              style={{
                background: '#14aede',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: '20px',
                paddingRight: '20px',
                height: '35px',
                borderRadius: '6px',
                color: 'white',
                fontWeight: '700',
                fontSize: '20px',
              }}
              disabled>
              Check In
            </button>
          )
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
      {success && (
        <div
          className="pdl"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: '16px',
          }}>
          <div className="pdl-data" style={{ paddingBottom: '16px' }}>
            Check-In Complete : {`${pdl}`}
          </div>
          <div className="explorer">
            <a
              href={`https://explorer.solana.com/tx/${checkInSignature}?cluster=devnet`}
              rel="noreferrer"
              target="_blank">
              View in Explorer
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckIn
