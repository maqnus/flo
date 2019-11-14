import "core-js/stable";
import "regenerator-runtime/runtime";

import express from "express";

import { urlencoded, json } from 'body-parser';
import { uploader, cloudinaryConfig } from './config/cloudinaryConfig';
import { multerUploads, dataUri } from './middlewares/multerUpload';

import firebase from 'firebase';
import * as admin from "firebase-admin";
import serviceAccount from "./config/grim-8aebe-firebase-adminsdk-pc08t-d4d16e4f38.json";
import firebaseConfig from "./config/firebaseConfig.json";

import * as utils from "./utils.js"

const app = express();
const http = require("http").createServer(app);
// const io = require("socket.io")(http);

firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://grim-8aebe.firebaseio.com"
});

app.set("port", process.env.PORT || 5000);
app.set("view engine", "pug");
app.use(express.static("src/public"));
app.use(json()); // to support JSON-encoded bodies
app.use('*', cloudinaryConfig);
app.use(urlencoded({ extended: false }));

app.get("/register", (req, res) => {
  res.render(__dirname + "/views/register", {
    pageTitle: "Register"
  });
});

app.post("/register", (req, res) => {
  firebase.auth()
    .createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then(() => res.redirect("/setup"))
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
});

app.get("/setup", async (req, res) => {
  const userData = firebase.auth().currentUser;
  if (!userData || !userData.uid) {
    res.redirect("/");
  }

  const departments = await utils.getDepartments(admin.database());

  res.render(__dirname + "/views/setup", {
    pageTitle: "Account setup",
    model: {
      departments
    }
  });
});

app.get("/upload", async (req, res) => {
  res.render(__dirname + "/views/upload", {
    pageTitle: "Upload",
    model: {}
  });
});

app.post('/upload', multerUploads('fileToUpload'), (req, res) => {
  if(req.file) {
    console.log(req.body.message);
    const file = dataUri(req).content;
    uploader.upload(file).then((result) => {
      const image = result.url;
      console.log({
        messge: 'Your image has been uploded successfully to cloudinary',
        data: {
          image
        }
    });
    // cosole.log('file', file);
    }).catch((err) => res.status(400).json({
      messge: 'someting went wrong while processing your request',
      data: {
        err
      }
    }))
  }
 });


app.post("/setup", multerUploads('userimage'), async (req, res) => {
  const userData = firebase.auth().currentUser;
  if (!userData || !userData.uid) {
    res.redirect("/");
  }
  const profileSlug = utils.slugify(req.body.username);

  const file = dataUri(req).content;
  let image = await utils.uploadSingleImageToCloudinary(file);

  await admin.database()
    .ref("users/" + userData.uid)
    .set({
      username: req.body.username,
      department: {
        title: req.body.department,
        slug: utils.slugify(req.body.department)
      },
      jobtitle: req.body.jobtitle,
      image,
      slug: profileSlug
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });

  await admin.database()
    .ref("departments/" + req.body.department + "/employees/" + userData.uid)
    .set({
      username: req.body.username,
      image,
      jobtitle: req.body.jobtitle,
      slug: profileSlug
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });

  const updates = {};
  updates["slug-to-user-id-map/" + profileSlug] = userData.uid;

  await admin.database()
    .ref()
    .update(updates)
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
  res.redirect("/mypage");
});

app.get("/reset-password", (req, res) => {
  res.render(__dirname + "/views/reset-password", {
    pageTitle: "Reset password",
    heading: "Forgot your password?"
  });
});

app.post("/reset-password", (req, res) => {
  console.log("reset password for email: ", req.body.email);
});

app.post("/logout", (req, res) => {
  firebase.auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      res.redirect("/");
    })
    .catch(function (error) {
      // An error happened.
    });
});

app.get("/", async (req, res) => {
  const userData = firebase.auth().currentUser;
  if (userData) {
    res.redirect("/mypage");
  }

  res.render(__dirname + "/views/login", {
    layoutType: "login",
    pageTitle: "Login"
  });
});

app.post("/login", (req, res) => {
  firebase.auth()
    .signInWithEmailAndPassword(req.body.email, req.body.password)
    .then(() => {
      res.redirect("/mypage");
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
      res.redirect(`/?error=${errorCode}`);
    });
});

app.get("/mypage", async (req, res) => {
  const userData = firebase.auth().currentUser;
  if (!userData || !userData.uid) {
    res.redirect("/");
  }
  const uid = userData && userData.uid;
  const departments = await utils.getDepartments(admin.database());
  const user = await utils.getUserData(admin.database(), uid);
  const messageRequests = await utils.getMessageRequests(admin.database(), uid);

  let requests = [];
  for (let request in messageRequests) {
    const {
      from,
      message,
      project
    } = messageRequests[request];
    const fromUser = await utils.getUserData(admin.database(), from);
    requests.push({
      rid: request,
      username: fromUser.username,
      message,
      project: await utils.getProjectData(admin.database(), project)
    });
  }

  res.render(__dirname + "/views/mypage", {
    pageTitle: user && user.username,
    heading: user && user.username,
    model: {
      user: {
        ...user,
        alt: user && user.username
      },
      requests,
      departments
    }
  });
});

