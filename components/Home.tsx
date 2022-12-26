import styled from "styled-components";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";
import "@solana/wallet-adapter-react-ui/styles.css";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
const ConnectButton = styled(WalletMultiButtonDynamic)`
  background: #14aede;
  width: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Home = () => {
  const { connected } = useWallet();

  return (
    <>
      {!connected ? (
        <ConnectButton>Connect Wallet</ConnectButton>
      ) : (
        <WalletMultiButtonDynamic />
      )}
    </>
  );
};

export default Home;
