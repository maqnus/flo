const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const firebase = require("firebase");
const admin = require('firebase-admin');
const uuid = require('uuidv4').default;
let serviceAccount = require('./config/grim-8aebe-firebase-adminsdk-pc08t-d4d16e4f38.json');
const firebaseConfig = require('./config/firebaseConfig.json');
const projectId = "grim-8aebe";
firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://grim-8aebe.firebaseio.com"
});


// /**
//  * Creates a new app with authentication data matching the input.
//  *
//  * @param {object} auth the object to use for authentication (typically {uid: some-uid})
//  * @return {object} the app.
//  */
// function authedApp(auth) {
//   return firebase.initializeApp({
//     serviceAccount,
//     auth
//   }).firestore();
// }

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/register', function (req, res) {
  res.render(__dirname + '/src/views/register', {
    pageTitle: 'Register'
  });
});

app.get('/account-setup', function (req, res) {
  res.render(__dirname + '/src/views/initial-setup', {
    pageTitle: 'Account setup'
  });
});

app.get('/reset-password', function (req, res) {
  res.render(__dirname + '/src/views/reset-password', {
    pageTitle: 'Reset password',
    heading: 'Forgot your password?'
  });
});

app.get('/logout', function (req, res) {
  res.render(__dirname + '/src/views/logout', {
    pageTitle: 'Logout'
  });
});

app.get('/', function (req, res) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      res.redirect('/mypage');
    } else {
      // No user is signed in.
      res.render(__dirname + '/src/views/login', {
        layoutType: 'login',
        pageTitle: 'Login',
      });
    }
  });
});

app.get('/mypage', function (req, res) {
  firebase.auth().onAuthStateChanged(() => {
    // const user = firebase.auth().currentUser;
    const user = firebase.auth().currentUser;
    let name, email, photoUrl, uid, emailVerified;

    if (user != null) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
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

app.get('/department/:department', function (req, res) {
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

app.get('/employee', function (req, res) {
  res.render(__dirname + '/src/views/employee', {
    pageTitle: '[employee]',
    heading: '[employee]'
  });
});

app.get('/chat', function (req, res) {
  res.render(__dirname + '/src/views/chat', {
    pageTitle: 'Chat'
  });
});

app.get('*', function (req, res) {
  res.render(__dirname + '/src/views/404', {
    pageTitle: '404 Page not found',
    name: 'Magnus'
  });
});

const createCookieString = ({
  name,
  value,
  days
}) => {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  return name + "=" + (value || "") + expires + "; path=/";
}

io.on('connection', socket => {
  // console.log('a user connected');
  const sessionId = uuid();
  const userId = uuid();

  // socket.on('disconnect', () => {
  //   console.log('user disconnected');
  // });

  socket.on('login', props => {
    console.log('login: ' + props);
    firebase.auth().signInWithEmailAndPassword(props.email, props.password).then(() => {
      io.emit('redirect', '/mypage');
    }).catch(error => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  });

  socket.on('logout', props => {
    console.log('logout');
    // io.emit('rm_sid', sessionId);
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      io.emit('redirect', '/');
    }).catch(function (error) {
      // An error happened.
    });
  });

  socket.on('chat message', props => {
    firebase.auth().onAuthStateChanged(user => {
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

  socket.on('register', props => {
    console.log('register', props);
    firebase.auth()
      .createUserWithEmailAndPassword(props.email, props.password)
      .then(() => io.emit('redirect', '/account-setup'))
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  });

  socket.on('forgotPassword', props => {

  })

  socket.on('set_sid', props => {

  });

  socket.on('getUserData', props => {
    console.log('User data;', props.uid);

  });

  socket.on('setup', async (props) => {
    console.log('Set account data', props);
    const user = firebase.auth().currentUser;
    admin
      .database()
      .ref('users/' + user.uid)
      .set({
        username: props.username,
        department: props.department,
        jobtitle: props.jobtitle
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      })
    // io.emit('set_sid', sessionId);
    io.emit('redirect', '/mypage')
  });

  socket.on('userShouldBeLoggedInHere', props => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
      } else {
        // No user is signed in.
        io.emit('redirect', '/')
      }
    });
  })

  socket.on('getUserData', props => {
    firebase.auth().onAuthStateChanged(user => {
      // io.emit('setUserData', user);
      // console.log(user.displayName);
      // console.log(user.department);
      // console.log(user.photoURL);
      // console.log(user.email);
      // console.log(user.uid);
    })
  })
})

http.listen(app.get('port'), () => {
  console.log('listening on *:5000');
});