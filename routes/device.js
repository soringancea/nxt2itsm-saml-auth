const express = require('express');

const router = express.Router();

const deviceController = require('../controllers/device.js');

console.log('Registering devices routes...');

ensureAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
    }
    next();
};

router.get('/', ensureAuthenticated, deviceController.getIndex);
router.get('/devicesList.json', ensureAuthenticated, deviceController.getDevicesList);
router.get('/device/:deviceId', ensureAuthenticated, deviceController.getDevice);
router.get('/score/:scoreId/:deviceId', ensureAuthenticated, deviceController.getScore);
router.get('/act/:deviceUid/:actUid', ensureAuthenticated, deviceController.getAct);

module.exports = router;