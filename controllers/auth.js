const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate sign token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler');

// using async/await
// exports.signup = async (req, res) => {
//     try {
//         const user = await new User(req.body);
//         console.log(req.body);

//         await user.save((err, user) => {
//             if (err) {
//                 // return res.status(400).json({ err });
//                 return res.status(400).json({
//                     error: 'Email is taken'
//                 });
//             }
//             res.status(200).json({ user });
//         });
//     } catch (err) {
//         console.error(err.message);
//     }
// };

// using promise
exports.signup = (req, res) => {
    // console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                // error: errorHandler(err)
                error: 'Email is taken'
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body
    User.findOne({email}, (err,user) => {
        if ( err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup.'
            })
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password dont match' 
            })
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, {expire: new Date() + 9999})
        // return response with user and token to frontend client
        const { _id, name, email, role } = user
        return res.json({ token, user: {_id, email, name, role}})
    })
        
}

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'signout successs' });
}


// express-jwt package is a middleware that validates json web token (JWT).
// We want to validate that the user has right SECRET KEY
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET, // req.user
    userProperty: 'auth'
})

exports.isAuth = (req, res, next) => {
    // req.profile._id == req.auth._id
    // req.profile._id is an ObjectId and req.auth._id is a string
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resorce! Access denied'
        })
    }
    next();
}