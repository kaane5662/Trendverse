const express = require("express")
const app = express()
const cors = require("cors")
const accounts = require("./routes/accounts")
const posts = require("./routes/posts")
const profiles = require("./routes/profiles")
const actions = require("./routes/actions")
const notifications = require("./routes/notifications")
const cookieParser = require("cookie-parser")
const dotenv = require('dotenv');
const result = dotenv.config({ path: '../.env' });
const path = require("path")

app.use(cors({
    origin: process.env.CLIENT_DOMAIN,
    credentials: true
}))


const session = require('express-session');
const {passport} = require("./auth")



console.log(process.env.CLIENT_DOMAIN)

app.use(cookieParser())
app.use('/default-icons', express.static(path.join(__dirname, 'public', 'default-icons')));

//new auth stuff
app.use(session({ secret: process.env.SECRET_JWT, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//server side media rendering
app.use('/uploads/posts', express.static(path.join(__dirname, 'uploads/posts')));
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));


//end new auth stuff


//routes
app.use("/api/accounts",accounts)
app.use("/api/posts", posts)
app.use("/api/profiles", profiles)
app.use("/api/actions", actions)
app.use("/api/notifications", notifications)

app.listen(3000, ()=>{
    console.log("Server running on port 3000")
})