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
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
    .then(user => {
        console.log('postAuth_user..... ', user);

        if(!user || password !== user.password) {
            return res.redirect('/login');
        }

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

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email: email})
    .then(userDoc => {
        if (userDoc) {
            return res.redirect('/signup');
        }

        const user = new User({
            email: email,
            password: password,
            cart: { items: [] }
        });

        return user.save();
    })
    .then(result => {
        console.log('postSignup_result..... ', result);

        if(result) {
            res.redirect('/login');
        }
    })
    .catch(err => {console.log(err)});
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}