# spacetime-app-chat

# Licence: MIT

# SpaceTimeDB:
- spacetimedb binary 2.0.5
- npm spacetimedb 2.0.4

# Features:
- upload image
- get image
- user
- message
- simple ui

# Information:
  Work in progress. Simple chat test.

  SpaceTimeDB is all one database and server module for typescript. Read more on SpaceTimeDB.

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
- it can be use for export to client

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

# refs:
- https://spacetimedb.com/docs/functions/views
- https://spacetimedb.com/docs/functions/procedures
