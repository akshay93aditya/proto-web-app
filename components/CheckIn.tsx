import React, { useState, useEffect, useRef } from "react";
import { idl } from "../proto";
import * as anchor from "@project-serum/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { Audio } from "react-loader-spinner";
import { Button, Input, Textarea } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { create } from "ipfs-http-client";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { latLngToCell } from "h3-js";

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
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const CheckIn = () => {
  const [lat, setlat] = useState<number>(0);
  const [lng, setlng] = useState<number>(0);
  const [checkInMessage, setcheckInMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [checkin, setcheckIn] = useState<pdl>();
  const [imageCount, setImageCount] = useState<number>(0);
  const [files, setFiles] = useState([]);

  const wallet = useAnchorWallet();

  useEffect(() => {
    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: Infinity,
    };
    function success(position) {
      setlat(position.coords.latitude);
      setlng(position.coords.longitude);
    }
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  function getProvider() {
    if (!wallet) {
      return null;
    }
    const network =
      "https://solana-devnet.g.alchemy.com/v2/6nOSXYNw7tWYjDzvQ2oLBVBfMg6Gj9Ho";
    const connection = new Connection(network, "processed");

    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });
    return provider;
  }

  async function CheckInTransaction(mongoId: string) {
    const provider = getProvider();
    const hindex = latLngToCell(lat, lng, 7);

    if (!provider) {
      return null;
    }

    const program = new Program(idl, process.env.PROGRAM_ID, provider);

    const [checkInPDA, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("check-in-data"),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(mongoId),
        Buffer.from(hindex),
      ],
      program.programId
    );

    try {
      await program.methods
        .checkIn(hindex, mongoId, checkInMessage)
        .accounts({
          user: provider.wallet.publicKey,
          checkIn: checkInPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const account = await program.account.CheckInData.fetch(
        provider.wallet.publicKey
      );
      console.log(account);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccess(false);
      if (!wallet.publicKey) {
        alert("Wallet Not Connected");
        setLoading(false);
        return;
      }

      const usersResponse = await axios({
        method: "get",
        url: "https://proto-api.onrender.com/users",
        params: { wallet_address: wallet.publicKey.toString() },
      });
      //   console.log(usersResponse);
      //   console.log(usersResponse.data.length);

      if (usersResponse.data.length) {
        const checkinResponse = await axios({
          method: "post",
          url: "https://proto-api.onrender.com/checkins",
          data: {
            user_wallet_address: wallet.publicKey.toString(),
            message: checkInMessage,
            latitude: lat,
            longitude: lng,
            files,
          },
        });
        // console.log(usersResponse);
        // // console.log(usersResponse.data.length);
        setcheckIn(checkinResponse.data);
        CheckInTransaction(checkinResponse.data._id);
        setLoading(false);
        setSuccess(true);
        console.log(checkinResponse.data);
      } else {
        const newUserResponse = await axios({
          method: "post",
          url: "https://proto-api.onrender.com/users",
          data: {
            wallet_address: wallet.publicKey.toString(),
          },
        });

        // console.log(newUserResponse);

        const checkinResponse = await axios({
          method: "post",
          url: "https://proto-api.onrender.com/checkins",
          data: {
            user_wallet_address: wallet.publicKey.toString(),
            message: checkInMessage,
            latitude: lat,
            longitude: lng,
            files,
          },
        });
        setcheckIn(checkinResponse.data);
        CheckInTransaction(checkinResponse.data._id);
        setLoading(false);
        setSuccess(true);
        console.log(checkinResponse.data);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setSuccess(false);
    }
  }

  function handleChange(e) {
    setcheckInMessage(e.target.value);
  }

  const handleFileSelect = async (e) => {
    if (Array.from(e.target.files).length > 3) {
      alert("You can only select a maximum of 3 files.");
    } else {
      try {
        let uploadedFiles = [];
        await Promise.all(
          Array.from(e.target.files).map(async (file: File) => {
            const added = await client.add(file);
            uploadedFiles.push({ filename: file.name, hash: added.path });
          })
        );
        setFiles(uploadedFiles);
        setImageCount(Array.from(e.target.files).length);
      } catch (e) {
        console.log("Error uploading file: ", e);
      }
    }
  };

  const fileInput = useRef(null);

  const handleClick = (e) => {
    fileInput.current.click();
  };

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
        onSubmit={handleSubmit}
      >
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
            style={{ display: "none" }}
            ref={fileInput}
            multiple
            onChange={handleFileSelect}
          />
          <Button
            w="70%"
            mr="8px"
            bg="#89d7ef"
            color="#fff"
            _hover={{ bg: "#89d7ef" }}
            _active={{ bg: "#14aede" }}
            onClick={handleClick}
            disabled={imageCount >= 3}
          >
            Upload Images
          </Button>
          <Button
            w="30%"
            bg="#89d7ef"
            color="#fff"
            _hover={{ bg: "#89d7ef" }}
            _active={{ bg: "#14aede" }}
          >
            {imageCount}/3
          </Button>
        </div>
        {!loading ? (
          lat && lng ? (
            <button
              type="submit"
              style={{
                background: `#14aede`,
                width: `100%`,
                display: `flex`,
                justifyContent: `center`,
                alignItems: `center`,
                paddingLeft: `20px`,
                paddingRight: `20px`,
                height: `35px`,
                borderRadius: `6px`,
                color: `white`,
                fontWeight: `700`,
                fontSize: `20px`,
              }}
            >
              Check In
            </button>
          ) : (
            <button
              type="submit"
              style={{
                background: `#14aede`,
                width: `100%`,
                display: `flex`,
                justifyContent: `center`,
                alignItems: `center`,
                paddingLeft: `20px`,
                paddingRight: `20px`,
                height: `35px`,
                borderRadius: `6px`,
                color: `white`,
                fontWeight: `700`,
                fontSize: `20px`,
              }}
              disabled
            >
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
            display: `flex`,
            flexDirection: `column`,
            justifyContent: `center`,
            alignItems: `center`,
            width: `100%`,
            marginTop: `16px`,
          }}
        >
          <div className="pdl-data" style={{ paddingBottom: `16px` }}>
            Check-In Complete : {`${checkin.pdl}`}
          </div>
          <div className="explorer">
            <a
              href={`https://explorer.solana.com/address/${checkin.pdl}?cluster=devnet`}
              target="_blank"
            >
              View in Explorer
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckIn;
