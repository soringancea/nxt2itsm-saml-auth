const os = require('os');
const fileCache = require('file-system-cache').default;
const axios = require('axios');
const https = require('https');
const path = require('path');
const fs = require('fs');
const tunnel = require('tunnel');
const utils = require('../utils/utils');

let propData = fs.readFileSync(path.join(utils.rootDir, 'properties.json'));

// application variables
exports.app = {
    port: process.env.PORT || 443,
    name: 'NXT2ITSM',
    scoreRefresh: process.env.SCORE_REFRESH || 60,
    deviceRefresh: process.env.DEVICE_REFRESH || 60,
    finder: process.env.FINDER || true
};

// ssl configuration. File to be placed in the ssl/ folder
exports.ssl = {
    certName: process.env.CERT_NAME,
    certContent: fs.readFileSync(path.join(utils.rootDir, 'ssl', process.env.CERT_NAME)),
    keyName: process.env.KEY_NAME,
    keyContent: fs.readFileSync(path.join(utils.rootDir, 'ssl', process.env.KEY_NAME)),
    caBundleName: process.env.CA_BUNDLE || '',
    caContent: fs.readFileSync(path.join(utils.rootDir, 'ssl', process.env.CA_BUNDLE)) || ''
};

// Information for Portal API query and NXQL queries
exports.api = {
    portal: process.env.PORTAL,
    nxqlPort: process.env.NXQL_PORT || '1671',
    username: process.env.USER_NAME,
    password: process.env.PASSWORD
};

// Properties that will appear in the properties tab
// format is nxql_field: ['Display name', 'nxql_type']
exports.properties = JSON.parse(propData);

// Check if proxy needed for SAML assertion requests or not
if (process.env.PROXY == 'true' || process.env.PROXY == 'True' || process.env.PROXY == 'TRUE') {
    console.log('Proxy for SAML:', process.env.PROXY);
    var agent = tunnel.httpsOverHttp({
        proxy: {
            host: process.env.PROXY_HOST,
            port: process.env.PROXY_PORT
        },
        ca: this.ssl.caContent,
        key: this.ssl.keyContent,
        cert: this.ssl.certContent
    });
} else {
    var agent = new https.Agent({ ca: this.ssl.caContent });
}

var axiosAgent = axios.create({ httpsAgent: agent });

//Strategy configuration for authentication
exports.passport = {
    protocol: 'saml2',
    entryPoint: process.env.IDP_ENTRYPOINT,
    saml: {
        path: '/login/callback',
        // issuer string to supply to identity provider
        issuer: process.env.ISSUER || 'urn:nodejs:nxt2itsm-app',
        // This is the callback url used by the IDP (https://hostname/login/callback)
        callbackUrl: 'https://'.concat(process.env.HOSTNAME, '/login/callback'),
        metadata: {
            client: axiosAgent,
            // IDP Metadata url
            url: 'https://'.concat(process.env.IDP_HOSTNAME, process.env.META_URL),
            timeout: 1500,
            backupStore: fileCache({
                basePath: os.tmpdir(),
                ns: process.env.ISSUER || 'urn:nodejs:nxt2itsm-app'
            })
        }
    }
}