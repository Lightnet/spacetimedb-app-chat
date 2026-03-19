import { DbConnection, tables } from './module_bindings';
import { Identity } from 'spacetimedb';
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.6.0.min.js"

// spacetime sql --server local spacetimedb-app-chat "SELECT * FROM message"
// spacetime sql --server local spacetimedb-app-chat "SELECT * FROM user"
const HOST = 'ws://localhost:3000';
const DB_NAME = 'spacetime-app-chat';

const {div, button, label, input, li, ul, img} = van.tags;
const el_file = input({type:'file'})
async function upload_file(event){
  console.log(event);
  const file = el_file.files[0];
  console.log(file);
  console.log(file.type);

  const arrayBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(arrayBuffer);

  console.log(arrayBuffer);
  conn.reducers.uploadAvatar({
    userId:BigInt(1),
    mimeType:file.type,
    data:fileBytes
  });

}

async function counts(){
  // conn.reducers.userAvatarCount();
  // conn.reducers.userAvatarCount();
  const avatarData = await conn.procedures.getAvatar({id:1n});
  console.log(avatarData);
  displayAvatar(avatarData.data, avatarData.type);
}


const user_avatar = div(
  el_file,
  button({onclick:upload_file},'upload file'),
  button({onclick:()=>get_avatar_id(1)},'test'),
  button({onclick:()=>counts()},'count')
);

const chat_messages = div();
const avatar_image = img();

const chat_box = div();
const el_status = van.state('None');
const username = van.state('Guest');

function apply_user(ctx){
  // console.log("apply");
  console.log(`Ready with ${ctx.db.user.count()} users`);
  // console.log(ctx);
}

function apply_messages(ctx){
  // console.log("apply");
  // console.log(`Ready with ${ctx.db.message.count()} messages`);
  // console.log(ctx);
}
// https://spacetimedb.com/docs/clients/api/
// 

// var current_id = null;
const conn = DbConnection.builder()
  .withUri(HOST)
  .withDatabaseName(DB_NAME)
  .withToken(localStorage.getItem('auth_token') || undefined)
  .onConnect((conn, identity, token) => {
    localStorage.setItem('auth_token', token);
    console.log('Connected with identity:', identity.toHexString());
    el_status.val = 'Connected';
    console.log("identity: ", identity);
    // const user = conn.db.user.identity.find(identity);//nope
    // const user = conn.db.user.identity.find('0x'+identity.toHexString());
    // const user = conn.db.user.identity.find('0x'+identity.toHexString());
    // console.log("user: ",user);
    // current_id = identity;
    // const user = conn.db.user.identity.find(identity);//nope
    // console.log("user: ",user);

    conn
      .subscriptionBuilder()
        .onApplied((ctx) => apply_user(ctx))
        .onError((ctx, error) => {
          console.error(`Subscription failed: ${error}`);
        })
        .subscribe(tables.user);

    conn
      .subscriptionBuilder()
        .onApplied((ctx) => apply_messages(ctx))
        .onError((ctx, error) => {
          console.error(`Subscription failed: ${error}`);
        })
        .subscribe(tables.message);

    conn.db.user.onInsert((ctx, row)=>{
      // console.log('insert user row');
      // console.log(row);
      // console.log(row.identity.toHexString());
      //console.log(ctx.identity);//nope, does not exist
      // console.log(conn.identity.toHexString());
      // check if current user client to update their name display
      if(row.identity.toHexString() == conn.identity.toHexString()){
        // console.log("found current ID:", conn.identity.toHexString());
        username.val = row.name;
      }
    });

    // any change on user.
    conn.db.user.onUpdate((ctx, oldRow, newRow)=>{
      // console.log("update???");
      // console.log("oldRow:", oldRow);
      // console.log("newRow:", newRow);
    })

    //add message on first and if there old message will be added here.
    conn.db.message.onInsert((ctx, row)=>{
      // console.log('insert message row');
      // console.log(`Message:`, row.text);
      // console.log(row)
      van.add(chat_messages,div(
        label(row.sender.toHexString().substring(0, 8)),
        label(' Msg:'),
        label(row.text),
      ))
    });

  })
  .onDisconnect(() => {
    console.log('Disconnected from SpacetimeDB');
    el_status.val = 'Disconnected';
  })
  .onConnectError((_ctx, error) => {
    console.error('Connection error:', error);
    // statusEl.textContent = 'Error: ' + error.message;
    // statusEl.style.color = 'red';
  })
  .build();

