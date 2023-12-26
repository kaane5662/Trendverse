import { useNavigate } from "react-router-dom"

export default function FollowNotification({username, id }:any){
    const navigate = useNavigate()
    return(
        <div className="flex gap-4">
            
            <img className=" h-12 w-12 object-scale-down bg-complementary rounded-2xl "></img>
            <div className="flex flex-col gap-2">
                <p onClick={()=>navigate(`/profile/${id}`)} className="text-md font-bold hover:underline hover:text-complementary hover:cursor-pointer">@{username}</p>
                <p className="text-sm text-opacity-5">Followed you</p>
            </div>
            
        </div>
    )
}