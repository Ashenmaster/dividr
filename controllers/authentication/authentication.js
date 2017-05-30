require('./../../config/config');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');

// local imports
const User = require('./../../models/user');

function generateToken(user) {
    return jwt.sign(user, process.env.SESSION_SECRET, {
        expiresIn: 10080 // in seconds
    });
}

// Set user info from request
function setUserInfo(request) {
    return {
        _id      : request._id,
        firstName: request.profile.firstName,
        lastName : request.profile.lastName,
        email    : request.email,
    };
}

//========================================
// Login Route
//========================================
exports.login = (req, res) => {
    let userInfo = setUserInfo(req.user);
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
};

exports.logout = (req, res) => {
    req.logout();
    res.status(200).send('Logged Out');
};


//========================================
// Registration Route
//========================================
exports.register = (req, res, next) =>{
    // Check for registration errors
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;

    // Return error if no email provided
    if (!email) {
        return res.status(422).send({ error: 'You must enter an email address.'});
    }

    if(!validator.isEmail(email)) {
        return res.status(422).send({error: 'Please enter a valid e-mail address'})
    }

    // Return error if full name not provided
    if (!firstName || !lastName) {
        return res.status(422).send({ error: 'You must enter your full name.'});
    }

    // Return error if no password provided
    if (!password) {
        return res.status(422).send({ error: 'You must enter a password.' });
    }

    User.findOne({ email: email }, (err, existingUser) =>{
        if (err) { return next(err); }

        // If user is not unique, return error
        if (existingUser) {
            return res.status(422).send({ error: 'That email address is already in use.' });
        }

        // If email is unique and password was provided, create account
        let user = new User({
            email: email,
            password: password,
            profile: { firstName: firstName, lastName: lastName }
        });

        user.save(function(err, user) {
            if (err) { return next(err); }

            // Subscribe member to Mailchimp list
            // mailchimp.subscribeToNewsletter(user.email);

            // Respond with JWT if user was created

            let userInfo = setUserInfo(user);

            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            });
        });
    });
};