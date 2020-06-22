const samlStrategy = require('passport-saml').Strategy;
const metadata = require('passport-saml-metadata');
const { text } = require('body-parser');

initialize = (passport, config) => {
    metadata.fetch(config.passport.saml.metadata)
        .then((reader) => {

            const strategyConfig = metadata.toPassportConfig(reader);
            strategyConfig.issuer = config.passport.saml.issuer;
            strategyConfig.callbackUrl = config.passport.saml.callbackUrl;
            strategyConfig.identifierFormat = null;
            strategyConfig.acceptedClockSkewMs = -1;

            passport.use('saml', new samlStrategy(strategyConfig, validateAccess));

            passport.serializeUser((user, done) => {
                done(null, user);
            });

            passport.deserializeUser((user, done) => {
                done(null, user);
            });

        })
        .catch((err) => {
            console.error('Error loading SAML metadata', err);
            process.exit(1);
        });
};

validateAccess = (profile, done) => {
    console.log('----Profile details:', profile);
    var property = process.env.IDP_PROPERTY;
    var values = convertToArray(process.env.IDP_VALUE);
    var valueFound = false;
    if (profile[property]) {
        if (Array.isArray(profile[property])) {
            valueFound = profile[property].some(elem => values.includes(elem));
        } else {
            valueFound = values.includes(profile[property]);
        };
    };
    if (valueFound) {
        return done(null, profile);
    } else {
        return done(null, false, { message: 'User is not authorized.' });
    }
};

convertToArray = text => {
    var propArray = text.split(',');
    var converted = propArray.map(elem => elem.trim());
    return converted;
}

module.exports = initialize;