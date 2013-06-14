# Node-Poker #

Realtime poker web-app using Node.js + websockets

## How to run ##
`npm install`

Currently, the game can only be run locally via `node simulate.js. You have to manually create
players, and add them to the table. After that, the game can be 'played' via STDIN.

## TODO ##

### Game Loop ###
- handle split pots
- deal with chip counts
- linting
- put cap on num of bets
- handle All In

### Network Layer ###
- replace socket.io with sockjs
- ensure that everything is actually be sent out

### Frontend ###
- everything :)



