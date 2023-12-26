const express = require("express")
const router = express.Router()
const {pool} = require("../dbConfig")
const { verifyToken } = require("../token")

router.use(express.json())

router.get("/recentFollowers", verifyToken, async (req,res)=>{
    const results = await pool.query("select distinct * from profile_logs inner join profile on profile_logs.user_id = profile.id where action_type = 'follow' and profile_logs.target_user_id = $1 and created_at between CURRENT_DATE - INTERVAL '2 week' AND CURRENT_DATE limit 3", [req.user.id])
    // console.log(results.rows)
    return res.status(200).json(results.rows)
})

router.get("/recentLikes", verifyToken, async(req,res)=>{
    const results = await pool.query("select distinct on(post_id) username, profile.id as id,tags, content, post_id, COUNT(*) OVER (PARTITION BY post_id) AS likes from post_logs inner join posts on post_logs.post_id = posts.id inner join profile on posts.owner_id = profile.id where action = 'like' and post_logs.user_id = $1 and post_logs.date between CURRENT_DATE - INTERVAL '1 day' AND CURRENT_DATE  limit 3", [req.user.id])
    // console.log(results.rows)
    return res.status(200).json(results.rows)
})


module.exports = router