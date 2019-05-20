const User = require('../models/user');

exports.getAuth = (req, res, next) => {
    console.log('getAuth_session..... ', req.session); // get session
    const loggedIn = req.session.isLoggedIn;

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: loggedIn
    });
};

exports.postAuth = (req, res, next) => {
    User.findById('5cd28dd8cf381111b99915c5')
    .then(user => {
        req.session.isLoggedIn = true;     // set a property in session
        req.session.user = user;
        req.session.save(err => {   // save the above set session before redirect just as guarantee the session is set before redirecting
            console.log(err);
            res.redirect('/');
        });
    })
    .catch(err => {console.log(err)});
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false
    });
};

exports.postSignup = (req, res, next) => {};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}