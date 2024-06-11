const jwt = require("jsonwebtoken")
const dotenv = require('dotenv').config();



const generateToken = (user) => {
    return jwt.sign(user, process.env.SECRET_JWT, { expiresIn: '1h' }); // Token expires in 1 hour
};

//middleware for authenication
  
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    // console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
        res.redirect(`${process.env.CLIENT_DOMAIN}/login`)
    }

    jwt.verify(token, process.env.SECRET_JWT, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(403).json({ message: 'Forbidden' });
            // return res.redirect(`${process.env.CLIENT_DOMAIN}/login`)
        }

        req.user = user;
        next();
    });
    // if (req.isAuthenticated()) {
    //     console.log(req.user)
    //     return next();

    // }else{
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }
    
};

module.exports = {generateToken, verifyToken}