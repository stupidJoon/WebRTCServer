var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/caller', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Caller/index.html'))
});
router.get('/callee', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Callee/index.html'))
});

module.exports = router;