app.get("/department/:department", async (req, res) => {
  const userData = firebase.auth().currentUser;
  if (!userData || !userData.uid) {
    res.redirect("/");
  }

  const uid = userData.uid;
  const departments = await utils.getDepartments(admin.database());
  const currentPage = await utils.getSpesificDepartment(admin.database(), req.params.department);
  const user = await utils.getUserData(admin.database(), uid);

  if (uid) {
    res.render(__dirname + "/views/department", {
      pageTitle: currentPage.title,
      heading: currentPage.title,
      model: {
        user,
        currentPage,
        departments
      }
    });
  } else {
    res.redirect("/");
  }
});

app.get("/employee/:user", async (req, res) => {
  const userData = firebase.auth().currentUser;
  if (!userData || !userData.uid) {
    res.redirect("/");
  }

  const departments = await utils.getDepartments(admin.database());
  const uid = await utils.getUidFromSlug(admin.database(), req.params.user);
  const user = await utils.getUserData(admin.database(), uid);

  res.render(__dirname + "/views/profile", {
    pageTitle: user && user.username,
    heading: user && user.username,
    model: {
      user,
      departments
    }
  });
});

app.get("/request/:requestId", async (req, res) => {
  const userData = firebase.auth().currentUser;
  if (!userData || !userData.uid) {
    res.redirect("/");
  }

  const uid = userData.uid;
  const departments = await utils.getDepartments(admin.database());

  if (uid) {
    res.render(__dirname + "/views/request", {
      pageTitle: "Request",
      heading: "Request",
      model: {
        departments
      }
    });
  } else {
    res.redirect("/");
  }
});

app.get("/create-request/:slug", async (req, res) => {
  const userData = auth().currentUser;
  if (!userData || !userData.uid) {
    res.redirect("/");
  }

  // const requestUid = await getUidFromSlug(admin.database(), req.params.slug);
  const projects = await utils.getProjects(admin.database());

  res.render(__dirname + "/views/create-request", {
    pageTitle: "Create request",
    heading: "Create request",
    model: {
      toSlug: req.params.slug,
      projects
    }
  });
});

app.post("/start-timer", async (req, res) => {
  const userData = auth().currentUser;
  if (!userData || !userData.uid) {
    res.redirect("/");
  }

  const user = await utils.getUserData(admin.database(), userData.uid);

  const {
    time
  } = req.body;

  const updates = {};
  updates["users/" + userData.uid] = {
    ...user,
    lastFocusStart: time
  };

  await admin.database()
    .ref()
    .update(updates)
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });

  res.redirect("/mypage");
});

app.post("/create-request", async (req, res) => {
  const userData = firebase.auth().currentUser;
  if (!userData || !userData.uid) {
    res.redirect("/");
  }

  const uid = userData.uid;
  const {
    project,
    message,
    to
  } = req.body;
  const toUid = await utils.getUidFromSlug(admin.database(), to);

  const postData = {
    from: uid,
    project,
    message
  };

  // Get a key for a new Post.
  const newPostKey = admin.database()
    .ref()
    .child("requests")
    .push().key;

  const updates = {};
  // updates["/requests/" + newPostKey] = postData;
  updates["/user-request/" + toUid + "/" + newPostKey] = postData;

  await admin.database()
    .ref()
    .update(updates)
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    })
    .then(() => {
      res.redirect("/mypage");
    });
});

app.get("/chat", async (req, res) => {
  const userData = firebase.auth().currentUser;
  if (!userData) {
    res.redirect("/");
  }
  const uid = userData.uid;
  const user = await utils.getUserData(admin.database(), uid);
  const departments = await utils.getDepartments(admin.database());

  res.render(__dirname + "/views/chat", {
    pageTitle: "Chat",
    heading: "Chat",
    model: {
      user,
      departments
    }
  });
});

app.get("*", async (req, res) => {
  const userData = firebase.auth().currentUser;
  if (!userData) {
    res.redirect("/");
  }

  res.render(__dirname + "/views/404", {
    pageTitle: "404 Page not found",
    model: {}
  });
});

// io.on('connection', socket => {
//   console.log('a user connected');

//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });

//   socket.on('chat message', props => {
//     firebase.auth().onAuthStateChanged(user => {
//       if (user) {
//         // User is signed in.
//         io.emit('chat message', props);
//         console.log('message: ' + props);
//       } else {
//         // No user is signed in.
//         io.emit('redirect', '/');
//       }
//     });

//   });

// });

http.listen(app.get("port"), () => {
  console.log("listening on *:5000");
});