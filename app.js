
console.log('Starting app...');

//------------------- Env variables --------------------
require('dotenv').config();
if (process.env.CA_BUNDLE) {
    process.env['NODE_EXTRA_CA_CERTS'] = './ssl/'.concat(process.env.CA_BUNDLE);
} else {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}

//------------------- Imports --------------------
const express = require('express');
const path = require('path');
const https = require('https');
const helmet = require('helmet');
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');

const config = require('./config/config.js');
const deviceRoutes = require('./routes/device.js');
const loginRoutes = require('./routes/login.js');
const metadataRoute = require('./routes/metadata.js');
const initPassport = require('./config/passport');

//------------------- Express APP -----------------
const app = express();

// Define templating Engine and where to find views
app.set('view engine', 'pug');
app.set('views', 'views');

// Create static route to 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));

app.use(cookieParser());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"]
    }
}));

initPassport(passport);

app.use(passport.initialize());
app.use(passport.session());

var httpsOptions;
if (process.env.CA_BUNDLE) {
    httpsOptions = {
        cert: config.ssl.certContent,
        ca: config.ssl.caContent,
        key: config.ssl.keyContent
    };
} else {
    httpsOptions = {
        cert: config.ssl.certContent,
        key: config.ssl.keyContent
    };
};

const httpsServer = https.createServer(httpsOptions, app);

ensureAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
    }
    next();
}

//Handling routes
app.use(metadataRoute);
app.use(loginRoutes(passport));
app.use(ensureAuthenticated, deviceRoutes);

try {
    console.log("Listening on port:", config.app.port);
    httpsServer.listen(config.app.port);
} catch (err) {
    console.error("Can't listen on port:", config.app.port, 'Error:', err.message);
};