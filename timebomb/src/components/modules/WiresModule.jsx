// components/modules/WiresModule.jsx
import React, { useState } from "react";
import ModulePopup from "./ModulePopup";
import WireRealistic from "./WireRealistic";

export default function WiresModule() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Compact preview */}
      <div
        onClick={() => setIsOpen(true)}
        className="bg-[#1f2227] border-2 border-gray-600 rounded-lg p-3 h-full cursor-pointer
                   hover:scale-[1.03] transition-transform flex items-center justify-center text-gray-300"
      >
        <div className="flex flex-col gap-2">
          {["red", "blue", "lime"].map((color, i) => (
            <div
              key={i}
              className={`h-[5px] w-28 rounded-full`}
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </div>

      {/* Popup with realistic wire bomb */}
      <ModulePopup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <WireRealistic />
      </ModulePopup>
    </>
  );
}
