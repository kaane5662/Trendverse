import { useEffect, useState } from "react"
import Post from "./Post"
import axios from "axios"
import { useParams } from "react-router-dom"

export default function ProfilePosts(){

    const {id} = useParams()

    type Post = {
        owner_id: Number,
        username: String,
        display_name: String,
        content: String,
        id: Number,
        tags: String[],
        likes: Number
    }


    const [Posts, setPosts] = useState<Post[]>()

    const getProfilePosts = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/api/posts/profile/${id}`).then((response)=>{
            console.log(response.data)
            setPosts(response.data)
        }).catch((error)=>{
            console.log(error)
        })
    }

    useEffect(()=>{
        getProfilePosts()
    }, [window.location.href])

    return(
        <div className=" flex flex-col gap-8 px-24 p-24">
            
            {Posts?.map((post, index)=>{
                return(
                    <Post key = {index} tags = {post.tags} post_id = {post.id} content ={post.content} display_name = {post.display_name} username = {post.username} owner_id = {post.owner_id} likes = {post.likes}></Post>
                )
            })}
        </div>
    )
}

