

import { dbContacts, stateConn } from "../../context";
import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import { modalDirectMessage } from "../directmessage/directmessage";

const { div, input, textarea, button, span, img, label, p } = van.tags;

export function contactAdd(){
  const closed = van.state(false);
  const contactId = van.state('');

  function create_group(){
    console.log("create : ", contactId.val);
    const conn = stateConn.val;
    conn.reducers.addContact({
      id:contactId.val
    })
  }

  return Modal({closed},
    div({style: `
      display: flex; 
      flex-direction: column; 
      gap: 1.5rem; 
      padding: 24px; 
      background-color: #1a1a1a; 
      color: #fff; 
      border-radius: 12px;
      min-width: 300px;
    `},
      // Header
      p({style: `margin: 0; font-size: 1.1rem; font-weight: bold;`}, "Add Contact"),

      // Input Group
      div({style: `display: flex; flex-direction: column; gap: 8px;`},
        label({style: `font-size: 0.85rem; color: #aaa;`}, "User ID or Name"),
        input({
          value: contactId, 
          oninput: e => contactId.val = e.target.value,
          placeholder: "Enter contact detail...",
          style: `
            padding: 10px; 
            background: #2d2d2d; 
            color: white; 
            border: 1px solid #444; 
            border-radius: 6px;
          `
        })
      ),

      // Centered Buttons
      div({style: `display: flex; justify-content: center; gap: 12px;`},
        button({
          onclick: create_group, // Note: You might want to rename this function to add_contact
          style: `
            flex: 1;
            padding: 10px; 
            background: #007bff; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            cursor: pointer;
            font-weight: bold;
          `
        }, "Add"),
        
        button({
          onclick: () => closed.val = true,
          style: `
            flex: 1;
            padding: 10px; 
            background: transparent; 
            color: #888; 
            border: 1px solid #444; 
            border-radius: 6px; 
            cursor: pointer;
          `
        }, "Cancel")
      )
    )
  )

}

function delete_contact_id(id){
  const conn = stateConn.val;
  conn.reducers.removeContactId({
    id:id
  });
}

const ContactItem = ({ contact, conn }) => {
  const name = van.state("Loading...");

  function directMessageId(id){
    van.add(document.body, modalDirectMessage(id));
  }
  
  // Trigger the async call immediately
  conn.procedures.getUserNameId({ id: contact.userId })
    .then(val => name.val = val ?? "Unknown");

  return div({ id: 'contact-' + contact.id },
    label(van.derive(() => `[ ${name.val.substring(0, 16)} ]`)),// limit to 16 character
    button({ onclick: () => delete_contact_id(contact.id) }, '[ Delete ]'),
    button({ onclick: () => directMessageId(contact.userId) }, '[ DM ]'),
  );
};

export function contactList() {
  return van.derive(() => div(
    Array.from(dbContacts.val.values()).map(contact => 
      ContactItem({ contact, conn: stateConn.val })
    )
  ));
}

