const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const posts = {};
app.use(bodyParser.json());
app.use(cors());
app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;
    const post = posts[postId];
    post.comments.push({ id, content });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('query service running on 4001');
});