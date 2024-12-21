"use client";

import { StardustAnimation } from "@/animations/StardustAnimation";
import useComponentSize from "@/hooks/useComponentSize.hook";
import { clickedFundState } from "@/state/nFunds";
import { useSetAtom } from "jotai";
import Link from "next/link";

interface FundCardProps {
  fund: {
    type: string;
    title: string;
    description: string;
    fund_id: string;
  };
  index: number;
}

const FundCards = ({ fund, index }: FundCardProps) => {
  const [ref, width, height] = useComponentSize();

  const setClickedFund = useSetAtom(clickedFundState);

  function handleNav() {
    setClickedFund({ id: Number(fund.fund_id), name: fund.title });
  }

  return (
    <div className="relative" ref={ref}>
      <Link onClick={handleNav} href={"/app/fund"}>
        <div
          key={index}
          className="bg-gray-950 shadow-[0px_4px_4px_0px_#00000040] text-white rounded-[10px] py-6 px-4 sm:py-8 sm:px-6 md:py-12 md:px-10 lg:py-16 lg:px-14 flex flex-col items-start justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-10 min-w-[20rem] sm:min-w-[25rem] md:min-w-[30rem] max-w-[36rem]"
        >
          <div className="flex flex-col items-start justify-between gap-2 sm:gap-4 md:gap-6">
            <p className="text-sm sm:text-base md:text-lg text-white font-light leading-5 sm:leading-6 md:leading-7">
              {fund.type}{" "}
              {fund.type === "Project" ? <span>&#x1f680;</span> : <span>&#x1FAC0;</span>}
            </p>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
              {fund.title}
            </h1>
          </div>
          <div>
            {fund.description.trim() ? (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white">
                {fund.description}
              </p>
            ) : (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white">
                No description provided
              </p>
            )}
          </div>
          <StardustAnimation height={height} width={width} />
        </div>
      </Link>
    </div>
  );
};

export default FundCards;
