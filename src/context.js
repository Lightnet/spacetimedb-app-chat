// global variable
// 
// import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.6.0.min.js";
import van from "vanjs-core";

const networkStatus = van.state('Offline');
const userName = van.state('Guest');
const userIdentity = van.state('');
const userStatus = van.state('None');
const userAvatarUrl = van.state('');

export {
  networkStatus,
  userName,
  userIdentity,
  userStatus,
  userAvatarUrl
}