
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
const firebase = require("firebase");
const admin = require('firebase-admin');
let serviceAccount = require('./config/grim-8aebe-firebase-adminsdk-pc08t-d4d16e4f38.json');
const firebaseConfig = require('./config/firebaseConfig.json');

const slugify = (string) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
};

const isUnique = (string) => {
  
};

firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://grim-8aebe.firebaseio.com"
});

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/register', (req, res) => {
  res.render(__dirname + '/src/views/register', {
    pageTitle: 'Register'
  });
});

app.post('/register', (req, res) => {
  firebase.auth()
    .createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then(() => res.redirect('/setup'))
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
});

app.get('/setup', async (req, res) => {
  const user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
    let departmentsData;
    await admin
      .database()
      .ref('departments/')
      .once('value')
      .then(snapshot => {
        departmentsData = snapshot.val();
        console.log('departmentsData: ', departmentsData);
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
        res.redirect('/mypage');
      });
    res.render(__dirname + '/src/views/setup', {
      pageTitle: 'Account setup',
      model: {
        departments: departmentsData
      }
    });
  } else {
    // No user is signed in.
    res.redirect('/');
  }
});

app.post('/setup', async (req, res) => {
  const user = firebase.auth().currentUser;
  const slug = slugify(req.body.username);
  console.log(req.body);

  await admin
    .database()
    .ref('users/' + user.uid)
    .set({
      username: req.body.username,
      department: req.body.department,
      jobtitle: req.body.jobtitle,
      image: req.body.imageurl,
      slug
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    })

  await admin
    .database()
    .ref('departments/' + req.body.department + '/employees/' + user.uid) 
    .set({
      username: req.body.username,
      image: req.body.imageurl,
      jobtitle: req.body.jobtitle,
      slug
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    })

  await admin
    .database()
    .ref('slug-to-user-id-map/' + slug) 
    .set({
      uid: user.uid
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    })
  res.redirect('/mypage');
});

app.get('/reset-password', (req, res) => {
  res.render(__dirname + '/src/views/reset-password', {
    pageTitle: 'Reset password',
    heading: 'Forgot your password?'
  });
});

app.post('/reset-password', (req, res) => {
  console.log('reset password for email: ', req.body.email);
});

app.post('/logout', (req, res) => {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    res.redirect('/');
  }).catch(function (error) {
    // An error happened.
  });
});

app.get('/', async (req, res) => {
  const user = firebase.auth().currentUser;
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

app.post('/login', (req, res) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(req.body.email, req.body.password)
    .then(() => {
      res.redirect('/mypage');
    }).catch(error => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
});

app.get('/mypage', async (req, res) => {
  const user = firebase.auth().currentUser;

  let departments;
  await admin
    .database()
    .ref('departments/')
    .once('value')
    .then(snapshot => {
      departments = snapshot.val();
      console.log('departmentsData: ', departments);
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });

  let userData;
  if (user && user.uid) {
    await admin
      .database()
      .ref('users/' + user.uid)
      .once('value')
      .then(snapshot => {
        userData = snapshot.val();
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      })
  }

  if (user && user.uid) {
    res.render(__dirname + '/src/views/mypage', {
      pageTitle: userData.username,
      heading: userData.username,
      model: {
        userData: {
          ...userData,
          alt: userData.username
        },
        departments
      }
    });
  } else {
    res.redirect('/');
  }
});

app.get('/department/:department', async (req, res) => {
  const user = firebase.auth().currentUser;
  console.log('department: ', req.params.department);
  
  let currentDepartmentData;
  await admin
    .database()
    .ref('departments/' + req.params.department)
    .once('value')
    .then(snapshot => {
      currentDepartmentData = snapshot.val();
      console.log('currentDepartmentData: ', currentDepartmentData);
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });

  let departments;
  await admin
    .database()
    .ref('departments/')
    .once('value')
    .then(snapshot => {
      departments = snapshot.val();
      console.log('departmentsData: ', departments);
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });

  let userData;
  if (user && user.uid) {
    await admin
      .database()
      .ref('users/' + user.uid)
      .once('value')
      .then(snapshot => {
        userData = snapshot.val();
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      })
  }

  if (user && user.uid) {
    res.render(__dirname + '/src/views/department', {
      pageTitle: currentDepartmentData.title,
      heading: currentDepartmentData.title,
      model: {
        userData,
        id: req.params.department,
        currentPage: currentDepartmentData,
        departments
      }
    });
  } else {
    res.redirect('/');
  }

});

app.get('/department/:department/:profile', async (req, res) => {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    res.redirect('/');
  }

  let departments;
  await admin
    .database()
    .ref('departments/')
    .once('value')
    .then(snapshot => {
      departments = snapshot.val();
      console.log('departmentsData: ', departments);
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });

  let currentDepartmentData;
  await admin
    .database()
    .ref('departments/' + req.params.department)
    .once('value')
    .then(snapshot => {
      currentDepartmentData = snapshot.val();
      console.log('currentDepartmentData: ', currentDepartmentData);
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });

  let user;
  await admin
    .database()
    .ref('slug-to-user-id-map/' + req.params.profile)
    .once('value')
    .then(snapshot => {
      user = snapshot.val();
      console.log('userId: ', uid);
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
  
  let userData;
  if (user && user.uid) {
    await admin
      .database()
      .ref('departments/' + req.params.department +'/employees/' + user.uid)
      .once('value')
      .then(snapshot => {
        userData = snapshot.val();
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      })
  }

  res.render(__dirname + '/src/views/profile', {
    pageTitle: '[employee]',
    heading: '[employee]',
    model: {
      userData,
      departments,
      currentPage: currentDepartmentData
    }
  });
});

app.get('/chat', function (req, res) {
  res.render(__dirname + '/src/views/chat', {
    pageTitle: 'Chat'
  });
});

app.get('*', async (req, res) => {
  const user = await firebase.auth().currentUser;

  res.render(__dirname + '/src/views/404', {
    pageTitle: '404 Page not found',
    model: {
      user
    }
  });
});

io.on('connection', socket => {
  // console.log('a user connected');

  // socket.on('disconnect', () => {
  //   console.log('user disconnected');
  // });

  // socket.on('chat message', props => {
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (user) {
  //       // User is signed in.
  //       io.emit('chat message', props);
  //       console.log('message: ' + props);
  //     } else {
  //       // No user is signed in.
  //       io.emit('redirect', '/');
  //     }
  //   });

  // });

})

http.listen(app.get('port'), () => {
  console.log('listening on *:5000');
});