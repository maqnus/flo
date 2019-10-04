var express = require('express'); 
var app = express(); 
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public')); 

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');
      socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('chat message', function(props){
      io.emit('chat message', props);
      console.log('message: ' + props);
    });
})

http.listen(app.get('port'), function(){
  console.log('listening on *:5000');
});