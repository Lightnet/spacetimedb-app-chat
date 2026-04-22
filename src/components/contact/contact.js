

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

export function contactList(){

  const myContacts = van.derive(()=>{
    const contacts = Array.from(dbContacts.val.values());
    console.log(contacts);

    return div(
      contacts.map(contact => {

        return div({id:'contact-'+contact.id},
          label("[ "+contact.name+" ]"),
          // button({onclick:()=>setupChatPanel(contact.id, contact.name)},'[ Join ]'),
          span(' '),
          button({onclick:()=>delete_contact_id(contact.id)},'[ Delete ]')
        )
      })
    );
  });

  return myContacts;
}