const express = require("express")
const router = express.Router()
const {pool} = require("../dbConfig")
const bcryptjs = require("bcryptjs")
const {generateToken, verifyToken} = require("../token")
const cookieParser = require("cookie-parser")
const path = require("path")
const passport = require("passport")
const fs = require("fs").promises
const multer = require("multer")



router.use(express.json())
// create an account
router.post("/", async (req,res)=>{
    const {username, email, password, confirmpassword} =  req.body
    if(confirmpassword != password) return res.status(500).json({message:"Passwords do not match!"})
    if(password.length < 8) return res.status(500).json({message: "Password must be at least 8 characters!"})
    if(email.split("@").length != 2) return res.status(500).json({message:"Must be a valid email!"})
    const hashedPassword = await bcryptjs.hash(password, 10)

    // const profile_icon_data = await fs.readFile("public/default-icons/profile-icon.jpg") 
    // const banner_icon_data = await fs.readFile("public/default-icons/banner-icon.jpg") 

    let userCreationResults;
    try{
      userCreationResults = await pool.query("insert into profile (username, email, display_name, password) values ($1, $2, $3, $4) returning *", [username, email, username, hashedPassword])
    }catch(error){
      return res.status(500).json({message: error})
    }
    const newUser = userCreationResults.rows[0]

    try{
      const mediaProfileResults = await pool.query("insert into profile_media (file_name, content_type, file_path,media_type, profile_id) values($1,$2,$3, 'banner',$4)",["profile-icon", "image/jpeg", "", newUser.id])
      const mediaBannerResults = await pool.query("insert into profile_media (file_name, content_type, file_path, media_type, profile_id) values($1,$2,$3, 'profile',$4)", ["banner-icon", "image/jpeg", "", newUser.id])

    }catch(error){
      return res.status(500).json({message: error})
    }
    console.log(newUser)
    const token = generateToken(newUser)
    res.cookie("token", token)
    return res.status(201).json(token)

})

// login to an account
router.put("/", async (req,res)=>{
    const {email, password} = req.body
    const users = await pool.query("select * from profile where email = $1", [email])
    if(users.rows.length <= 0) return res.status(500).json({message: "Invalid email"})
    const user = users.rows[0]
    const matchedPassword = await bcryptjs.compare(password, user.password)
    if(!matchedPassword) return res.status(500).json({message: "Invalid password"})
    const token = generateToken(user)
    console.log(token)
    res.cookie("token", token)
    res.status(200).json(token)
})


//auth provider routes
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
    console.log("Call back")
    // return res.redirect("http://localhost:5173/")

    const {emails, displayName, id} = req.user
    console.log(emails[0].value)
    console.log(displayName)

    const result = await pool.query("select * from profile where email = $1", [emails[0].value])
    if(result.rowCount == 0){
        
    }else{
        const token = generateToken(result.rows[0]);
        req.user = token
        res.cookie("token", token, { maxAge: 900000, httpOnly: true })
        res.status(200)
        res.redirect(process.env.CLIENT_DOMAIN)
    }
    
    // const token = generateToken(req.user);
    // res.json(token);
  }
);

// delete an account
router.delete("/", verifyToken,(req,res)=>{
    res.cookie("token", "")
    res.status(200).json({message:"Logged out successfully"})
})


module.exports = router