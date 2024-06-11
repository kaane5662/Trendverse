const express = require("express")
const router = express.Router()
const multer = require("multer")
const {verifyToken} = require("../token")
const {pool} = require("../dbConfig")

const {uploadProfileMedia} = require("../uploadMiddleware")
 

router.get("/:id", async (req, res)=>{
    const {id} = req.params
    const userResults = await pool.query("select username, display_name  from profile where id = $1", [id])
    if(userResults.rows.length <= 0) return res.status(404).json({message: "User does not exist"})
    const mediaResults = await pool.query("select * from profile_media where profile_id = $1 order by media_type asc", [id])
    // console.log(userResults.rows[0])
    return res.status(200).json({User: userResults.rows[0], Media: mediaResults.rows})
})

router.get("/followers/:id", async (req, res)=>{
    const {id} = req.params
    const results = await pool.query("select target_user_id as id from profile_logs where target_user_id = $1 and action_type = 'follow' order by created_at desc ", [id])
    console.log(results.rows)
    return res.status(200).json(results.rows)
})

router.get("/", verifyToken, async(req,res)=>{
    const results = await pool.query("select username, id from profile where id = $1", [req.user.id])
    return res.status(200).json(results.rows[0])
})


router.get("/following/:id", async (req, res)=>{
    const {id} = req.params
    const results = await pool.query("select user_id as id from profile_logs where user_id = $1 and action_type = 'follow' order by created_at desc ", [id])
    console.log(results.rows)
    return res.status(200).json(results.rows)
})

router.put("/edit", [verifyToken, uploadProfileMedia.fields([{ name: 'icon', maxCount: 1 }, { name: 'banner', maxCount: 1 }])], async(req,res)=>{
    const {display_name} = req.body
    const files = req.files
    // console.log(files)
    const banner = req.files["banner"]
    const profileIcon = req.files["icon"]
    console.log(banner)
    console.log(profileIcon)
    if(display_name) await pool.query("update profile set display_name = $1 where id = $2", [display_name, req.user.id])
    if(banner) await pool.query("update profile_media set file_name = $1, content_type = $2, file_path = $3 where profile_id = $4 and media_type = 'banner'", [banner[0].originalname, banner[0].mimetype, banner[0].destination+banner[0].filename, req.user.id])
    if(profileIcon) await pool.query("update profile_media set file_name = $1, content_type = $2, file_path = $3 where profile_id = $4 and media_type = 'profile'", [profileIcon[0].originalname, profileIcon[0].mimetype, profileIcon[0].destination+profileIcon[0].filename, req.user.id])
    return res.status(200).send()
})

router.get("/edit/profile", verifyToken, async(req, res)=>{
    // console.log(req.user.id)
    const mediaResults = await pool.query("select * from profile_media where profile_id = $1 order by media_type asc", [req.user.id])
    const userResults = await pool.query("select username, display_name, id from profile where id = $1", [req.user.id])
    return res.status(200).json({User: userResults.rows[0], Media: mediaResults.rows})
})





module.exports = router