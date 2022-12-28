import { Suspense } from "react";
import Loading from "../components/Loading";
export default function Home() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="w-full text-black flex flex-col justify-center items-center">
          Hey Everyone! This is proto, a decentralized application for creating
          lifelogs. Please provide location access to the application. LFG!!
          <ol>
            <li>1. Click on the Location Marker icon in the footer</li>
            <li>
              2. Notice that a map is shown with your realtime location. Pretty
              cool,right!
            </li>
            <li>
              3. Connect your wallet and then click on the blue "check in" icon{" "}
            </li>
            <li>
              4. Wait for your location coordinates to be fetched after which
              you gotta add a check in message and click check in.{" "}
            </li>
            <li>
              5. Voila! In just a few clicks, You have checked in and a unique
              PDA has been generated. Verify the transaction on the solana
              explorer.{" "}
            </li>
          </ol>
        </div>
      </Suspense>
    </>
  );
}
