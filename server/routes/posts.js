const express = require("express")
const router = express.Router()
const multer = require("multer")
const {verifyToken} = require("../token")
const {pool} = require("../dbConfig")
const {getOrSetCache, redisClient} = require("../helpers/redis")

const {uploadPostMedia} = require("../uploadMiddleware")

// create poste
router.post("/", [verifyToken, uploadPostMedia.array("uploads",5)], async (req, res)=>{
    const {content} = req.body
    const hashtagRegex = /\B#\w+/g;
    const tags = content.match(hashtagRegex);

    console.log(tags)   
    const userId = req.user.id
    const files = req.files
    console.log(files[0])
    
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
                'INSERT INTO media (file_name, file_path, content_type, post_id) VALUES ($1, $2, $3, $4)',
                [file.originalname, `${file.destination}${file.filename}`, file.mimetype,post.rows[0].id]
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
    const reccomended = await pool.query(`
            -- get all tags that contains user interactions
            with single_tags as (select jsonb_array_elements_text(tags) as tags from post_logs as pl
            inner join posts as p on pl.post_id = p.id
            where pl.user_id = $1 and pl.date >= NOW() - INTERVAL '7 days'),

            -- top 3 viewed tags
            tt as (select count(tags), array_agg(to_jsonb(tags)) as tag from single_tags
            group by single_tags
            order by count(single_tags) desc
            limit 3)

            -- retrieve similar posts with tags and profiles associated
            select * from tt, posts as p 
            join profile on p.owner_id = profile.id
            where p.tags @> ANY((tt.tag)::jsonb[])
            order by random()
            limit 10
    `, [req.user.id])
    
    
    // console.log(postsWithTags.rows)
    res.status(200).json(reccomended.rows)
})


router.get("/explore", async (req, res)=>{
    try{
        const randomPosts = await pool.query("select username, display_name, content, tags, posts.id as id, profile.id as owner_id, likes from posts inner join profile on posts.owner_id = profile.id order by random() limit 5")
        return res.status(200).json(randomPosts.rows)
    }catch(error){
        return res.status(500).json({message: error.message})
    }
})

router.put("/search", async(req,res)=>{
    const {filter, tag} = req.body
    console.log(filter+" "+tag)

    const stringifiedTag = JSON.stringify("#"+tag)
    if(filter == "latest" || filter == "earliest"){
        queryFilter = filter == "earliest" ? "asc" : "desc"

        const filteredPostsWithTag = await pool.query(`select username, display_name, content, tags, likes ,posts.id as id from posts inner join profile on posts.owner_id = profile.id where tags @> $1::jsonb order by date ${queryFilter}`, [stringifiedTag])
        return res.status(200).json(filteredPostsWithTag.rows)
    }
    if(filter == "popular"){
        const popularPostsWithTag = await pool.query(`select username, display_name, content, tags, likes, posts.id as id from posts inner join profile on posts.owner_id = profile.id where tags @> $1::jsonb order by likes desc limit 100`, [stringifiedTag])
        return res.status(200).json(popularPostsWithTag.rows)
    }
    if(filter == "featured"){
        const featuredPostsWithTag = await pool.query(`select username, display_name, content, likes, tags, posts.id as id from posts inner join profile on posts.owner_id = profile.id where tags @> $1::jsonb and date between CURRENT_DATE - INTERVAL '1 week' AND CURRENT_DATE order by likes desc limit 10`, [stringifiedTag])
        return res.status(200).json(featuredPostsWithTag.rows)

    }
    return res.status(500)
})

router.get("/reccomendedFollowing", verifyToken, async (req,res)=>{
    const following = await pool.query(`
        -- get posts of users following
        select * from profile_logs as pl
        join posts on pl.target_user_id = posts.owner_id
        join profile on posts.owner_id = profile.id
        where pl.user_id = $1 and action_type = 'follow'
        order by posts.date desc
    
    `, [req.user.id])
    
    res.status(200).json(following.rows)
})


//retrieve specific post, cache revalidation 10 seconds
router.get("/:id", async (req,res)=>{
    const id = req.params.id
    console.log(id)
    try{
        let results = await redisClient.get(`posts?postId=${id}`)
        if(results != null){
            // console.log(results)
            return res.json(JSON.parse(results))
        }else{
            let data = {}
            post_data = await pool.query(("select * from posts where id = $1"), [id])
            data.post = post_data.rows[0]
                
                // console.log(responseData)
                // get post media
            media_data  = await pool.query(("select * from media where post_id = $1"), [post_data.id])
            data.media = media_data.rows
            console.log(data)
            await redisClient.setEx(`posts?postId=${id}`,10,JSON.stringify(data))
            return res.status(200).json(data)
        }
    }catch(error){
        return res.status(500).json({message:error.message})
    }
   
})

// retrieve profile posts based on id, cache revalidation 60s
router.get("/profile/:id", async (req, res)=>{
    const {id} = req.params
    try{
        let results = await redisClient.get(`profile?profileId=${id}`)
        if(results != null){
            // console.log(results)
            return res.json(JSON.parse(results))
        }else{
            const {rows} = await pool.query("select posts.id as id, display_name, username, content, owner_id, tags, likes  from posts inner join profile on posts.owner_id = profile.id where owner_id = $1 order by id desc", [id])
            await redisClient.setEx(`profile?profileId=${id}`,60,JSON.stringify(rows))
            return res.status(200).json(rows)
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({message:error.message})
    }
    
})

// grt specific post image gouerge fkergker
router.get("/images/:id", async (req,res)=>{
    const {id} = req.params
    const results = await pool.query("select * from media where post_id = $1", [id])
    // if(results.rows.length == 0) return res.status(404).json({message: "Images do not exist"})
    return res.status(200).json(results.rows)
})


module.exports = router