# spacetime-app-chat

# Licence: MIT

# Status:
- prototyping
- in development
- not ready for production.

# SpaceTimeDB:
- spacetimedb binary 2.1.0

# NPM Package:
- vanjs-core 1.6.0
- vanjs-ui
- spacetimedb 2.1.0
- vite 8.0.0

# Features:
- upload image ( buffer )
- get image ( two method procedure or view)
- user ( simple account no password)
  - edit name
  - edit status
  - edit bio
- message (simple message)
- direct message ( wip )
- simple chat ui ( wip )
- group chat ( wip )
  - group name
  - group config
  - group member
  - group message
- notifications
 - friend online / offline
 - new message ?
 - dm message ?
 - report alert ?
 - update information
 - server boardcast message

# Project files:
- index.html
- chathub.html

# Information:
  The project is to test chat messages. As well some vary types. Like direct message, group chat and server group.

  Direct message is chat between two users. ( wip )

  Group chat is create group that not part of the server group which can be delete. ( wip )

  Server group is list of text channel. ( wip )

# Encrypt and Decrypt:
  Currently not coded.

  For the encrypt and decrypt libraries does required nodje for crypto and random to work. But Spacetime has single random function but no crypto. There are some restrictions since it web assembly sandbox module server.

  The nodejs libraries can't be use since it sandbox but use SpaceTimeDB api.

```
ctx.random()
ctx.timestamp
ctx.newUuidV4()
ctx.newUuidV7()
```
## List:
  Doing some simple tests.
- crypto-es ( working simple test, partly not working)
- nanoid ( failed required crypto)
- @noble/ciphers ( required random)

# Group chat filter:
  There are differen ways to handle group chat. The SpaceTimeDB has view and anonymousView features. As well there are pros and cons.

  https://spacetimedb.com/docs/functions/views

## Client side:
  It has it pros and cons. It can easy expose the public messages from other chat groups. Reason it open to query easy.

### Method 1
```js
  const closed = van.state(false);
  const messages = van.state([]);
  let groupMsgSub = null;
  //...

  function update_message(ctx, row){
    let side = '';
    console.log("group msg...");
    if(row.senderId.toHexString() == userIdentity.val.toHexString()){
      // console.log("FOUND USER???");
      side = "sent";
    }
    messages.val = [...messages.val, { side: side, name: "You", text:row.content }];
  }
  function setUpConnChat(){
    //create subscription to unsubscribe.
    conn.reducers.setGroupChatId({id:groupId});
    groupMsgSub = conn
      .subscriptionBuilder()
      .onApplied((ctx)=>{
        ctx.db.current_group_chat_messages.onInsert(update_message);
      })
      .onError((ctx, error) => {
        console.error(`Subscription failed: ${error}`);
      })
      //.subscribe(tables.groupChatMessage.where(r=>r.groupId.eq(groupId)));
      .subscribe(tables.current_group_chat_messages);
  }
  //...
  // This will handle the table to unsubscribe. To stop listen table.
  van.derive(()=>{
    console.log("group chat closed: ", closed.val);
    if(closed.val == true){
      console.log(groupMsgSub);
      if(groupMsgSub.isActive){
        // remove callback function
        conn.db.current_group_chat_messages.removeOnInsert(update_messages)
        groupMsgSub.unsubscribe();
      }
    }
  })
```

## Server side:
  It same but required more load but reduce bandwidth sending the message data to filter out.
### Method 1
```js
export const set_group_chat_id = spacetimedb.reducer(
  { id:t.u64() },
  (ctx, { id }) => {
    console.info(`ctx.sender: ${ctx.sender}  Group Chat Id: ${id}`);
    const config = ctx.db.groupChatConfig.identity.find(ctx.sender);

    if(config){
      config.groupChatId = id;
      ctx.db.groupChatConfig.identity.update(config);
    }else{
      ctx.db.groupChatConfig.insert({
        status: undefined,
        identity: ctx.sender,
        createdAt: ctx.timestamp,
        groupChatId: id
      })
    }
  }
);

// get user id that current group chat messages.
export const current_group_chat_messages = spacetimedb.view(
  { name: 'current_group_chat_messages', public: true },
  t.array(groupChatMessage.rowType), 
  (ctx) => {
    //check current user config
    const _groupConfig = ctx.db.groupChatConfig.identity.find(ctx.sender);
    if(_groupConfig){
      //return group chat message to filter by group chat id.
      return Array.from(ctx.db.groupChatMessage.groupId.filter(_groupConfig.groupChatId));
    }
    return [];
  }
);
```
### Method 2
```ts
export const all_group_chat_messages = spacetimedb.view(
  { name: 'all_group_chat_messages', public: true },
  t.array(groupChatMessage.rowType), 
  (ctx) => {

    // ctx.sender = user id.
    const groupChatlist = ctx.db.groupChatMember.memberId.filter(ctx.sender);

    const allowedGroupIds = new Set(
      Array.from(groupChatlist).map(m => m.groupId)
    );

    if (allowedGroupIds.size === 0) {
      return []; // User is not in any groups
    }
    // Get ALL messages and filter to only those in the user's groups
    const allMessages = ctx.db.groupChatMessage.iter(); // or .filter if you had a range, but here we need multiple values

    return Array.from(allMessages).filter(msg => 
      allowedGroupIds.has(msg.groupId)
    );
    // return []
  })
```

# Callbacks onInsert, onUpdate, OnDelete:
  Note that when create a window instance. When handle the element window panel floating.

