import { useNavigate } from "react-router-dom"

export default function LikeNotification({username, id, post_id, content, likes }:any){
    const navigate = useNavigate()
    return(
        <div className="flex gap-4">
            
            <img className=" h-12 w-12 object-scale-down bg-complementary rounded-2xl "></img>
            <div className="flex flex-col gap-2">
                <p onClick={()=>navigate(`/profile/${id}`)} className="text-md font-bold"> <span className="hover:underline hover:text-complementary hover:cursor-pointer">@{username}</span> {likes-1 > 0 ? "+ "+(likes-1)+"": null}</p>
                <p className="text-sm text-opacity-5">Liked <span className="hover:underline text-complementary">{typeof(content) == "string" ? content.substring(0,8)+"..." : null}</span></p>
            </div>
            
        </div>
    )
}