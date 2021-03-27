var express = require("express");
var axios = require("axios");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const app = express();
const cors = require("cors");
app.use(cors({ origin: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const blockServer = "http://34.87.52.243:3000";
const entityName = "Test";

app.get("/", (req, res) => {
  return res.send("Received a GET HTTP method");
});

async function getCrop(cropId) {
  return axios
    .get(`${blockServer}/api/${entityName}/${cropId}`)
    .then((resp) => {
      return resp.data;
    })
    .then((resp) => {
      console.log(resp);
      return [true, resp.data];
    })
    .catch((error) => {
      return [false, `{"code": ${error.response.status}}`];
    });
}

app.get("/get/:cropId", async (req, res) => {
  let [status, data] = await getCrop(req.params.cropId);
  console.log(status, data);
  data = JSON.parse(data);
  console.log(status, data);
  if (!status) res.status(data.code);
  return res.send({ success: status, data: data });
});

app.post("/create/:cropId", async (req, res) => {
  let data = {
    $class: "org.orange.organicchain.Test",
    cropId: req.params.cropId,
    data: JSON.stringify(req.body),
  };
  console.log(data);
  let [status, ret] = await axios
    .post(`${blockServer}/api/${entityName}`, data)
    .then((resp) => {
      return [true, resp.data];
    })
    .catch((error) => {
      console.log(error.response.data);
      return [false, `{"code": ${error.response.status}}`];
    });
  console.log(status, ret);

  return res.send({ success: status, data: ret });
});

app.post("/update/:cropId", async (req, res) => {
  let [gotStatus, gotData] = await getCrop(req.params.cropId);

  if (!gotStatus) {
    return res.send({ success: gotStatus, data: gotData });
  }

  let data = {
    $class: "org.orange.organicchain.Test",
    cropId: req.params.cropId,
    data: JSON.stringify(req.body),
  };
  console.log(data);
  let [status, ret] = await axios
    .post(`${blockServer}/api/${entityName}`, data)
    .then((resp) => {
      return [true, resp.data];
    })
    .catch((error) => {
      console.log(error.response.data);
      return [false, `{"code": ${error.response.status}}`];
    });
  console.log(status, ret);

  return res.send({ success: status, data: ret });
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));

app.post("/register", async (req, res) => {
  const uid = req.body.uid;
  const id = req.body.id;
  const name = req.body.name;
  const loc = req.body.loc;

  const cityRef = db.collection("users").doc(uid);
  const doc = await cityRef.get();

  const data = {
    name: name,
    id: id,
    loc: loc,
    reg: 1,
  };

  const res1 = await cityRef.update(data);
  const doc1 = await cityRef.get();
  return res.send({ uid: uid, data: doc.data() });
});

app.post("/login", async (req, res) => {
  const uid = req.body.uid;
  const type = req.body.type;

  const cityRef = db.collection("users").doc(uid);
  const doc = await cityRef.get();
  if (!doc.exists) {
    console.log("No such document!");
    const data = {
      type: type,
      reg: 0,
    };
    const res1 = await db.collection("users").doc(uid).set(data);
    const doc = await cityRef.get();

    return res.send({ uid: uid, data: doc.data() });
  } else {
    console.log("Document data:", doc.data());
    return res.send({ uid: uid, data: doc.data() });
  }
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
