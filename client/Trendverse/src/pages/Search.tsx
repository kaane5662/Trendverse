import Sidebar from "../components/Sidebar"
import Notifications from "../components/Notifications"
import { useEffect, useState } from "react"
import axios from "axios"
import Post from "../components/Post"



export default function Search(){
    const Filters = ["featured", "popular", "latest", "earliest"]
    const [tag, setTag] = useState("") 
    const [filterer, setFilter] = useState("") 

    type Post = {
        owner_id: Number,
        username: String,
        display_name: String,
        content: String,
        id: Number,
        tags: String[],
        likes:Number
    }

    const [Posts, setPosts] = useState<Post[]>()

    const getTaggedPostsWithFilter = ()=>{
        const params = new URLSearchParams(window.location.search)
        let tag = params.get("tag") || ""
        let filter = params.get("filter") || ""
        console.log(tag + ""+filter);
        setTag(tag)
        setFilter(filter)

        
        axios.put(`${import.meta.env.VITE_SERVER}/api/posts/search`, {filter, tag}).then((response)=>{
            console.log(response.data)
            setPosts(response?.data)
        }).catch((error)=>{
            console.log(error)
        })
    }

    useEffect(()=>{
        
        getTaggedPostsWithFilter()
    },[window.location.search])
    
    const updateSearchParams = (filter: string)=>{
        const params = new URLSearchParams(window.location.search)
        params.set("filter", filter)
        window.location.href = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    }

    return(
        
            
            
        <div className=" bg-primary text-secondary col-span-3 flex flex-col font-josefin gap-8 p-80 py-12 min-h-screen">
            <h1 className="text-4xl font-bold">Showing results for <span className="text-complementary">#{tag}</span> </h1>
            <div className="flex justify-between items-center sticky">
                {Filters.map((filter, index)=>{
                    return filterer == filter ?  (
                        <div className="border-b-2 border-complementary py-2 px-16">
                            <h1 className="text-xl font-bold hover:" key = {index}>{filter.charAt(0).toUpperCase() + filter.slice(1)}</h1>
                        </div>
                    ):(
                        <div onClick={()=>updateSearchParams(filter) } className="border-b-2 hover:border-complementary duration-300 py-2 px-6 hover:font-bold hover:cursor-pointer">
                            <h1 className="text-xl" key = {index}>{filter.charAt(0).toUpperCase() + filter.slice(1)}</h1> 
                        </div>
                        
                    )
                })}
                
            </div>
            <div className="flex flex-col gap-8 px-0">
                {Posts?.map((post, index)=>{
                    return (
                        <Post key = {index} tags = {post.tags} post_id = {post.id} content ={post.content} display_name = {post.display_name} username = {post.username} likes = {post.likes}></Post>
                    )
                })}
            </div>
            
        </div>
    
    )
}