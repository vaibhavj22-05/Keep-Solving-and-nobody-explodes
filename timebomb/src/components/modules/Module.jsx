import React from "react";
import TimerModule from "./TimerModule";
import WiresModule from "./WiresModule";
import RedButtonModule from "./RedButtonModule";
import EmptyModule from "./EmptyModule";
import ChemicalChaosModule from "./ChemicalChaosModule";
import StatusBulb from "./StatusBulb"; // ✅ Bulb component

export default function Module({
  type,
  onSolved,
  allModulesSolved,
  timerRunning,
  onDisarm,
  disarmed,
}) {
  // ✅ Show bulb only for interactive modules (not empty or button)
  const showBulb = ["wires", "chemical"].includes(type);

  // ✅ Define module components
  const moduleMap = {
    timer: <TimerModule running={timerRunning} disarmed={disarmed} />,
    wires: <WiresModule onSolved={() => onSolved("wires")} />,
    button: (
      <RedButtonModule
        allModulesSolved={allModulesSolved}
        onDisarm={onDisarm}
      />
    ),
    chemical: <ChemicalChaosModule onSolved={onSolved} />,
    null: <EmptyModule />,
  };

  return (
    <div className="relative w-full h-full">
      {/* ✅ Bulb appears only for interactive modules */}
      {showBulb && (
        <div className="absolute top-2 left-2 z-10">
          {/* Let bulb handle its own logic via localStorage */}
          <StatusBulb moduleKey={type} />
        </div>
      )}

      {/* ✅ Always render something */}
      {moduleMap[type] || <EmptyModule />}
    </div>
  );
}
