require('./../../config/config');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');
const async = require('async');
const nodemailer = require('nodemailer');

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

exports.forgot = (req, res) => {
    async.waterfall([
        (done) => {
            crypto.randomBytes(20, function(err, buf) {
                let token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) =>{
            User.findOne({ email: req.body.email }, (err, user) =>{
                if (!user) {

                    return res.status(404).json({error : 'No account with that email address exists.'});
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        (token, user, done) =>{
            let smtpTransport = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            let mailOptions = {
                debug: true,
                to: user.email,
                from: 'passwordreset@dividr.info',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, err =>{
                //console.log(req);
                return res.status(200).json({info : 'An e-mail has been sent to ' + user.email + ' with further instructions.'}).done(err, 'done');
                //done(err, 'done');
            });
        },
    ], err =>{
        if (err) return next(err);
        res.status(400).json({error : 'something went wrong' + err});
    });
};

exports.resetPassword = (req, res) => {
    async.waterfall([
        done =>{
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) =>{
                if (!user) {
                    return res.status(400).json({error : 'Password reset token is invalid or has expired.'});
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                    res.status(200).json({
                        info: "Password Saved, please log in"
                    });
                    done(err, user)
                });
            });
        },
        (user, done) =>{
            let smtpTransport = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            let mailOptions = {
                to: user.email,
                from: 'passwordreset@dividr.info',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, err =>{
                res.status(200).json({ success : 'Success! Your password has been changed.'});
                done(err);
            });
        }
    ], err =>{
        res.status(400).json({error: err});
    });
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