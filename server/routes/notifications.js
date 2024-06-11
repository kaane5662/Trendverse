const express = require("express")
const router = express.Router()
const {pool} = require("../dbConfig")
const { verifyToken } = require("../token")

router.use(express.json())

router.get("/recentFollowers", verifyToken, async (req,res)=>{
    const results = await pool.query(`
       select * from profile_logs as pl
        join profile on pl.target_user_id = profile.id
        where pl.user_id = $1 and action_type = 'follow'
        order by pl.created_at desc
        limit 3 
    
    `, [req.user.id])
    // console.log(results.rows)
    return res.status(200).json(results.rows)
})

router.get("/recentLikes", verifyToken, async(req,res)=>{
    const results = await pool.query("select distinct on(post_id) username, posts.owner_id as id,tags, content, post_id, COUNT(*) OVER (PARTITION BY post_id) AS likes from post_logs inner join posts on post_logs.post_id = posts.id inner join profile on posts.owner_id = profile.id where action = 'like' and post_logs.user_id = $1 and post_logs.date between CURRENT_DATE - INTERVAL '1 day' AND CURRENT_DATE limit 4", [req.user.id])
    // console.log(results.rows)
    return res.status(200).json(results.rows)
})


module.exports = router