# Node-Poker #

Realtime poker web-app using Node.js + websockets

## How to run ##
`npm install`

Currently, the game can only be run locally via `node simulate.js`. This will allow you to get a feel for
the game engine. The script creates a table as well as three players with a predetermined chip count.
After that, the game can be 'played' via STDIN.

## TODO ##

### Game Loop ###
- handle split pots
- deal with chip counts
- linting
- put cap on num of bets
- handle All In

### Network Layer ###
- replace socket.io with sockjs
- persistence to DB
- get data going out to websockets

### Frontend ###
- everything :)
