// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var cors = require('cors') ;
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

app.use(cors()); // add this line below it


// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  //res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub! Ok');
  res.sendFile(__dirname + '/public/index.html');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);

//var http = require('http').Server(app);
var io = require('socket.io')(httpServer);

httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});


io.on('connection', function(socket){
   console.log('a user connected');

  socket.on('chat message', function(msg){
      console.log('message: ' + msg);
      var port = 5000; //The same port that the server is listening on
      var host = '127.0.0.1';
      // var socket2 = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
      // socket2.connect(port, host);
      // socket2.on('connect', function() { //Don't send until we're connected
      //     socket2.sendMessage(msg);
      //     socket2.on('message', function(message) {
      //         console.log('The result is: '+message);
      //         io.emit('chat message', message);
      //     });
      // });


    socket = new net.Socket();
    socket.connect(port, host);
    socket.on('connect', function() { 
          socket.write(msg);
          socket.on('data', function(message) {
              message = String(message.toString().trim());
              console.log('The result is: '+message);
              io.emit('chat message', message);
          });
      });



  });
});


    const net = require('net');
     
    const server = net.createServer((sock) => {

      sock.on('data', (data) => {
        sock.write(data);
        //console.log('Datass', data);
        var response = data.toString().trim();
        console.log(String(response));

      });

      sock.on('end', () => {
        console.log('client disconnected');
      });
    
      sock.on('error', () => {
        console.log('client socket had error');

      });
    
      sock.on('close', () => {
        console.log('client socket closed');
      });
    });

     
     
    
     
    server.listen(3210, () => {
      console.log('opened server on', server.address());
    });


    //var net = require('net'),
    JsonSocket = require('json-socket');
    var clients = [];
    var port = 5000;
    var server2 = net.createServer();
    server2.listen(port);
    server2.on('connection', function(socket) { //This is a standard net.Socket
      clients.push(socket);
        //socket.
        client = socket.remoteAddress + ":" + socket.remotePort;
        console.log('From', client);
        //socket = new JsonSocket(socket); //Now we've decorated the net.Socket to be a JsonSocket
        
        socket.on('data', function(message) {
            console.log('on server net message', message);
            var result = String(message.toString().trim());
            //socket.end(result+",");
            clients.forEach(function(sk){
              sk.write(result+",");
            });
            
        });

        // socket.on('data', function(data) {
        //     console.log('data', data);
        //     var result = data;
        //     //socket.sendEndMessage(result+",");
        //     var response = data.toString().trim();
        //     console.log(String(response));
        // });
    });




// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
