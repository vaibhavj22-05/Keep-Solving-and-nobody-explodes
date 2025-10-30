import React, { useState } from "react";
import ModulePopup from "./ModulePopup";
import ChemicalChaosGame from "./ChemicalChaosGame";

export default function ChemicalChaosModule() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* --- Thumbnail --- */}
      <div
        onClick={() => setIsOpen(true)}
        className="bg-[#1f2227] border-2 border-gray-600 rounded-lg p-3 h-full cursor-pointer
                   hover:scale-[1.03] transition-transform flex items-center justify-center"
      >
        <div className="flex gap-3 items-end">
          {/* 3 Beakers */}
          <div className="w-6 h-10 bg-[#8b5cf6] rounded-b-full border-2 border-gray-500 shadow-md"></div>
          <div className="w-6 h-14 bg-[#22d3ee] rounded-b-full border-2 border-gray-500 shadow-md"></div>
          <div className="w-6 h-8 bg-[#facc15] rounded-b-full border-2 border-gray-500 shadow-md"></div>
        </div>
      </div>

      {/* --- Popup Game --- */}
      <ModulePopup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ChemicalChaosGame />
      </ModulePopup>
    </>
  );
}
