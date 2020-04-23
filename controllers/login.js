exports.getLogin = (req, res) => {
    passport.authenticate('saml', {
        failureRedirect: '/login',
    });
};

exports.postLogin = (req, res) => {
    passport.authenticate('saml', {
        failureRedirect: '/login',
    });
};

exports.redirectHome = (req, res) => {
    res.redirect('/');
}