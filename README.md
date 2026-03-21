# spacetime-app-chat

# Licence: MIT

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
- direct message ( n/a )
- simple chat ui 

# project files:
- index.html
- chathub.html

# Information:
  Work in progress. Simple chat test.

  SpaceTimeDB is all one database and server module for typescript. Read more on SpaceTimeDB. It use the web socket and module api from SpaceTimeDB cli command export and import module for server and client plugins design. By default use token ID generate from SpaceTimeDB and no ip tracking. It is anonymous by default just normal browser access vist the sites.

  As for ip address might due to Web Assembly in case of bad actors as they can create fake ip address. SpaceTimeDB base on OpenID Connect protocol. Basiclly identity aka token id is create when enter the door as client. Which needed a firewall proxy or third party applications to handle ip tracking for ban or blocking in case of spam and other things. Another way is third party auth application to handle access.

  https://spacetimedb.com/blog/who-are-you

  The only way is the dev way to handle the filter of the ip and auth in their own ways. For this project to test SpaceTimeDB to handle chat messages.

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
