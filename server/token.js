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
    }

    jwt.verify(token, process.env.SECRET_JWT, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.user = user;
        next();
    });
};

module.exports = {generateToken, verifyToken}