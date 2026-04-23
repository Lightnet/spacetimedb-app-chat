//-----------------------------------------------
// chat ui test build
//-----------------------------------------------

import { DbConnection, tables } from './module_bindings';
import van from "vanjs-core";
import { networkStatus, userIdentity, userName, stateConn} from './context.js';
import { setUpDBUser } from './db/db_user.js';
import { setupDBImageAvatar } from './db/db_image.js';
import { STDBPanel } from './components/spacetimedb/stdboanel.js';
import { UserPanel } from './components/user/user.js';
import { setupDBGroupChat } from './db/db_groupchat.js';
import { setupDBContact } from './db/db_contact.js';
import { App } from './components/app.js';

const {style, div, input, textarea, button, span, img, label, p } = van.tags;

const app_css = style(`
body{
  background-color:gray;
}
`);
van.add(document.body, app_css);

const loadingscreen = div({style:`
  display: flex; 
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  height: 100vh;
  `},
  div(
    label("Loading")
  ),
  div(
    label(()=>networkStatus.val),
  )
);
van.add(document.body, loadingscreen);

networkStatus.val = 'Initial connection...';


const HOST = 'ws://localhost:3000';
const DB_NAME = 'spacetime-app-chat';
const TOKEN_KEY = `${HOST}/${DB_NAME}/auth_token`;
// localStorage.getItem('auth_token')
//-----------------------------------------------
//
//-----------------------------------------------
const conn = DbConnection.builder()
  .withUri(HOST)
  .withDatabaseName(DB_NAME)
  // .withToken(localStorage.getItem('auth_token') || undefined)
  .withToken(localStorage.getItem(TOKEN_KEY) || undefined)
  .onConnect((conn, identity, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    // loadingscreen
    document.body.removeChild(loadingscreen);

    networkStatus.val = 'Connected';
    stateConn.val = conn;

    // conn.db.my_direct_messages

    // console.log("identity: ", identity);
    console.log("identity: ", identity.toHexString());
    // console.log("conn: ", conn);
    // filter from table update calls...
    userIdentity.val = identity;
    initDB();
  })
  .onDisconnect(() => {
    console.log('Disconnected from SpacetimeDB');
    networkStatus.val = 'Disconnected';
  })
  .onConnectError((_ctx, error) => {
    console.error('Connection error:', error);
    networkStatus.val = 'Connection error';
    // statusEl.textContent = 'Error: ' + error.message;
    // statusEl.style.color = 'red';
  })
  .build();
//-----------------------------------------------
// 
//-----------------------------------------------
function initDB(){
  van.add(document.body, App());
  van.add(document.body, UserPanel());
  van.add(document.body, STDBPanel());

  setUpDBUser();
  setupDBImageAvatar();
  setupDBGroupChat();
  setupDBContact();
  // test_db();
}

// conn.subscriptionBuilder().subscribe(
//  tables.user.where(r => r.online.eq(true))
// );

// https://spacetimedb.com/docs/clients/typescript/
// tables.groupMessage.groupId
// console.log(tables.groupMessage);
// console.log(tables.groupMessage.where(r=>r.groupId.eq(id)))
