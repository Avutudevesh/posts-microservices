const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const comments = {}

app.get('/posts/:id/comments', (req, res) => {
  res.send(comments[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const commentsForId = comments[req.params.id] || [];
  commentsForId.push({ id: commentId, content });
  comments[req.params.id] = commentsForId;
  await axios.post('http://event-bus-srv:4002/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id
    }
  })
  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  console.log('event received', req.body.type);
  res.send({});
})

app.listen('5000', () => {
  console.log('comments service listening on 5000');
})