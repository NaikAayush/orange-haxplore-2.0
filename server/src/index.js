import express from 'express';
import axios from 'axios';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const blockServer = 'http://34.87.52.243:3000'

app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});

app.get('/get/:cropId', async (req, res) => {
  let [status, data] = await axios.get(`${blockServer}/api/Test/${req.params.cropId}`)
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
  console.log(status, data);
  data = JSON.parse(data);
  console.log(status, data);
  if (!status) res.status(data.code);
  return res.send({"success": status, "data": data});
});

app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);
