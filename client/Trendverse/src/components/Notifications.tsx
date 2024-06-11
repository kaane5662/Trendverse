import axios from "axios";
import FollowNotification from "./FollowNotification";
import LikeNotification from "./LikeNotification";
import { useEffect, useState } from "react";

export default function Notifications(){

    type FollowNotificationContent = {
        username: String,
        id: Number
    }

    type LikeNotificationContent = {
        username: String,
        id: Number,
        post_id: Number,
        likes: Number,
        content: String
    }

    const [FollowNotifications, setFollowNotifications] = useState<FollowNotificationContent[]>()
    const [LikeNotifications,setLikeNotifications] = useState<LikeNotificationContent[]>()


    const getFollowerNotifications = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/api/notifications/recentFollowers`, {withCredentials: true}).then((response)=>{
            setFollowNotifications(response?.data)
        }).catch(error=>{
            console.log(error)
        })
    }

    const getLikedPostNotifications = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/api/notifications/recentLikes`, {withCredentials: true}).then((response)=>{
            console.log(response.data)
            setLikeNotifications(response?.data)
        }).catch(error=>{
            console.log(error)
        })
    }

    useEffect(()=>{
        getFollowerNotifications()
        getLikedPostNotifications()
    },[])

    return(
        <nav className="bg-white text-secondary w-fit p-12 h-screen font-josefin flex flex-col gap-8  right-0 border-l-2 z-50 top-0 fixed">
            <h1 className="font-bold text-2xl">Notifications</h1>
            <div className="flex flex-col gap-8">
                <h3 className="text-md">Recent Followers</h3>
                {FollowNotifications?.map((followNotif, index)=>{
                    return(
                        <FollowNotification key = {index} username = {followNotif.username} id = {followNotif.id}></FollowNotification>
                    )
                })}
                <h3 className="text-md">Recent Likes</h3>
                {LikeNotifications?.map((likeNotif, index)=>{
                    return (
                        <LikeNotification key = {index} username = {likeNotif.username} post_id = {likeNotif.post_id} likes = {likeNotif.likes} id = {likeNotif.id} content = {likeNotif.content}/>
                    )
                })}
                    
            </div>
        </nav>
    )
}