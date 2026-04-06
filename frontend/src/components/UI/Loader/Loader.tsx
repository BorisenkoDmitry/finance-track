import { type FC } from "react";

interface ILoader {
  isLoading: boolean;
}

export const Loader: FC<ILoader> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 z-[2000] flex h-full w-full items-center justify-center bg-primary-900/60 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary-700/40" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary-500 [animation-duration:1s]" />
          <div className="absolute inset-1.5 animate-spin rounded-full border-2 border-transparent border-t-secondary-500 [animation-duration:1.5s] [animation-direction:reverse]" />
        </div>
        <span className="text-xs font-medium text-grey-200/50 animate-pulse-soft">Загрузка...</span>
      </div>
    </div>
  );
};
