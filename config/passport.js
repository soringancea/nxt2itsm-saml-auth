const samlStrategy = require('passport-saml').Strategy;
const metadata = require('passport-saml-metadata');

let inUsePassport;

getProfile = (profile, done) => {
    profile = metadata.claimsToCamelCase(profile, reader.claimSchema);
    return done(null, profile);
}

initialize = (passport, config) => {
    metadata.fetch(config.passport.saml.metadata)
        .then((reader) => {

            const strategyConfig = metadata.toPassportConfig(reader);
            strategyConfig.issuer = config.passport.saml.issuer;
            strategyConfig.callbackUrl = config.passport.saml.callbackUrl;
            strategyConfig.identifierFormat = null;
            strategyConfig.acceptedClockSkewMs = -1;

            passport.use('saml', new samlStrategy(strategyConfig, getProfile));

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

module.exports = initialize;