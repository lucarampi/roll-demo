"use client";

import { ValueIcons } from "@/app/page";

import {
  PiEye,
  PiEyeSlash,
  PiTrashBold,
  PiSkull,
  PiRocketLaunch,
} from "react-icons/pi";

interface CardComponentProps {
  value: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function CardComponent({
  value,
  isSelected,
  onClick,
}: CardComponentProps) {
  const getValue = () => {
    if (isNaN(Number(value))) {
      if (value.toUpperCase() === ValueIcons.SKULL) {
        return <PiSkull />;
      }
      if (value.toUpperCase() === ValueIcons.ROCKET) {
        return <PiRocketLaunch />;
      }
    }
    return value;
  };

  return (
    <div
      onClick={() => onClick()}
      className={`w-24 select-none h-28 min-w-[96px] min-h-[112px] bg-stone-50 rounded-lg flex flex-col cursor-pointer border-2 duration-[25ms]  transition-all ${
        isSelected
          ? " border-stone-900 shadow text-stone-950"
          : "border-stone-200 hover:border-stone-300  text-stone-600  "
      }`}>
      {/* <div className='h-10 bg-red-300'>Header</div> */}
      <div
        className={`h-full flex justify-center items-center font-mono font-semibold  ${
          value.toUpperCase() === ValueIcons.ROCKET ||
          value.toUpperCase() === ValueIcons.SKULL
            ? "text-4xl"
            : "text-2xl"
        }`}>
        {getValue()}
      </div>
      {/* <div className='h-10 bg-red-300'>Footer</div> */}
    </div>
  );
}
