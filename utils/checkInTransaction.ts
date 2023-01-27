import {
  clusterApiUrl,
  ConfirmOptions,
  Connection,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';

import { utils, Program, AnchorProvider } from '@project-serum/anchor';

import { latLngToCell } from 'h3-js';
import axios from 'axios';

const opts: ConfirmOptions = {
  preflightCommitment: 'processed',
};

let baseUrl = 'https://proto-api.onrender.com';

const network =
  'https://solana-devnet.g.alchemy.com/v2/6nOSXYNw7tWYjDzvQ2oLBVBfMg6Gj9Ho';

const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new AnchorProvider(connection, window.solana, opts);
  return provider;
};

const getProgram = async () => {
  const provider = getProvider();
  // Get metadata about your solana program
  const idl = await Program.fetchIdl(
    process.env.NEXT_PUBLIC_PROGRAM_ID,
    provider
  );
  // Create a program that you can call
  return new Program(idl, process.env.NEXT_PUBLIC_PROGRAM_ID, provider);
};

export async function CheckInTransaction(
  mongoId: string,
  lat,
  lng,
  checkInMessage,
  setPdl,
  setcheckIn,
  setCheckInSignature
) {
  const provider = getProvider();
  const hindex = latLngToCell(lat, lng, 7);

  const program = await getProgram();

  const [checkInPDA] = PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('check-in-data'),
      provider.wallet.publicKey.toBuffer(),
      Buffer.from(mongoId),
      Buffer.from(hindex),
    ],
    program.programId
  );

  try {
    const sig = await program.methods
      .checkIn(hindex, mongoId, checkInMessage)
      .accounts({
        user: provider.wallet.publicKey,
        checkIn: checkInPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    // save generated pdl for this checkin
    const checkinPdlResponse = await axios({
      method: 'post',
      url: `${baseUrl}/checkins/${mongoId}/pdls`,
      data: {
        pdl: checkInPDA,
      },
    });
    setPdl(checkInPDA.toString());
    setcheckIn(checkinPdlResponse.data);
    setCheckInSignature(sig);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
