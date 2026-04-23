// main entry point

import spacetimedb, {init , onConnect, onDisconnect} from './module';

import { 
  set_name,
  set_custom_status,
} from './reducers/reducer_user';

import {
  user_current_avatar,
  current_user
} from './views/view_user';

import { upload_avatar } from './reducers/reducer_image';

import { 
  add_contact,
  add_contact_id,
  remove_contact_id,
} from './reducers/reducer_contact';

import {get_user_name_id} from './procedures/procedure_user';

import { view_contacts } from './views/view_contact';

import { 
  send_direct_message,
  mark_conversation_as_read,
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
  test_c,
  test_id,
  test_random,
  test_salt,
} from './reducers/reducer_test';

import { 
  my_direct_messages,
  my_direct_conversations,
} from './views/view_direct_message';

export {
  // spacetimedb predefine
  init,
  onConnect,
  onDisconnect,
  // user 
  set_name,
  set_custom_status,
  current_user,
  get_user_name_id,
  user_current_avatar,
  upload_avatar,
  add_contact,
  add_contact_id,
  remove_contact_id,
  view_contacts,
  //
  send_message, // test
  // 
  send_direct_message,
  mark_conversation_as_read,
  my_direct_messages,
  my_direct_conversations,
  //
  create_group_chat,
  set_group_chat_id,
  current_group_chat_messages,
  send_group_chat_message,
  delete_group_chat,
  // tests
  test_c,
  test_id,
  test_random,
  test_salt
}

export default spacetimedb;