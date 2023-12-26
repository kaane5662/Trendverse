import {useState, useEffect} from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowCircleLeft, faArrowCircleRight, faArrowLeftLong, faArrowRightLong, faHeart } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

export default function Post({content, username, display_name, post_id, tags}: any){

    type MediaData= {   
        content_type: String,
        file_name: String,
        data: Object[]
    }
    const navigate = useNavigate()
    const[liked, setIsLiked] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
   

    const switchImage = (dir: number) =>{
        console.log("Swtiching image")
        if(!MediaFiles) return  
        setCurrentIndex((prevIndex) => Math.abs( (prevIndex + dir) % MediaFiles.length ));

    }

    const [MediaFiles, setMedia] = useState<MediaData[]>()
    const getPostMedia = ()=>{
        if(!post_id) return
        axios.get(`${import.meta.env.VITE_SERVER}/api/posts/images/${post_id}`).then((response)=>{
            
            
            setMedia(response.data)   
           
        }).catch((error)=>{
            // console.log(error)
        })
    }

    const likePost = () =>{
        console.log("fjergjiergoi")
        axios.put(`${import.meta.env.VITE_SERVER}/api/actions/post/like/${post_id}`, {}, {withCredentials: true}).then((response)=>{
            console.log("Successfully liked image")
            setIsLiked(true)
        }).catch((error)=>{
            if(error.response.status == "403"){navigate("/login")}
            console.log(error)
        })
    }

    useEffect(()=>{
        getPostMedia()
    }, [])

    return(
        

        <div className="flex flex-col gap-4 font-josefin rounded-2xl ">
            <div className="flex items-center gap-4">
                <img className=" h-16 w-16 object-scale-down bg-complementary rounded-2xl "></img>
                <div className="flex flex-col gap-0">
                    <p className="text-lg font-bold">{display_name}</p>
                    <p onClick={()=> navigate("/profile/${}")} className="text-md text-opacity-5">@{username}</p>
                </div>
                {liked ? (
                    <FontAwesomeIcon className="h-6 scale-110 text-complementary " icon={faHeart}></FontAwesomeIcon> 
                ):
                (<FontAwesomeIcon onClick={likePost} className="h-6 hover:scale-110 cursor-pointer duration-300 text-complementary text-opacity-20" icon={faHeart}></FontAwesomeIcon> )}
                
                
            </div>
            <p className="text-2xl">{content}</p>
            <div className="flex gap-4">
                {
                tags?.map((tag, index)=>{
                    return(
                        <p onClick={()=>navigate(`/search?filter=latest&tag=${tag}`)} key = {index} className="text-complementary text-xl hover:cursor-pointer hover:scale-105 duration-300">#{tag}</p>
                    )
                })
                }
            </div>
            <div className="flex">
                {
                    MediaFiles && MediaFiles.length > 0 ? (
                        <div className="relative w-full select-none overflow-hidden">

                            <img src={`data:${MediaFiles[currentIndex].content_type};base64,${btoa(
                                new Uint8Array(MediaFiles[currentIndex].data.data).reduce(
                                  (data, byte) => data + String.fromCharCode(byte),
                                  ''
                                )
                              )}`} className="rounded-xl w-full h-[400px] transition-transform object-cover duration-500 ease-out" style={{translate: "translateX(50%)"}}></img>
                              
                              <FontAwesomeIcon onClick={()=> switchImage(-1)}  className="absolute text-white text-opacity-50 m-auto top-0 bottom-0 left-3 h-8 hover:scale-110 hover:text-opacity-60 duration-300 hover:cursor-pointer" icon = {faArrowCircleLeft}></FontAwesomeIcon>
                              <FontAwesomeIcon onClick={()=> switchImage(1)} className="absolute text-white text-opacity-50 m-auto top-0 bottom-0 right-3 h-8 hover:scale-110 hover:text-opacity-60 duration-300 hover:cursor-pointer" icon = {faArrowCircleRight}></FontAwesomeIcon>
                        </div>
                    ) : (null)

                }
                
            </div>
        </div>
       
    )
}