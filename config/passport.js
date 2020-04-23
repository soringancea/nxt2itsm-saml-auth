const samlStrategy = require('passport-saml').Strategy;
const metadata = require('passport-saml-metadata');

let strategy;

getProfile = (profile, done) => {
    profile = metadata.claimsToCamelCase(profile, reader.claimSchema);
    return done(null, profile);
}

createStrategy = () => {
    metadata.fetch(config.passport.saml.metadata)
        .then((reader) => {

            const strategyConfig = metadata.toPassportConfig(reader);
            strategyConfig.issuer = config.passport.saml.issuer;
            strategyConfig.callbackUrl = config.passport.saml.callbackUrl;
            strategyConfig.identifierFormat = null;
            strategyConfig.acceptedClockSkewMs = -1;

            strategy = new samlStrategy(strategyConfig, getProfile)
        })
        .catch((err) => {
            console.error('Error loading SAML metadata', err);
            process.exit(1);
        });
}

initialize = (passport) => {

    if (!strategy) {
        createStrategy();
    };

    passport.use(strategy);

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};

module.exports = initialize;