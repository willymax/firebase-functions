const functions = require("firebase-functions");
const app = require("express")();
const { db } = require("./utils/admin");

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
} = require("./handlers/screams");
const {
  signUp,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNoticationsRead
} = require("./handlers/users");
const { FBAuth } = require("./utils/FBAuth");

// scream routes
app.get("/screams", getAllScreams);
app.post("/screams", FBAuth, postOneScream);
app.get("/screams/:screamId", getScream);
app.delete("/scream/:screamId", FBAuth, deleteScream);
app.get("/scream/:screamId/like", FBAuth, likeScream);
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);

// users routes
app.post("/signup", signUp);

app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.get("/notifications", FBAuth, markNoticationsRead);

// https
exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate(async (snapshot) => {
    try {
      const scream = await db.doc(`/screams/${snapshot.data().screamId}`).get();
      if (
        scream.exists &&
        scream.data().userHandle !== snapshot.data().userHandle
      ) {
        return await db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: scream.data().userHandle,
          sender: snapshot.data().userHandle,
          type: "like",
          read: false,
          screamId: scream.id
        });
      } 
    } catch (error) {
      console.error(error)
    }
  });
exports.deleteNotificationOnUnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err);
        return;
      });
  });
exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(async (snapshot) => {
    try {
      const scream = await db.doc(`/screams/${snapshot.data().screamId}`).get();
      if (
        scream.exists &&
        scream.data().userHandle !== snapshot.data().userHandle
      ) {
        return await db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: scream.data().userHandle,
          sender: snapshot.data().userHandle,
          type: "comment",
          read: false,
          screamId: scream.id
        });
      } 
    } catch (error) {
      console.error(error)
    }
  });