// console.log("conn.reducers");
// console.log(conn.reducers);
// console.log("vanjs test");

function displayAvatar(bytes, mimeType) {
  // 1. Create a Blob from the Uint8Array and the stored MIME type
  const blob = new Blob([bytes], { type: mimeType });
  
  // 2. Generate a temporary URL for the browser
  const imageUrl = URL.createObjectURL(blob);
  
  // 3. Set it as an <img> source
  // document.getElementById('avatarDisplay').src = imageUrl;
  avatar_image.src = imageUrl;
}

async function get_avatar_id(userId){
  // Access the table via your connection
  // const avatarRecord = conn.db.userAvatar.userId.find(BigInt(userId));
  console.log("conn:", conn);
  // conn.procedures.getAvatar(1n);
  // //does not work here.
  // const avatarRecord = conn.db.userAvatar.userId.find(1);
  // console.log("conn.db.userAvatar:", conn.db.userAvatar.count());
  // for (const row of conn.db.userAvatar.iter()) {
  //   console.log("Found avatar for user:", row.userId);
  //   // Do something with row.data...
  //   console.log(row )
  // }
  // // const data  = conn.db.userAvatar.iter();
  // // console.log(data )
  // console.log("avatarRecord");
  // console.log(avatarRecord);
  // if (avatarRecord) {
  //   const format = avatarRecord.mimeType; // "image/png"
  //   const bytes = avatarRecord.data;     // Uint8Array
  //   console.log(format);
  //   // Use them to show the image
  //   displayAvatar(bytes, format);
  // }
}

function App(){

  const isEdit = van.state(false);
  const message = van.state('');
  const text_content = van.state('');
  // const isDone = van.state(false);
  const isDone = van.state(true);

    function test(){
        console.log("test");
        console.log(conn.reducers);
        // conn.reducers.sayHello();
    }

    const render_name = van.derive(()=>{
      if(isEdit.val){
        return input({value:username,oninput:e=>username.val=e.target.value})
      }else{
        return label(username.val)
      }
    });

    // update name
    function update_name(){
      console.log("update name");
      conn.reducers.setName({name:username.val})
      isEdit.val = false;
    }

    const name_mode =  van.derive(()=>{
      if(isEdit.val){
        return button({onclick:update_name},'Update')
      }else{
        return button({onclick:()=>isEdit.val=!isEdit.val},'Edit')
      }
    });

    function click_sent(){
      console.log("message: ", message.val);

      conn.reducers.sendMessage({
          text:message.val
        });
    }

    function typing_message(e){
      if (e.key === "Enter") {
        console.log("Input Value:", e.target.value)
        // Add your logic here
        conn.reducers.sendMessage({
          text:e.target.value
        });
      }
    }

    function setup(){
      van.add(chat_box, input({value:message,oninput:e=>message.val=e.target.value,onkeydown:e=>typing_message(e)}))
      van.add(chat_box, button({onclick:click_sent},'Send'))
      console.log("hello?");
      get_avatar_id(1);
    }

    setup();

    return div(
        div(
          label("Status: "),
          el_status
        ),
        avatar_image,
        user_avatar,

        div(
          name_mode,
          label('Name: '),
          render_name,
        ),
        
        chat_box,
        chat_messages,
    )
}

van.add(document.body, App());


