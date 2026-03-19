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
