import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Post from "./Post"

export default function EngagedFollowerPosts(){
    type Post = {
        owner_id: Number,
        username: String,
        display_name: String,
        content: String,
        id: Number,
        tags: String[]
    }

    const [Posts, setPosts] = useState<Post[]>()

    const navigate = useNavigate()
    const getReccomendedPosts = () =>{
        axios.get(`${import.meta.env.VITE_SERVER}/api/posts/reccomendedFollowing`, {withCredentials: true}).then((response)=>{
            setPosts(response.data)
        }).catch(error=>{
            console.log(error)
            if(error.response.status == 403) navigate("/login")
        })
    }

    


    useEffect(()=>{
        getReccomendedPosts()
    },[])

    return(
        <div className="gap-8 flex flex-col py-4">
                <h1 className="text-4xl font-bold">Catch Up:</h1>
                {Posts?.map((post, index)=>{
                    return(
                        <Post key = {index} tags = {post.tags} post_id = {post.id} content ={post.content} display_name = {post.display_name} username = {post.username}></Post>
                    )
                })}
                
                
        </div>
    )
}