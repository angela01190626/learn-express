const express = require('express')
const fs = require('fs');
const path = require('path');
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  })
// define the home page route
router.post('/addUser', (req, res) => {
    let newuser = req.body;
    req.users.push(newuser);
    fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), (err) => {
      if (err) console.log('Failed to write');
      else console.log('User Saved');
    });
    res.send('done');
})

module.exports = router