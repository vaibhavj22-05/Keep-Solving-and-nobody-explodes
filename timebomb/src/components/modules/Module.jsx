import React from "react";
import TimerModule from "./TimerModule";
import WiresModule from "./WiresModule";
import RedButtonModule from "./RedButtonModule";
import EmptyModule from "./EmptyModule";
import ChemicalChaosModule from "./ChemicalChaosModule";

export default function Module({
  type,
  onSolved,
  allModulesSolved,
  timerRunning,
  onDisarm,
  disarmed,
}) {
   const moduleMap = {
    timer: <TimerModule running={timerRunning} disarmed={disarmed} />,
    wires: <WiresModule onSolved={() => onSolved("wires")} />,
    button: <RedButtonModule allModulesSolved={allModulesSolved} onDisarm={onDisarm} />,
    chemical: <ChemicalChaosModule onSolved={onSolved} />, // 👈 Added here
    null: <EmptyModule />,
  };

  return moduleMap[type] || <EmptyModule />;
}