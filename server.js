const express = require("express");
const app = express();
const http = require("http").createServer(app);
const bodyParser = require("body-parser");
const io = require("socket.io")(http);
const firebase = require("firebase");
const admin = require("firebase-admin");
let serviceAccount = require("./config/grim-8aebe-firebase-adminsdk-pc08t-d4d16e4f38.json");
const firebaseConfig = require("./config/firebaseConfig.json");

const slugify = string => {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://grim-8aebe.firebaseio.com"
});

const getDepartments = async () =>
  await admin
  .database()
  .ref("departments/")
  .once("value")
  .then(snapshot => snapshot.val())
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

const getSpesificDepartment = async department =>
  await admin
  .database()
  .ref("departments/" + department)
  .once("value")
  .then(snapshot => snapshot.val())
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

const getUidFromSlug = async slug =>
  await admin
  .database()
  .ref("slug-to-user-id-map/" + slug)
  .once("value")
  .then(snapshot => snapshot.val())
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

const getUserData = async uid =>
  await admin
  .database()
  .ref("users/" + uid)
  .once("value")
  .then(snapshot => snapshot.val())
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

const getMessageRequests = async uid => {
  return await admin
    .database()
    .ref("user-request/" + uid)
    .once("value")
    .then(snapshot => snapshot.val())
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
};

const getProjectData = async pid =>
  await admin
  .database()
  .ref("projects/" + pid)
  .once("value")
  .then(snapshot => snapshot.val())
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

const getProjects = async pid =>
  await admin
  .database()
  .ref("projects/")
  .once("value")
  .then(snapshot => snapshot.val())
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

app.set("port", process.env.PORT || 5000);
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.get("/register", (req, res) => {
  res.render(__dirname + "/src/views/register", {
    pageTitle: "Register"
  });
});

app.post("/register", (req, res) => {
  firebase
    .auth()
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

  const departments = await getDepartments();

  res.render(__dirname + "/src/views/setup", {
    pageTitle: "Account setup",
    model: {
      departments
    }
  });
});

app.post("/setup", async (req, res) => {
  const userData = firebase.auth().currentUser;
  if (!userData || !userData.uid) {
    res.redirect("/");
  }
  const profileSlug = slugify(req.body.username);

  await admin
    .database()
    .ref("users/" + userData.uid)
    .set({
      username: req.body.username,
      department: {
        title: req.body.department,
        slug: slugify(req.body.department)
      },
      jobtitle: req.body.jobtitle,
      image: req.body.imageurl,
      slug: profileSlug
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });

  await admin
    .database()
    .ref("departments/" + req.body.department + "/employees/" + userData.uid)
    .set({
      username: req.body.username,
      image: req.body.imageurl,
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

  await admin
    .database()
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
  res.render(__dirname + "/src/views/reset-password", {
    pageTitle: "Reset password",
    heading: "Forgot your password?"
  });
});

app.post("/reset-password", (req, res) => {
  console.log("reset password for email: ", req.body.email);
});

app.post("/logout", (req, res) => {
  firebase
    .auth()
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

  res.render(__dirname + "/src/views/login", {
    layoutType: "login",
    pageTitle: "Login"
  });
});

app.post("/login", (req, res) => {
  firebase
    .auth()
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
  const departments = await getDepartments();
  const user = await getUserData(uid);
  const messageRequests = await getMessageRequests(uid);

  let requests = [];
  for (let request in messageRequests) {
    const {
      from,
      message,
      project
    } = messageRequests[request];
    const fromUser = await getUserData(from);
    requests.push({
      rid: request,
      username: fromUser.username,
      message,
      project: await getProjectData(project)
    });
  }

  res.render(__dirname + "/src/views/mypage", {
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
  const departments = await getDepartments();
  const currentPage = await getSpesificDepartment(req.params.department);
  const user = await getUserData(uid);

  if (uid) {
    res.render(__dirname + "/src/views/department", {
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

  const departments = await getDepartments();
  const uid = await getUidFromSlug(req.params.user);
  const user = await getUserData(uid);

  res.render(__dirname + "/src/views/profile", {
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
  const departments = await getDepartments();

  if (uid) {
    res.render(__dirname + "/src/views/request", {
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
  const userData = firebase.auth().currentUser;
  if (!userData || !userData.uid) {
    res.redirect("/");
  }

  // const requestUid = await getUidFromSlug(req.params.slug);
  const projects = await getProjects();

  res.render(__dirname + "/src/views/create-request", {
    pageTitle: "Create request",
    heading: "Create request",
    model: {
      toSlug: req.params.slug,
      projects
    }
  });
});

app.post("/start-timer", async (req, res) => {
  const userData = firebase.auth().currentUser;
  if (!userData || !userData.uid) {
    res.redirect("/");
  }
  const {
    triggerTime
  } = req.body;
  console.log('triggerTime: ', triggerTime);
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
  const toUid = await getUidFromSlug(to);

  const postData = {
    from: uid,
    project,
    message
  };

  // Get a key for a new Post.
  const newPostKey = admin
    .database()
    .ref()
    .child("requests")
    .push().key;

  const updates = {};
  // updates["/requests/" + newPostKey] = postData;
  updates["/user-request/" + toUid + "/" + newPostKey] = postData;

  await admin
    .database()
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
  const user = await getUserData(uid);
  const departments = await getDepartments();

  res.render(__dirname + "/src/views/chat", {
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

  res.render(__dirname + "/src/views/404", {
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