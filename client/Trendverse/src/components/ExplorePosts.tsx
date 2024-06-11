import {useState, useEffect, useReducer, useRef} from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Post from "./Post"



export default function ExplorePosts(){
    type Post = {
        owner_id: Number,
        username: String,
        display_name: String,
        content: String,
        id: Number,
        tags: String[]
    }

    const [Posts, setPosts] = useState<Post[]>([])
    const containerRef = useRef(null);
    
      // Attach scroll event listener to the container element
      const handleScroll = () => {
        console.log("HEllo")
        if (
            containerRef.current.scrollTop + containerRef.current.clientHeight >=
            containerRef.current.scrollHeight
        ) getReccomendedPosts();
      }

    const navigate = useNavigate()
    const getReccomendedPosts = () =>{
        axios.get(`${import.meta.env.VITE_SERVER}/api/posts/explore`, {withCredentials: true}).then((response)=>{
            setPosts(prevPosts => [...prevPosts, ...response.data])
        }).catch(error=>{
            console.log(error)
            if(error.response.status == 403) navigate("/login")
        })
    }

    


    useEffect(()=>{
        getReccomendedPosts()
    },[])

    return(
        <div ref={containerRef} onScroll={handleScroll} className="gap-8 h-auto flex flex-col py-4">
                
                {Posts?.map((post, index)=>{
                    return(
                        <Post key = {index} tags = {post.tags} post_id = {post.id} content ={post.content} display_name = {post.display_name} username = {post.username} owner_id={post.owner_id}></Post>
                    )
                })}
                <button onClick={getReccomendedPosts} className="bg-complementary p-2 px-4 hover:opacity-50  rounded-xl text-primary font-bold w-fit self-center">
                    <p className=" animate-pulse  self-center flex">Load More</p>
                </button>
                
                
        </div>
    )
}