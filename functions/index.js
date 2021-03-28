var express = require("express");
var axios = require("axios");
const { AwesomeQR } = require("awesome-qr");
const { v4: uuidv4 } = require("uuid");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp({
  storageBucket: "haxplore-orange.appspot.com",
});
const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket();
var logoFile = "";
bucket
  .file("logo.png")
  .download()
  .then((resp) => {
    logoFile = resp[0];
  });

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

const frontendServer = "https://haxplore-orange.web.app";
const blockServer = "http://34.87.52.243:3000";
const entityName = "OrganicData";

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
      return [
        false,
        JSON.stringify({
          code: error.response.status,
          message: error.response.data,
        }),
      ];
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
  const qrUrl = await makeQR(`${frontendServer}/data/${req.params.cropId}`);
  console.log(qrUrl);
  let newData = req.body;
  newData.qrUrl = qrUrl;

  let data = {
    $class: "org.orange.organicchain.Test",
    cropId: req.params.cropId,
    data: JSON.stringify(newData),
  };

  console.log(data);
  let [status, ret] = await axios
    .post(`${blockServer}/api/${entityName}`, data)
    .then((resp) => {
      let newData = resp.data;
      newData.data = JSON.parse(newData.data);
      return [true, newData];
    })
    .catch((error) => {
      console.log(error.response.data);
      return [
        false,
        { code: error.response.status, message: error.response.data },
      ];
    });
  console.log(status, ret);
  if (!status) res.status(ret.code);

  return res.send({ success: status, data: ret, qrUrl: qrUrl });
});

app.post("/update/:cropId", async (req, res) => {
  let [gotStatus, gotData] = await getCrop(req.params.cropId);
  gotData = JSON.parse(gotData);

  if (!gotStatus) {
    return res.send({ success: gotStatus, data: gotData });
  }

  let new_data = { ...gotData, ...req.body };
  console.log(new_data);

  let data = {
    $class: "org.orange.organicchain.Test",
    data: JSON.stringify(new_data),
  };
  console.log(data);
  let [status, ret] = await axios
    .put(`${blockServer}/api/${entityName}/${req.params.cropId}`, data)
    .then((resp) => {
      let newData = resp.data;
      newData.data = JSON.parse(newData.data);
      return [true, newData];
    })
    .catch((error) => {
      console.log(error.response.data);
      return [
        false,
        { code: error.response.status, message: error.response.data },
      ];
    });
  console.log(status, ret);
  if (!status) res.status(ret.code);

  return res.send({ success: status, data: ret });
});

// app.listen(3000, () => console.log("Example app listening on port 3000!"));

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

//Get Insititute Id(Producer, Seller)
app.get("/getInstituteDetails/:UID", async (req, res) => {
  const UID = req.params.UID;
  const cityRef = db.collection("users").doc(UID);
  const doc = await cityRef.get();
  if (!doc.exists) {
    console.log("No such document!");
  } else {
    console.log("Document data:", doc.data());
  }
  return res.send({
    id: doc.data().id,
    name: doc.data().name,
    loc: doc.data().loc,
  });
});

async function makeQR(text) {
  console.time("gen QR");
  const buffer = await new AwesomeQR({
    text: text,
    size: 400,
    components: {
      data: {
        scale: 1.0,
      },
    },
    logoImage: logoFile,
    logoScale: 0.2,
  }).draw();
  console.timeEnd("gen QR");

  console.time("get file");
  const newFileName = uuidv4();
  const newFile = bucket.file(`QR/${newFileName}`);
  console.timeEnd("get file");
  console.time("Upload file");
  await newFile.save(buffer, {
    metadata: {
      contentType: "image/png",
      contentDisposition: "attachment",
    },
    resumable: false,
    public: true,
  });
  console.timeEnd("Upload file");
  const newFileURL = bucket.file(`QR/${newFileName}`).publicUrl();

  return newFileURL;
}

app.post("/genQR", async (req, res) => {
  newFileURL = await makeQR(req.body.text);
  res.send({ url: newFileURL });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
//
//

exports.api = functions.https.onRequest(app);
