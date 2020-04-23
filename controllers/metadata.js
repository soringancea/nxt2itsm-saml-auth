const path = require('path');
const SAML = require('passport-saml').SAML;
const utils = require('../utils/utils');
const config = require(path.join(utils.rootDir, 'config', 'config'));

exports.getMeta = (req, res) => {
    const saml = new SAML({
        issuer: config.passport.saml.issuer,
        callbackUrl: config.passport.saml.callbackUrl,
        logoutCallbackUrl: config.passport.saml.logoutCallbackUrl || ''
    });
    const xml = saml.generateServiceProviderMetadata();
    res.set('Content-Type', 'application/samlmetadata+xml').send(xml);
};