// global variable
// 
// import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.6.0.min.js";
import van from "vanjs-core";

export const networkStatus = van.state('Offline');
export const userName = van.state('Guest');
export const userIdentity = van.state('');
export const userId = van.state('');
export const userStatus = van.state('None');
export const userAvatarUrl = van.state('');
export const stateConn = van.state(null);


export const dbUsers = van.state(new Map());
export const dbGroupChats = van.state(new Map());
export const dbContacts = van.state(new Map());

