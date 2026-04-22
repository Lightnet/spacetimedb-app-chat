

//-----------------------------------------------
// 
//-----------------------------------------------

import { networkStatus } from "../../context";
import van from "vanjs-core";

const { div, input, textarea, button, span, img, label, p } = van.tags;


// testing if network is connected.
export function STDBPanel(){

  return div({
    style: `
      position: fixed;
      top: 8px;
      right: 8px;
      width: 280px;
      height: 60px;
      background: #2f3136;          /* Discord dark gray */
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.4);
      color: #dcddde;
      font-family: 'gg sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      user-select: none;
      z-index: 9999;
    `
  },
  div({ style: "display:flex; flex-direction:column;" },
    label({style:"font-weight:600;" }, "Network: ", networkStatus)
  ),
  // div({ style: "display:flex; gap:12px;" },
  //   label({style:"" }, " [test] ")
  // )
  )
}