const express = require('express'); 
const app = express(); 
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug');
app.use(express.static('public')); 

app.get('/register', function(req, res){
  res.render(__dirname + '/src/views/register', {
    pageTitle: 'Register'
  });
});

app.get('/reset-password', function(req, res){
  res.render(__dirname + '/src/views/reset-password', {
    pageTitle: 'Reset password',
    heading: 'Forgot your password?'
  });
});

app.get('/logout', function(req, res){
  res.render(__dirname + '/src/views/logout', {
    pageTitle: 'Logout'
  });
});

app.get('/', function(req, res){
  res.render(__dirname + '/src/views/login', {
    layoutType: 'login',
    pageTitle: 'Login'
  });
});

app.get('/mypage', function(req, res){
  res.render(__dirname + '/src/views/mypage', {
    pageTitle: '[username]',
    heading: '[username]'
  });
});

app.get('/chat', function(req, res){
  res.render(__dirname + '/src/views/chat', {
    pageTitle: 'Chat'
  });
});

app.get('*', function(req, res){
  res.render(__dirname + '/src/views/404', {
    pageTitle: '404 Page not found',
    name: 'Magnus'
  });
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