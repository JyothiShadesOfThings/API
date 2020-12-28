const express = require('express');
const routeV1 = require('./route');

const router = express.Router();

router.use(routeV1);

module.exports = router;