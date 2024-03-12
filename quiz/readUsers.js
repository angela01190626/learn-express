const express = require('express')
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  })

// get all usernames
router.get('/usernames', (req, res) => {
let usernames = req.users.map(function(user) {
    return {id: user.id, username: user.username};
    });
    res.send(usernames);
})

router.get('/username/:name', (req, res) => {
  const name = req.params.name;
  const users = req.users.filter(person => person.username === name);

  if (users.length === 0) {
    console.log('User not found');
    return res.status(404).send(`User ${name} not found`);
  }
  res.send(users);
})

module.exports = router;