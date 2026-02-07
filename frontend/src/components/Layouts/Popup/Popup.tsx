import { useState, type FC } from "react";

interface IPopup {
  children: React.ReactNode;
  onClose: () => void;
  wide?: number;
  className?: string;
  height?: string | "auto";
}

export const Popup: FC<IPopup> = ({
  children,
  onClose,
  wide,
  className,
  height,
}) => {
  const [isHover, setHover] = useState(false);
  const [isActive, setActive] = useState(false);
  return (
    <div
      className={[
        "fixed inset-0 z-[1001] flex h-screen w-screen flex-col items-center justify-center",
        "bg-[color:var(--popup--bg-clr)] backdrop-blur-[3px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="app-surface-strong relative p-[50px]"
        style={{
          maxWidth: wide ? `${wide}px` : `auto`,
          width: wide ? `100vw` : "auto",
          minHeight: height === "auto" ? "auto" : height,
        }}
      >
        <button
          onMouseDown={() => setActive(true)}
          onMouseUp={() => setActive(false)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => {
            setHover(false);
            setActive(false);
          }}
          className="app-icon-btn absolute right-2.5 top-2.5 h-10 w-10 rounded-full"
          onClick={() => onClose()}
          style={{
            transform: isActive ? "rotate(90deg) translate(-1px, 2px)" : "none",
            opacity: isActive ? "0.5" : "1",
            transition: "all .2s ease-in-out",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40px"
            height="40px"
            viewBox="0 0 24 24"
            fill="none"
            className="h-10 w-10"
          >
            <path
              d="M21 11.9999C21 16.9704 16.9706 20.9999 12 20.9999C7.02944 20.9999 3 16.9704 3 11.9999C3 7.02931 7.02944 2.99988 12 2.99988"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
            />
            <path
              d="M19 5L16 8"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              style={{
                transform: isHover
                  ? "scale(2) translate(-11.5px, -0.7px)"
                  : "none",
                transition: "transform .2s ease-in-out",
              }}
            />
            <path
              d="M15.9999 4.99998L19 7.99985"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              style={{
                transform: isHover
                  ? "scale(2) translate(-11.5px, -0.7px)"
                  : "none",
                transition: "transform .2s ease-in-out",
              }}
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};
