import { useEffect, useState } from "react"
import axios from "axios"
import ProfileHeader from "../components/ProfileHeader"
import Sidebar from "../components/Sidebar"
import Notifications from "../components/Notifications"
import ProfilePosts from "../components/ProfilePosts"


export default function Profile(){

    useEffect(()=>{
        console.log(window.location.href)
    },[window.location.href])
    return(
       
        <div className="bg-primary col-span-3 p-64 py-0 min-h-screen">
            <ProfileHeader/>
            <ProfilePosts/>
        </div>
        
    )
}