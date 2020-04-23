exports.getLogin = (passport) => {
    return (req, res) => {
        passport.authenticate('saml', {
            failureRedirect: '/login',
            failureFlash: true
        });
    };
}

exports.postLogin = (passport) => {
    return (req, res) => {
        passport.authenticate('saml', {
            failureRedirect: '/login',
            failureFlash: true
        });
    };
};

exports.redirectHome = (req, res) => {
    res.redirect('/');
}