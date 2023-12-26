const express = require("express")
const router = express.Router()
const multer = require("multer")
const {verifyToken} = require("../token")
const {pool} = require("../dbConfig")

const storage = multer.memoryStorage(); // Use memory storage for storing file buffers
const upload = multer({ storage: storage });
const uploadMiddleware = upload.array('uploads', 3); // 'images' is the field name for the files, and 3 is the maximum number of files

// create poste
router.post("/", [verifyToken, uploadMiddleware], async (req, res)=>{
    const {content} = req.body
    const words = content.split(" ")
    const tags = []
    words.map((word, index)=>{ if(word.startsWith("#")) tags.push(word.substring(1)) })

    console.log(tags)   
    const userId = req.user.id
    const files = req.files
    
    let post;
    try{
        post = await pool.query("insert into posts (owner_id, content, tags) values ($1,$2, $3::jsonb) returning *", [userId, content, JSON.stringify(tags)])
    }catch(error){        
        return res.status(500).json({message: error.message})
    }
    // insert photos
    try{
        files.map(async file=>{
            const result = await pool.query(
                'INSERT INTO media (file_name, content_type, data, post_id) VALUES ($1, $2, $3, $4)',
                [file.originalname, file.mimetype, file.buffer, post.rows[0].id]
            );
        })
    }catch(error){
        return res.status(500).json({message: error.message})
    }
    return res.status(201).json({message: "Post created successfully"})

})

router.use(express.json())

// get posts
router.get("/", (req, res)=>{
    console.log(req.user)
    res.status(200).json(req.user)
})

router.get("/reccomended", verifyToken, async (req,res)=>{
    const mostViewedRecentTags = await pool.query("with userTags as (select jsonb_array_elements_text(tags) as singleTags from post_logs inner join posts on post_logs.post_id = posts.id where post_logs.user_id = $1 and post_logs.date > CURRENT_DATE-100) select singleTags from userTags group by singleTags order by count(singleTags) desc limit 5", [req.user.id])
    const stringifiedTags = mostViewedRecentTags.rows.map((tag, index)=> {return JSON.stringify(tag.singletags)})
    console.log(stringifiedTags)
    const postsWithTags = await pool.query('select username, display_name, content, tags, posts.id as id from posts inner join profile on posts.owner_id = profile.id where tags @> ANY($1::jsonb[]) order by random()', [stringifiedTags])
    // console.log(postsWithTags.rows)
    res.status(200).json(postsWithTags.rows)
})

router.put("/search", async(req,res)=>{
    const {filter, tag} = req.body
    console.log(filter+" "+tag)
    if(filter == "latest" || filter == "earliest"){
        queryFilter = filter == "earliest" ? "asc" : "desc"

        const filteredPostsWithTag = await pool.query(`select username, display_name, content, tags, posts.id as id from posts inner join profile on posts.owner_id = profile.id where tags @> $1::jsonb order by date ${queryFilter}`, [JSON.stringify(tag)])
        return res.status(200).json(filteredPostsWithTag.rows)
    }
    if(filter == "popular"){
        const popularPostsWithTag = await pool.query(`select username, display_name, content, tags, posts.id as id from posts inner join profile on posts.owner_id = profile.id where tags @> $1::jsonb order by likes desc limit 10`, [JSON.stringify(tag)])
        return res.status(200).json(popularPostsWithTag.rows)
    }
    if(filter == "featured"){
        const featuredPostsWithTag = await pool.query(`select username, display_name, content, tags, posts.id as id from posts inner join profile on posts.owner_id = profile.id where tags @> $1::jsonb and date between CURRENT_DATE - INTERVAL '1 week' AND CURRENT_DATE order by likes desc limit 10`, [JSON.stringify(tag)])
        return res.status(200).json(featuredPostsWithTag.rows)

    }
    return res.status(500)
})

router.get("/reccomendedFollowing", verifyToken, async (req,res)=>{
    const mostEngagedFollowingProfiles = await pool.query("select owner_id, count(owner_id) as frequency from profile_logs inner join posts on profile_logs.target_user_id = posts.owner_id inner join post_logs on posts.id = post_logs.post_id where profile_logs.user_id = $1 group by owner_id order by count(owner_id) desc limit 5", [req.user.id])
    if(mostEngagedFollowingProfiles.rowCount <1 ) return res.status(404).send()
    const mostEngagedFollowingProfilesIds = mostEngagedFollowingProfiles.rows.map((profile)=>{return profile.owner_id})
    console.log(mostEngagedFollowingProfilesIds)
    const reccomendedFollowingsPosts = await pool.query("select posts.id as id, display_name, username, content, tags from profile inner join posts on profile.id = posts.owner_id where posts.owner_id = ANY($1) and posts.date > CURRENT_DATE-1 order by posts.owner_id desc limit 12", [mostEngagedFollowingProfilesIds])
    res.status(200).json(reccomendedFollowingsPosts.rows)
})


//retrieve specific post
router.get("/:id", async (req,res)=>{
    const id = req.params.id
    console.log(id)
    let responseData = {}
    // get post content
    pool.query(("select * from posts where id = $1"), [id], (error, results)=>{
        if(error) return res.status(500).json({message: error.message})
        if(results.rows.length == 0) return res.status(404).json({message: "No existing post"})
        responseData.post = results.rows[0]
        console.log(responseData)
        // get post media
        pool.query(("select * from media where post_id = $1"), [responseData.post.id], (error, results)=>{
            if(error) return res.status(500).json({message: error.message})
            responseData.media = results.rows
            return res.status(200).json(responseData)
        })
    })


})

router.get("/profile/:id", async (req, res)=>{
    const {id} = req.params
    console.log(id)
    const results = await pool.query("select posts.id as id, display_name, username, content, tags from posts inner join profile on posts.owner_id = profile.id where owner_id = $1 order by date desc", [id])
    if(results.rows == 0) return res.status(404).json({message: "User does not exist"})
    const posts = results.rows
    return res.status(200).json(posts)
})


router.get("/images/:id", async (req,res)=>{
    const {id} = req.params
    const results = await pool.query("select * from media where post_id = $1", [id])
    // if(results.rows.length == 0) return res.status(404).json({message: "Images do not exist"})
    return res.status(200).json(results.rows)
})


module.exports = router