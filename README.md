# How to use this starter kit

The starter kit includes both the Vite + React setup as well as the WebSocket server tailored specifically for the Mini Discord Clone project.

## React application

The application contains WebSocket socket.io object via `src/libs/socket.js`, which is imported inside `App.jsx`. Use the socket object to handle the connection and events.

## WebSocket server

The WebSocket server uses [socket.io](https://socket.io). The main server file is located in the root directory, `server.cjs`. Additional supporting modules are placed inside the `server` folder.

### Supported events

* `connect` - emitted to the client when WebSocket connection is established with the server.
* `session` - emitted when session is initialized after connecting to the server.
* `channels` - returns list of channels along with contained messages in each channel.
* `message:channel` - emitted to all clients in the `<channel>` when the user sends a message to that channel. The event is also emitted to the sender.
* `users` - returns list of users (both online and offline).
* `user:join` - emitted to all clients in the `welcome` channel when a new user joins the server.
* `user:disconnect` - emitted to all clients when the user disconnects (WebSocket connection closed).
* `disconnect` - emitted to the client when WebSocket connection is closed.

* `user:leave` - client should emit this event when user explicitly leaves the server.
* `message:channel:send` - client should emit this event when user sends a message to a specific channel.

Inspect the `server.cjs` to see what parameters and arguments are accompanied by each event.

#### Leaving vs disconnecting

In Discord, one can join and leave the server. When leaving, such a user is no longer present in the server user list.

Disconnecting, however, means that the user is no longer currently online, but is still present in the server user list. Reconnecting to the server means the user becoming online again.

### WebSocket server state

User list, sessions and messages are stored in memory. When the WebSocket server is restarted, all data is lost.

### Running the server

After installing dependencies with `npm install`, use the following command to start the WebSocket server:

```sh
npm run server
```

Alternatively, you can invoke Node.js directly with the given server file:

```sh
node server.cjs
```

React + Vite dev server must be running separately:

```sh
npm run dev
```
