"use client";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { activeChainId } from "@/state/activeChain";
import { walletStarknetkitLatestAtom } from "@/state/connectedWallet";
import { useAtom } from "jotai";
import { connect, disconnect } from "starknetkit";

export default function WalletConnector() {
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom);
  const [activeChain, setActiveChain] = useAtom(activeChainId);

  const handleNetwork = (chainId?: string, accounts?: string[]) => {
    setActiveChain(wallet?.chainId);
  };

  wallet?.on("networkChanged", handleNetwork);

  const handleConnect = async (event: any) => {
    try {
      const { wallet } = await connect({
        provider,
        modalMode: "alwaysAsk",
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Starknetkit example dapp",
          url: window.location.hostname,
          chainId: CHAIN_ID,
          icons: [],
        },
      });

      setWallet(wallet);
      setActiveChain(wallet?.chainId);
    } catch (e) {
      console.error(e);
      alert((e as any).message);
    }
  };

  const handleDisconnect = async (event: any) => {
    event.preventDefault();
    try {
      await disconnect();
      setWallet(undefined);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {wallet ? (
        <button
          className="bg-darkblue text-white py-2 px-6 md:py-3 md:px-10 rounded-md text-xs md:text-sm lg:text-base shadow-lg hover:bg-starkorange active:bg-darkblue ease-in-out duration-300 active:duration-75 shadow-gray-400"
          onClick={handleDisconnect}
        >
          Log Out
        </button>
      ) : (
        <button
          className="bg-darkblue text-white py-2 px-6 md:py-3 md:px-10 rounded-md text-xs md:text-sm lg:text-base shadow-lg hover:bg-starkorange active:bg-darkblue ease-in-out duration-300 active:duration-75 shadow-gray-400"
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
