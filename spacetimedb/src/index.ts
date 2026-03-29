// main entry point

import spacetimedb, {init , onConnect, onDisconnect} from './module';

import { 
  set_name,
  set_custom_status, 
  upload_avatar,
} from './reducers/reducer_user';

import { 
  send_direct_message, 
  my_direct_message 
} from './reducers/reducer_direct_message';

import {
  send_message
} from './reducers/reducer_message';

import {
  create_group_chat,
  set_group_chat_id,
  send_group_chat_message,
  delete_group_chat,
} from './reducers/reducer_group_chat';

import {
  current_group_chat_messages
} from './views/view_group_chat';

import {
  user_current_avatar,
  current_user
} from './views/view_user';

import {test_c} from './reducers/reducer_test';

export {
  // spacetimedb predefine
  init,
  onConnect,
  onDisconnect,
  // dev 
  set_name,
  set_custom_status,
  current_user,
  user_current_avatar,
  upload_avatar,
  //
  send_message, // test
  // 
  send_direct_message,
  my_direct_message,
  //
  create_group_chat,
  set_group_chat_id,
  current_group_chat_messages,
  send_group_chat_message,
  delete_group_chat,
  // tests
  test_c,
}

export default spacetimedb;