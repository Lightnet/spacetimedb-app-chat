

import { dbContacts, stateConn } from "../../context";
import van from "vanjs-core";
import { Modal } from "vanjs-ui";

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

  return Modal({closed, },
    p({style:`background-color:black;`},"Add Contact:"),
    div({style: "display: flex; justify-content: center;background-color:black;"},
      label('Name: '), input({value:contactId.val, oninput:e=>contactId.val=e.target.value}),
      button({onclick:create_group}, "Create"),
      button({onclick: () => closed.val = true}, "Cancel"),
    ),
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
  
  // Trigger the async call immediately
  conn.procedures.getUserNameId({ id: contact.userId })
    .then(val => name.val = val ?? "Unknown");

  return div({ id: 'contact-' + contact.id },
    label(van.derive(() => `[ ${name.val.substring(0, 16)} ]`)),// limit to 16 character
    button({ onclick: () => delete_contact_id(contact.id) }, '[ Delete ]')
  );
};

export function contactList() {
  return van.derive(() => div(
    Array.from(dbContacts.val.values()).map(contact => 
      ContactItem({ contact, conn: stateConn.val })
    )
  ));
}

