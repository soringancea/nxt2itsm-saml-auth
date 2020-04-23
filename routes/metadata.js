const express = require('express');

const router = express.Router();

const metadataController = require('../controllers/metadata.js');

console.log('Registering metadata route...');

router.get('/FederationMetadata/2007-06/FederationMetadata.xml', metadataController.getMeta);

module.exports = router;