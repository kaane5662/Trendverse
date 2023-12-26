const express = require("express")
const router = express.Router()
const {pool} = require("../dbConfig")
const { verifyToken } = require("../token")


router.put(("/post/view/:id"), verifyToken, async (req,res)=>{
    const {id} = req.params
    const user = req.user
    console.log(user.id)
    try {
        const results = await pool.query("insert into post_logs (user_id, action, post_id, date) values ($1,$2,$3,CURRENT_DATE) returning *", [user.id, "view", id])
    }catch(error){
        return res.status(500).json({message: error.message})
    }
    return res.status(200).send()
    
})

router.put(("/post/like/:id"), verifyToken, async (req,res)=>{
    const {id} = req.params
    console.log(id)
    const like = await pool.query("update posts set likes = likes + 1 where id = $1", [id])
    const log = await pool.query("insert into post_logs(user_id, action, post_id, date) values ($1,$2,$3,CURRENT_DATE)", [req.user.id, "like", id])  
    return res.status(200).send()
})

router.put("/profile/follow/:id", verifyToken, async(req,res)=>{
    const {id} = req.params
    const response = await pool.query("insert into profile_logs(user_id, target_user_id, action_type) values ($1,$2,$3)", [req.user.id, id, "follow"])
    return res.status(200).send()
})

module.exports = router
