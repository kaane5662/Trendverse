const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv').config();
// const {pool} = require("../dbConfig");


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/accounts/auth/google/callback', // Adjust the URL as per your setup
},
async (accessToken, refreshToken, profile, done) =>  {
  // Add user to database or retrieve user data
  // let isUser = await pool.query("select * from profile where email = $1",[profile.email[0].value])
  // if(isUser.rows.count == 0) pool.q
  return done(null, profile);
}));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// const containsEmail = async (email) =>{
//   const email = await pool.query("select * from profile where email = $1", [email])
//   if(email.rows.length == 0) return false
//   return true
// }

// const login = async (email, password) =>{
//     const {email, password} = req.body
//     const users = await pool.query("select * from profile where email = $1", [email])
//     if(users.rows.length <= 0) throw({message: "Invalid email"})
//     const user = users.rows[0]
//     const matchedPassword = await bcryptjs.compare(password, user.password)
//     if(!matchedPassword) return res.status(500).json({message: "Invalid password"})
//     return user
// }

// const register = async (email, password)=>{

// }


module.exports = {passport}