```ts
function update_messages(ctx, row){
  //do something
}
//...
const groupMsgSub = conn
  .subscriptionBuilder()
  .onApplied((ctx)=>{
    ctx.db.current_group_chat_messages.onInsert(update_messages);
  })
  .subscribe(tables.current_group_chat_messages);
//...

// This will handle the table to unsubscribe. To stop listen table.
van.derive(()=>{
  console.log("group chat closed: ", closed.val);
  if(closed.val == true){
    console.log(groupMsgSub);
    if(groupMsgSub.isActive){
      // since it view it need main connector client
      conn.db.current_group_chat_messages.removeOnInsert(update_messages)
      groupMsgSub.unsubscribe();
    }
  }
})

//...
// this will handle window panel clean way.
// make sure it clean up once the element is remove from the doc body.
return ()=> closed.val ? null : windowEl;
//...
```
  Make sure create a function to register and unregister. Else it would stack in the listeners once reused callback functions.


# SpaceTimeDB Information:

  SpaceTimeDB is all one database and server module for typescript as Web Assembly as plugin add on to the database. Read more on SpaceTimeDB. It use the web socket and module api from SpaceTimeDB for simple chat message application.  

  SpaceTimeDB base on OpenID Connect protocol. They treat identity as client. SpacetimeDB does not track ip address but create string token by default if wish to use same identity. It is anonymous by default just normal browser access vist the site.

  There are third party applications and packages that handle authentication can be read in docs. 
  
  https://spacetimedb.com/blog/who-are-you
  
  Which required developer code to handle how SpaceTimeDB to authentication who the user is. As for the ip address tracking for ban or blocking in case of spam and other things. I have not gone into depth for tools or apps to handle security and ip address logging to ban or block. It vary in the hosting servcies.

# SpaceTimeDB Diagram:

```
# SpaceTimeDB #
/------------------/                  /------------------/
/   Database       /                  /     Browser      /
/      |           /                  /                  /
/      |           /                  /                  /
/   Server Module  / -- web socket -- /  Client Module   /
/    - Reducers    /                  / - Reducers       /
/    - Procedures  /                  / - Procedures     /
/    - Views       /                  / - conn.db.<name> /
/    - Tables      /                  /   -onUpdate(...) /
/------------------/                  /   -onDelete(...) /
                                      /   -onInsert(...) /
/------------------/                  /                  /
/  Web Server      / ----- htpp ----- /                  /
/------------------/                  /------------------/
```

# SpaceTimeDB view:
- https://spacetimedb.com/docs/functions/views
- The view is read only when filter query.

# SpaceTimeDB anonymousView:
- There is restrict but required public. Mean everyone can view the data in public.
- Note that ctx.sender id can't be use here. Only the db and from can be use here.
- Here for note reminder.
```ts
export const high_scorers = spacetimedb.anonymousView(
  { name: 'high_scorers', public: true },
  t.array(players.rowType),
  (ctx) => {
    return ctx.from.players
      .where(p => p.score.gte(1000n))
      .where(p => p.name.ne('BOT'));
  }
);
```

## Server module:
```js
// https://spacetimedb.com/docs/functions/views
export const user_current_avatar = spacetimedb.view(
  { 
    name: 'user_current_avatar',
    public: true 
  },
  t.option(userAvatar.rowType),
  (ctx) => {
    const user = ctx.db.user.identity.find(ctx.sender);
    if(user){
      const user_avatar = ctx.db.userAvatar.userId.find(user.id);
      if(user_avatar){
        return user_avatar; 
      }
    }
    return undefined;
});
```
## Client:
```js
//...
    // current user avatar image listen
    conn
      .subscriptionBuilder()
        .subscribe(tables.user_current_avatar);
    // current user avatar image
    conn.db.user_current_avatar.onInsert((ctx, row)=>{
      console.log(row);
      displayAvatar(row.data, row.type); // load image helper
    })
//...
```

# Set Up and Config
 - Required SpaceTimeDB install. https://spacetimedb.com/
 - Required Bun. https://bun.com/

# SpaceTimeDB start:
```
spacetime start
```
- start database and server application.
- note it need to run on terminal.

```
spacetime dev --server local
```
- build, run, watch files changes.
- debug logs

# SpaceTimeDB publish:
```
spacetime publish --server local --module-path spacetimedb spacetime-app-chat
```
- run spacetime to push module app
- This support Typescript to push to module to run server for clients to access web socket.

# SpaceTimeDB logs:
```
spacetime logs -s local -f spacetime-app-chat 
```
- Note this run another terminal to access spacetimedb client to log for database name.
- log datbase spacetime-app-chat debug 

# SpaceTimeDB generate client module:
```
spacetime generate --lang typescript --out-dir src/module_bindings --module-path spacetimedb
```
- generate typescript for client
- note this export typescript.

# SpaceTimeDB delete database:
```
spacetime publish --server local spacetime-app-chat --delete-data
```
- clear data
- in case of table fail to update change.

# spacetimedb sql:
```
spacetime sql --server local spacetime-app-chat "SELECT * FROM user"
```
```
spacetime sql --server local spacetime-app-chat "SELECT * FROM user_avatar"
```

# Refs:
- https://spacetimedb.com/docs/functions/views
- https://spacetimedb.com/docs/functions/procedures

# Bugs:
- subscriptionBuilder
  - unsubscribe does not clear previsit listen. It over laps.
- nanoid required crypto which is not defined.
- math random is not defined.
- ctx.random() use by SpaceTimeDB.
