# spacetime-app-chat

# Licence: MIT

# status:
- prototyping
- in development
- not ready for production.

# SpaceTimeDB:
- spacetimedb binary 2.0.5

# NPM Package:
- vanjs-core 1.6.0
- vanjs-ui
- spacetimedb 2.0.4
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

# Group chat filter:
  After learning how to filter some group message id. There are limited how to handle different group. There are pros and cons.

  There are couple of ways. One client side filter and server side filter. The SpaceTimeDB has View features.

  For client side it has problem as it expose public to other group chat list that anyone can view messages. But it can filter out groupChatId.

  On the server side can filter but support one view at the time. But required if there many groups that join other groups. Not found correct way to handle multiples groups to filter out messages.

  Note required some logics on how code filter.

  https://spacetimedb.com/docs/functions/views


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
- The view is read only when filter query.

## server module:
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
