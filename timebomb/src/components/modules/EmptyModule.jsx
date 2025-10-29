import React from "react";

export default function EmptyModule() {
  return (
    <div className="relative w-full h-full bg-[#2e2f31] border-[3px] border-gray-700 rounded-lg overflow-hidden">
      {/* Orange shutter background */}
      <div className="absolute inset-[8px] rounded-md bg-[repeating-linear-gradient(0deg,#cc6b3e_0_8px,#b4522c_8px_16px)] shadow-[inset_0_2px_6px_rgba(255,255,255,0.15),0_4px_10px_rgba(0,0,0,0.8)] border-[2px] border-[#8b3a1f]"></div>

      {/* Metallic outer rim */}
      <div className="absolute inset-0 rounded-lg border-[1px] border-[#ff7b0030] shadow-[inset_0_0_10px_#ff9b0050]"></div>

      {/* Glossy reflection effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-md"></div>

      {/* Screws for realism */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600 shadow-inner"></div>
      <div className="absolute top-1 right-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600 shadow-inner"></div>
      <div className="absolute bottom-1 left-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600 shadow-inner"></div>
      <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600 shadow-inner"></div>
    </div>
  );
}
