const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
var cors = require('cors');
const { log } = require('console');
const port = 8000;

let users;
fs.readFile(path.resolve(__dirname, '../data/users.json'), function(err, data) {
  console.log('reading file ... ');
  if(err) throw err;
  users = JSON.parse(data);
})

const addMsgToRequest = function (req, res, next) {
  if(users) {
    req.users = users;
    next();
  }
  else {
    return res.json({
        error: {message: 'users not found', status: 404}
    });
  }
  
}

app.use(
  cors({origin: 'http://localhost:3000'})
);
app.use('/read/usernames', addMsgToRequest);
app.get('/read/usernames', (req, res) => {
  let usernames = req.users.map(function(user) {
    return {id: user.id, username: user.username};
  });
  res.send(usernames);
});

// Below 2 lines of code are for POST and PUT requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/write/adduser', addMsgToRequest);
app.post('/write/adduser', (req, res) => {
  let newuser = req.body;
  req.users.push(newuser);
  fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), (err) => {
    if (err) console.log('Failed to write');
    else console.log('User Saved');
  });
  res.send('done');
})


app.use('/read/username', addMsgToRequest);
app.get('/read/username/:name', (req, res) => {
  const name = req.params.name;
  const users = req.users.filter(person => person.username === name);

  if (users.length === 0) {
    console.log('User not found');
    return res.status(404).send(`${name} not found`);
  }
  res.send(users);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
