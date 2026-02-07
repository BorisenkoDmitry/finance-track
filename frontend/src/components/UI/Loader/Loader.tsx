import { type FC } from "react";

import { DNA } from "react-loader-spinner";
interface ILoader {
  isLoading: boolean;
}

export const Loader: FC<ILoader> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 z-[2000] flex h-full w-full items-center justify-center bg-[color:var(--popup--bg-clr)] backdrop-blur-[3px]">
      <div className="animate-spin [animation-duration:2s] text-secondary-500">
        {/* <LuLoader /> */}
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </div>
    </div>
  );
};
