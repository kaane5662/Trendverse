import {useState, useEffect} from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowCircleLeft, faArrowCircleRight, faArrowLeftLong, faArrowRightLong, faHeart, faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

export default function Post({content, username, display_name, post_id, owner_id, likes}: any){

    type MediaData= {   
        file_name: String,
        file_path: String,
        content_type: String
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

    const renderInteractiveContent = (content:String) => {
        const words = content.split(" ")
        // console.log(content.split(regex))
        return words.map((part:String, index:number) => {
          if (part.startsWith("#")) {
            return (
              <>
              <span key={index} onClick={()=>navigate(`/search?filter=latest&tag=${part.substring(1)}`)} className="text-complementary hover:underline duration-300 hover:cursor-pointer  ">
                {part}
              </span>
              <span key={index+" "+index}>
                {" "}
              </span>
              </>
            );
          } else if(!part.startsWith("#")) {
            return <span key={index}>{part+" "}</span>;
          }
        });
    };

    useEffect(()=>{
        console.log(owner_id)
        getPostMedia()
    }, [])

    return(
        

        <div className="flex flex-col gap-4 hover:cursor-pointer duration-300 bg-white  p-4 font-josefin ">
            <div className="flex items-center justify-between gap-4">
                <div className="flex gap-8 items-center">

                    <img className=" h-16 w-16 object-scale-down bg-complementary rounded-full "></img>
                    <div className="flex flex-col gap-0">
                        <p className="text-md font-bold">{display_name}</p>
                        <p onClick={()=> navigate(`/profile/${owner_id}`)} className="text-md text-opacity-5 hover:underline hover:text-complementary hover:cursor-pointer text-opacity-50 text-secondary">@{username}</p>
                    </div>
                </div>
                
                
            </div>
            {
                
            }
            <p className="text-xl">{renderInteractiveContent(content)}</p>
            
            <div className="flex">
                {
                    MediaFiles && MediaFiles.length > 0 ? (
                        <div className="relative w-full select-none overflow-hidden">

                            {
                                MediaFiles[currentIndex].content_type == "video/mp4"? 
                                (
                                    <video controls src={`${import.meta.env.VITE_SERVER}/${MediaFiles[currentIndex].file_path}`} className="rounded-xl  w-full h-[400px] transition-transform object-cover duration-500 ease-out"></video>
                                ):
                                (
                                    <img src={`${import.meta.env.VITE_SERVER}/${MediaFiles[currentIndex].file_path}`} className="rounded-xl  w-full h-[400px] transition-transform object-cover duration-500 ease-out"></img>
                                )
                            }

                            
                              
                                <FontAwesomeIcon onClick={()=> switchImage(-1)}  className="absolute text-white text-opacity-50 m-auto top-0 bottom-0 left-3 h-8 hover:scale-110 hover:text-opacity-60 duration-300 hover:cursor-pointer" icon = {faArrowCircleLeft}></FontAwesomeIcon>
                              <FontAwesomeIcon onClick={()=> switchImage(1)} className="absolute text-white text-opacity-50 m-auto top-0 bottom-0 right-3 h-8 hover:scale-110 hover:text-opacity-60 duration-300 hover:cursor-pointer" icon = {faArrowCircleRight}></FontAwesomeIcon>
                        </div>
                    ) : (null)

                }
                
            </div>
            <div className="items-center flex gap-2">

                    {liked ? (
                        <FontAwesomeIcon className="h-6 scale-110 text-complementary self-end " icon={faThumbsUp}></FontAwesomeIcon> 
                    ):
                    (<FontAwesomeIcon onClick={likePost} className="h-5 hover:scale-110 cursor-pointer duration-300 text-complementary text-opacity-20" icon={faHeart}></FontAwesomeIcon> )}
                    <p className="text-sm font-bold text-secondary text-opacity-50">{likes || 0}</p>
                </div>
        </div>
       
    )
}