import {connection, server as WebSocketServer} from 'websocket';
import http from 'http';
import { IncomingMessage, SupportedMessage } from './messages/incomingMessages';
import { UserManager } from './userManager';
import { InMemoryStore } from './store/InMemoryStore';

var server = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

const userManager = new UserManager()
const store = new InMemoryStore()

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if(message.type == 'utf8'){
            try{
                MessageHandler(JSON.parse(message))


            }catch(e){
                console.log(e)
            }
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});



function MessageHandler(ws: connection, message: IncomingMessage){
    if(message.type === SupportedMessage.JoinRoom){
        const payload = message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId ,ws)
    }

    if(message.type === SupportedMessage.SendMessage){
        const payload = message.payload;
        const user = userManager.getUser(payload.userId, payload.roomId)
        if(!user){
            console.error('User not found!')
            return
        }
        store.addChat(payload.message, user.name, payload.userId, payload.roomId)
    }

    if(message.type === SupportedMessage.UpvoteMessage){
        const payload = message.payload;
        store.upvote(payload.chatId, payload.userId, payload.roomId)
    }
}