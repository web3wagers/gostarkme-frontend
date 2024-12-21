import { calculatePorcentage } from "@/app/utils";
import { Button } from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  walletStarknetkitLatestAtom,
} from "@/state/connectedWallet";
import { latestTxAtom } from "@/state/latestTx";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import ShareXButton from "@/components/ui/ShareOnX";
import { BRAAVOS_CHAIN_ID, CHAIN_ID, provider } from "@/constants";
import { CallData } from "starknet";
import { activeChainId } from "@/state/activeChain";

interface FundVoteProps {
  name: String,
  upVotes: number,
  upVotesNeeded: number,
  addr: string,
  voted: any,
  setLoading: (load: boolean) => void,
}

export const FundVote = ({ name, upVotes, upVotesNeeded, addr, voted, setLoading }: FundVoteProps) => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom);
  const chainId = useAtomValue(activeChainId);
  const [progress, setProgress] = useState(calculatePorcentage(upVotes, upVotesNeeded));
  const [currentUpvotes, setCurrentUpvotes] = useState(upVotes);
  const voteMessage = `🗳️ Voted for ${name} on Go Stark Me! Support now: https://gostarkme.com 🙌💫 @undefined_org_ @Starknet`;

  const [isVoting, setIsVoting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [latestTx, setLatestTx] = useAtom(latestTxAtom);
  const [canVote, setCanVote] = useState((voted != BigInt(0) ? false : true));

  const waitForTransaction = async (hash: string) => {
    try {
      await provider.waitForTransaction(hash);
      return true;
    } catch (error) {
      console.error("Error waiting for transaction:", error);
      return false;
    }
  };

  const handleVoteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsVoting(true);

    try {
      const tx = await wallet?.account.execute([
        {
          contractAddress: addr,
          entrypoint: 'receive_vote',
          calldata: CallData.compile({}),
        },
      ]);

      if (tx) {
        const isConfirmed = await waitForTransaction(tx.transaction_hash);

        if (isConfirmed) {
          setLatestTx(tx.transaction_hash);
          setCanVote(false);
          setShowSuccessPopup(true);
          setCurrentUpvotes((prev) => Number(BigInt(prev) + BigInt(1)));
          setProgress(calculatePorcentage(Number(BigInt(upVotes) + BigInt(1)), Number(upVotesNeeded)));
        }
      }
    } catch (error: any) {
      console.log(error.message || "Transaction failed. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col p-4 space-y-4 max-w-lg mx-auto">
      <ProgressBar progress={progress} />
      <div className="flex justify-center items-center space-x-2 text-sm md:text-base">
        <p>{currentUpvotes.toString()} / {upVotesNeeded.toString()}</p>
        <p className="text-yellow-500">&#127775;</p>
      </div>
      {isVoting ? (
        <div className="text-center">
          <Button
            label="Voting..."
            onClick={() => { }}
            className="opacity-50 cursor-not-allowed"
            disabled
          />
        </div>
      ) : wallet ? (
        !canVote ? (
          <div className="text-center">
            <Button
              label="Vote"
              onClick={() => { }}
              className="opacity-50 cursor-not-allowed"
              disabled
            />
            <p className="text-xs md:text-sm text-gray-500 mt-2">You have already voted</p>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={handleVoteClick}
              disabled={isVoting || chainId !== CHAIN_ID && chainId != BRAAVOS_CHAIN_ID}
              className={`bg-darkblue text-white py-2 px-4 md:py-3 md:px-6 rounded-md text-xs md:text-sm shadow-md hover:bg-starkorange
              active:bg-darkblue ease-in-out duration-500 ${chainId !== CHAIN_ID && chainId != BRAAVOS_CHAIN_ID ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Vote
            </button>
            {chainId !== CHAIN_ID && chainId != BRAAVOS_CHAIN_ID && (
              <p className="text-xs md:text-sm text-gray-500 mt-2">
                Your wallet is connected to the wrong network. Please switch to {CHAIN_ID}.
              </p>
            )}
          </div>
        )
      ) : (
        <div className="text-center">
          <Button
            label="Vote"
            onClick={() => { }}
            className="opacity-50 cursor-not-allowed"
            disabled
          />
          <p className="text-xs md:text-sm text-gray-500 mt-2">Connect your wallet to vote</p>
        </div>
      )}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
          <div className="w-[90%] sm:w-[600px] rounded-md flex flex-col items-center justify-center gap-4 text-center bg-white drop-shadow p-5 sm:p-7">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                setShowSuccessPopup(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl">Success</h1>
            <p className="text-sm sm:text-base font-light m-3 sm:m-5">
              Your vote was sent, take a look at the transaction{" "}
              <a
                className="text-blue-600"
                target="_blank"
                href={"https://voyager.online/tx/" + latestTx}
              >
                here.
              </a>
            </p>
            <p className="text-sm sm:text-base font-light m-3 sm:m-5">
              Share your contribution via X to tell everyone how cool you are
            </p>
            <ShareXButton message={voteMessage} />
          </div>
        </div>
      )}
    </div>
  );
};
