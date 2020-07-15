const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express()

app.use(bodyParser.json())

app.post('/events', async (req, res) => {
  const event = req.body;

  await axios.post('http://posts-clusterip-srv:4000/events', event);
  await axios.post('http://comments-clusterip-srv:5000/events', event);
  await axios.post('http://query-clusterip-srv:4001/events', event);
  res.send({ status: 'OK' })

});

app.listen(4002, () => {
  console.log('event bus listening on port 4002');
});