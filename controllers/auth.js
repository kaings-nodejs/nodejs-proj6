const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getAuth = (req, res, next) => {
    console.log('getAuth_session..... ', req.session); // get session

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errMessage: req.flash('error')
    });
};

exports.postAuth = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let currentUser;

    User.findOne({email: email})
    .then(user => {
        console.log('postAuth_user..... ', user);
        currentUser = user;

        if(!user) {
            req.flash('error', 'Invalid Email or Password!');
            return res.redirect('/login');
        }

        return bcrypt.compare(password, user.password); // compare the input password & hashed password in DB (one way encryption)
    })
    .then(passwordMatch => {
        console.log('postAuth_passwordMatch..... ', passwordMatch);

        if(passwordMatch) {    // bcrypt.compare will return Promise of true or false. True if password match and False if not match
            req.session.isLoggedIn = true;     // set a property in session
            req.session.user = currentUser;
            req.session.save(err => {   // save the above set session before redirect just as guarantee the session is set before redirecting
                console.log(err);
                res.redirect('/');
            });
        } else {
            res.redirect('/login');
        }
    })
    .catch(err => {console.log(err)});
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errMessage: req.flash('error')
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email: email})
    .then(userDoc => {
        console.log('postSignup_userDoc..... ', userDoc);

        if (userDoc) {
            req.flash('error', 'Email Exist! Please Use Other Email!')
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12);   // the higher the salt, the more secure https://github.com/dcodeIO/bcrypt.js
    })
    .then(hashedPassword => {
        console.log('postSignup_hashedPassword..... ', hashedPassword);

        if(hashedPassword) {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
    
            return user.save();
        }
        return null;
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