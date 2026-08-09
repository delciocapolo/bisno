import { cn } from "@src/lib/utils";
import { useEffect, useState } from "react";
import { INTERVALO_MS } from "./constants";

interface IFadeTicker {
  bisnos: string[];
}

export default function FadeTicker({ bisnos }: IFadeTicker) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (bisnos.length === 0) return;
      setIndex((i) => (i + 1) % bisnos.length);
    }, INTERVALO_MS);
    return () => clearInterval(timer);
  }, [bisnos.length]);

  return (
    <div className="max-h-8.5 overflow-hidden w-fit max-w-full inline-flex items-center gap-2 bg-background py-2 px-3.5">
      {/* Keyframes */}
      <style>{`
            @keyframes msgFadeIn {
              from { opacity: 0.25; transform: translateY(6px); }
              to   { opacity: 1;    transform: translateY(0); }
            }
            .msg-enter {
              animation: msgFadeIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
            }
        `}</style>

      <div className="flex-none w-fit flex-center">
        <span
          className={cn("size-2.5 rounded-full bg-[#3ADB76]", "animate-pulse")}
        />
      </div>

      <div className="relative h-full flex-1 overflow-hidden min">
        <span
          key={index}
          className="msg-enter flex items-center text-body-14 font-medium text-foreground whitespace-nowrap"
        >
          {bisnos[index]}
        </span>
      </div>
    </div>
  );
}
