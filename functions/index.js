const functions = require("firebase-functions");
const app = require("express")();
const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream
} = require("./handlers/screams");
const {
  signUp,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/users");
const { FBAuth } = require("./utils/FBAuth");

// scream routes
app.get("/screams", getAllScreams);
app.post("/screams", FBAuth, postOneScream);
app.get("/screams/:screamId", getScream);

// TODO: delete scream
// TODO: like a scream
// TODO: unlike a scream
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);

// users routes
app.post("/signup", signUp);

app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

// https
exports.api = functions.https.onRequest(app);
