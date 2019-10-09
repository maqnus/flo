const express = require('express'); 
const app = express(); 
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const admin = require('firebase-admin');
const uuid = require('uuidv4').default;
let serviceAccount = require('./config/grim-8aebe-firebase-adminsdk-pc08t-d4d16e4f38.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://grim-8aebe.firebaseio.com"
});

let db = admin.firestore();

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug');
app.use(express.static('public')); 

app.get('/register', function(req, res){
  res.render(__dirname + '/src/views/register', {
    pageTitle: 'Register'
  });
});

app.get('/account-setup', function(req, res){
  res.render(__dirname + '/src/views/initial-setup', {
    pageTitle: 'Account setup'
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
    pageTitle: 'Login',
  });
});

app.get('/mypage', function(req, res){
  res.render(__dirname + '/src/views/mypage', {
    pageTitle: '[username]',
    heading: '[username]'
  });
});

app.get('/department', function(req, res){
  res.render(__dirname + '/src/views/department', {
    pageTitle: '[department]',
    heading: '[department]'
  });
});

app.get('/employee', function(req, res){
  res.render(__dirname + '/src/views/employee', {
    pageTitle: '[employee]',
    heading: '[employee]'
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

const createCookieString = ({name,value,days}) => {
  let expires = "";
  if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  return name + "=" + (value || "")  + expires + "; path=/";
}

io.on('connection', function(socket) {
    console.log('a user connected');
    const sessionId = uuid();
    const userId = uuid();
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('login', function(props){
      console.log('login: ' + props);
      // const usersRef = db.collection('users').doc(props.email);
      // usersRef.get()
      //   .then(doc => {
      //     if (!doc.exists) {
      //       console.log('No such document!');
      //     } else {
      //       const data = doc.data();
      //       console.log('Document data:', data);
      //       if (props.password == data.password) {
      //         io.emit('set_sid', sessionId);
      //         io.emit('redirect', '/mypage');
      //       }
      //     }
      //   })
      //   .catch(err => {
      //     console.log('Error getting document', err);
      //   });
    });
    socket.on('logout', function(props){
      console.log('logout');
      // io.emit('rm_sid', sessionId);
      io.emit('redirect', '/');
    });
    socket.on('chat message', function(props){
      io.emit('chat message', props);
      console.log('message: ' + props);
    });
    socket.on('setup', function(props){
      console.log('Set account data', props);
      let userRef = db.collection('users').doc(userId);
      let updateSingle = userRef.set({
        name: props.name,
        profileImg: props.profileImg,
        department: props.department
      }, {merge: true});
    });
    socket.on('register', function(props){
      console.log('register', props);
      const data = {
        email: props.email,
        password: props.password,
        id: userId
      };
      console.log('register data:', data);
      db.collection('users').doc(userId).set(data);
      io.emit('set_uid', createCookieString({ name: 'gf_uid', value: userId, days: 1 }));
      io.emit('set_sid', sessionId);
      io.emit('redirect', '/account-setup');
    });
    socket.on('set_sid', function(props){
      io.emit('set_sid', sessionId);
      io.emit('redirect', '/');
    });
    socket.on('getUserData', function(props){
      console.log('User data;', props.uid);
      
    });
    socket.on('setup', function(props){
      console.log('setup', props);
      io.emit('redirect', '/mypage')
    });
})

http.listen(app.get('port'), function(){
  console.log('listening on *:5000');
});