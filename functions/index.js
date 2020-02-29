const functions = require('firebase-functions');
const app = require('express')();
const { getAllScreams, postOneScream } = require('./handlers/screams');
const { signUp, login } = require('./handlers/users');
const { FBAuth } = require('./utils/FBAuth');

// scream routes
app.get("/screams", getAllScreams);

app.post("/screams", FBAuth, postOneScream);

// users routes
app.post("/signup", signUp);

app.post("/login", login);

// https
exports.api = functions.https.onRequest(app);
