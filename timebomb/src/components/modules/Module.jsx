import React from "react";
import TimerModule from "./TimerModule";
import WiresModule from "./WiresModule";
import RedButtonModule from "./RedButtonModule";
import EmptyModule from "./EmptyModule"; // new import

export default function Module({ type }) {
  const moduleMap = {
    timer: <TimerModule />,
    wires: <WiresModule />,
    button: <RedButtonModule />,
  };

  // If a valid module type exists, render it
  if (type && moduleMap[type]) return moduleMap[type];

  // Otherwise, render the empty shutter
  return <EmptyModule />;
}
