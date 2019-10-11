const express = require('express'); 
const app = express(); 
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const firebase = require("firebase");
const admin = require('firebase-admin');
const uuid = require('uuidv4').default;
let serviceAccount = require('./config/grim-8aebe-firebase-adminsdk-pc08t-d4d16e4f38.json');

const firebaseConfig = {
  apiKey: "AIzaSyBjwGyONriXqNEBdtAnroU_t9bSUGEvado",
  authDomain: "grim-8aebe.firebaseapp.com",
  databaseURL: "https://grim-8aebe.firebaseio.com",
  projectId: "grim-8aebe",
  storageBucket: "grim-8aebe.appspot.com",
  messagingSenderId: "646298061526",
  appId: "1:646298061526:web:adb26466e51c73d9c15777"
};

firebase.initializeApp(firebaseConfig);
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
  firebase.auth().onAuthStateChanged(() => {
    // const user = firebase.auth().currentUser;
    const user = firebase.auth().currentUser;
    let name, email, photoUrl, uid, emailVerified;

    if (user != null) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                      // this value to authenticate with your backend server, if
                      // you have one. Use User.getToken() instead.
    };
    // console.log('name:', name, 'email: ', email, 'photoUrl: ', photoUrl, 'emailVerified: ', emailVerified, 'uid: ', uid);
    res.render(__dirname + '/src/views/mypage', {
      pageTitle: name,
      heading: '[username]',
      userName: name
    });
  });
});

app.get('/department/:department', function(req, res){
  console.log('department: ', req.params.department);
  let currentDepartment = department.find(item => item.id == req.params.department.department);
  if (currentDepartment) {
    res.render(__dirname + '/src/views/department', {
      pageTitle: '[department]',
      heading: '[department]',
      model: currentDepartment
    });
  } else {
    pageNotFound();
  }
  
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
      firebase.auth().signInWithEmailAndPassword(props.email, props.password).then(function(){
        io.emit('redirect', '/mypage');
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
    });
    socket.on('logout', function(props){
      console.log('logout');
      // io.emit('rm_sid', sessionId);
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        io.emit('redirect', '/');
      }).catch(function(error) {
        // An error happened.
      });
    });
    socket.on('chat message', function(props){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          io.emit('chat message', props);
        console.log('message: ' + props);
        } else {
          // No user is signed in.
          io.emit('redirect', '/');
        }
      });
      
    });
    socket.on('setup', function(props){
      console.log('Set account data', props);
      io.emit('set_sid', sessionId);
    });
    socket.on('register', function(props){
      console.log('register', props);
      firebase.auth().createUserWithEmailAndPassword(props.email, props.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
      io.emit('redirect', '/account-setup');
    });
    socket.on('forgotPassword', function(props){

    })
    socket.on('set_sid', function(props){
      // io.emit('set_sid', sessionId);
      // io.emit('redirect', '/');
    });
    socket.on('getUserData', function(props){
      console.log('User data;', props.uid);
      
    });
    socket.on('setup', function(props){
      console.log('setup', props);
      const user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: props.name,
        department: props.department,
        photoURL: props.profileImg
      }).then(function() {
        // Update successful.
      }).catch(function(error) {
        // An error happened.
      });
      io.emit('redirect', '/mypage')
    });

    socket.on('userShouldBeLoggedInHere', function(props){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
        } else {
          // No user is signed in.
          io.emit('redirect', '/')
        }
      });
    })

    socket.on('getUserData', function(props){
      firebase.auth().onAuthStateChanged(function(user) {
        // io.emit('setUserData', user);
        // console.log(user.displayName);
        // console.log(user.department);
        // console.log(user.photoURL);
        // console.log(user.email);
        // console.log(user.uid);
      })
    })
})

http.listen(app.get('port'), function(){
  console.log('listening on *:5000');
});