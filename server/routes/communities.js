const express = require('express');
const { getCommunities } = require('../controllers/communityController.js');
const router = express.Router();

router.get('/', getCommunities);

module.exports = router;