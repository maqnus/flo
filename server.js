const express = require('express'); 
const app = express(); 
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug');
app.use(express.static('public')); 

app.get('/register', function(req, res){
  res.sendFile(__dirname + '/public/register.html');
});

app.get('/reset-password', function(req, res){
  res.render(__dirname + '/src/views/reset-password');
});

app.get('/logout', function(req, res){
  res.render(__dirname + '/src/views/logout');
});

app.get('/', function(req, res){
  res.render(__dirname + '/src/views/login');
});

app.get('/pug', function(req, res){
  res.render(__dirname + '/src/views/index', {
    name: 'Magnus'
  });
});

app.get('/mypage', function(req, res){
  res.sendFile(__dirname + '/public/mypage.html');
});

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/public/chat.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('login', function(props){
      console.log('login: ' + props);
      io.emit('redirect', '/mypage');
    });
    socket.on('logout', function(props){
      console.log('logout');
      io.emit('redirect', '/');
    });
    socket.on('chat message', function(props){
      io.emit('chat message', props);
      console.log('message: ' + props);
    });
})

http.listen(app.get('port'), function(){
  console.log('listening on *:5000');
});